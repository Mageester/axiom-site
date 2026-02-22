import { apiError, d1ErrorMessage, json } from '../_utils/http';

export async function onRequestGet(context) {
    const { env } = context;
    try {
        const { results } = await env.DB.prepare(`
            SELECT id, type, status, attempts, created_at, updated_at, last_error
            FROM jobs 
            ORDER BY created_at DESC 
            LIMIT 100
        `).all();

        const stats = await env.DB.prepare(`
            SELECT status, count(*) as c 
            FROM jobs 
            GROUP BY status
        `).all();

        return json({ jobs: results, stats: stats.results });
    } catch (e: any) {
        return apiError(500, d1ErrorMessage(e, 'Failed to fetch jobs'));
    }
}
