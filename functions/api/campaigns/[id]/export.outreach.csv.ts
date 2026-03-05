import { apiError, d1ErrorMessage } from '../../_utils/http';
import { ensureDiscoverySchema } from '../../_utils/schema';

function esc(value: unknown) {
    const s = String(value ?? '');
    const neutralized = /^[=+\-@]/.test(s) ? `'${s}` : s;
    if (/[",\n]/.test(neutralized)) return `"${neutralized.replace(/"/g, '""')}"`;
    return neutralized;
}

function outreachAngle(row: any) {
    const reasons: string[] = [];
    if (!row.website) reasons.push('No website found');
    if (row.website_verified === 'unreachable') reasons.push('Website unreachable');
    if (!Number(row.intake_present || 0)) reasons.push('Missing intake form');
    if (!Number(row.booking_present || 0)) reasons.push('Missing booking');
    if (!reasons.length) reasons.push('Lead quality signals present');
    return reasons.slice(0, 2).join('; ');
}

export async function onRequestGet(context: any) {
    const { env, params, request } = context;
    const campaignId = String(params?.id || '').trim();
    if (!campaignId) return apiError(400, 'Campaign id is required');
    const includeDnc = new URL(request.url).searchParams.get('include_dnc') === '1';

    try {
        await ensureDiscoverySchema(env);
        const { results: campaignRows } = await env.DB.prepare(
            `SELECT id, niche, city FROM campaigns WHERE id = ? LIMIT 1`
        ).bind(campaignId).all();
        if (!campaignRows.length) return apiError(404, 'Campaign not found');
        const campaign = campaignRows[0];

        const { results } = await env.DB.prepare(`
            SELECT DISTINCT
                b.name,
                l.detected_email as email,
                b.phone,
                COALESCE(l.canonical_url, b.website_raw, '') as website,
                ? as city,
                ? as niche,
                COALESCE(l.website_verified, 'unknown') as website_verified,
                COALESCE(l.intake_present, 0) as intake_present,
                COALESCE(l.booking_present, 0) as booking_present,
                COALESCE(l.dnc, 0) as dnc
            FROM leads l
            JOIN businesses b ON l.business_id = b.osm_id
            WHERE (l.campaign_id = ? OR EXISTS (SELECT 1 FROM lead_campaigns lc WHERE lc.lead_id = l.id AND lc.campaign_id = ?))
              AND (COALESCE(l.dnc, 0) = 0 OR ? = 1)
              AND ((l.detected_email IS NOT NULL AND l.detected_email != '') OR (b.phone IS NOT NULL AND b.phone != ''))
            ORDER BY COALESCE(l.lead_quality_score, 0) DESC, COALESCE(l.opportunity_score, 0) DESC
            LIMIT 2000
        `).bind(campaign.city, campaign.niche, campaignId, campaignId, includeDnc ? 1 : 0).all();

        const header = ['name', 'email', 'phone', 'website', 'city', 'niche', 'angle_reason'];
        const lines = results.map((r: any) => [
            r.name,
            r.email,
            r.phone,
            r.website,
            r.city,
            r.niche,
            outreachAngle(r)
        ].map(esc).join(','));

        return new Response([header.join(','), ...lines].join('\n'), {
            status: 200,
            headers: {
                'Content-Type': 'text/csv; charset=utf-8',
                'Content-Disposition': `attachment; filename="campaign-${campaignId}-outreach.csv"`,
                'Cache-Control': 'no-store'
            }
        });
    } catch (e: any) {
        return apiError(500, d1ErrorMessage(e, 'Failed to export outreach CSV'));
    }
}
