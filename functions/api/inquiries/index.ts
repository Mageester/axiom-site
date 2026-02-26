import { z } from 'zod';
import { apiError, d1ErrorMessage, json } from '../_utils/http';
import { INQUIRY_STATUSES, ensureWebsiteInquiriesSchema } from '../_utils/inquiries';

const QuerySchema = z.object({
    status: z.enum(INQUIRY_STATUSES).optional(),
    q: z.string().trim().max(120).optional(),
    limit: z.coerce.number().int().min(1).max(100).optional().default(50),
    offset: z.coerce.number().int().min(0).max(5000).optional().default(0)
});

export async function onRequestGet(context: any) {
    const { env, request } = context;
    try {
        await ensureWebsiteInquiriesSchema(env);
        let queryInput: z.infer<typeof QuerySchema>;
        try {
            const url = new URL(request.url);
            queryInput = QuerySchema.parse({
                status: url.searchParams.get('status') || undefined,
                q: url.searchParams.get('q') || undefined,
                limit: url.searchParams.get('limit') || undefined,
                offset: url.searchParams.get('offset') || undefined
            });
        } catch (e: any) {
            return apiError(400, 'Invalid query', { details: e?.issues?.[0]?.message });
        }

        const where: string[] = [];
        const binds: any[] = [];
        if (queryInput.status) {
            where.push('status = ?');
            binds.push(queryInput.status);
        }
        if (queryInput.q) {
            where.push('(business_name LIKE ? OR name LIKE ? OR email LIKE ?)');
            const needle = `%${queryInput.q}%`;
            binds.push(needle, needle, needle);
        }
        const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';

        const { results } = await env.DB.prepare(`
            SELECT id, created_at, business_name, name, email, primary_goal, status
            FROM website_inquiries
            ${whereSql}
            ORDER BY created_at DESC
            LIMIT ? OFFSET ?
        `).bind(...binds, queryInput.limit, queryInput.offset).all();

        return json({ inquiries: results, limit: queryInput.limit, offset: queryInput.offset });
    } catch (e: any) {
        return apiError(500, d1ErrorMessage(e, 'Failed to load inquiries'));
    }
}
