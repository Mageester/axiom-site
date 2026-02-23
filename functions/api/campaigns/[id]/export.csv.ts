import { apiError, d1ErrorMessage } from '../../_utils/http';
import { ensureDiscoverySchema } from '../../_utils/schema';

function esc(value: unknown) {
    const s = String(value ?? '');
    if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
    return s;
}

export async function onRequestGet(context: any) {
    const { env, params } = context;
    const campaignId = String(params?.id || '').trim();
    if (!campaignId) return apiError(400, 'Campaign id is required');

    try {
        await ensureDiscoverySchema(env);
        const { results: campaignRows } = await env.DB.prepare(
            `SELECT id, niche, city FROM campaigns WHERE id = ? LIMIT 1`
        ).bind(campaignId).all();
        if (!campaignRows.length) return apiError(404, 'Campaign not found');
        const campaign = campaignRows[0];

        const { results } = await env.DB.prepare(`
            SELECT DISTINCT
                l.id,
                b.name,
                b.phone,
                l.detected_email as email,
                COALESCE(l.canonical_url, b.website_raw, '') as website,
                b.address,
                ? as city,
                ? as niche,
                COALESCE(l.opportunity_score, 0) as score,
                l.status,
                COALESCE(l.notes, '') as notes,
                COALESCE(l.intake_present, 0) as intake_present,
                COALESCE(l.booking_present, 0) as booking_present,
                l.opportunity_reasons
            FROM leads l
            JOIN businesses b ON l.business_id = b.osm_id
            WHERE l.campaign_id = ?
               OR EXISTS (SELECT 1 FROM lead_campaigns lc WHERE lc.lead_id = l.id AND lc.campaign_id = ?)
            ORDER BY COALESCE(l.opportunity_score, 0) DESC, l.last_audit_at DESC NULLS LAST, l.id DESC
            LIMIT 2000
        `).bind(campaign.city, campaign.niche, campaignId, campaignId).all();

        const header = [
            'name', 'phone', 'email', 'website', 'address', 'city', 'niche', 'score', 'missing_flags', 'status', 'notes'
        ];
        const rows = results.map((r: any) => {
            const flags = [
                !(r.website) ? 'no_website' : '',
                Number(r.intake_present) ? '' : 'missing_intake',
                Number(r.booking_present) ? '' : 'missing_booking'
            ].filter(Boolean).join('|');
            return [
                r.name,
                r.phone,
                r.email,
                r.website,
                r.address,
                r.city,
                r.niche,
                r.score,
                flags,
                r.status,
                r.notes
            ].map(esc).join(',');
        });

        const csv = [header.join(','), ...rows].join('\n');
        return new Response(csv, {
            status: 200,
            headers: {
                'Content-Type': 'text/csv; charset=utf-8',
                'Content-Disposition': `attachment; filename="campaign-${campaignId}.csv"`,
                'Cache-Control': 'no-store'
            }
        });
    } catch (e: any) {
        return apiError(500, d1ErrorMessage(e, 'Failed to export campaign CSV'));
    }
}
