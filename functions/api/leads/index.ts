import { ensureDiscoverySchema } from '../_utils/schema';
import { apiError, d1ErrorMessage, json } from '../_utils/http';

export async function onRequestGet(context) {
    const { env, request } = context;
    const url = new URL(request.url);
    const campaign_id = url.searchParams.get('campaign_id');
    const status = url.searchParams.get('status');
    const tag = url.searchParams.get('tag');
    const includeDuplicates = url.searchParams.get('include_duplicates') === '1';
    const readyOnly = url.searchParams.get('ready_to_contact') === '1';
    const noWebsite = url.searchParams.get('no_website') === '1';
    const websiteUnreachable = url.searchParams.get('website_unreachable') === '1';
    const verifiedLive = url.searchParams.get('verified_live') === '1';
    const highOpportunity = url.searchParams.get('high_opportunity') === '1';
    const highQuality = url.searchParams.get('high_quality') === '1';

    try {
        await ensureDiscoverySchema(env);
        let qs = '';
        const binds: any[] = [];
        if (campaign_id) {
            qs += ' WHERE (l.campaign_id = ? OR EXISTS (SELECT 1 FROM lead_campaigns lc WHERE lc.lead_id = l.id AND lc.campaign_id = ?))';
            binds.push(campaign_id, campaign_id);
        }
        if (status) {
            qs += (qs ? ' AND' : ' WHERE') + ' l.status = ?';
            binds.push(status);
        }
        if (!includeDuplicates) {
            qs += (qs ? ' AND' : ' WHERE') + ' (l.duplicate_of_lead_id IS NULL OR l.duplicate_of_lead_id = \'\')';
        }
        if (tag) {
            qs += (qs ? ' AND' : ' WHERE') + ' EXISTS (SELECT 1 FROM lead_tags lt JOIN tags t ON t.id = lt.tag_id WHERE lt.lead_id = l.id AND t.name = ?)';
            binds.push(tag);
        }
        if (readyOnly) {
            qs += (qs ? ' AND' : ' WHERE') + ` COALESCE(l.dnc,0)=0 AND ((b.phone IS NOT NULL AND b.phone != '') OR (l.detected_email IS NOT NULL AND l.detected_email != ''))`;
        }
        if (noWebsite) {
            qs += (qs ? ' AND' : ' WHERE') + ` (l.canonical_url IS NULL OR l.canonical_url = '')`;
        }
        if (websiteUnreachable) {
            qs += (qs ? ' AND' : ' WHERE') + ` COALESCE(l.website_verified, 'unknown') = 'unreachable'`;
        }
        if (verifiedLive) {
            qs += (qs ? ' AND' : ' WHERE') + ` COALESCE(l.website_verified, 'unknown') = 'confirmed_live'`;
        }
        if (highOpportunity) {
            qs += (qs ? ' AND' : ' WHERE') + ` COALESCE(l.opportunity_score, 0) >= 15`;
        }
        if (highQuality) {
            qs += (qs ? ' AND' : ' WHERE') + ` COALESCE(l.lead_quality_score, 0) >= 40`;
        }

        const query = `
            SELECT l.id, l.campaign_id, l.status, l.notes, l.canonical_url, l.last_audit_at,
                   COALESCE(l.opportunity_score, 0) as opportunity_score,
                   l.opportunity_reasons,
                   COALESCE(l.website_status, 'unknown') as website_status,
                   l.website_source,
                   COALESCE(l.website_verified, 'unknown') as website_verified,
                   l.website_last_checked_at,
                   COALESCE(l.lead_quality_score, 0) as lead_quality_score,
                   l.lead_quality_reasons,
                   COALESCE(l.dnc, 0) as dnc,
                   l.dnc_reason,
                   l.duplicate_of_lead_id,
                   l.last_contacted_at,
                   COALESCE(l.intake_present, 0) as intake_present,
                   COALESCE(l.booking_present, 0) as booking_present,
                   l.detected_email,
                   b.name, b.address, b.phone, b.website_raw, b.lat, b.lon,
                   a.id as audit_id, s.total as score, s.breakdown_json,
                   (SELECT GROUP_CONCAT(t.name, '|')
                      FROM lead_tags lt JOIN tags t ON t.id = lt.tag_id
                     WHERE lt.lead_id = l.id) as tags_csv,
                   (SELECT nh.note_text
                      FROM lead_notes_history nh
                     WHERE nh.lead_id = l.id
                     ORDER BY nh.created_at DESC
                     LIMIT 1) as last_note_preview
            FROM leads l
            JOIN businesses b ON l.business_id = b.osm_id
            LEFT JOIN audits a ON a.lead_id = l.id
            LEFT JOIN scores s ON s.audit_id = a.id
            ${qs}
            ORDER BY COALESCE(l.opportunity_score, 0) DESC, s.total DESC NULLS LAST, l.last_audit_at DESC NULLS LAST
            LIMIT 500
        `;

        const { results } = await env.DB.prepare(query).bind(...binds).all();

        return json({ leads: results });
    } catch (e: any) {
        return apiError(500, d1ErrorMessage(e, 'Failed to fetch leads'));
    }
}
