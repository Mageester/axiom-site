import { apiError, d1ErrorMessage, json } from '../../_utils/http';

async function deleteCampaignGraph(env: any, campaignId: string) {
    await env.DB.prepare(
        `DELETE FROM jobs WHERE type = 'AUDIT' AND payload_json LIKE ?`
    ).bind(`%"campaignId":"${campaignId}"%`).run().catch(() => null);

    await env.DB.prepare(
        `DELETE FROM jobs WHERE type = 'DISCOVERY' AND payload_json LIKE ?`
    ).bind(`%"campaignId":"${campaignId}"%`).run().catch(() => null);

    await env.DB.prepare(`
        DELETE FROM scores
        WHERE audit_id IN (
            SELECT id FROM audits
            WHERE lead_id IN (SELECT id FROM leads WHERE campaign_id = ?)
        )
    `).bind(campaignId).run();

    await env.DB.prepare(`
        DELETE FROM summaries
        WHERE audit_id IN (
            SELECT id FROM audits
            WHERE lead_id IN (SELECT id FROM leads WHERE campaign_id = ?)
        )
    `).bind(campaignId).run();

    await env.DB.prepare(`
        DELETE FROM audits
        WHERE lead_id IN (SELECT id FROM leads WHERE campaign_id = ?)
    `).bind(campaignId).run();

    await env.DB.prepare(`DELETE FROM leads WHERE campaign_id = ?`).bind(campaignId).run();
    await env.DB.prepare(`DELETE FROM campaigns WHERE id = ?`).bind(campaignId).run();
}

export async function onRequestDelete(context: any) {
    const { env, params } = context;
    const campaignId = String(params?.id || '').trim();
    if (!campaignId) return apiError(400, 'Campaign id is required');

    try {
        const { results } = await env.DB.prepare('SELECT id FROM campaigns WHERE id = ? LIMIT 1').bind(campaignId).all();
        if (results.length === 0) return apiError(404, 'Campaign not found');

        await deleteCampaignGraph(env, campaignId);
        return json({ message: 'Campaign deleted', campaign_id: campaignId });
    } catch (e: any) {
        return apiError(500, d1ErrorMessage(e, 'Failed to delete campaign'));
    }
}
