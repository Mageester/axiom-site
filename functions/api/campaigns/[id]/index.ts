import { apiError, d1ErrorMessage, json } from '../../_utils/http';
import { ensureDiscoverySchema } from '../../_utils/schema';

async function deleteCampaignGraph(env: any, campaignId: string) {
    await env.DB.prepare(
        `DELETE FROM jobs WHERE type = 'DISCOVERY' AND payload_json LIKE ?`
    ).bind(`%"campaignId":"${campaignId}"%`).run().catch(() => null);

    // Remove explicit links first
    await env.DB.prepare(`DELETE FROM lead_campaigns WHERE campaign_id = ?`).bind(campaignId).run().catch(() => null);

    // Delete leads owned by this campaign that are not linked elsewhere
    const { results: leadRows } = await env.DB.prepare(`
        SELECT id FROM leads
        WHERE campaign_id = ?
           OR id IN (SELECT lead_id FROM lead_campaigns WHERE campaign_id = ?)
    `).bind(campaignId, campaignId).all();
    const leadIds = leadRows.map((r: any) => String(r.id));

    for (const leadId of leadIds) {
        const { results: links } = await env.DB.prepare(
            `SELECT COUNT(*) as c FROM lead_campaigns WHERE lead_id = ?`
        ).bind(leadId).all();
        const linkCount = Number(links?.[0]?.c || 0);
        const { results: ownerRows } = await env.DB.prepare(
            `SELECT campaign_id FROM leads WHERE id = ? LIMIT 1`
        ).bind(leadId).all();
        const ownerCampaignId = ownerRows[0]?.campaign_id ? String(ownerRows[0].campaign_id) : null;
        const shouldDeleteLead = ownerCampaignId === campaignId && linkCount === 0;
        if (!shouldDeleteLead) continue;

        await env.DB.prepare(`DELETE FROM scores WHERE audit_id IN (SELECT id FROM audits WHERE lead_id = ?)`).bind(leadId).run();
        await env.DB.prepare(`DELETE FROM summaries WHERE audit_id IN (SELECT id FROM audits WHERE lead_id = ?)`).bind(leadId).run();
        await env.DB.prepare(`DELETE FROM audits WHERE lead_id = ?`).bind(leadId).run();
        await env.DB.prepare(`DELETE FROM jobs WHERE type = 'AUDIT' AND payload_json LIKE ?`).bind(`%"leadId":"${leadId}"%`).run().catch(() => null);
        await env.DB.prepare(`DELETE FROM leads WHERE id = ?`).bind(leadId).run();
    }

    // Clean remaining rows that still directly reference this campaign without link support
    await env.DB.prepare(`
        DELETE FROM leads
        WHERE campaign_id = ?
          AND id NOT IN (SELECT lead_id FROM lead_campaigns)
    `).bind(campaignId).run();
    await env.DB.prepare(`DELETE FROM campaigns WHERE id = ?`).bind(campaignId).run();
}

export async function onRequestDelete(context: any) {
    const { env, params } = context;
    const campaignId = String(params?.id || '').trim();
    if (!campaignId) return apiError(400, 'Campaign id is required');

    try {
        await ensureDiscoverySchema(env);
        const { results } = await env.DB.prepare('SELECT id FROM campaigns WHERE id = ? LIMIT 1').bind(campaignId).all();
        if (results.length === 0) return apiError(404, 'Campaign not found');

        await deleteCampaignGraph(env, campaignId);
        return json({ message: 'Campaign deleted', campaign_id: campaignId });
    } catch (e: any) {
        return apiError(500, d1ErrorMessage(e, 'Failed to delete campaign'));
    }
}
