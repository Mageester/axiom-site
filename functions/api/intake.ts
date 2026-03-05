import { z } from 'zod';
import { hashToken } from './_utils/crypto';

/**
 * Cloudflare Pages Function: POST /api/intake
 *
 * Edge-native lead intake pipeline for Axiom Infrastructure.
 * Uses Resend API for transactional email delivery (V8 isolate compatible).
 *
 * Required Cloudflare Environment Variables:
 *   RESEND_API_KEY  - Your Resend API key (re_xxxxxxxxx)
 *   INTAKE_EMAIL    - Destination emails CSV (aidan@getaxiom.ca,riley@getaxiom.ca)
 *
 * Optional hardening variables:
 *   INTAKE_ALLOWED_ORIGINS / CORS_ALLOW_ORIGINS - comma-separated CORS allowlist
 *   TURNSTILE_SECRET_KEY - Cloudflare Turnstile secret (if set, token verification is enforced)
 */

interface Env {
    DB?: any;
    RESEND_API_KEY?: string;
    INTAKE_EMAIL?: string;
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
    'http://127.0.0.1:5173'
];

const INTAKE_RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const INTAKE_RATE_LIMIT_MAX = 5;

const inMemoryRateLimit = new Map<string, { count: number; windowStart: number }>();

const IntakePayloadSchema = z.object({
    name: z.string().trim().min(1).max(80),
    email: z.string().trim().email().max(160),
    business_name: z.string().trim().max(120).optional(),
    businessName: z.string().trim().max(120).optional(),
    phone: z.string().trim().max(30).optional(),
    current_website: z.string().trim().max(500).optional(),
    websiteUrl: z.string().trim().max(500).optional(),
    website: z.string().trim().max(500).optional(),
    project_scale: z.string().trim().max(120).optional(),
    projectScale: z.string().trim().max(120).optional(),
    pain_points: z.union([
        z.string().trim().max(2000),
        z.array(z.string().trim().max(120)).max(20)
    ]).optional(),
    painPoints: z.union([
        z.string().trim().max(2000),
        z.array(z.string().trim().max(120)).max(20)
    ]).optional(),
    details: z.string().trim().max(4000).optional(),
    primary_goal: z.string().trim().max(120).optional(),
    primaryGoal: z.string().trim().max(120).optional(),
    source_path: z.string().trim().max(200).optional(),
    sourcePath: z.string().trim().max(200).optional(),
    company_fax: z.string().trim().max(120).optional(),
    companyFax: z.string().trim().max(120).optional(),
    turnstile_token: z.string().trim().max(2048).optional(),
    cf_turnstile_response: z.string().trim().max(2048).optional(),
}).strict();

function getAllowedOrigins(env: Env) {
    const configured = (env.INTAKE_ALLOWED_ORIGINS || env.CORS_ALLOW_ORIGINS || '')
        .split(',')
        .map((origin) => origin.trim())
        .filter(Boolean);

    return new Set(configured.length > 0 ? configured : DEFAULT_ALLOWED_ORIGINS);
}

function resolveCorsOrigin(request: Request, env: Env) {
    const origin = request.headers.get('Origin');
    if (!origin) return null;
    return getAllowedOrigins(env).has(origin) ? origin : null;
}

function buildJsonHeaders(request: Request, env: Env, extra: Record<string, string> = {}) {
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
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

function jsonResponse(request: Request, env: Env, payload: unknown, status = 200, extraHeaders: Record<string, string> = {}) {
    return new Response(JSON.stringify(payload), {
        status,
        headers: buildJsonHeaders(request, env, extraHeaders)
    });
}

function getClientIp(request: Request) {
    const cfIp = request.headers.get('CF-Connecting-IP');
    if (cfIp) return cfIp.trim();

    const forwarded = request.headers.get('X-Forwarded-For');
    if (forwarded) {
        return forwarded.split(',')[0].trim();
    }

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

    if (!current || (now - current.windowStart) > INTAKE_RATE_LIMIT_WINDOW_MS) {
        inMemoryRateLimit.set(key, { count: 1, windowStart: now });
        return true;
    }

    if (current.count >= INTAKE_RATE_LIMIT_MAX) {
        return false;
    }

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

function parsePainPoints(raw: unknown) {
    if (Array.isArray(raw)) {
        return raw.map((item) => String(item || '').trim()).filter(Boolean);
    }

    if (typeof raw === 'string' && raw.trim().length > 0) {
        return raw
            .split(',')
            .map((item) => item.trim())
            .filter(Boolean);
    }

    return [] as string[];
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
    const { request, env } = context;

    const requestOrigin = request.headers.get('Origin');
    if (requestOrigin && !resolveCorsOrigin(request, env)) {
        return jsonResponse(request, env, { error: 'Origin not allowed' }, 403);
    }

    try {
        const contentType = request.headers.get('content-type') || '';
        if (!contentType.includes('application/json')) {
            return jsonResponse(request, env, {
                error: 'Invalid Content-Type',
                details: 'Expected application/json'
            }, 400);
        }

        const rawBody = await request.json().catch(() => null);
        if (!rawBody || typeof rawBody !== 'object') {
            return jsonResponse(request, env, {
                error: 'Malformed JSON',
                details: 'Could not parse request body as JSON.'
            }, 400);
        }

        const parsed = IntakePayloadSchema.safeParse(rawBody);
        if (!parsed.success) {
            return jsonResponse(request, env, {
                error: 'Validation Failed',
                details: parsed.error.issues[0]?.message || 'Invalid payload'
            }, 400);
        }

        const body = parsed.data;

        const companyFax = (body.company_fax || body.companyFax || '').trim();
        if (companyFax) {
            return jsonResponse(request, env, { success: true }, 200);
        }

        const clientIp = getClientIp(request);
        const ipHash = clientIp && clientIp !== 'unknown' ? await hashToken(clientIp) : null;
        const allowedByRateLimit = await checkIntakeRateLimit(env, ipHash);
        if (!allowedByRateLimit) {
            return jsonResponse(request, env, {
                error: 'Too many requests. Please try again later.'
            }, 429, {
                'Retry-After': '600'
            });
        }

        const turnstileSecret = String(env.TURNSTILE_SECRET_KEY || '').trim();
        const turnstileToken = (body.turnstile_token || body.cf_turnstile_response || '').trim();
        if (turnstileSecret) {
            if (!turnstileToken) {
                return jsonResponse(request, env, {
                    error: 'Verification required',
                    details: 'Missing Turnstile token.'
                }, 400);
            }

            const turnstileOk = await verifyTurnstile(turnstileSecret, turnstileToken, clientIp);
            if (!turnstileOk) {
                return jsonResponse(request, env, {
                    error: 'Verification failed',
                    details: 'Turnstile verification failed.'
                }, 400);
            }
        }

        const name = body.name.trim();
        const email = body.email.trim().toLowerCase();
        const businessName = (body.business_name || body.businessName || '').trim();
        const phone = (body.phone || '').trim();
        const currentWebsite = (body.current_website || body.websiteUrl || body.website || '').trim();
        const projectScale = (body.project_scale || body.projectScale || '').trim();
        const details = (body.details || '').trim();
        const primaryGoal = (body.primary_goal || body.primaryGoal || '').trim();
        const sourcePath = (body.source_path || body.sourcePath || '').trim();
        const painPointsList = parsePainPoints(body.pain_points || body.painPoints || '');

        const scaleText = projectScale ? projectScale.toUpperCase() : 'AUDIT REQUEST';
        const titleLine = businessName || currentWebsite || name;
        const subjectLine = `[NEW LEAD] - ${scaleText} - ${titleLine}`;

        const painPointsHtml = painPointsList.length > 0
            ? `<ul>${painPointsList.map((item) => `<li>${item}</li>`).join('')}</ul>`
            : '<em>None selected</em>';

        const htmlBody = `
            <div style="font-family: Arial, sans-serif; color: #1a1a1a; max-width: 600px;">
                <h2 style="color: #0B0B0C; border-bottom: 2px solid #5a729b; padding-bottom: 8px;">Axiom Infrastructure Request</h2>

                <h3 style="margin-top: 24px;">Lead Information</h3>
                <table style="width: 100%; border-collapse: collapse;">
                    <tr><td style="padding: 4px 0; width: 150px;"><strong>Name:</strong></td><td>${name}</td></tr>
                    <tr><td style="padding: 4px 0;"><strong>Email:</strong></td><td><a href="mailto:${email}">${email}</a></td></tr>
                    <tr><td style="padding: 4px 0;"><strong>Phone:</strong></td><td>${phone || 'N/A'}</td></tr>
                    <tr><td style="padding: 4px 0;"><strong>Business:</strong></td><td>${businessName || 'N/A'}</td></tr>
                    <tr><td style="padding: 4px 0;"><strong>Website:</strong></td><td>${currentWebsite ? `<a href="${currentWebsite}">${currentWebsite}</a>` : 'N/A'}</td></tr>
                </table>

                <h3 style="margin-top: 24px;">Project Scope</h3>
                <p><strong>Scale/Goal:</strong> ${projectScale || primaryGoal || 'N/A'}</p>
                <p><strong>Source:</strong> ${sourcePath || 'N/A'}</p>

                <p style="margin-top: 16px;"><strong>Identified Pain Points:</strong></p>
                ${painPointsHtml}

                <h3 style="margin-top: 24px;">Technical Details / Notes</h3>
                <div style="background-color: #f4f4f4; padding: 16px; border-radius: 4px; white-space: pre-wrap;">${details || 'No details provided.'}</div>

                <p style="margin-top: 32px; font-size: 12px; color: #666;">Routed via Axiom Edge Infrastructure.</p>
            </div>
        `;

        const destinationEmails = (env.INTAKE_EMAIL || 'aidan@getaxiom.ca,riley@getaxiom.ca')
            .split(',')
            .map((value) => value.trim())
            .filter(Boolean);

        const resendApiKey = String(env.RESEND_API_KEY || '').trim();
        if (!resendApiKey) {
            console.error('[INTAKE] RESEND_API_KEY is not configured.');
            console.log('[INTAKE] SUBJECT:', subjectLine);
            return jsonResponse(request, env, { success: true, mocked: true }, 200);
        }

        const resendResponse = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${resendApiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                from: 'Axiom Systems <engine@getaxiom.ca>',
                to: destinationEmails,
                reply_to: email,
                subject: subjectLine,
                html: htmlBody,
            }),
        });

        if (!resendResponse.ok) {
            const errorText = await resendResponse.text();
            console.error('[INTAKE] Resend API Error:', resendResponse.status, errorText);
            return jsonResponse(request, env, {
                error: 'Email delivery failed',
                details: `Resend returned ${resendResponse.status}`
            }, 500);
        }

        console.log('[INTAKE] Lead notification dispatched to', destinationEmails.join(', '));

        try {
            const scaleLabel = projectScale || primaryGoal || 'Infrastructure Audit';
            const painPointsText = painPointsList.length > 0
                ? painPointsList.join(', ')
                : 'general infrastructure review';

            const receiptHtml = `
                <div style="font-family: 'Helvetica Neue', Arial, sans-serif; color: #1a1a1a; max-width: 560px; margin: 0 auto;">
                    <div style="border-bottom: 1px solid #e0e0e0; padding-bottom: 24px; margin-bottom: 32px;">
                        <h1 style="font-size: 20px; font-weight: 600; color: #0a0a0a; margin: 0; letter-spacing: -0.02em;">Axiom Infrastructure</h1>
                    </div>

                    <p style="font-size: 15px; line-height: 1.7; color: #333; margin: 0 0 20px 0;">
                        Hello ${name},
                    </p>

                    <p style="font-size: 15px; line-height: 1.7; color: #333; margin: 0 0 20px 0;">
                        Thank you for your interest in Axiom. We have received your infrastructure qualification for a <strong>${scaleLabel}</strong> build.
                    </p>

                    <p style="font-size: 15px; line-height: 1.7; color: #333; margin: 0 0 20px 0;">
                        Our lead engineer is currently auditing your selected pain points: <strong>${painPointsText}</strong>.
                    </p>

                    <p style="font-size: 15px; line-height: 1.7; color: #333; margin: 0 0 32px 0;">
                        Expect your Blueprint within 24 hours.
                    </p>

                    <div style="border-top: 1px solid #e0e0e0; padding-top: 24px; margin-top: 32px;">
                        <p style="font-size: 12px; color: #999; margin: 0;">
                            Axiom Infrastructure &mdash; Enterprise-grade web systems for service businesses.<br/>
                            <a href="https://getaxiom.ca" style="color: #666;">getaxiom.ca</a>
                        </p>
                    </div>
                </div>
            `;

            const receiptResponse = await fetch('https://api.resend.com/emails', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${resendApiKey}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    from: 'Axiom Systems <engine@getaxiom.ca>',
                    to: [email],
                    subject: '[Axiom Blueprint] Infrastructure Audit Initiated',
                    html: receiptHtml,
                }),
            });

            if (!receiptResponse.ok) {
                const receiptError = await receiptResponse.text();
                console.warn('[INTAKE] Receipt email failed (non-critical):', receiptResponse.status, receiptError);
            }
        } catch (receiptErr: any) {
            console.warn('[INTAKE] Receipt email threw (non-critical):', receiptErr?.message || receiptErr);
        }

        return jsonResponse(request, env, { success: true }, 200);
    } catch (error: any) {
        console.error('[INTAKE] Unhandled error:', error?.message || error);
        return jsonResponse(request, env, {
            error: 'Internal server error',
            details: error?.message || 'Unknown failure in edge function'
        }, 500);
    }
};

export const onRequestOptions: PagesFunction<Env> = async (context) => {
    const { request, env } = context;

    const requestOrigin = request.headers.get('Origin');
    if (requestOrigin && !resolveCorsOrigin(request, env)) {
        return jsonResponse(request, env, { error: 'Origin not allowed' }, 403);
    }

    return new Response(null, {
        status: 204,
        headers: buildJsonHeaders(request, env)
    });
};
