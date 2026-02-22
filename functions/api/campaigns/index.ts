import { apiError, d1ErrorMessage, json } from '../_utils/http';

export async function onRequestGet(context) {
    const { env } = context;
    try {
        const { results } = await env.DB.prepare(`
            SELECT c.*, COUNT(l.id) as lead_count
            FROM campaigns c
            LEFT JOIN leads l ON c.id = l.campaign_id
            GROUP BY c.id
            ORDER BY c.created_at DESC
        `).all();

        return json({ campaigns: results });
    } catch (e: any) {
        return apiError(500, d1ErrorMessage(e, 'Failed to fetch campaigns'));
    }
}

export async function onRequestPost(context) {
    const { request, env } = context;
    try {
        const { niche, city, radius_km } = await request.json();

        if (!niche || !city || radius_km == null) {
            return apiError(400, 'Missing fields');
        }

        const campaignId = crypto.randomUUID();
        await env.DB.prepare(
            'INSERT INTO campaigns (id, niche, city, radius_km) VALUES (?, ?, ?, ?)'
        ).bind(campaignId, niche, city, radius_km).run();

        // Enqueue a discovery job
        const jobId = crypto.randomUUID();
        const payload = JSON.stringify({ campaignId, niche, city, radius_km });
        await env.DB.prepare(
            'INSERT INTO jobs (id, type, payload_json) VALUES (?, ?, ?)'
        ).bind(jobId, 'DISCOVERY', payload).run();

        return json({ message: "Campaign created", campaign_id: campaignId, job_id: jobId }, 201);
    } catch (e: any) {
        return apiError(500, d1ErrorMessage(e, 'Failed to create campaign'));
    }
}
