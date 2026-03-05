import { apiError, d1ErrorMessage } from '../../_utils/http';
import { ensureDiscoverySchema } from '../../_utils/schema';

function esc(value: unknown) {
    const s = String(value ?? '');
    const neutralized = /^[=+\-@]/.test(s) ? `'${s}` : s;
    if (/[",\n]/.test(neutralized)) return `"${neutralized.replace(/"/g, '""')}"`;
    return neutralized;
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
                l.id,
                b.name,
                b.phone,
                l.detected_email as email,
                COALESCE(l.canonical_url, b.website_raw, '') as website,
                b.address,
                ? as city,
                ? as niche,
                COALESCE(l.opportunity_score, 0) as opportunity_score,
                COALESCE(l.lead_quality_score, 0) as quality_score,
                COALESCE(l.website_status, 'unknown') as website_status,
                COALESCE(l.website_verified, 'unknown') as website_verified,
                l.status,
                COALESCE(l.dnc, 0) as dnc,
                COALESCE(l.dnc_reason, '') as dnc_reason,
                COALESCE(l.last_contacted_at, '') as last_contacted_at,
                COALESCE(l.notes, '') as notes,
                COALESCE(l.intake_present, 0) as intake_present,
                COALESCE(l.booking_present, 0) as booking_present,
                l.opportunity_reasons,
                (SELECT GROUP_CONCAT(t.name, '|')
                   FROM lead_tags lt JOIN tags t ON t.id = lt.tag_id
                  WHERE lt.lead_id = l.id) as tags_csv,
                (SELECT nh.note_text
                   FROM lead_notes_history nh
                  WHERE nh.lead_id = l.id
                  ORDER BY nh.created_at DESC
                  LIMIT 1) as notes_summary
            FROM leads l
            JOIN businesses b ON l.business_id = b.osm_id
            WHERE l.campaign_id = ?
               OR EXISTS (SELECT 1 FROM lead_campaigns lc WHERE lc.lead_id = l.id AND lc.campaign_id = ?)
              ${includeDnc ? '' : 'AND COALESCE(l.dnc, 0) = 0'}
            ORDER BY COALESCE(l.opportunity_score, 0) DESC, l.last_audit_at DESC NULLS LAST, l.id DESC
            LIMIT 2000
        `).bind(campaign.city, campaign.niche, campaignId, campaignId).all();

        const header = [
            'name', 'phone', 'email', 'website', 'address', 'city', 'niche',
            'website_status', 'website_verified',
            'opportunity_score', 'quality_score',
            'missing_flags', 'tags', 'last_contacted_at', 'status', 'notes_summary', 'notes'
        ];
        const rows = results.map((r: any) => {
            const flags = [
                !(r.website) ? 'no_website' : '',
                r.website_verified === 'unreachable' ? 'website_unreachable' : '',
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
                r.website_status,
                r.website_verified,
                r.opportunity_score,
                r.quality_score,
                flags,
                r.tags_csv || '',
                r.last_contacted_at || '',
                r.status,
                r.notes_summary || '',
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
