import { z } from 'zod';
import { apiError, d1ErrorMessage, json } from '../../_utils/http';
import { ensureDiscoverySchema } from '../../_utils/schema';

const AddLeadTagInput = z.object({
    tag_id: z.string().min(1).optional(),
    tag_name: z.string().min(1).max(64).optional()
});

export async function onRequestGet(context: any) {
    const { env, params } = context;
    try {
        await ensureDiscoverySchema(env);
        const leadId = String(params?.id || '');
        const { results } = await env.DB.prepare(`
            SELECT t.id, t.name, t.color
            FROM lead_tags lt
            JOIN tags t ON t.id = lt.tag_id
            WHERE lt.lead_id = ?
            ORDER BY lower(t.name) ASC
        `).bind(leadId).all();
        return json({ tags: results });
    } catch (e: any) {
        return apiError(500, d1ErrorMessage(e, 'Failed to load lead tags'));
    }
}

export async function onRequestPost(context: any) {
    const { env, params, request } = context;
    try {
        await ensureDiscoverySchema(env);
        let payload: any;
        try {
            payload = AddLeadTagInput.parse(await request.json());
        } catch (e: any) {
            return apiError(400, 'Invalid input', { details: e?.issues?.[0]?.message });
        }
        const leadId = String(params?.id || '');
        let tagId = String(payload.tag_id || '').trim();
        if (!tagId) {
            const tagName = String(payload.tag_name || '').trim().replace(/\s+/g, ' ');
            if (!tagName) return apiError(400, 'tag_id or tag_name is required');
            const { results } = await env.DB.prepare(`SELECT id FROM tags WHERE name = ? LIMIT 1`).bind(tagName).all();
            if (results.length) tagId = String(results[0].id);
            else {
                tagId = crypto.randomUUID();
                await env.DB.prepare(`INSERT INTO tags (id, name) VALUES (?, ?)`).bind(tagId, tagName).run();
            }
        }
        await env.DB.prepare(`INSERT OR IGNORE INTO lead_tags (lead_id, tag_id) VALUES (?, ?)`).bind(leadId, tagId).run();
        return json({ message: 'Tag added' });
    } catch (e: any) {
        return apiError(500, d1ErrorMessage(e, 'Failed to add tag'));
    }
}

export async function onRequestDelete(context: any) {
    const { env, params, request } = context;
    try {
        await ensureDiscoverySchema(env);
        const leadId = String(params?.id || '');
        const url = new URL(request.url);
        const tagId = String(url.searchParams.get('tag_id') || '').trim();
        const tagName = String(url.searchParams.get('tag_name') || '').trim();
        if (!tagId && !tagName) return apiError(400, 'tag_id or tag_name is required');

        if (tagId) {
            await env.DB.prepare(`DELETE FROM lead_tags WHERE lead_id = ? AND tag_id = ?`).bind(leadId, tagId).run();
        } else {
            await env.DB.prepare(`
                DELETE FROM lead_tags
                WHERE lead_id = ?
                  AND tag_id IN (SELECT id FROM tags WHERE name = ?)
            `).bind(leadId, tagName).run();
        }
        return json({ message: 'Tag removed' });
    } catch (e: any) {
        return apiError(500, d1ErrorMessage(e, 'Failed to remove tag'));
    }
}
