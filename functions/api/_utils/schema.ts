let discoverySchemaEnsured = false;

async function tryRun(env: any, sql: string) {
    try {
        await env.DB.prepare(sql).run();
    } catch (e: any) {
        const msg = String(e?.message || '');
        if (
            msg.includes('duplicate column name') ||
            msg.includes('already exists')
        ) {
            return;
        }
        throw e;
    }
}

export async function ensureDiscoverySchema(env: any) {
    if (!env?.DB?.prepare) return;
    if (discoverySchemaEnsured) return;

    await tryRun(env, `ALTER TABLE campaigns ADD COLUMN mode TEXT DEFAULT 'opportunity'`);
    await tryRun(env, `ALTER TABLE leads ADD COLUMN opportunity_score INTEGER DEFAULT 0`);
    await tryRun(env, `ALTER TABLE leads ADD COLUMN opportunity_reasons TEXT`);
    await tryRun(env, `ALTER TABLE leads ADD COLUMN intake_present INTEGER DEFAULT 0`);
    await tryRun(env, `ALTER TABLE leads ADD COLUMN booking_present INTEGER DEFAULT 0`);
    await tryRun(env, `ALTER TABLE leads ADD COLUMN detected_email TEXT`);
    await tryRun(env, `ALTER TABLE leads ADD COLUMN dedupe_key TEXT`);
    await tryRun(env, `ALTER TABLE leads ADD COLUMN website_status TEXT DEFAULT 'unknown'`);
    await tryRun(env, `ALTER TABLE leads ADD COLUMN website_source TEXT`);
    await tryRun(env, `ALTER TABLE leads ADD COLUMN website_verified TEXT DEFAULT 'unknown'`);
    await tryRun(env, `ALTER TABLE leads ADD COLUMN website_last_checked_at TEXT`);
    await tryRun(env, `ALTER TABLE leads ADD COLUMN lead_quality_score INTEGER DEFAULT 0`);
    await tryRun(env, `ALTER TABLE leads ADD COLUMN lead_quality_reasons TEXT`);
    await tryRun(env, `ALTER TABLE leads ADD COLUMN dnc INTEGER DEFAULT 0`);
    await tryRun(env, `ALTER TABLE leads ADD COLUMN dnc_reason TEXT`);
    await tryRun(env, `ALTER TABLE leads ADD COLUMN duplicate_of_lead_id TEXT`);
    await tryRun(env, `ALTER TABLE leads ADD COLUMN last_contacted_at TEXT`);

    await env.DB.prepare(`
        CREATE TABLE IF NOT EXISTS lead_campaigns (
            lead_id TEXT NOT NULL,
            campaign_id TEXT NOT NULL,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(lead_id, campaign_id)
        )
    `).run();

    await env.DB.prepare(`
        CREATE TABLE IF NOT EXISTS website_enrich_cache (
            key TEXT PRIMARY KEY,
            website TEXT,
            checked_at INTEGER NOT NULL
        )
    `).run().catch(() => null);

    await env.DB.prepare(`
        CREATE TABLE IF NOT EXISTS website_verify_cache (
            key TEXT PRIMARY KEY,
            verified_status TEXT NOT NULL,
            final_url TEXT,
            checked_at INTEGER NOT NULL
        )
    `).run().catch(() => null);

    await env.DB.prepare(`
        CREATE TABLE IF NOT EXISTS tags (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL UNIQUE,
            color TEXT,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP
        )
    `).run().catch(() => null);

    await env.DB.prepare(`
        CREATE TABLE IF NOT EXISTS lead_tags (
            lead_id TEXT NOT NULL,
            tag_id TEXT NOT NULL,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(lead_id, tag_id)
        )
    `).run().catch(() => null);

    await env.DB.prepare(`
        CREATE TABLE IF NOT EXISTS lead_notes_history (
            id TEXT PRIMARY KEY,
            lead_id TEXT NOT NULL,
            note_text TEXT NOT NULL,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP
        )
    `).run().catch(() => null);

    await env.DB.prepare(`
        CREATE INDEX IF NOT EXISTS idx_leads_dedupe_key ON leads(dedupe_key)
    `).run().catch(() => null);
    await env.DB.prepare(`
        CREATE INDEX IF NOT EXISTS idx_lead_campaigns_campaign_id ON lead_campaigns(campaign_id)
    `).run().catch(() => null);
    await env.DB.prepare(`
        CREATE INDEX IF NOT EXISTS idx_leads_duplicate_of ON leads(duplicate_of_lead_id)
    `).run().catch(() => null);
    await env.DB.prepare(`
        CREATE INDEX IF NOT EXISTS idx_leads_dnc ON leads(dnc)
    `).run().catch(() => null);
    await env.DB.prepare(`
        CREATE INDEX IF NOT EXISTS idx_lead_tags_lead_id ON lead_tags(lead_id)
    `).run().catch(() => null);
    await env.DB.prepare(`
        CREATE INDEX IF NOT EXISTS idx_lead_notes_history_lead_id ON lead_notes_history(lead_id, created_at)
    `).run().catch(() => null);

    discoverySchemaEnsured = true;
}
