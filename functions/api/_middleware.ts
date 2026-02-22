import { hashToken } from './_utils/crypto';
import { apiError } from './_utils/http';
import { logEvent } from './_utils/log';

// Track bootstrap state for the process lifetime to avoid running on every request
let bootstrapped = false;

export async function onRequest(context: any) {
    const { request, env, next } = context;
    const url = new URL(request.url);

    // Always allow login (handles its own bootstrap inline)
    if (url.pathname === '/api/auth/login') {
        return next();
    }

    // Always allow logout and me — even with no/expired session
    // logout should never block the user from clearing their session
    if (url.pathname === '/api/auth/logout' || url.pathname === '/api/auth/me') {
        const cookieHeader = request.headers.get('Cookie') || '';
        const match = cookieHeader.match(/axiom_session=([^;]+)/);
        const sessionToken = match ? match[1] : null;

        if (!sessionToken) {
            // For /logout, just clear cookie and succeed silently
            if (url.pathname === '/api/auth/logout') {
                return new Response(JSON.stringify({ message: "Logged out" }), {
                    status: 200,
                    headers: {
                        'Content-Type': 'application/json',
                        'Set-Cookie': `axiom_session=; HttpOnly; Secure; SameSite=Strict; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT`
                    }
                });
            }
            // For /me, no session = unauthorized
            return apiError(401, 'Unauthorized');
        }

        // Has a token, let it through to the actual handler (which validates it)
        const hashedToken = await hashToken(sessionToken).catch(() => null);
        if (!hashedToken) return apiError(401, 'Unauthorized');

        try {
            const { results } = await env.DB.prepare(
                `SELECT u.id, u.username, u.role, u.must_change_password, s.id as session_id
                 FROM sessions s 
                 JOIN users u ON s.user_id = u.id 
                 WHERE s.session_token_hash = ? 
                 AND s.expires_at > CURRENT_TIMESTAMP
                 AND s.revoked_at IS NULL`
            ).bind(hashedToken).all();

            if (results.length > 0) {
                context.data = context.data || {};
                context.data.user = results[0];
            }
        } catch (e) {
            logEvent('error', 'auth.middleware.lookup_failed', {
                path: url.pathname,
                message: e instanceof Error ? e.message : String(e)
            });
        }

        return next();
    }

    // All other /api/* routes require a valid session
    const cookieHeader = request.headers.get('Cookie') || '';
    const match = cookieHeader.match(/axiom_session=([^;]+)/);
    const sessionToken = match ? match[1] : null;

    if (!sessionToken) {
        return apiError(401, 'Unauthorized');
    }

    try {
        const hashedToken = await hashToken(sessionToken);

        const { results } = await env.DB.prepare(
            `SELECT u.id, u.username, u.role, u.must_change_password, s.id as session_id
             FROM sessions s 
             JOIN users u ON s.user_id = u.id 
             WHERE s.session_token_hash = ? 
             AND s.expires_at > CURRENT_TIMESTAMP
             AND s.revoked_at IS NULL`
        ).bind(hashedToken).all();

        if (results.length === 0) {
            logEvent('warn', 'auth.session.invalid', { path: url.pathname });
            return apiError(401, 'Unauthorized / Session Expired');
        }

        const user = results[0];

        // Block all non-account requests if must_change_password is true
        if (user.must_change_password &&
            !url.pathname.startsWith('/api/auth/change-password')) {
            return apiError(403, 'Forbidden: Must change password');
        }

        // Attach context
        context.data = context.data || {};
        context.data.user = user;

        return next();
    } catch (e) {
        logEvent('error', 'auth.middleware.internal_error', {
            path: url.pathname,
            message: e instanceof Error ? e.message : String(e)
        });
        return apiError(500, 'Internal error checking session');
    }
}
