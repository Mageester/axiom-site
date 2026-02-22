import { z } from 'zod';
import { hashPassword, verifyPassword, hashToken } from '../_utils/crypto';
import { apiError, d1ErrorMessage, json } from '../_utils/http';
import { logEvent } from '../_utils/log';

const LoginInput = z.object({
    username: z.string().min(1).max(64),
    password: z.string().min(1).max(256)
});

async function checkRateLimit(env: any, ip: string, username: string): Promise<boolean> {
    const key = `${ip}:${username.toLowerCase()}`;
    try {
        const { results } = await env.DB.prepare(`
            SELECT count, last_at FROM login_attempts WHERE key = ?
        `).bind(key).all();

        if (results.length > 0) {
            const attempt = results[0];
            if (attempt.count >= 5) {
                const windowAgo = new Date(Date.now() - 15 * 60000).toISOString();
                if (attempt.last_at > windowAgo) return false;
                await env.DB.prepare(`UPDATE login_attempts SET count = 1, last_at = CURRENT_TIMESTAMP WHERE key = ?`).bind(key).run();
                return true;
            }
            await env.DB.prepare(`UPDATE login_attempts SET count = count + 1, last_at = CURRENT_TIMESTAMP WHERE key = ?`).bind(key).run();
            return true;
        }
        await env.DB.prepare(`INSERT INTO login_attempts (key, count) VALUES (?, 1)`).bind(key).run();
        return true;
    } catch {
        return true; // On rate limit DB error, allow — don't block legitimate logins
    }
}

let _bootstrapped = false;

async function ensureSchema(env: any) {
    if (_bootstrapped) return;

    // Detect legacy broken schema (missing username column) and rebuild
    try {
        await env.DB.prepare('SELECT username FROM users LIMIT 1').all();
    } catch {
        await env.DB.prepare('DROP TABLE IF EXISTS sessions').run().catch(() => null);
        await env.DB.prepare('DROP TABLE IF EXISTS users').run().catch(() => null);
    }

    await env.DB.prepare(`
        CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            email TEXT,
            username TEXT UNIQUE NOT NULL COLLATE NOCASE,
            password_hash TEXT NOT NULL,
            role TEXT NOT NULL DEFAULT 'admin',
            must_change_password BOOLEAN NOT NULL DEFAULT 1,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
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
        )
    `).run();

    await env.DB.prepare(`
        CREATE TABLE IF NOT EXISTS login_attempts (
            key TEXT PRIMARY KEY,
            count INTEGER NOT NULL DEFAULT 1,
            first_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            last_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `).run();

    _bootstrapped = true;

    // Bootstrap admin ONLY if explicitly enabled AND no admin exists
    const bootstrapEnabled = env.BOOTSTRAP_ENABLED === 'true' || env.BOOTSTRAP_ENABLED === '1';
    if (!bootstrapEnabled) return;

    const { results } = await env.DB.prepare(`SELECT id FROM users WHERE username = 'admin' COLLATE NOCASE`).all();
    if (results.length === 0) {
        const initialPassHash = await hashPassword('admin', undefined, env);
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
        await ensureSchema(env);

        let data: z.infer<typeof LoginInput>;
        try {
            data = LoginInput.parse(await request.json());
        } catch {
            return apiError(400, 'Invalid input format');
        }

        const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
        const allowed = await checkRateLimit(env, ip, data.username);
        if (!allowed) {
            logEvent('warn', 'auth.login.rate_limited', { username: data.username, ip });
            return json({ error: 'Too many login attempts. Please try again in 15 minutes.' }, 429, {
                'Retry-After': '900'
            });
        }

        const { results } = await env.DB.prepare(
            'SELECT * FROM users WHERE username = ? COLLATE NOCASE'
        ).bind(data.username).all();

        // Always run verifyPassword to prevent user-enumeration via timing.
        // Dummy hash uses current format so timing is identical.
        const dummyHash = `100000:${'aa'.repeat(16)}:${'bb'.repeat(32)}`;
        const hashToVerify = results.length > 0 ? results[0].password_hash : dummyHash;
        const valid = await verifyPassword(data.password, hashToVerify, env);

        if (results.length === 0 || !valid) {
            logEvent('warn', 'auth.login.invalid_credentials', { username: data.username, ip });
            return apiError(401, 'Invalid credentials');
        }

        const user = results[0];

        // Reset rate limit on success
        await env.DB.prepare('DELETE FROM login_attempts WHERE key = ?')
            .bind(`${ip}:${data.username.toLowerCase()}`).run().catch(() => null);

        // Session: double UUID = 72 chars of entropy
        const sessionToken = crypto.randomUUID() + crypto.randomUUID();
        const sessionHash = await hashToken(sessionToken);
        const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);
        const sessionId = crypto.randomUUID();

        await env.DB.prepare(`
            INSERT INTO sessions (id, user_id, session_token_hash, expires_at, ip, user_agent)
            VALUES (?, ?, ?, ?, ?, ?)
        `).bind(
            sessionId, user.id, sessionHash, expiresAt.toISOString(),
            ip, request.headers.get('User-Agent') || 'unknown'
        ).run();

        return json({
            user: {
                username: user.username,
                role: user.role,
                must_change_password: !!user.must_change_password
            }
        }, 200, {
            'Set-Cookie': `axiom_session=${sessionToken}; HttpOnly; Secure; SameSite=Strict; Path=/; Expires=${expiresAt.toUTCString()}`
        });

    } catch (e: any) {
        logEvent('error', 'auth.login.internal_error', {
            message: e?.message || 'unknown'
        });
        return apiError(500, d1ErrorMessage(e, 'Login system error'));
    }
}
