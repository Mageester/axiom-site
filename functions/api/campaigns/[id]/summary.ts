import { apiError, d1ErrorMessage, json } from '../../_utils/http';
import { ensureDiscoverySchema } from '../../_utils/schema';

export async function onRequestGet(context: any) {
    const { env, params } = context;
    const campaignId = String(params?.id || '').trim();
    if (!campaignId) return apiError(400, 'Campaign id is required');

    try {
        await ensureDiscoverySchema(env);
        const { results: campaignRows } = await env.DB.prepare(
            `SELECT id, niche, city, radius_km, COALESCE(mode, 'opportunity') as mode FROM campaigns WHERE id = ? LIMIT 1`
        ).bind(campaignId).all();
        if (!campaignRows.length) return apiError(404, 'Campaign not found');

        const baseFilter = `
            FROM leads l
            WHERE l.campaign_id = ?
               OR EXISTS (SELECT 1 FROM lead_campaigns lc WHERE lc.lead_id = l.id AND lc.campaign_id = ?)
        `;

        const [{ results: totals }, { results: emails }] = await Promise.all([
            env.DB.prepare(`
                SELECT
                    COUNT(*) as total_leads,
                    SUM(CASE WHEN COALESCE(l.opportunity_score, 0) >= 15 THEN 1 ELSE 0 END) as high_opportunity_count,
                    SUM(CASE WHEN l.canonical_url IS NULL OR l.canonical_url = '' THEN 1 ELSE 0 END) as no_website_count,
                    SUM(CASE WHEN COALESCE(l.intake_present, 0) = 0 THEN 1 ELSE 0 END) as missing_intake_count,
                    SUM(CASE WHEN COALESCE(l.booking_present, 0) = 0 THEN 1 ELSE 0 END) as missing_booking_count
                    ${baseFilter}
            `).bind(campaignId, campaignId).all(),
            env.DB.prepare(`
                SELECT COUNT(*) as emails_found_count
                ${baseFilter}
                  AND l.detected_email IS NOT NULL AND l.detected_email != ''
            `).bind(campaignId, campaignId).all()
        ]);

        return json({
            campaign: campaignRows[0],
            summary: {
                total_leads: Number(totals?.[0]?.total_leads || 0),
                high_opportunity_count: Number(totals?.[0]?.high_opportunity_count || 0),
                no_website_count: Number(totals?.[0]?.no_website_count || 0),
                missing_intake_count: Number(totals?.[0]?.missing_intake_count || 0),
                missing_booking_count: Number(totals?.[0]?.missing_booking_count || 0),
                emails_found_count: Number(emails?.[0]?.emails_found_count || 0)
            }
        });
    } catch (e: any) {
        return apiError(500, d1ErrorMessage(e, 'Failed to load campaign summary'));
    }
}
