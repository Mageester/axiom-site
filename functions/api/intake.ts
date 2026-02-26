import { apiError } from './_utils/http';
import { logEvent } from './_utils/log';
import { PublicIntakeInput, checkPublicIntakeRateLimit, ensureWebsiteInquiriesSchema, hashIpForTelemetry, intakeSuccess } from './_utils/inquiries';

export async function onRequestPost(context: any) {
    const { env, request } = context;
    try {
        await ensureWebsiteInquiriesSchema(env);

        let payload: any;
        try {
            payload = PublicIntakeInput.parse(await request.json());
        } catch (e: any) {
            return apiError(400, 'Invalid inquiry submission', {
                details: e?.issues?.[0]?.message || 'Invalid fields'
            });
        }

        // Honeypot: return generic success without revealing spam handling.
        if (String(payload.company_fax || '').trim()) {
            logEvent('warn', 'intake.honeypot_triggered', {
                path: '/api/intake'
            });
            return intakeSuccess();
        }

        const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
        const ipHash = await hashIpForTelemetry(ip);
        const allowed = await checkPublicIntakeRateLimit(env, ipHash);
        if (!allowed) {
            logEvent('warn', 'intake.rate_limited', {
                path: '/api/intake',
                ip_hash_prefix: ipHash ? ipHash.slice(0, 12) : null
            });
            return apiError(429, 'Too many requests. Please try again later.', {
                ok: false
            });
        }

        const nowIso = new Date().toISOString();
        await env.DB.prepare(`
            INSERT INTO website_inquiries (
                id, created_at, name, email, business_name, phone, current_website,
                primary_goal, details, status, source_path, user_agent, ip_hash
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'new', ?, ?, ?)
        `).bind(
            crypto.randomUUID(),
            nowIso,
            payload.name,
            payload.email,
            payload.business_name,
            payload.phone || null,
            payload.current_website || null,
            payload.primary_goal,
            payload.details,
            payload.source_path || null,
            (request.headers.get('User-Agent') || '').slice(0, 400) || null,
            ipHash
        ).run();

        logEvent('info', 'intake.submitted', {
            path: '/api/intake',
            source_path: payload.source_path || null,
            primary_goal: payload.primary_goal
        });
        return intakeSuccess();
    } catch (e: any) {
        logEvent('error', 'intake.internal_error', {
            path: '/api/intake',
            message: e?.message || 'unknown'
        });
        return apiError(500, 'Unable to process request right now');
    }
}
