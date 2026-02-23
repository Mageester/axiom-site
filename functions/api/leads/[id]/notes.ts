import { z } from 'zod';
import { apiError, d1ErrorMessage, json } from '../../_utils/http';
import { ensureDiscoverySchema } from '../../_utils/schema';

const CreateNoteInput = z.object({
    note_text: z.string().min(1).max(5000)
});

export async function onRequestGet(context: any) {
    const { env, params } = context;
    try {
        await ensureDiscoverySchema(env);
        const leadId = String(params?.id || '');
        const { results } = await env.DB.prepare(`
            SELECT id, note_text, created_at
            FROM lead_notes_history
            WHERE lead_id = ?
            ORDER BY created_at DESC
            LIMIT 100
        `).bind(leadId).all();
        return json({ notes: results });
    } catch (e: any) {
        return apiError(500, d1ErrorMessage(e, 'Failed to load note history'));
    }
}

export async function onRequestPost(context: any) {
    const { env, params, request } = context;
    try {
        await ensureDiscoverySchema(env);
        let payload: any;
        try {
            payload = CreateNoteInput.parse(await request.json());
        } catch (e: any) {
            return apiError(400, 'Invalid input', { details: e?.issues?.[0]?.message });
        }
        const leadId = String(params?.id || '');
        const noteText = payload.note_text.trim();
        const id = crypto.randomUUID();
        await env.DB.prepare(`
            INSERT INTO lead_notes_history (id, lead_id, note_text)
            VALUES (?, ?, ?)
        `).bind(id, leadId, noteText).run();
        return json({ note: { id, note_text: noteText } }, 201);
    } catch (e: any) {
        return apiError(500, d1ErrorMessage(e, 'Failed to add note'));
    }
}
