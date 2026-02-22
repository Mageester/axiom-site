import { verifyPassword } from '../_utils/crypto';

export async function onRequestPost({ request, env }) {
    try {
        const { email, password } = await request.json();

        if (!email || !password) return new Response('Invalid credentials', { status: 400 });

        const { results } = await env.DB.prepare('SELECT * FROM users WHERE email = ?').bind(email).all();
        if (results.length === 0) return new Response('Unauthorized', { status: 401 });

        const user = results[0];

        const valid = await verifyPassword(password, user.password_hash, user.salt);
        if (!valid) return new Response('Unauthorized', { status: 401 });

        const sessionId = crypto.randomUUID();
        const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7); // 7 days

        await env.DB.prepare('INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)')
            .bind(sessionId, user.id, expiresAt.toISOString()).run();

        return new Response(JSON.stringify({ user: { id: user.id, email: user.email, role: user.role } }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Set-Cookie': `session_id=${sessionId}; HttpOnly; Secure; SameSite=Strict; Path=/; Expires=${expiresAt.toUTCString()}`
            }
        });
    } catch (e) {
        return new Response('Login failed: ' + e.message, { status: 500 });
    }
}
