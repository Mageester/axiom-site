import { z } from 'zod';
import { apiError, d1ErrorMessage, json } from '../../_utils/http';
import { ensureDiscoverySchema } from '../../_utils/schema';

const ALLOWED_STATUSES = ['new', 'contacted', 'qualified', 'closed', 'disqualified'] as const;

const PatchLeadInput = z.object({
    status: z.enum(ALLOWED_STATUSES).optional(),
    notes: z.string().max(5000).optional(),
    dnc: z.boolean().optional(),
    dnc_reason: z.string().max(500).nullable().optional(),
    last_contacted_at: z.string().max(64).nullable().optional()
});

export async function onRequestGet(context: any) {
    const { env, params } = context;
    try {
        await ensureDiscoverySchema(env);
        const { results: leads } = await env.DB.prepare(`
            SELECT l.id, l.campaign_id, l.business_id, l.canonical_url, l.status, l.notes,
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
                   b.name, b.address, b.phone, b.website_raw, b.lat, b.lon,
                   a.id as audit_id, a.final_url, a.redirect_chain_json, a.https_supported, 
                   a.response_time_ms, a.has_form, a.has_booking, a.has_chat,
                   s.total as score, s.breakdown_json, s.reasons_json,
                   sum.bullets_json,
                   (SELECT GROUP_CONCAT(t.name, '|')
                      FROM lead_tags lt JOIN tags t ON t.id = lt.tag_id
                     WHERE lt.lead_id = l.id) as tags_csv,
                   (SELECT nh.note_text
                      FROM lead_notes_history nh
                     WHERE nh.lead_id = l.id
                     ORDER BY nh.created_at DESC
                     LIMIT 1) as last_note_entry
            FROM leads l
            JOIN businesses b ON l.business_id = b.osm_id
            LEFT JOIN audits a ON a.lead_id = l.id
            LEFT JOIN scores s ON s.audit_id = a.id
            LEFT JOIN summaries sum ON sum.audit_id = a.id
            WHERE l.id = ?
            ORDER BY a.created_at DESC
            LIMIT 1
        `).bind(params.id).all();

        if (leads.length === 0) return apiError(404, 'Lead not found');

        return json({ lead: leads[0] });
    } catch (e: any) {
        return apiError(500, d1ErrorMessage(e, 'Failed to fetch lead'));
    }
}

export async function onRequestPatch(context: any) {
    const { env, params, request } = context;
    try {
        await ensureDiscoverySchema(env);
        let payload;
        try {
            payload = PatchLeadInput.parse(await request.json());
        } catch (e: any) {
            return apiError(400, 'Invalid input', { details: e.issues?.[0]?.message });
        }

        const { status, notes, dnc, dnc_reason, last_contacted_at } = payload;

        const updates: string[] = [];
        const binds: any[] = [];
        if (status !== undefined) { updates.push('status = ?'); binds.push(status); }
        if (notes !== undefined) { updates.push('notes = ?'); binds.push(notes); }
        if (dnc !== undefined) { updates.push('dnc = ?'); binds.push(dnc ? 1 : 0); }
        if (dnc_reason !== undefined) { updates.push('dnc_reason = ?'); binds.push(dnc_reason); }
        if (last_contacted_at !== undefined) { updates.push('last_contacted_at = ?'); binds.push(last_contacted_at); }
        if (status === 'contacted' && last_contacted_at === undefined) {
            updates.push(`last_contacted_at = COALESCE(last_contacted_at, CURRENT_TIMESTAMP)`);
        }

        if (updates.length > 0) {
            await env.DB.prepare(`UPDATE leads SET ${updates.join(', ')} WHERE id = ?`).bind(...binds, params.id).run();
        }
        if (notes !== undefined && String(notes || '').trim()) {
            await env.DB.prepare(`
                INSERT INTO lead_notes_history (id, lead_id, note_text) VALUES (?, ?, ?)
            `).bind(crypto.randomUUID(), params.id, String(notes).trim()).run().catch(() => null);
        }

        return json({ message: "Updated" });
    } catch (e: any) {
        return apiError(500, d1ErrorMessage(e, 'Failed to update lead'));
    }
}
