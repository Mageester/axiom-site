function jsonError(status: number, error: string) {
    return new Response(JSON.stringify({ error }), {
        status,
        headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store'
        }
    });
}

function constantTimeEqualString(a: string, b: string) {
    if (a.length !== b.length) return false;
    let diff = 0;
    for (let i = 0; i < a.length; i++) {
        diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
    }
    return diff === 0;
}

export async function onRequest(context: any) {
    const { env, request, next } = context;
    const adminAccessToken = String(env?.ADMIN_ACCESS_TOKEN || '').trim();
    if (!adminAccessToken) return next();

    const provided = request.headers.get('X-Admin-Token') || '';
    if (!provided || !constantTimeEqualString(provided, adminAccessToken)) {
        return jsonError(403, 'Forbidden: Admin edge token required');
    }

    return next();
}
