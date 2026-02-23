import { z } from 'zod';
import { apiError, d1ErrorMessage, json } from '../_utils/http';
import { ensureDiscoverySchema } from '../_utils/schema';

const CreateTagInput = z.object({
    name: z.string().min(1).max(64),
    color: z.string().max(32).optional()
});

export async function onRequestGet(context: any) {
    const { env } = context;
    try {
        await ensureDiscoverySchema(env);
        const { results } = await env.DB.prepare(`
            SELECT id, name, color, created_at
            FROM tags
            ORDER BY lower(name) ASC
        `).all();
        return json({ tags: results });
    } catch (e: any) {
        return apiError(500, d1ErrorMessage(e, 'Failed to load tags'));
    }
}

export async function onRequestPost(context: any) {
    const { env, request } = context;
    try {
        await ensureDiscoverySchema(env);
        let payload: any;
        try {
            payload = CreateTagInput.parse(await request.json());
        } catch (e: any) {
            return apiError(400, 'Invalid input', { details: e?.issues?.[0]?.message });
        }
        const name = payload.name.trim().replace(/\s+/g, ' ');
        const color = payload.color || null;
        if (!name) return apiError(400, 'Tag name is required');

        const id = crypto.randomUUID();
        await env.DB.prepare(`
            INSERT INTO tags (id, name, color) VALUES (?, ?, ?)
        `).bind(id, name, color).run();

        return json({ tag: { id, name, color } }, 201);
    } catch (e: any) {
        const msg = String(e?.message || '');
        if (msg.includes('UNIQUE')) return apiError(409, 'Tag already exists');
        return apiError(500, d1ErrorMessage(e, 'Failed to create tag'));
    }
}
