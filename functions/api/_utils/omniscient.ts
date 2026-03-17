import { hashToken } from './crypto';
import { apiError, json } from './http';
import { logEvent } from './log';

export type OmniscientUser = {
    id: string;
    username: string;
    role: string;
    must_change_password?: boolean;
};

export type OmniscientEnv = {
    appBaseUrl: string;
    geminiApiKey: string;
    rateLimitMaxExport: number;
    rateLimitMaxScrape: number;
    rateLimitWindowSeconds: number;
    scrapeConcurrencyLimit: number;
    scrapeTimeoutMs: number;
};

export type OmniscientLead = {
    id: number;
    businessName: string;
    niche: string;
    city: string;
    category: string | null;
    address: string | null;
    phone: string | null;
    websiteUrl: string | null;
    email: string | null;
    socialLink: string | null;
    rating: number | null;
    reviewCount: number | null;
    websiteStatus: string | null;
    contactName: string | null;
    tacticalNote: string | null;
    leadScore: number | null;
    websiteGrade: string | null;
    axiomScore: number | null;
    axiomTier: string | null;
    scoreBreakdown: string | null;
    painSignals: string | null;
    callOpener: string | null;
    followUpQuestion: string | null;
    axiomWebsiteAssessment: string | null;
    dedupeKey: string | null;
    dedupeMatchedBy: string | null;
    emailType: string | null;
    emailConfidence: number | null;
    phoneConfidence: number | null;
    disqualifiers: string | null;
    disqualifyReason: string | null;
    source: string | null;
    isArchived: boolean;
    createdAt: string;
    lastUpdated: string | null;
};

type LeadFilters = {
    city?: string | null;
    hasEmail?: boolean | null;
    hasPhone?: boolean | null;
    includeArchived?: boolean;
    limit?: number;
    minRating?: number | null;
    niche?: string | null;
    noWebsite?: boolean | null;
    search?: string | null;
    sort?: 'createdAt' | 'axiomScore' | 'rating' | 'reviewCount' | 'businessName';
    sortDir?: 'asc' | 'desc';
    tier?: string[] | null;
    websiteStatus?: string | null;
};

type RateLimitResult = {
    allowed: boolean;
    resetAt: Date;
    remaining: number;
};

function toNumber(value: unknown, fallback = 0) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
}

function toBoolean(value: unknown) {
    return value === true || value === 1 || value === '1' || value === 'true';
}

function toIso(value: unknown) {
    if (!value) return null;
    const date = new Date(String(value));
    return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function quote(value: string) {
    return `"${value.replace(/"/g, '""')}"`;
}

async function run(env: any, sql: string, binds: unknown[] = []) {
    return env.DB.prepare(sql).bind(...binds).run();
}

async function all<T = any>(env: any, sql: string, binds: unknown[] = []) {
    const result = await env.DB.prepare(sql).bind(...binds).all();
    return (result.results || []) as T[];
}

async function first<T = any>(env: any, sql: string, binds: unknown[] = []) {
    const result = await env.DB.prepare(sql).bind(...binds).first();
    return (result || null) as T | null;
}

let schemaEnsured = false;

export async function ensureOmniscientSchema(env: any) {
    if (!env?.DB?.prepare || schemaEnsured) return;

    await run(env, `
        CREATE TABLE IF NOT EXISTS omniscient_leads (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            business_name TEXT NOT NULL,
            niche TEXT NOT NULL,
            city TEXT NOT NULL,
            category TEXT,
            address TEXT,
            phone TEXT,
            website_url TEXT,
            email TEXT,
            social_link TEXT,
            rating REAL,
            review_count INTEGER,
            website_status TEXT,
            contact_name TEXT,
            tactical_note TEXT,
            lead_score INTEGER,
            website_grade TEXT,
            axiom_score INTEGER,
            axiom_tier TEXT,
            score_breakdown TEXT,
            pain_signals TEXT,
            call_opener TEXT,
            follow_up_question TEXT,
            axiom_website_assessment TEXT,
            dedupe_key TEXT,
            dedupe_matched_by TEXT,
            email_type TEXT,
            email_confidence REAL,
            phone_confidence REAL,
            disqualifiers TEXT,
            disqualify_reason TEXT,
            source TEXT,
            is_archived INTEGER NOT NULL DEFAULT 0,
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            last_updated TEXT
        )
    `);

    await run(env, `
        CREATE TABLE IF NOT EXISTS omniscient_audit_events (
            id TEXT PRIMARY KEY,
            actor_user_id TEXT,
            actor_username TEXT,
            action TEXT NOT NULL,
            target_type TEXT,
            target_id TEXT,
            ip_address TEXT,
            metadata_json TEXT,
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
        )
    `);

    await run(env, `
        CREATE TABLE IF NOT EXISTS omniscient_rate_limit_windows (
            id TEXT PRIMARY KEY,
            limiter_key TEXT NOT NULL UNIQUE,
            scope TEXT NOT NULL,
            window_start TEXT NOT NULL,
            count INTEGER NOT NULL DEFAULT 0,
            updated_at TEXT NOT NULL
        )
    `);

    await run(env, `
        CREATE TABLE IF NOT EXISTS omniscient_scrape_runs (
            id TEXT PRIMARY KEY,
            actor_user_id TEXT,
            actor_username TEXT,
            status TEXT NOT NULL,
            niche TEXT NOT NULL,
            city TEXT NOT NULL,
            error_message TEXT,
            metadata_json TEXT,
            started_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            finished_at TEXT
        )
    `);

    await run(env, `CREATE UNIQUE INDEX IF NOT EXISTS idx_omniscient_leads_dedupe_key ON omniscient_leads(dedupe_key)`);
    await run(env, `CREATE INDEX IF NOT EXISTS idx_omniscient_leads_created_at ON omniscient_leads(created_at DESC)`);
    await run(env, `CREATE INDEX IF NOT EXISTS idx_omniscient_leads_archived_created ON omniscient_leads(is_archived, created_at DESC)`);
    await run(env, `CREATE INDEX IF NOT EXISTS idx_omniscient_leads_tier ON omniscient_leads(axiom_tier)`);
    await run(env, `CREATE INDEX IF NOT EXISTS idx_omniscient_leads_city ON omniscient_leads(city)`);
    await run(env, `CREATE INDEX IF NOT EXISTS idx_omniscient_leads_niche ON omniscient_leads(niche)`);
    await run(env, `CREATE INDEX IF NOT EXISTS idx_omniscient_rate_limit_scope ON omniscient_rate_limit_windows(scope, window_start)`);
    await run(env, `CREATE INDEX IF NOT EXISTS idx_omniscient_scrape_runs_status_started ON omniscient_scrape_runs(status, started_at DESC)`);

    schemaEnsured = true;
}

export function getOmniscientEnv(env: any): OmniscientEnv {
    return {
        appBaseUrl: String(env?.APP_BASE_URL || ''),
        geminiApiKey: String(env?.GEMINI_API_KEY || ''),
        rateLimitMaxExport: Math.max(1, toNumber(env?.RATE_LIMIT_MAX_EXPORT, 20)),
        rateLimitMaxScrape: Math.max(1, toNumber(env?.RATE_LIMIT_MAX_SCRAPE, 3)),
        rateLimitWindowSeconds: Math.max(60, toNumber(env?.RATE_LIMIT_WINDOW_SECONDS, 900)),
        scrapeConcurrencyLimit: Math.max(1, toNumber(env?.SCRAPE_CONCURRENCY_LIMIT, 1)),
        scrapeTimeoutMs: Math.max(15000, toNumber(env?.SCRAPE_TIMEOUT_MS, 90000)),
    };
}

export function getOmniscientClientIp(request: Request) {
    return request.headers.get('CF-Connecting-IP')
        || request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
        || 'unknown';
}

export function requireOmniscientUser(context: any, opts: { admin?: boolean } = {}) {
    const user = context?.data?.user as OmniscientUser | undefined;
    if (!user?.id) {
        return { response: apiError(401, 'Unauthorized') as Response };
    }
    if (opts.admin && user.role !== 'admin') {
        return { response: apiError(403, 'Forbidden') as Response };
    }
    return { user };
}

export async function resolveOmniscientUserFromRequest(request: Request, env: any): Promise<OmniscientUser | null> {
    const cookieHeader = request.headers.get('Cookie') || '';
    const match = cookieHeader.match(/axiom_session=([^;]+)/);
    const sessionToken = match ? match[1] : null;

    if (!sessionToken) {
        return null;
    }

    const hashedToken = await hashToken(sessionToken).catch(() => null);
    if (!hashedToken) {
        return null;
    }

    try {
        const row = await env.DB.prepare(
            `SELECT u.id, u.username, u.role, u.must_change_password
             FROM sessions s
             JOIN users u ON s.user_id = u.id
             WHERE s.session_token_hash = ?
               AND s.expires_at > CURRENT_TIMESTAMP
               AND s.revoked_at IS NULL
             LIMIT 1`
        ).bind(hashedToken).first() as {
            id: string;
            username: string;
            role: string;
            must_change_password?: number | boolean;
        } | null;

        if (!row?.id) {
            return null;
        }

        return {
            id: String(row.id),
            username: String(row.username),
            role: String(row.role),
            must_change_password: toBoolean(row.must_change_password),
        };
    } catch (error) {
        logOmniscientFailure('resolve_user', error);
        return null;
    }
}

function mapLead(row: any): OmniscientLead {
    return {
        id: toNumber(row.id),
        businessName: String(row.business_name || ''),
        niche: String(row.niche || ''),
        city: String(row.city || ''),
        category: row.category ? String(row.category) : null,
        address: row.address ? String(row.address) : null,
        phone: row.phone ? String(row.phone) : null,
        websiteUrl: row.website_url ? String(row.website_url) : null,
        email: row.email ? String(row.email) : null,
        socialLink: row.social_link ? String(row.social_link) : null,
        rating: row.rating == null ? null : Number(row.rating),
        reviewCount: row.review_count == null ? null : toNumber(row.review_count),
        websiteStatus: row.website_status ? String(row.website_status) : null,
        contactName: row.contact_name ? String(row.contact_name) : null,
        tacticalNote: row.tactical_note ? String(row.tactical_note) : null,
        leadScore: row.lead_score == null ? null : toNumber(row.lead_score),
        websiteGrade: row.website_grade ? String(row.website_grade) : null,
        axiomScore: row.axiom_score == null ? null : toNumber(row.axiom_score),
        axiomTier: row.axiom_tier ? String(row.axiom_tier) : null,
        scoreBreakdown: row.score_breakdown ? String(row.score_breakdown) : null,
        painSignals: row.pain_signals ? String(row.pain_signals) : null,
        callOpener: row.call_opener ? String(row.call_opener) : null,
        followUpQuestion: row.follow_up_question ? String(row.follow_up_question) : null,
        axiomWebsiteAssessment: row.axiom_website_assessment ? String(row.axiom_website_assessment) : null,
        dedupeKey: row.dedupe_key ? String(row.dedupe_key) : null,
        dedupeMatchedBy: row.dedupe_matched_by ? String(row.dedupe_matched_by) : null,
        emailType: row.email_type ? String(row.email_type) : null,
        emailConfidence: row.email_confidence == null ? null : Number(row.email_confidence),
        phoneConfidence: row.phone_confidence == null ? null : Number(row.phone_confidence),
        disqualifiers: row.disqualifiers ? String(row.disqualifiers) : null,
        disqualifyReason: row.disqualify_reason ? String(row.disqualify_reason) : null,
        source: row.source ? String(row.source) : null,
        isArchived: toBoolean(row.is_archived),
        createdAt: toIso(row.created_at) || new Date().toISOString(),
        lastUpdated: toIso(row.last_updated),
    };
}

function buildLeadQuery(filters: LeadFilters = {}) {
    const where: string[] = [];
    const binds: unknown[] = [];

    if (!filters.includeArchived) {
        where.push('is_archived = 0');
    }

    if (filters.city) {
        where.push('city = ?');
        binds.push(filters.city);
    }

    if (filters.niche) {
        where.push('niche = ?');
        binds.push(filters.niche);
    }

    if (filters.websiteStatus) {
        where.push('website_status = ?');
        binds.push(filters.websiteStatus);
    }

    if (filters.noWebsite === true) {
        where.push(`website_status = 'MISSING'`);
    }

    if (filters.tier && filters.tier.length > 0 && !filters.tier.includes('ALL')) {
        where.push(`axiom_tier IN (${filters.tier.map(() => '?').join(', ')})`);
        binds.push(...filters.tier);
    }

    if (filters.minRating && filters.minRating > 0) {
        where.push('COALESCE(rating, 0) >= ?');
        binds.push(filters.minRating);
    }

    if (filters.hasEmail === true) {
        where.push(`email IS NOT NULL AND TRIM(email) != ''`);
    }

    if (filters.hasEmail === false) {
        where.push(`(email IS NULL OR TRIM(email) = '')`);
    }

    if (filters.hasPhone === true) {
        where.push(`phone IS NOT NULL AND TRIM(phone) != ''`);
    }

    if (filters.hasPhone === false) {
        where.push(`(phone IS NULL OR TRIM(phone) = '')`);
    }

    if (filters.search) {
        const search = `%${filters.search.toLowerCase()}%`;
        where.push(`
            (
                LOWER(business_name) LIKE ?
                OR LOWER(niche) LIKE ?
                OR LOWER(city) LIKE ?
                OR LOWER(COALESCE(email, '')) LIKE ?
                OR LOWER(COALESCE(contact_name, '')) LIKE ?
                OR LOWER(COALESCE(category, '')) LIKE ?
                OR LOWER(COALESCE(address, '')) LIKE ?
                OR LOWER(COALESCE(tactical_note, '')) LIKE ?
            )
        `);
        binds.push(search, search, search, search, search, search, search, search);
    }

    const sortMap: Record<string, string> = {
        axiomScore: 'COALESCE(axiom_score, 0)',
        businessName: 'LOWER(business_name)',
        createdAt: 'created_at',
        rating: 'COALESCE(rating, 0)',
        reviewCount: 'COALESCE(review_count, 0)',
    };
    const sortKey = sortMap[filters.sort || 'createdAt'] || 'created_at';
    const sortDir = filters.sortDir === 'asc' ? 'ASC' : 'DESC';
    const limit = Math.min(Math.max(toNumber(filters.limit, 250), 1), 1000);

    return {
        binds: [...binds, limit],
        sql: `
            SELECT *
            FROM omniscient_leads
            ${where.length > 0 ? `WHERE ${where.join(' AND ')}` : ''}
            ORDER BY ${sortKey} ${sortDir}, id DESC
            LIMIT ?
        `,
    };
}

export async function listOmniscientLeads(env: any, filters: LeadFilters = {}) {
    await ensureOmniscientSchema(env);
    const query = buildLeadQuery(filters);
    const rows = await all(env, query.sql, query.binds);
    return rows.map(mapLead);
}

export async function getOmniscientLeadById(env: any, id: number) {
    await ensureOmniscientSchema(env);
    const row = await first(env, 'SELECT * FROM omniscient_leads WHERE id = ? LIMIT 1', [id]);
    return row ? mapLead(row) : null;
}

export async function findOmniscientLeadByDedupeKey(env: any, dedupeKey: string) {
    await ensureOmniscientSchema(env);
    const row = await first(env, 'SELECT * FROM omniscient_leads WHERE dedupe_key = ? LIMIT 1', [dedupeKey]);
    return row ? mapLead(row) : null;
}

export async function insertOmniscientLead(env: any, input: Record<string, unknown>) {
    await ensureOmniscientSchema(env);
    const entries = Object.entries({
        address: input.address ?? null,
        axiom_score: input.axiomScore ?? null,
        axiom_tier: input.axiomTier ?? null,
        axiom_website_assessment: input.axiomWebsiteAssessment ?? null,
        business_name: input.businessName,
        call_opener: input.callOpener ?? null,
        category: input.category ?? null,
        city: input.city,
        contact_name: input.contactName ?? null,
        created_at: input.createdAt ?? new Date().toISOString(),
        dedupe_key: input.dedupeKey ?? null,
        dedupe_matched_by: input.dedupeMatchedBy ?? null,
        disqualifiers: input.disqualifiers ?? null,
        disqualify_reason: input.disqualifyReason ?? null,
        email: input.email ?? null,
        email_confidence: input.emailConfidence ?? null,
        email_type: input.emailType ?? null,
        follow_up_question: input.followUpQuestion ?? null,
        is_archived: input.isArchived ? 1 : 0,
        last_updated: input.lastUpdated ?? new Date().toISOString(),
        lead_score: input.leadScore ?? null,
        niche: input.niche,
        pain_signals: input.painSignals ?? null,
        phone: input.phone ?? null,
        phone_confidence: input.phoneConfidence ?? null,
        rating: input.rating ?? null,
        review_count: input.reviewCount ?? null,
        score_breakdown: input.scoreBreakdown ?? null,
        social_link: input.socialLink ?? null,
        source: input.source ?? null,
        tactical_note: input.tacticalNote ?? null,
        website_grade: input.websiteGrade ?? null,
        website_status: input.websiteStatus ?? null,
        website_url: input.websiteUrl ?? null,
    }).filter(([, value]) => value !== undefined);

    const columns = entries.map(([key]) => quote(key)).join(', ');
    const placeholders = entries.map(() => '?').join(', ');
    const binds = entries.map(([, value]) => value);

    const result = await run(env, `INSERT INTO omniscient_leads (${columns}) VALUES (${placeholders})`, binds);
    const insertedId = toNumber(result.meta?.last_row_id);
    return getOmniscientLeadById(env, insertedId);
}

export async function deleteOmniscientLeadById(env: any, id: number) {
    await ensureOmniscientSchema(env);
    await run(env, 'DELETE FROM omniscient_leads WHERE id = ?', [id]);
}

export async function updateOmniscientLeadById(env: any, id: number, input: Record<string, unknown>) {
    await ensureOmniscientSchema(env);

    const entries = Object.entries({
        contact_name: input.contactName,
        email: input.email,
        follow_up_question: input.followUpQuestion,
        is_archived: input.isArchived === undefined ? undefined : (input.isArchived ? 1 : 0),
        last_updated: new Date().toISOString(),
        phone: input.phone,
        social_link: input.socialLink,
        tactical_note: input.tacticalNote,
        call_opener: input.callOpener,
        website_url: input.websiteUrl,
    }).filter(([, value]) => value !== undefined);

    if (entries.length === 0) {
        return getOmniscientLeadById(env, id);
    }

    const assignments = entries.map(([key]) => `${quote(key)} = ?`).join(', ');
    const binds = [...entries.map(([, value]) => value), id];
    await run(env, `UPDATE omniscient_leads SET ${assignments} WHERE id = ?`, binds);
    return getOmniscientLeadById(env, id);
}

export async function countActiveOmniscientScrapeRuns(env: any) {
    await ensureOmniscientSchema(env);
    const row = await first<{ count: number | string }>(
        env,
        `SELECT COUNT(*) as count FROM omniscient_scrape_runs WHERE status = 'running'`
    );
    return toNumber(row?.count);
}

export async function createOmniscientScrapeRun(env: any, input: {
    actorUserId: string;
    actorUsername: string;
    city: string;
    metadata?: Record<string, unknown>;
    niche: string;
}) {
    await ensureOmniscientSchema(env);
    const id = crypto.randomUUID();
    await run(
        env,
        `
            INSERT INTO omniscient_scrape_runs (
                id,
                actor_user_id,
                actor_username,
                status,
                niche,
                city,
                metadata_json,
                started_at
            ) VALUES (?, ?, ?, 'running', ?, ?, ?, ?)
        `,
        [
            id,
            input.actorUserId,
            input.actorUsername,
            input.niche,
            input.city,
            JSON.stringify(input.metadata || {}),
            new Date().toISOString(),
        ],
    );
    return { id };
}

export async function finishOmniscientScrapeRun(env: any, input: {
    errorMessage?: string | null;
    metadata?: Record<string, unknown>;
    runId: string;
    status: string;
}) {
    await ensureOmniscientSchema(env);
    await run(
        env,
        `
            UPDATE omniscient_scrape_runs
            SET status = ?, error_message = ?, metadata_json = ?, finished_at = ?
            WHERE id = ?
        `,
        [
            input.status,
            input.errorMessage || null,
            JSON.stringify(input.metadata || {}),
            new Date().toISOString(),
            input.runId,
        ],
    );
}

export async function writeOmniscientAuditEvent(env: any, input: {
    action: string;
    actorUserId?: string | null;
    actorUsername?: string | null;
    ipAddress?: string | null;
    metadata?: Record<string, unknown>;
    targetId?: string | number | null;
    targetType?: string | null;
}) {
    await ensureOmniscientSchema(env);
    await run(
        env,
        `
            INSERT INTO omniscient_audit_events (
                id,
                actor_user_id,
                actor_username,
                action,
                target_type,
                target_id,
                ip_address,
                metadata_json,
                created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [
            crypto.randomUUID(),
            input.actorUserId || null,
            input.actorUsername || null,
            input.action,
            input.targetType || null,
            input.targetId == null ? null : String(input.targetId),
            input.ipAddress || null,
            JSON.stringify(input.metadata || {}),
            new Date().toISOString(),
        ],
    );
}

export async function consumeOmniscientRateLimit(env: any, input: {
    identifier: string;
    limit: number;
    scope: string;
    windowSeconds: number;
}): Promise<RateLimitResult> {
    await ensureOmniscientSchema(env);

    const now = new Date();
    const windowStart = new Date(Math.floor(now.getTime() / (input.windowSeconds * 1000)) * input.windowSeconds * 1000);
    const limiterKey = `${input.scope}:${input.identifier}:${windowStart.toISOString()}`;
    const resetAt = new Date(windowStart.getTime() + input.windowSeconds * 1000);

    const existing = await first<{ id: string; count: number | string }>(
        env,
        'SELECT id, count FROM omniscient_rate_limit_windows WHERE limiter_key = ? LIMIT 1',
        [limiterKey],
    );

    if (!existing) {
        await run(
            env,
            `
                INSERT INTO omniscient_rate_limit_windows (
                    id,
                    limiter_key,
                    scope,
                    window_start,
                    count,
                    updated_at
                ) VALUES (?, ?, ?, ?, 1, ?)
            `,
            [crypto.randomUUID(), limiterKey, input.scope, windowStart.toISOString(), now.toISOString()],
        );
        return {
            allowed: true,
            remaining: Math.max(input.limit - 1, 0),
            resetAt,
        };
    }

    const currentCount = toNumber(existing.count);
    if (currentCount >= input.limit) {
        return {
            allowed: false,
            remaining: 0,
            resetAt,
        };
    }

    await run(
        env,
        'UPDATE omniscient_rate_limit_windows SET count = count + 1, updated_at = ? WHERE id = ?',
        [now.toISOString(), existing.id],
    );

    return {
        allowed: true,
        remaining: Math.max(input.limit - currentCount - 1, 0),
        resetAt,
    };
}

export async function getOmniscientAnalytics(env: any) {
    const leads = await listOmniscientLeads(env, {
        includeArchived: false,
        limit: 5000,
        sort: 'createdAt',
        sortDir: 'desc',
    });

    const total = leads.length;
    const withEmail = leads.filter((lead) => lead.email && lead.email.length > 0).length;
    const withPhone = leads.filter((lead) => lead.phone && lead.phone.length > 0).length;
    const missingWebsite = leads.filter((lead) => lead.websiteStatus === 'MISSING').length;
    const activeWebsite = leads.filter((lead) => lead.websiteStatus === 'ACTIVE').length;
    const withSocial = leads.filter((lead) => lead.socialLink && lead.socialLink.length > 0).length;
    const withContact = leads.filter((lead) => lead.contactName && lead.contactName.length > 0).length;
    const rated = leads.filter((lead) => lead.rating != null);
    const avgRating = rated.length > 0
        ? Number((rated.reduce((sum, lead) => sum + Number(lead.rating || 0), 0) / rated.length).toFixed(1))
        : 0;
    const scored = leads.filter((lead) => lead.axiomScore != null);
    const avgScore = scored.length > 0
        ? Math.round(scored.reduce((sum, lead) => sum + Number(lead.axiomScore || 0), 0) / scored.length)
        : 0;
    const emailRate = total > 0 ? Math.round((withEmail / total) * 100) : 0;

    const tierCounts = { elite: 0, high: 0, medium: 0, low: 0 };
    const nicheMap = new Map<string, number>();
    const cityMap = new Map<string, number>();
    const gradeMap = new Map<string, number>();
    const timeMap = new Map<string, number>();

    const now = new Date();
    for (let index = 29; index >= 0; index--) {
        const day = new Date(now);
        day.setDate(day.getDate() - index);
        timeMap.set(day.toISOString().slice(0, 10), 0);
    }

    for (const lead of leads) {
        if (lead.axiomTier === 'S') tierCounts.elite += 1;
        else if (lead.axiomTier === 'A') tierCounts.high += 1;
        else if (lead.axiomTier === 'B') tierCounts.medium += 1;
        else tierCounts.low += 1;

        nicheMap.set(lead.niche || 'Unknown', (nicheMap.get(lead.niche || 'Unknown') || 0) + 1);
        cityMap.set(lead.city || 'Unknown', (cityMap.get(lead.city || 'Unknown') || 0) + 1);
        if (lead.websiteGrade) {
            gradeMap.set(lead.websiteGrade, (gradeMap.get(lead.websiteGrade) || 0) + 1);
        }

        const key = lead.createdAt.slice(0, 10);
        if (timeMap.has(key)) {
            timeMap.set(key, (timeMap.get(key) || 0) + 1);
        }
    }

    return {
        activeWebsite,
        avgRating,
        avgScore,
        cityDistribution: Array.from(cityMap.entries()).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count),
        emailRate,
        funnel: {
            contactable: leads.filter((lead) => Boolean(lead.email) || Boolean(lead.phone)).length,
            enriched: leads.filter((lead) => Boolean(lead.tacticalNote)).length,
            raw: total,
            scored: scored.length,
        },
        gradeDistribution: Array.from(gradeMap.entries()).map(([grade, count]) => ({ grade, count })).sort((a, b) => a.grade.localeCompare(b.grade)),
        leadsOverTime: Array.from(timeMap.entries()).map(([date, count]) => ({ date, count })),
        missingWebsite,
        nicheBreakdown: Array.from(nicheMap.entries()).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count),
        recentActivity: leads.slice(0, 10).map((lead) => ({
            axiomScore: lead.axiomScore,
            axiomTier: lead.axiomTier,
            businessName: lead.businessName,
            city: lead.city,
            createdAt: lead.createdAt,
            email: Boolean(lead.email),
            id: lead.id,
            niche: lead.niche,
            websiteStatus: lead.websiteStatus,
        })),
        scoreDistribution: tierCounts,
        topLeads: [...leads]
            .filter((lead) => lead.axiomScore != null)
            .sort((a, b) => Number(b.axiomScore || 0) - Number(a.axiomScore || 0))
            .slice(0, 8)
            .map((lead) => ({
                axiomScore: lead.axiomScore,
                axiomTier: lead.axiomTier,
                businessName: lead.businessName,
                city: lead.city,
                email: Boolean(lead.email),
                id: lead.id,
                niche: lead.niche,
                websiteStatus: lead.websiteStatus,
            })),
        total,
        withContact,
        withEmail,
        withPhone,
        withSocial,
    };
}

export async function getOmniscientStats(env: any) {
    const leads = await listOmniscientLeads(env, {
        includeArchived: true,
        limit: 5000,
        sort: 'createdAt',
        sortDir: 'desc',
    });

    const total = leads.filter((lead) => !lead.isArchived).length;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayLeads = leads.filter((lead) => !lead.isArchived && new Date(lead.createdAt) >= today);
    const todayEmails = todayLeads.filter((lead) => Boolean(lead.email)).length;
    const todayCallable = todayLeads.filter((lead) => ['S', 'A', 'B'].includes(lead.axiomTier || '') && (lead.phoneConfidence || 0) >= 0.5).length;
    const todayTierSA = todayLeads.filter((lead) => ['S', 'A'].includes(lead.axiomTier || '')).length;
    const todayDisqualified = leads.filter((lead) => lead.isArchived && new Date(lead.createdAt) >= today).length;

    return {
        todayCallable,
        todayDisqualified,
        todayEmails,
        todayLeads: todayLeads.length,
        todayTierSA,
        total,
    };
}

export function escapeCsv(value: unknown) {
    const stringValue = String(value ?? '');
    if (/[",\n]/.test(stringValue)) {
        return `"${stringValue.replace(/"/g, '""')}"`;
    }
    return stringValue;
}

export function buildOmniscientCsv(leads: OmniscientLead[]) {
    const header = [
        'Business Name',
        'Niche',
        'City',
        'Category',
        'Address',
        'Phone',
        'Email',
        'Website URL',
        'Social Link',
        'Rating',
        'Review Count',
        'Website Status',
        'Contact Name',
        'Axiom Score',
        'Axiom Tier',
        'Website Grade',
        'Archived',
        'Tactical Note',
        'Created At',
    ];

    const rows = leads.map((lead) => [
        lead.businessName,
        lead.niche,
        lead.city,
        lead.category || '',
        lead.address || '',
        lead.phone || '',
        lead.email || '',
        lead.websiteUrl || '',
        lead.socialLink || '',
        lead.rating ?? '',
        lead.reviewCount ?? '',
        lead.websiteStatus || '',
        lead.contactName || '',
        lead.axiomScore ?? '',
        lead.axiomTier || '',
        lead.websiteGrade || '',
        lead.isArchived ? '1' : '0',
        lead.tacticalNote || '',
        lead.createdAt,
    ].map(escapeCsv).join(','));

    return [header.join(','), ...rows].join('\n');
}

export async function getOmniscientRuntimeStatus(env: any) {
    await ensureOmniscientSchema(env);
    const settings = getOmniscientEnv(env);
    const userCount = await first<{ count: number | string }>(env, 'SELECT COUNT(*) as count FROM users');
    const adminCount = await first<{ count: number | string }>(env, `SELECT COUNT(*) as count FROM users WHERE role = 'admin'`);

    return {
        appBaseUrl: settings.appBaseUrl,
        authAllowedCount: toNumber(userCount?.count),
        adminEmailCount: toNumber(adminCount?.count),
        browserRenderingConfigured: Boolean(env?.BROWSER),
        databaseTarget: env?.DB ? 'cloudflare-d1' : 'binding-missing',
        geminiConfigured: Boolean(settings.geminiApiKey),
        rateLimitMaxExport: settings.rateLimitMaxExport,
        rateLimitMaxScrape: settings.rateLimitMaxScrape,
        rateLimitWindowSeconds: settings.rateLimitWindowSeconds,
        scrapeConcurrencyLimit: settings.scrapeConcurrencyLimit,
        scrapeTimeoutMs: settings.scrapeTimeoutMs,
    };
}

export function logOmniscientFailure(scope: string, error: unknown) {
    const message = error instanceof Error ? error.message : String(error || 'unknown');
    logEvent('error', `omniscient.${scope}.failed`, { message });
}
