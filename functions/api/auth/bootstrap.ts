import { hashPassword } from '../_utils/crypto';

export async function onRequestPost(context) {
    const { request, env } = context;

    // Check config secret
    const token = request.headers.get('Authorization')?.replace('Bearer ', '');
    if (!env.BOOTSTRAP_TOKEN || token !== env.BOOTSTRAP_TOKEN) {
        return new Response('Forbidden: invalid bootstrap token', { status: 403 });
    }

    try {
        const { email, password } = await request.json();

        if (!email || !password || password.length < 8) {
            return new Response('Invalid input', { status: 400 });
        }

        const { hash, salt } = await hashPassword(password);
        const id = crypto.randomUUID();

        // Check if user already exists
        const { results } = await env.DB.prepare('SELECT id FROM users WHERE email=?').bind(email).all();
        if (results.length > 0) {
            return new Response('User already exists', { status: 400 });
        }

        await env.DB.prepare(`
            INSERT INTO users (id, email, password_hash, salt, role) 
            VALUES (?, ?, ?, ?, 'admin')
        `).bind(id, email, hash, salt).run();

        return new Response(JSON.stringify({ message: "Admin user created successfully" }), {
            status: 201,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (e) {
        return new Response('Error creating user: ' + e.message, { status: 500 });
    }
}
