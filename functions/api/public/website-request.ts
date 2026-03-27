import { z } from 'zod';

// Legacy public intake endpoint.
// The public site now uses /api/intake as the canonical submission path.
const WebsiteRequestSchema = z.object({
    name: z.string().min(1, "Name is required").max(100),
    company: z.string().min(1, "Company is required").max(100),
    email: z.string().email("Invalid email").max(100),
    phone: z.string().max(50).optional().nullable(),
    industry: z.string().max(100).optional().nullable(),
    website: z.string().max(250).optional().nullable(),
    goal: z.string().max(100).optional().nullable(),
    notes: z.string().max(2000),
    honeypot: z.string().max(0).optional() // Basic spam guard
});

// Simple rate limit helper specific to public form submissions
async function checkFormRateLimit(env: any, ip: string): Promise<boolean> {
    const key = `form_req_${ip}`;
    try {
        const { results } = await env.DB.prepare(`
            SELECT count, last_at FROM login_attempts WHERE key = ?
        `).bind(key).all();

        if (results.length > 0) {
            const attempt = results[0];
            if (attempt.count >= 5) {
                const windowAgo = new Date(Date.now() - 60 * 60000).toISOString(); // 5 requests per hour
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
        return true; // DB failure shouldn't block submission
    }
}

// Ensure the table exists at runtime (idempotent setup just in case)
let _tableEnsured = false;
async function ensureReqTable(env: any) {
    if (_tableEnsured) return;
    try {
        await env.DB.prepare(`
            CREATE TABLE IF NOT EXISTS website_requests (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                company TEXT NOT NULL,
                email TEXT NOT NULL,
                phone TEXT,
                industry TEXT,
                website TEXT,
                goal TEXT,
                notes TEXT,
                ip_address TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `).run();
        _tableEnsured = true;
    } catch (e) {
        // Fallback
    }
}

export async function onRequestPost(context: any) {
    const { request, env } = context;

    try {
        await ensureReqTable(env);

        let data;
        try {
            const body = await request.json();
            data = WebsiteRequestSchema.parse(body);
        } catch (e: any) {
            return new Response(JSON.stringify({ error: 'Invalid input format', details: e.issues?.[0]?.message }), {
                status: 400, headers: { 'Content-Type': 'application/json' }
            });
        }

        // Honeypot check
        if (data.honeypot && data.honeypot.length > 0) {
            return new Response(JSON.stringify({ message: "Success" }), { status: 200, headers: { 'Content-Type': 'application/json' } });
        }

        const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
        const allowed = await checkFormRateLimit(env, ip);
        
        if (!allowed) {
            return new Response(JSON.stringify({ error: 'Too many requests. Please try again later.' }), {
                status: 429, headers: { 'Content-Type': 'application/json', 'Retry-After': '3600' }
            });
        }

        const id = crypto.randomUUID();
        
        await env.DB.prepare(`
            INSERT INTO website_requests (id, name, company, email, phone, industry, website, goal, notes, ip_address)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(
            id, data.name, data.company, data.email, data.phone || null, data.industry || null, data.website || null, data.goal || null, data.notes, ip
        ).run();

        return new Response(JSON.stringify({ message: "Website request submitted successfully" }), {
            status: 200, headers: { 'Content-Type': 'application/json' }
        });

    } catch (e: any) {
        return new Response(JSON.stringify({ error: 'System error processing request' }), {
            status: 500, headers: { 'Content-Type': 'application/json' }
        });
    }
}
