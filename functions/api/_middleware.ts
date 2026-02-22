export async function onRequest(context) {
    const { request, env, next } = context;
    const url = new URL(request.url);

    // Bypass auth for login, bootstrap, and non-api routes (just in case)
    if (url.pathname.startsWith('/api/auth/login') || url.pathname.startsWith('/api/auth/bootstrap')) {
        return next();
    }

    const cookieHeader = request.headers.get('Cookie') || '';
    const match = cookieHeader.match(/session_id=([^;]+)/);
    const sessionId = match ? match[1] : null;

    if (!sessionId) {
        return new Response('Unauthorized', { status: 401 });
    }

    try {
        const { results } = await env.DB.prepare(
            `SELECT u.id, u.email, u.role FROM sessions s 
             JOIN users u ON s.user_id = u.id 
             WHERE s.id = ? AND s.expires_at > CURRENT_TIMESTAMP`
        ).bind(sessionId).all();

        if (results.length === 0) {
            return new Response('Unauthorized / Session Expired', { status: 401 });
        }

        // Attach user dict to context data for downstream handlers
        context.data.user = results[0];

        // Ensure RBAC for admins
        if (context.data.user.role !== 'admin') {
            return new Response('Forbidden', { status: 403 });
        }

        return next();
    } catch (e) {
        return new Response('Internal error checking session', { status: 500 });
    }
}
