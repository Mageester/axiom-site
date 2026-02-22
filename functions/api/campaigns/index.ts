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

        return new Response(JSON.stringify({ campaigns: results }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (e) {
        return new Response('Error: ' + e.message, { status: 500 });
    }
}

export async function onRequestPost(context) {
    const { request, env } = context;
    try {
        const { niche, city, radius_km } = await request.json();

        if (!niche || !city || radius_km == null) {
            return new Response('Missing fields', { status: 400 });
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

        return new Response(JSON.stringify({ message: "Campaign created", campaign_id: campaignId, job_id: jobId }), {
            status: 201,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (e) {
        return new Response('Error: ' + e.message, { status: 500 });
    }
}
