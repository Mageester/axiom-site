import { z } from 'zod';
import { apiError, d1ErrorMessage, json } from '../../_utils/http';

const ALLOWED_STATUSES = ['new', 'contacted', 'qualified', 'closed', 'disqualified'] as const;

const PatchLeadInput = z.object({
    status: z.enum(ALLOWED_STATUSES).optional(),
    notes: z.string().max(5000).optional()
});

export async function onRequestGet(context: any) {
    const { env, params } = context;
    try {
        const { results: leads } = await env.DB.prepare(`
            SELECT l.id, l.campaign_id, l.business_id, l.canonical_url, l.status, l.notes,
                   b.name, b.address, b.phone, b.website_raw, b.lat, b.lon,
                   a.id as audit_id, a.final_url, a.redirect_chain_json, a.https_supported, 
                   a.response_time_ms, a.has_form, a.has_booking, a.has_chat,
                   s.total as score, s.breakdown_json, s.reasons_json,
                   sum.bullets_json
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
        let payload;
        try {
            payload = PatchLeadInput.parse(await request.json());
        } catch (e: any) {
            return apiError(400, 'Invalid input', { details: e.issues?.[0]?.message });
        }

        const { status, notes } = payload;

        const updates: string[] = [];
        const binds: any[] = [];
        if (status !== undefined) { updates.push('status = ?'); binds.push(status); }
        if (notes !== undefined) { updates.push('notes = ?'); binds.push(notes); }

        if (updates.length > 0) {
            await env.DB.prepare(`UPDATE leads SET ${updates.join(', ')} WHERE id = ?`).bind(...binds, params.id).run();
        }

        return json({ message: "Updated" });
    } catch (e: any) {
        return apiError(500, d1ErrorMessage(e, 'Failed to update lead'));
    }
}
