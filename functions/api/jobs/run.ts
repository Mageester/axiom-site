import { fetchOsmBusinesses } from '../_utils/osm';
import { performAudit } from '../_utils/audit';

export async function onRequestPost({ request, env }: { request: any, env: any }) {
    let jobsProcessed = 0;
    const log: string[] = [];

    try {
        const { results: pendingJobs } = await env.DB.prepare(`
            SELECT id, type, payload_json, attempts 
            FROM jobs 
            WHERE status = 'queued' AND run_after <= CURRENT_TIMESTAMP
            ORDER BY created_at ASC
            LIMIT 3
        `).all();

        if (pendingJobs.length === 0) return new Response(JSON.stringify({ msg: "No jobs pending", log }), { status: 200, headers: { 'Content-Type': 'application/json' } });

        for (const job of pendingJobs) {
            log.push(`Starting ${job.type} ID: ${job.id}`);
            await env.DB.prepare("UPDATE jobs SET status='running', locked_at=CURRENT_TIMESTAMP WHERE id=?").bind(job.id).run();

            try {
                if (job.type === 'DISCOVERY') {
                    const payload = JSON.parse(job.payload_json);
                    const { campaignId, niche, city, radius_km } = payload;

                    const businesses = await fetchOsmBusinesses(niche, city, radius_km);
                    log.push(`Found ${businesses.length} businesses`);

                    for (const b of businesses) {
                        try {
                            await env.DB.prepare(`
                                INSERT OR IGNORE INTO businesses (osm_id, name, lat, lon, address, phone, website_raw)
                                VALUES (?, ?, ?, ?, ?, ?, ?)
                            `).bind(b.osm_id, b.name, b.lat, b.lon, b.address, b.phone, b.website).run();

                            const leadId = crypto.randomUUID();
                            await env.DB.prepare(`
                                INSERT OR IGNORE INTO leads (id, campaign_id, business_id, canonical_url)
                                VALUES (?, ?, ?, ?)
                            `).bind(leadId, campaignId, b.osm_id, b.website).run();

                            if (b.website && b.website.length > 5) {
                                const auditJobId = crypto.randomUUID();
                                const auditPayload = JSON.stringify({ leadId, website: b.website });
                                await env.DB.prepare(`
                                    INSERT INTO jobs (id, type, payload_json) VALUES (?, 'AUDIT', ?)
                                `).bind(auditJobId, auditPayload).run();
                            }
                        } catch (ibE) { } // ignore minor insert collisions
                    }

                } else if (job.type === 'AUDIT') {
                    const payload = JSON.parse(job.payload_json);
                    const { leadId, website } = payload;

                    const auditRes = await performAudit(website);
                    log.push(`Audit res length ms: ${auditRes.timeMs || 'err'}`);

                    if (!auditRes.error) {
                        const auditId = crypto.randomUUID();
                        await env.DB.prepare(`
                            INSERT INTO audits (id, lead_id, final_url, https_supported, response_time_ms, html_bytes, has_form, has_booking, has_chat, evidence_json)
                            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                        `).bind(
                            auditId, leadId, auditRes.finalUrl, auditRes.httpsSupported, auditRes.timeMs,
                            auditRes.htmlBytes, auditRes.hasForm, auditRes.hasBooking, auditRes.hasChat, auditRes.evidenceJson
                        ).run();

                        let score = 100;
                        let reasons: string[] = [];
                        let bullets: string[] = [];

                        if (auditRes.timeMs && auditRes.timeMs > 2000) { score -= 20; reasons.push("Slow response (>2s)"); bullets.push("Website loads very slowly, risking immediate user bounce/abandonment."); }
                        if (auditRes.hasBooking === 0) { score -= 15; reasons.push("No booking integration"); bullets.push("Missing an automated way to schedule jobs (No Calendly/Jobber/ServiceTitan)."); }
                        if (auditRes.hasForm === 0) { score -= 20; reasons.push("No intake form"); bullets.push("Customers cannot request quotes directly via form—forcing inefficient phone cycles."); }
                        if (auditRes.hasChat === 1) { score += 5; reasons.push("Has chat"); }

                        if (score < 0) score = 0;

                        const scoreId = crypto.randomUUID();
                        await env.DB.prepare(`
                            INSERT INTO scores (id, audit_id, total, reasons_json) VALUES (?, ?, ?, ?)
                        `).bind(scoreId, auditId, score, JSON.stringify(reasons)).run();

                        const sumId = crypto.randomUUID();
                        await env.DB.prepare(`
                            INSERT INTO summaries (id, lead_id, audit_id, bullets_json) VALUES (?, ?, ?, ?)
                        `).bind(sumId, leadId, auditId, JSON.stringify(bullets)).run();

                        await env.DB.prepare(`UPDATE leads SET last_audit_at = CURRENT_TIMESTAMP WHERE id = ?`).bind(leadId).run();
                    } else {
                        throw new Error(auditRes.error);
                    }
                }

                await env.DB.prepare("UPDATE jobs SET status='done', updated_at=CURRENT_TIMESTAMP WHERE id=?").bind(job.id).run();
                jobsProcessed++;
            } catch (jobE: any) {
                log.push(`Job ${job.id} failed: ${jobE.message}`);
                const nextStatus = job.attempts >= 2 ? 'failed' : 'queued';
                await env.DB.prepare("UPDATE jobs SET status=?, attempts=attempts+1, last_error=?, updated_at=CURRENT_TIMESTAMP WHERE id=?")
                    .bind(nextStatus, jobE.message, job.id).run();
            }
        }

        return new Response(JSON.stringify({ msg: "Jobs run triggered", processed: jobsProcessed, log }), {
            status: 200, headers: { 'Content-Type': 'application/json' }
        });
    } catch (e: any) {
        return new Response('Fatal runner error: ' + e.message, { status: 500 });
    }
}
