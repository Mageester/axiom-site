export async function onRequestPost({ request, env }) {
    const cookieHeader = request.headers.get('Cookie') || '';
    const match = cookieHeader.match(/session_id=([^;]+)/);
    const sessionId = match ? match[1] : null;

    if (sessionId) {
        await env.DB.prepare('DELETE FROM sessions WHERE id = ?').bind(sessionId).run();
    }

    return new Response(JSON.stringify({ message: "Logged out" }), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
            'Set-Cookie': `session_id=; HttpOnly; Secure; SameSite=Strict; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT`
        }
    });
}
