import { z } from 'zod';
import { hashToken } from './crypto';

export const INQUIRY_STATUSES = ['new', 'contacted', 'booked', 'closed', 'spam'] as const;
export const INQUIRY_PRIMARY_GOALS = [
    'new_site',
    'rebuild',
    'landing_page',
    'maintenance',
    'seo_performance',
    'not_sure'
] as const;

function normalizeOptionalString(value: unknown) {
    const text = String(value ?? '').trim();
    return text ? text : null;
}

function normalizeWebsiteUrlish(value: unknown) {
    const text = String(value ?? '').trim();
    if (!text) return null;
    const candidate = /^https?:\/\//i.test(text) ? text : `https://${text}`;
    try {
        const url = new URL(candidate);
        if (!url.hostname || !url.hostname.includes('.')) return null;
        return url.toString();
    } catch {
        return null;
    }
}

export const PublicIntakeInput = z.object({
    name: z.string().min(2).max(80).transform(v => v.trim()),
    email: z.string().email().max(160).transform(v => v.trim().toLowerCase()),
    business_name: z.string().min(2).max(120).transform(v => v.trim()),
    phone: z.preprocess(v => normalizeOptionalString(v), z.string().min(7).max(30).nullable().optional()),
    current_website: z.preprocess(v => normalizeOptionalString(v), z.string().max(500).nullable().optional()),
    primary_goal: z.enum(INQUIRY_PRIMARY_GOALS),
    details: z.string().min(20).max(2000).transform(v => v.trim()),
    company_fax: z.string().max(500).optional().default(''),
    source_path: z.preprocess(v => normalizeOptionalString(v), z.string().max(200).nullable().optional())
}).superRefine((value, ctx) => {
    if (value.current_website) {
        const normalized = normalizeWebsiteUrlish(value.current_website);
        if (!normalized) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['current_website'], message: 'Invalid website URL' });
            return;
        }
        (value as any).current_website = normalized;
    }
});

let inquiriesSchemaEnsured = false;

export async function ensureWebsiteInquiriesSchema(env: any) {
    if (!env?.DB?.prepare) return;
    if (inquiriesSchemaEnsured) return;

    await env.DB.prepare(`
        CREATE TABLE IF NOT EXISTS website_inquiries (
            id TEXT PRIMARY KEY,
            created_at TEXT NOT NULL,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            business_name TEXT NOT NULL,
            phone TEXT,
            current_website TEXT,
            primary_goal TEXT NOT NULL,
            details TEXT NOT NULL,
            status TEXT NOT NULL DEFAULT 'new',
            source_path TEXT,
            user_agent TEXT,
            ip_hash TEXT
        )
    `).run();
    await env.DB.prepare(`CREATE INDEX IF NOT EXISTS idx_website_inquiries_created_at ON website_inquiries(created_at)`).run().catch(() => null);
    await env.DB.prepare(`CREATE INDEX IF NOT EXISTS idx_website_inquiries_status ON website_inquiries(status)`).run().catch(() => null);

    // Reuse existing login_attempts table for rate limiting if present; create if missing.
    await env.DB.prepare(`
        CREATE TABLE IF NOT EXISTS login_attempts (
            key TEXT PRIMARY KEY,
            count INTEGER NOT NULL DEFAULT 1,
            first_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            last_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `).run().catch(() => null);

    inquiriesSchemaEnsured = true;
}

export async function hashIpForTelemetry(ip: string) {
    if (!ip || ip === 'unknown') return null;
    return hashToken(ip);
}

export async function checkPublicIntakeRateLimit(env: any, ipHash: string | null): Promise<boolean> {
    if (!ipHash) return true;
    const key = `intake:${ipHash}`;
    const windowAgo = new Date(Date.now() - 10 * 60_000).toISOString(); // 10 minutes
    try {
        const { results } = await env.DB.prepare(`SELECT count, last_at FROM login_attempts WHERE key = ? LIMIT 1`).bind(key).all();
        if (results.length > 0) {
            const row = results[0];
            if (Number(row.count || 0) >= 5 && String(row.last_at || '') > windowAgo) {
                return false;
            }
            if (String(row.last_at || '') <= windowAgo) {
                await env.DB.prepare(`UPDATE login_attempts SET count = 1, last_at = CURRENT_TIMESTAMP WHERE key = ?`).bind(key).run();
                return true;
            }
            await env.DB.prepare(`UPDATE login_attempts SET count = count + 1, last_at = CURRENT_TIMESTAMP WHERE key = ?`).bind(key).run();
            return true;
        }
        await env.DB.prepare(`INSERT INTO login_attempts (key, count) VALUES (?, 1)`).bind(key).run();
        return true;
    } catch {
        return true;
    }
}

export function intakeSuccess() {
    return new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
    });
}
