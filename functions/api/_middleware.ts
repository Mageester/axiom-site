import { hashToken } from './_utils/crypto';

export async function onRequest(context: { request: any, env: any, next: any, data?: any }) {
    const { request, env, next } = context;
    const url = new URL(request.url);

    // Bootstrap single admin user on first hit (if no user exists)
    // Run this asynchronously or inside the worker cycle, but cleanly
    // For MVP, we can just do a very fast check on /api/auth/login implicitly or explicitly 
    // but the prompt says: "On first run (or if no users exist), create a single admin user... If admin already exists, DO NOT overwrite."
    // We'll put the bootstrap logic inside the middleware if it's the login endpoint, to save queries

    // Bypass auth for login
    if (url.pathname === '/api/auth/login') {
        return next();
    }

    const cookieHeader = request.headers.get('Cookie') || '';
    const match = cookieHeader.match(/axiom_session=([^;]+)/);
    const sessionToken = match ? match[1] : null;

    if (!sessionToken) {
        return new Response('Unauthorized', { status: 401 });
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
            return new Response('Unauthorized / Session Expired', { status: 401 });
        }

        const user = results[0];

        // Block all non-account requests if must_change_password is true
        if (user.must_change_password &&
            !url.pathname.startsWith('/api/auth/change-password') &&
            !url.pathname.startsWith('/api/auth/logout') &&
            !url.pathname.startsWith('/api/auth/me')) {
            return new Response('Forbidden: Must change password', { status: 403 });
        }

        // Attach context
        context.data = context.data || {};
        context.data.user = user;

        // Optional: async update last_seen_at
        // context.waitUntil(env.DB.prepare('UPDATE sessions SET last_seen_at = CURRENT_TIMESTAMP WHERE id = ?').bind(user.session_id).run());

        return next();
    } catch (e) {
        return new Response('Internal error checking session', { status: 500 });
    }
}
