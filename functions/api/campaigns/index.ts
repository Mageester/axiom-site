import { apiError, d1ErrorMessage, json } from '../_utils/http';
import { ensureDiscoverySchema } from '../_utils/schema';

export async function onRequestGet(context) {
    const { env } = context;
    try {
        await ensureDiscoverySchema(env);
        const { results } = await env.DB.prepare(`
            SELECT c.id, c.niche, c.city, c.radius_km, c.created_at, COALESCE(c.mode, 'opportunity') as mode,
                   COUNT(DISTINCT cl.lead_id) as lead_count
            FROM campaigns c
            LEFT JOIN (
                SELECT id as lead_id, campaign_id FROM leads
                UNION
                SELECT lead_id, campaign_id FROM lead_campaigns
            ) cl ON c.id = cl.campaign_id
            GROUP BY c.id
            ORDER BY c.created_at DESC
        `).all();

        return json({ campaigns: results });
    } catch (e: any) {
        return apiError(500, d1ErrorMessage(e, 'Failed to fetch campaigns'));
    }
}

export async function onRequestPost(context) {
    const { request, env } = context;
    try {
        await ensureDiscoverySchema(env);
        const { niche, city, radius_km, mode } = await request.json();
        const safeMode = mode === 'strict' ? 'strict' : 'opportunity';

        if (!niche || !city || radius_km == null) {
            return apiError(400, 'Missing fields');
        }

        const campaignId = crypto.randomUUID();
        await env.DB.prepare(
            'INSERT INTO campaigns (id, niche, city, radius_km, mode) VALUES (?, ?, ?, ?, ?)'
        ).bind(campaignId, niche, city, radius_km, safeMode).run();

        // Enqueue a discovery job
        const jobId = crypto.randomUUID();
        const payload = JSON.stringify({ campaignId, niche, city, radius_km, mode: safeMode });
        await env.DB.prepare(
            'INSERT INTO jobs (id, type, payload_json) VALUES (?, ?, ?)'
        ).bind(jobId, 'DISCOVERY', payload).run();

        return json({ message: "Campaign created", campaign_id: campaignId, job_id: jobId, mode: safeMode }, 201);
    } catch (e: any) {
        return apiError(500, d1ErrorMessage(e, 'Failed to create campaign'));
    }
}

export async function onRequestDelete(context) {
    const { env } = context;
    try {
        await ensureDiscoverySchema(env);
        await env.DB.prepare(`DELETE FROM jobs WHERE type IN ('DISCOVERY', 'AUDIT')`).run().catch(() => null);
        await env.DB.prepare(`DELETE FROM scores`).run();
        await env.DB.prepare(`DELETE FROM summaries`).run();
        await env.DB.prepare(`DELETE FROM audits`).run();
        await env.DB.prepare(`DELETE FROM lead_campaigns`).run().catch(() => null);
        await env.DB.prepare(`DELETE FROM leads`).run();
        await env.DB.prepare(`DELETE FROM campaigns`).run();

        return json({ message: 'All campaigns deleted' });
    } catch (e: any) {
        return apiError(500, d1ErrorMessage(e, 'Failed to delete all campaigns'));
    }
}
