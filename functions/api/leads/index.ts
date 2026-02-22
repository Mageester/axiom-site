export async function onRequestGet(context) {
    const { env, request } = context;
    const url = new URL(request.url);
    const campaign_id = url.searchParams.get('campaign_id');
    const status = url.searchParams.get('status');

    try {
        let qs = '';
        let binds = [];
        if (campaign_id) {
            qs += ' WHERE l.campaign_id = ?';
            binds.push(campaign_id);
        }
        if (status) {
            qs += (qs ? ' AND' : ' WHERE') + ' l.status = ?';
            binds.push(status);
        }

        const query = `
            SELECT l.id, l.campaign_id, l.status, l.notes, l.canonical_url,
                   b.name, b.address, b.phone, b.website_raw, b.lat, b.lon,
                   a.id as audit_id, s.total as score, s.breakdown_json 
            FROM leads l
            JOIN businesses b ON l.business_id = b.osm_id
            LEFT JOIN audits a ON a.lead_id = l.id
            LEFT JOIN scores s ON s.audit_id = a.id
            ${qs}
            ORDER BY s.total DESC NULLS LAST, l.last_audit_at DESC NULLS LAST
            LIMIT 500
        `;

        const { results } = await env.DB.prepare(query).bind(...binds).all();

        return new Response(JSON.stringify({ leads: results }), {
            status: 200, headers: { 'Content-Type': 'application/json' }
        });
    } catch (e) {
        return new Response('Error fetch leads: ' + e.message, { status: 500 });
    }
}
