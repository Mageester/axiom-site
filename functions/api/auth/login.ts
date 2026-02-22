import { z } from 'zod';
import { hashPassword, verifyPassword, hashToken } from '../_utils/crypto';

// Basic Zod schema for input validation
const LoginInput = z.object({
    username: z.string().min(1),
    password: z.string().min(1)
});

async function checkRateLimit(env: any, ip: string, username: string): Promise<boolean> {
    const key = `${ip}:${username}`;
    // very basic in-memory limit using DB (better than nothing for MVP)
    const { results } = await env.DB.prepare(`
        SELECT count, last_at 
        FROM login_attempts 
        WHERE key = ?
    `).bind(key).all();

    if (results.length > 0) {
        let attempt = results[0];
        // 5 attempts per 10 minutes
        if (attempt.count >= 5) {
            const tenMinsAgo = new Date(Date.now() - 10 * 60000).toISOString();
            if (attempt.last_at > tenMinsAgo) {
                return false; // Rate limited
            } else {
                // Reset limit if older than 10 mins
                await env.DB.prepare(`
                    UPDATE login_attempts 
                    SET count = 1, last_at = CURRENT_TIMESTAMP 
                    WHERE key = ?
                `).bind(key).run();
                return true;
            }
        } else {
            // Increment
            await env.DB.prepare(`
                UPDATE login_attempts 
                SET count = count + 1, last_at = CURRENT_TIMESTAMP 
                WHERE key = ?
            `).bind(key).run();
            return true;
        }
    } else {
        // Insert new limit
        await env.DB.prepare(`
            INSERT INTO login_attempts (key, count) 
            VALUES (?, 1)
        `).bind(key).run();
        return true;
    }
}

async function bootstrapAdmin(env: any) {
    // Automatically wipe legacy table structures
    try {
        await env.DB.prepare('SELECT username FROM users LIMIT 1').all();
    } catch (e) {
        await env.DB.prepare('DROP TABLE IF EXISTS sessions').run();
        await env.DB.prepare('DROP TABLE IF EXISTS users').run();
    }

    // 1) Fully execute missing schema tables if they don't exist
    await env.DB.prepare(`
        CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            email TEXT,
            username TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            role TEXT NOT NULL DEFAULT 'admin',
            must_change_password BOOLEAN NOT NULL DEFAULT 1,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `).run();

    await env.DB.prepare(`
        CREATE TABLE IF NOT EXISTS sessions (
            id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            session_token_hash TEXT NOT NULL UNIQUE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            expires_at TIMESTAMP NOT NULL,
            revoked_at TIMESTAMP,
            last_seen_at TIMESTAMP,
            ip TEXT,
            user_agent TEXT
        );
    `).run();

    await env.DB.prepare(`
        CREATE TABLE IF NOT EXISTS login_attempts (
            key TEXT PRIMARY KEY,
            count INTEGER NOT NULL DEFAULT 1,
            first_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            last_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `).run();

    const { results } = await env.DB.prepare(`SELECT id FROM users WHERE username = 'admin'`).all();
    if (results.length === 0) {
        // Safe creation of admin
        const initialPassHash = await hashPassword('admin');
        const id = crypto.randomUUID();
        await env.DB.prepare(`
            INSERT INTO users (id, username, password_hash, role, must_change_password) 
            VALUES (?, 'admin', ?, 'admin', 1)
        `).bind(id, initialPassHash).run();
    }
}

export async function onRequestPost(context: any) {
    const { request, env } = context;
    try {
        await bootstrapAdmin(env);

        let data;
        try {
            data = LoginInput.parse(await request.json());
        } catch (err: any) {
            return new Response(JSON.stringify({ error: "Invalid input format" }), { status: 400 });
        }

        const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
        const allowed = await checkRateLimit(env, ip, data.username);

        if (!allowed) {
            return new Response(JSON.stringify({ error: "Too many login attempts. Please try again later." }), { status: 429 });
        }

        const { results } = await env.DB.prepare('SELECT * FROM users WHERE username = ? COLLATE NOCASE').bind(data.username).all();
        if (results.length === 0) return new Response(JSON.stringify({ error: "Invalid credentials" }), { status: 401 });

        const user = results[0];
        const valid = await verifyPassword(data.password, user.password_hash);

        if (!valid) return new Response(JSON.stringify({ error: "Invalid credentials" }), { status: 401 });

        // reset rate limit on success
        await env.DB.prepare(`DELETE FROM login_attempts WHERE key = ?`).bind(`${ip}:${data.username}`).run();

        // Create secure session
        const sessionToken = crypto.randomUUID() + crypto.randomUUID(); // Double UUID for entropy
        const sessionHash = await hashToken(sessionToken);
        const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7); // 7 days
        const sessionId = crypto.randomUUID();

        await env.DB.prepare(`
            INSERT INTO sessions (id, user_id, session_token_hash, expires_at, ip, user_agent) 
            VALUES (?, ?, ?, ?, ?, ?)
        `).bind(
            sessionId, user.id, sessionHash, expiresAt.toISOString(),
            ip, request.headers.get('User-Agent') || 'unknown'
        ).run();

        // Clear password in response
        return new Response(JSON.stringify({
            user: { username: user.username, role: user.role, must_change_password: !!user.must_change_password }
        }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Set-Cookie': `axiom_session=${sessionToken}; HttpOnly; Secure; SameSite=Strict; Path=/; Expires=${expiresAt.toUTCString()}`
            }
        });
    } catch (e: any) {
        return new Response(JSON.stringify({ error: "Login system error", details: e.message }), { status: 500 });
    }
}
