import { z } from 'zod';
import { apiError, d1ErrorMessage, json } from '../../_utils/http';
import { INQUIRY_STATUSES, ensureWebsiteInquiriesSchema } from '../../_utils/inquiries';

const PatchSchema = z.object({
    status: z.enum(INQUIRY_STATUSES)
});

export async function onRequestGet(context: any) {
    const { env, params } = context;
    try {
        await ensureWebsiteInquiriesSchema(env);
        const id = String(params?.id || '').trim();
        if (!id) return apiError(400, 'Inquiry id is required');
        const { results } = await env.DB.prepare(`
            SELECT *
            FROM website_inquiries
            WHERE id = ?
            LIMIT 1
        `).bind(id).all();
        if (!results.length) return apiError(404, 'Inquiry not found');
        return json({ inquiry: results[0] });
    } catch (e: any) {
        return apiError(500, d1ErrorMessage(e, 'Failed to load inquiry'));
    }
}

export async function onRequestPatch(context: any) {
    const { env, params, request } = context;
    try {
        await ensureWebsiteInquiriesSchema(env);
        const id = String(params?.id || '').trim();
        if (!id) return apiError(400, 'Inquiry id is required');

        let payload: z.infer<typeof PatchSchema>;
        try {
            payload = PatchSchema.parse(await request.json());
        } catch (e: any) {
            return apiError(400, 'Invalid input', { details: e?.issues?.[0]?.message });
        }

        const result = await env.DB.prepare(`
            UPDATE website_inquiries
            SET status = ?
            WHERE id = ?
        `).bind(payload.status, id).run();

        if (Number(result.meta?.changes || 0) === 0) {
            return apiError(404, 'Inquiry not found');
        }
        return json({ ok: true, status: payload.status });
    } catch (e: any) {
        return apiError(500, d1ErrorMessage(e, 'Failed to update inquiry'));
    }
}
