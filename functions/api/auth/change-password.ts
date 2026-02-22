import { z } from 'zod';
import { hashPassword, verifyPassword, hashToken } from '../_utils/crypto';

const ChangePassInput = z.object({
    old_password: z.string().min(1).max(256),
    new_password: z.string().min(10, 'Password must be at least 10 characters').max(256)
});

export async function onRequestPost(context: any) {
    const { request, env, data } = context;
    if (!data?.user) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401, headers: { 'Content-Type': 'application/json' }
        });
    }

    let input: z.infer<typeof ChangePassInput>;
    try {
        input = ChangePassInput.parse(await request.json());
    } catch (e: any) {
        return new Response(JSON.stringify({ error: 'Invalid input', details: e.issues?.[0]?.message }), {
            status: 400, headers: { 'Content-Type': 'application/json' }
        });
    }

    try {
        const userId = data.user.id;
        const { results } = await env.DB.prepare('SELECT password_hash FROM users WHERE id = ?').bind(userId).all();
        if (results.length === 0) {
            return new Response(JSON.stringify({ error: 'User not found' }), {
                status: 404, headers: { 'Content-Type': 'application/json' }
            });
        }

        const valid = await verifyPassword(input.old_password, results[0].password_hash, env);
        if (!valid) {
            return new Response(JSON.stringify({ error: 'Incorrect current password' }), {
                status: 403, headers: { 'Content-Type': 'application/json' }
            });
        }

        // Prevent setting same password as current
        const isSame = await verifyPassword(input.new_password, results[0].password_hash, env);
        if (isSame) {
            return new Response(JSON.stringify({ error: 'New passphrase must differ from current' }), {
                status: 400, headers: { 'Content-Type': 'application/json' }
            });
        }

        const newHash = await hashPassword(input.new_password, undefined, env);

        await env.DB.prepare(
            'UPDATE users SET password_hash = ?, must_change_password = 0, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
        ).bind(newHash, userId).run();

        // Revoke old session
        const cookieHeader = request.headers.get('Cookie') || '';
        const match = cookieHeader.match(/axiom_session=([^;]+)/);
        const oldSessionToken = match?.[1] ?? null;
        if (oldSessionToken) {
            const oldHashed = await hashToken(oldSessionToken);
            await env.DB.prepare('UPDATE sessions SET revoked_at = CURRENT_TIMESTAMP WHERE session_token_hash = ?')
                .bind(oldHashed).run();
        }

        // Issue fresh session
        const newSessionToken = crypto.randomUUID() + crypto.randomUUID();
        const newSessionHash = await hashToken(newSessionToken);
        const newExpiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);
        const sessionId = crypto.randomUUID();

        await env.DB.prepare(`
            INSERT INTO sessions (id, user_id, session_token_hash, expires_at, ip, user_agent)
            VALUES (?, ?, ?, ?, ?, ?)
        `).bind(
            sessionId, userId, newSessionHash, newExpiresAt.toISOString(),
            request.headers.get('CF-Connecting-IP') || 'unknown',
            request.headers.get('User-Agent') || 'unknown'
        ).run();

        return new Response(JSON.stringify({ message: 'Password updated successfully' }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Set-Cookie': `axiom_session=${newSessionToken}; HttpOnly; Secure; SameSite=Strict; Path=/; Expires=${newExpiresAt.toUTCString()}`
            }
        });

    } catch (e: any) {
        return new Response(JSON.stringify({ error: 'Internal error' }), {
            status: 500, headers: { 'Content-Type': 'application/json' }
        });
    }
}
