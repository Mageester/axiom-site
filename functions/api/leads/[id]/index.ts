export async function onRequestGet(context) {
    const { env, params } = context;
    try {
        const { results: leads } = await env.DB.prepare(`
            SELECT l.id, l.campaign_id, l.business_id, l.canonical_url, l.status, l.notes,
                   b.name, b.address, b.phone, b.website_raw, b.lat, b.lon,
                   a.id as audit_id, a.final_url, a.redirect_chain_json, a.https_supported, 
                   a.response_time_ms, a.has_form, a.has_booking, a.has_chat,
                   s.total as score, s.breakdown_json, s.reasons_json,
                   sum.bullets_json
            FROM leads l
            JOIN businesses b ON l.business_id = b.osm_id
            LEFT JOIN audits a ON a.lead_id = l.id
            LEFT JOIN scores s ON s.audit_id = a.id
            LEFT JOIN summaries sum ON sum.audit_id = a.id
            WHERE l.id = ?
            ORDER BY a.created_at DESC
            LIMIT 1
        `).bind(params.id).all();

        if (leads.length === 0) return new Response('Not found', { status: 404 });

        return new Response(JSON.stringify({ lead: leads[0] }), {
            status: 200, headers: { 'Content-Type': 'application/json' }
        });
    } catch (e) {
        return new Response('Error: ' + e.message, { status: 500 });
    }
}

export async function onRequestPatch(context) {
    const { env, params, request } = context;
    try {
        const payload = await request.json();
        const { status, notes } = payload;

        const updates = [];
        const binds = [];
        if (status) { updates.push('status = ?'); binds.push(status); }
        if (notes !== undefined) { updates.push('notes = ?'); binds.push(notes); }

        if (updates.length > 0) {
            await env.DB.prepare(`UPDATE leads SET ${updates.join(', ')} WHERE id = ?`).bind(...binds, params.id).run();
        }

        return new Response(JSON.stringify({ message: "Updated" }), {
            status: 200, headers: { 'Content-Type': 'application/json' }
        });
    } catch (e) {
        return new Response('Error: ' + e.message, { status: 500 });
    }
}
