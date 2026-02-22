import { hashToken } from '../_utils/crypto';

export async function onRequestPost({ request, env }: { request: any, env: any }) {
    const cookieHeader = request.headers.get('Cookie') || '';
    const match = cookieHeader.match(/axiom_session=([^;]+)/);
    const sessionToken = match ? match[1] : null;

    if (sessionToken) {
        try {
            const hashedToken = await hashToken(sessionToken);
            await env.DB.prepare('UPDATE sessions SET revoked_at = CURRENT_TIMESTAMP WHERE session_token_hash = ?').bind(hashedToken).run();
        } catch (e) { }
    }

    return new Response(JSON.stringify({ message: "Logged out" }), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
            'Set-Cookie': `axiom_session=; HttpOnly; Secure; SameSite=Strict; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT`
        }
    });
}
