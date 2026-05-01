import { z } from 'zod';
import { hashToken } from './_utils/crypto';
import { ensureWebsiteInquiriesSchema } from './_utils/inquiries';

interface Env {
    DB?: D1Database;
    RESEND_API_KEY?: string;
    INTAKE_EMAIL?: string;
    INTAKE_FROM_EMAIL?: string;
    INTAKE_CONFIRMATION_FROM_EMAIL?: string;
    INTAKE_ALLOWED_ORIGINS?: string;
    CORS_ALLOW_ORIGINS?: string;
    TURNSTILE_SECRET_KEY?: string;
}

const DEFAULT_ALLOWED_ORIGINS = [
    'https://getaxiom.ca',
    'https://www.getaxiom.ca',
    'https://hvac.getaxiom.ca',
    'https://roofing.getaxiom.ca',
    'https://landscaping.getaxiom.ca',
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:10000',
    'http://127.0.0.1:10000'
];

const DEFAULT_INTERNAL_RECIPIENTS = ['contact@getaxiom.ca'];
const DEFAULT_FROM_EMAIL = 'Axiom Intake <engine@getaxiom.ca>';
const DEFAULT_CONFIRMATION_FROM_EMAIL = 'Axiom Web <engine@getaxiom.ca>';

const INTAKE_RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const INTAKE_RATE_LIMIT_MAX = 5;
const RETRY_AFTER_SECONDS = 600;

const inMemoryRateLimit = new Map<string, { count: number; windowStart: number }>();

const IntakePayloadSchema = z.object({
    name: z.string().trim().min(1, 'Name is required').max(100),
    email: z.string().trim().email('Valid email is required').max(160),
    business_name: z.string().trim().max(120).optional(),
    businessName: z.string().trim().max(120).optional(),
    phone: z.string().trim().max(30).optional(),
    current_website: z.string().trim().max(500).optional(),
    websiteUrl: z.string().trim().max(500).optional(),
    website: z.string().trim().max(500).optional(),
    pricing_path: z.string().trim().max(120).optional(),
    pricingPath: z.string().trim().max(120).optional(),
    project_scale: z.string().trim().max(120).optional(),
    projectScale: z.string().trim().max(120).optional(),
    pain_points: z.union([z.string().trim().max(2000), z.array(z.string().trim().max(120)).max(20)]).optional(),
    painPoints: z.union([z.string().trim().max(2000), z.array(z.string().trim().max(120)).max(20)]).optional(),
    fit_active_demand: z.enum(['yes', 'no']).optional(),
    fitActiveDemand: z.enum(['yes', 'no']).optional(),
    fit_trust_conversion_need: z.enum(['yes', 'no']).optional(),
    fitTrustConversionNeed: z.enum(['yes', 'no']).optional(),
    fit_decision_owner_ready: z.enum(['yes', 'no']).optional(),
    fitDecisionOwnerReady: z.enum(['yes', 'no']).optional(),
    fit_defined_scope_ready: z.enum(['yes', 'no']).optional(),
    fitDefinedScopeReady: z.enum(['yes', 'no']).optional(),
    details: z.string().trim().min(10, 'Details must be at least 10 characters').max(4000),
    primary_goal: z.string().trim().max(120).optional(),
    primaryGoal: z.string().trim().max(120).optional(),
    source_path: z.string().trim().max(200).optional(),
    sourcePath: z.string().trim().max(200).optional(),
    company_fax: z.string().trim().max(120).optional(),
    companyFax: z.string().trim().max(120).optional(),
    turnstile_token: z.string().trim().max(2048).optional(),
    cf_turnstile_response: z.string().trim().max(2048).optional()
}).passthrough();

function splitCsv(value: string) {
    return value
        .split(',')
        .map((entry) => entry.trim())
        .filter(Boolean);
}

function getAllowedOrigins(env: Env) {
    const configuredOrigins = splitCsv(String(env.INTAKE_ALLOWED_ORIGINS || env.CORS_ALLOW_ORIGINS || ''));
    return new Set(configuredOrigins.length ? configuredOrigins : DEFAULT_ALLOWED_ORIGINS);
}

function resolveCorsOrigin(request: Request, env: Env) {
    const origin = request.headers.get('Origin');
    if (!origin) return null;
    return getAllowedOrigins(env).has(origin) ? origin : null;
}

function buildJsonHeaders(request: Request, env: Env, extra: Record<string, string> = {}) {
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store',
        ...extra
    };

    const allowedOrigin = resolveCorsOrigin(request, env);
    if (allowedOrigin) {
        headers['Access-Control-Allow-Origin'] = allowedOrigin;
        headers['Vary'] = 'Origin';
        headers['Access-Control-Allow-Methods'] = 'POST, OPTIONS';
        headers['Access-Control-Allow-Headers'] = 'Content-Type';
        headers['Access-Control-Max-Age'] = '86400';
    }

    return headers;
}

function jsonResponse(
    request: Request,
    env: Env,
    payload: unknown,
    status = 200,
    extraHeaders: Record<string, string> = {}
) {
    return new Response(JSON.stringify(payload), {
        status,
        headers: buildJsonHeaders(request, env, extraHeaders)
    });
}

function getClientIp(request: Request) {
    const cfIp = request.headers.get('CF-Connecting-IP');
    if (cfIp) return cfIp.trim();

    const forwarded = request.headers.get('X-Forwarded-For');
    if (forwarded) return forwarded.split(',')[0].trim();

    return 'unknown';
}

async function ensureRateLimitTable(env: Env) {
    if (!env.DB?.prepare) return;
    await env.DB.prepare(`
        CREATE TABLE IF NOT EXISTS login_attempts (
            key TEXT PRIMARY KEY,
            count INTEGER NOT NULL DEFAULT 1,
            first_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            last_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `).run().catch(() => null);
}

function checkInMemoryRateLimit(key: string) {
    const now = Date.now();
    const current = inMemoryRateLimit.get(key);

    if (!current || now - current.windowStart > INTAKE_RATE_LIMIT_WINDOW_MS) {
        inMemoryRateLimit.set(key, { count: 1, windowStart: now });
        return true;
    }

    if (current.count >= INTAKE_RATE_LIMIT_MAX) return false;

    current.count += 1;
    inMemoryRateLimit.set(key, current);
    return true;
}

async function checkIntakeRateLimit(env: Env, ipHash: string | null) {
    if (!ipHash) return true;

    if (!env.DB?.prepare) {
        return checkInMemoryRateLimit(`intake:${ipHash}`);
    }

    await ensureRateLimitTable(env);

    const key = `intake:${ipHash}`;
    const windowAgo = new Date(Date.now() - INTAKE_RATE_LIMIT_WINDOW_MS).toISOString();

    try {
        const { results } = await env.DB.prepare(`
            SELECT count, last_at FROM login_attempts WHERE key = ? LIMIT 1
        `).bind(key).all();

        if (results.length > 0) {
            const row = results[0];
            if (Number(row.count || 0) >= INTAKE_RATE_LIMIT_MAX && String(row.last_at || '') > windowAgo) {
                return false;
            }

            if (String(row.last_at || '') <= windowAgo) {
                await env.DB.prepare(`
                    UPDATE login_attempts SET count = 1, last_at = CURRENT_TIMESTAMP WHERE key = ?
                `).bind(key).run();
                return true;
            }

            await env.DB.prepare(`
                UPDATE login_attempts SET count = count + 1, last_at = CURRENT_TIMESTAMP WHERE key = ?
            `).bind(key).run();
            return true;
        }

        await env.DB.prepare(`
            INSERT INTO login_attempts (key, count) VALUES (?, 1)
        `).bind(key).run();

        return true;
    } catch {
        return checkInMemoryRateLimit(key);
    }
}

async function verifyTurnstile(secret: string, token: string, ip: string) {
    const form = new URLSearchParams();
    form.set('secret', secret);
    form.set('response', token);
    if (ip && ip !== 'unknown') form.set('remoteip', ip);

    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: form.toString()
    });

    if (!response.ok) return false;
    const data = await response.json<any>().catch(() => ({}));
    return Boolean(data?.success);
}

function sanitizeHeaderValue(value: unknown, max = 160) {
    return String(value ?? '')
        .replace(/[\r\n]+/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, max);
}

function escapeHtml(value: unknown) {
    return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function normalizeHttpUrl(value: string) {
    const trimmed = value.trim();
    if (!trimmed) return '';
    const withScheme = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
    try {
        const parsed = new URL(withScheme);
        if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return '';
        return parsed.toString();
    } catch {
        return '';
    }
}

function normalizePrimaryGoal(value: string) {
    const raw = value.trim().toLowerCase();
    if (!raw) return 'not_sure';
    if (raw === 'rebuild') return 'rebuild';
    if (raw === 'landing_page' || raw.includes('landing')) return 'landing_page';
    if (raw === 'maintenance' || raw.includes('maint')) return 'maintenance';
    if (raw === 'seo_performance' || raw.includes('seo') || raw.includes('performance')) return 'seo_performance';
    if (raw === 'new_site' || raw.includes('foundation') || raw.includes('authority') || raw.includes('expansion') || raw.includes('simple') || raw.includes('standard') || raw.includes('premium') || raw.includes('audit')) {
        return 'new_site';
    }
    return 'not_sure';
}

function formatPricingPath(value: string) {
    const raw = value.trim().toLowerCase();
    if (!raw) return '';
    if (raw === 'monthly') return 'Monthly plan';
    if (raw === 'one_time' || raw === 'one-time') return 'One-time project';
    if (raw === 'not_sure' || raw === 'not sure yet') return 'Not sure yet';
    return value.trim();
}

type ResendEmailPayload = {
    from: string;
    to: string[];
    subject: string;
    html: string;
    text: string;
    reply_to?: string;
};

async function sendResendEmail(apiKey: string, payload: ResendEmailPayload) {
    const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        throw new Error(`RESEND_${response.status}`);
    }
}

function getInternalRecipients(env: Env) {
    const configured = splitCsv(String(env.INTAKE_EMAIL || '')).map((email) => email.toLowerCase());
    return Array.from(new Set([...DEFAULT_INTERNAL_RECIPIENTS, ...configured]));
}

function buildInternalEmail(params: {
    name: string;
    email: string;
    businessName: string;
    website: string;
    pricingPath: string;
    projectScale: string;
    primaryGoal: string;
    details: string;
    sourcePath: string;
}) {
    const html = `
        <div style="font-family:Arial,sans-serif;color:#1a1a1a;max-width:640px;margin:0 auto;">
            <h2 style="margin:0 0 16px 0;color:#0d1323;">New Axiom Intake Submission</h2>
            <table style="width:100%;border-collapse:collapse;">
                <tr><td style="padding:6px 0;width:180px;"><strong>Name</strong></td><td>${escapeHtml(params.name)}</td></tr>
                <tr><td style="padding:6px 0;"><strong>Email</strong></td><td><a href="mailto:${escapeHtml(params.email)}">${escapeHtml(params.email)}</a></td></tr>
                <tr><td style="padding:6px 0;"><strong>Business</strong></td><td>${escapeHtml(params.businessName || 'Not provided')}</td></tr>
                <tr><td style="padding:6px 0;"><strong>Preferred Path</strong></td><td>${escapeHtml(params.pricingPath || 'Not provided')}</td></tr>
                <tr><td style="padding:6px 0;"><strong>Website</strong></td><td>${params.website ? `<a href="${escapeHtml(params.website)}">${escapeHtml(params.website)}</a>` : 'Not provided'}</td></tr>
                <tr><td style="padding:6px 0;"><strong>Scale / Goal</strong></td><td>${escapeHtml(params.projectScale || params.primaryGoal || 'Not provided')}</td></tr>
                <tr><td style="padding:6px 0;"><strong>Source Path</strong></td><td>${escapeHtml(params.sourcePath || 'Not provided')}</td></tr>
            </table>
            <h3 style="margin:24px 0 8px 0;">Project Description</h3>
            <div style="background:#f4f5f7;border:1px solid #e7e7e7;border-radius:8px;padding:14px;white-space:pre-wrap;">${escapeHtml(params.details)}</div>
        </div>
    `;

    const text = [
        'New Axiom Intake Submission',
        '',
        `Name: ${params.name}`,
        `Email: ${params.email}`,
        `Business: ${params.businessName || 'Not provided'}`,
        `Preferred Path: ${params.pricingPath || 'Not provided'}`,
        `Website: ${params.website || 'Not provided'}`,
        `Scale / Goal: ${params.projectScale || params.primaryGoal || 'Not provided'}`,
        `Source Path: ${params.sourcePath || 'Not provided'}`,
        '',
        'Project Description:',
        params.details
    ].join('\n');

    return { html, text };
}

function buildConfirmationEmail(params: { name: string }) {
    const html = `
        <div style="font-family:Arial,sans-serif;color:#1a1a1a;max-width:560px;margin:0 auto;">
            <h1 style="font-size:22px;line-height:1.3;margin:0 0 16px 0;color:#0d1323;">Transmission received</h1>
            <p style="margin:0 0 14px 0;line-height:1.6;">Hi ${escapeHtml(params.name)},</p>
            <p style="margin:0 0 14px 0;line-height:1.6;">Your request has been received by Axiom Web.</p>
            <p style="margin:0 0 20px 0;line-height:1.6;">A partner will review your submission and reply from <strong>contact@getaxiom.ca</strong> within one business day.</p>
            <p style="margin:0;color:#6b7280;font-size:12px;">Axiom Web</p>
        </div>
    `;

    const text = [
        'Transmission received',
        '',
        `Hi ${params.name},`,
        'Your request has been received by Axiom Web.',
        'A partner will review your submission and reply from contact@getaxiom.ca within one business day.',
        '',
        'Axiom Web'
    ].join('\n');

    return { html, text };
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
    const { request, env } = context;

    const requestOrigin = request.headers.get('Origin');
    if (requestOrigin && !resolveCorsOrigin(request, env)) {
        return jsonResponse(request, env, { ok: false, error: 'Origin not allowed' }, 403);
    }

    try {
        const contentType = request.headers.get('content-type') || '';
        if (!contentType.includes('application/json')) {
            return jsonResponse(request, env, { ok: false, error: 'Invalid Content-Type' }, 400);
        }

        const rawBody = await request.json().catch(() => null);
        if (!rawBody || typeof rawBody !== 'object') {
            console.warn('[INTAKE] invalid_body', {
                bodyType: rawBody === null ? 'null' : Array.isArray(rawBody) ? 'array' : typeof rawBody
            });
            return jsonResponse(request, env, { ok: false, error: 'Malformed JSON or empty body' }, 400);
        }

        const parsed = IntakePayloadSchema.safeParse(rawBody);
        if (!parsed.success) {
            const bodyKeys = Object.keys(rawBody || {});
            const nameVal = typeof (rawBody as any)?.name;
            const nameLength = String((rawBody as any)?.name || '').length;

            console.warn('[INTAKE] validation_failed', {
                errors: parsed.error.issues,
                bodyKeys,
                nameType: nameVal,
                nameLen: nameLength
            });

            return jsonResponse(request, env, {
                ok: false,
                error: 'Validation failed',
                details: `${parsed.error.issues[0]?.message || 'Invalid payload'} (Context: Found ${bodyKeys.length} fields, Name is ${nameVal} len ${nameLength})`
            }, 400);
        }

        const body = parsed.data;
        const honeypot = (body.company_fax || body.companyFax || '').trim();
        if (honeypot) {
            const requestOrigin = request.headers.get('Origin');
            if (!requestOrigin) {
                return jsonResponse(request, env, { ok: false, error: 'Spam check failed' }, 400);
            }
            console.warn('[INTAKE] honeypot_ignored_for_trusted_origin', {
                origin: requestOrigin,
                length: honeypot.length
            });
            return jsonResponse(request, env, { ok: true }, 200);
        }

        const clientIp = getClientIp(request);
        const ipHash = clientIp && clientIp !== 'unknown' ? await hashToken(clientIp) : null;
        const allowedByRateLimit = await checkIntakeRateLimit(env, ipHash);
        if (!allowedByRateLimit) {
            return jsonResponse(
                request,
                env,
                { ok: false, error: 'Too many requests. Please try again later.' },
                429,
                { 'Retry-After': String(RETRY_AFTER_SECONDS) }
            );
        }

        const turnstileSecret = String(env.TURNSTILE_SECRET_KEY || '').trim();
        const turnstileToken = (body.turnstile_token || body.cf_turnstile_response || '').trim();
        if (turnstileSecret) {
            if (!turnstileToken) {
                return jsonResponse(request, env, { ok: false, error: 'Verification required' }, 400);
            }

            const turnstileOk = await verifyTurnstile(turnstileSecret, turnstileToken, clientIp);
            if (!turnstileOk) {
                return jsonResponse(request, env, { ok: false, error: 'Verification failed' }, 400);
            }
        }

        const resendApiKey = String(env.RESEND_API_KEY || '').trim();
        if (!resendApiKey) {
            console.error('[INTAKE] missing_resend_api_key');
            return jsonResponse(request, env, {
                ok: false,
                error: 'Intake is temporarily unavailable. Please email contact@getaxiom.ca.'
            }, 503);
        }

        const name = body.name.trim();
        const email = body.email.trim().toLowerCase();
        const businessName = (body.business_name || body.businessName || '').trim();
        const phone = (body.phone || '').trim();
        const currentWebsite = (body.current_website || body.websiteUrl || body.website || '').trim();
        const normalizedWebsite = normalizeHttpUrl(currentWebsite);
        const pricingPathInput = (body.pricing_path || body.pricingPath || '').trim();
        const pricingPath = formatPricingPath(pricingPathInput);
        const projectScale = (body.project_scale || body.projectScale || '').trim();
        const primaryGoalInput = (body.primary_goal || body.primaryGoal || '').trim();
        const primaryGoal = normalizePrimaryGoal(primaryGoalInput || projectScale);
        const sourcePath = (body.source_path || body.sourcePath || '').trim();
        const details = body.details.trim();

        try {
            await ensureWebsiteInquiriesSchema(env);
            if (env.DB?.prepare) {
                const inquiryId = crypto.randomUUID();
                const createdAt = new Date().toISOString();

                await env.DB.prepare(`
                    INSERT INTO website_inquiries (
                        id, created_at, name, email, business_name, phone, current_website,
                        primary_goal, details, status, source_path, user_agent, ip_hash
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'new', ?, ?, ?)
                `).bind(
                    inquiryId,
                    createdAt,
                    name,
                    email,
                    businessName || 'N/A',
                    phone || null,
                    normalizedWebsite || null,
                    primaryGoal,
                    details,
                    sourcePath || null,
                    request.headers.get('User-Agent') || null,
                    ipHash
                ).run();
            }
        } catch (dbError: any) {
            console.error('[INTAKE] inquiry_store_failed', dbError?.message || 'unknown');
        }

        const recipients = getInternalRecipients(env);
        const fromEmail = String(env.INTAKE_FROM_EMAIL || DEFAULT_FROM_EMAIL).trim() || DEFAULT_FROM_EMAIL;
        const confirmationFrom = String(env.INTAKE_CONFIRMATION_FROM_EMAIL || DEFAULT_CONFIRMATION_FROM_EMAIL).trim() || DEFAULT_CONFIRMATION_FROM_EMAIL;

        const scaleForSubject = sanitizeHeaderValue(pricingPath || projectScale || primaryGoalInput || primaryGoal || 'Submission', 80);
        const originForSubject = sanitizeHeaderValue(businessName || normalizedWebsite || name, 120);
        const internalSubject = `[Axiom] New Submission - ${scaleForSubject} - ${originForSubject}`;

        const internalEmail = buildInternalEmail({
            name,
            email,
            businessName,
            website: normalizedWebsite,
            pricingPath,
            projectScale,
            primaryGoal: primaryGoalInput || primaryGoal,
            details,
            sourcePath
        });
        const confirmationEmail = buildConfirmationEmail({ name });

        const deliveryResults = await Promise.allSettled([
            sendResendEmail(resendApiKey, {
                from: fromEmail,
                to: recipients,
                reply_to: email,
                subject: internalSubject,
                html: internalEmail.html,
                text: internalEmail.text
            }),
            sendResendEmail(resendApiKey, {
                from: confirmationFrom,
                to: [email],
                reply_to: 'contact@getaxiom.ca',
                subject: 'Axiom Web received your request',
                html: confirmationEmail.html,
                text: confirmationEmail.text
            })
        ]);

        const internalFailed = deliveryResults[0].status === 'rejected';
        const confirmationFailed = deliveryResults[1].status === 'rejected';

        if (internalFailed || confirmationFailed) {
            const internalError = deliveryResults[0].status === 'rejected' ? deliveryResults[0].reason : null;
            const confirmationError = deliveryResults[1].status === 'rejected' ? deliveryResults[1].reason : null;

            if (internalFailed) {
                console.error('[INTAKE] internal_email_failed', {
                    message: internalError instanceof Error ? internalError.message : 'unknown',
                    recipients
                });
            }
            if (confirmationFailed) {
                console.error('[INTAKE] confirmation_email_failed', {
                    message: confirmationError instanceof Error ? confirmationError.message : 'unknown',
                    recipientProvided: Boolean(email)
                });
            }

            return jsonResponse(request, env, {
                ok: false,
                error: 'Submission could not be delivered. Please try again or email contact@getaxiom.ca.'
            }, 502);
        }

        return jsonResponse(request, env, {
            ok: true,
            message: 'Transmission received. Confirmation email sent.'
        }, 200);
    } catch (error: any) {
        console.error('[INTAKE] unhandled_error', error?.message || 'unknown');
        return jsonResponse(request, env, { ok: false, error: 'Internal server error' }, 500);
    }
};

export const onRequestOptions: PagesFunction<Env> = async (context) => {
    const { request, env } = context;

    const requestOrigin = request.headers.get('Origin');
    if (requestOrigin && !resolveCorsOrigin(request, env)) {
        return jsonResponse(request, env, { ok: false, error: 'Origin not allowed' }, 403);
    }

    return new Response(null, {
        status: 204,
        headers: buildJsonHeaders(request, env)
    });
};
