import { z } from 'zod';
import { apiError, d1ErrorMessage, json } from '../_utils/http';
import { ensureDiscoverySchema } from '../_utils/schema';

const BulkLeadInput = z.object({
    lead_ids: z.array(z.string().min(1)).min(1).max(200),
    action: z.enum(['status', 'dnc', 'tag_add', 'tag_remove']),
    status: z.enum(['new', 'contacted', 'qualified', 'closed', 'disqualified']).optional(),
    dnc: z.boolean().optional(),
    dnc_reason: z.string().max(500).optional(),
    tag_name: z.string().max(64).optional()
});

export async function onRequestPost(context: any) {
    const { env, request } = context;
    try {
        await ensureDiscoverySchema(env);
        let payload: any;
        try {
            payload = BulkLeadInput.parse(await request.json());
        } catch (e: any) {
            return apiError(400, 'Invalid input', { details: e?.issues?.[0]?.message });
        }

        const leadIds = Array.from(new Set(payload.lead_ids.map((v: string) => v.trim()).filter(Boolean))).slice(0, 200);
        if (!leadIds.length) return apiError(400, 'No lead IDs provided');
        const placeholders = leadIds.map(() => '?').join(', ');

        if (payload.action === 'status') {
            if (!payload.status) return apiError(400, 'status is required');
            await env.DB.prepare(`
                UPDATE leads SET status = ?, last_contacted_at = CASE WHEN ? = 'contacted' THEN COALESCE(last_contacted_at, CURRENT_TIMESTAMP) ELSE last_contacted_at END
                WHERE id IN (${placeholders})
            `).bind(payload.status, payload.status, ...leadIds).run();
            return json({ message: 'Bulk status updated', count: leadIds.length });
        }

        if (payload.action === 'dnc') {
            if (typeof payload.dnc !== 'boolean') return apiError(400, 'dnc is required');
            await env.DB.prepare(`
                UPDATE leads SET dnc = ?, dnc_reason = ?
                WHERE id IN (${placeholders})
            `).bind(payload.dnc ? 1 : 0, payload.dnc ? (payload.dnc_reason || '') : null, ...leadIds).run();
            return json({ message: 'Bulk DNC updated', count: leadIds.length });
        }

        const tagName = String(payload.tag_name || '').trim().replace(/\s+/g, ' ');
        if (!tagName) return apiError(400, 'tag_name is required');
        let tagId = '';
        const { results: tagRows } = await env.DB.prepare(`SELECT id FROM tags WHERE name = ? LIMIT 1`).bind(tagName).all();
        if (tagRows.length) {
            tagId = String(tagRows[0].id);
        } else if (payload.action === 'tag_add') {
            tagId = crypto.randomUUID();
            await env.DB.prepare(`INSERT INTO tags (id, name) VALUES (?, ?)`).bind(tagId, tagName).run();
        } else {
            return json({ message: 'Tag not found', count: 0 });
        }

        if (payload.action === 'tag_add') {
            for (const leadId of leadIds) {
                await env.DB.prepare(`INSERT OR IGNORE INTO lead_tags (lead_id, tag_id) VALUES (?, ?)`).bind(leadId, tagId).run();
            }
            return json({ message: 'Bulk tag added', count: leadIds.length, tag_id: tagId });
        }

        await env.DB.prepare(`DELETE FROM lead_tags WHERE tag_id = ? AND lead_id IN (${placeholders})`).bind(tagId, ...leadIds).run();
        return json({ message: 'Bulk tag removed', count: leadIds.length, tag_id: tagId });
    } catch (e: any) {
        return apiError(500, d1ErrorMessage(e, 'Bulk lead action failed'));
    }
}
