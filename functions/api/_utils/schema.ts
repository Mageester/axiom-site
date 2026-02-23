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

    await env.DB.prepare(`
        CREATE TABLE IF NOT EXISTS lead_campaigns (
            lead_id TEXT NOT NULL,
            campaign_id TEXT NOT NULL,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(lead_id, campaign_id)
        )
    `).run();

    await env.DB.prepare(`
        CREATE INDEX IF NOT EXISTS idx_leads_dedupe_key ON leads(dedupe_key)
    `).run().catch(() => null);
    await env.DB.prepare(`
        CREATE INDEX IF NOT EXISTS idx_lead_campaigns_campaign_id ON lead_campaigns(campaign_id)
    `).run().catch(() => null);

    discoverySchemaEnsured = true;
}
