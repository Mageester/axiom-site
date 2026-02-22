import { fetchOsmBusinesses } from '../_utils/osm';
import { performAudit } from '../_utils/audit';
import { apiError, d1ErrorMessage, json } from '../_utils/http';
import { logEvent } from '../_utils/log';

export async function onRequestPost(context: any) {
    const { env } = context;
    let jobsProcessed = 0;
    const log: string[] = [];

    try {
        // Only pick up queued jobs. 'running' jobs are in-flight or orphaned.
        // Orphaned jobs (locked > 5 min ago) get reset to queued automatically.
        await env.DB.prepare(`
            UPDATE jobs 
            SET status = 'queued', locked_at = NULL 
            WHERE status = 'running' 
            AND locked_at < datetime('now', '-5 minutes')
        `).run().catch(() => null); // ignore if locked_at column missing

        const { results: pendingJobs } = await env.DB.prepare(`
            SELECT id, type, payload_json, attempts 
            FROM jobs 
            WHERE status = 'queued'
            AND run_after <= CURRENT_TIMESTAMP
            ORDER BY created_at ASC
            LIMIT 3
        `).all();

        if (pendingJobs.length === 0) {
            return json({ msg: "No jobs pending", log });
        }

        for (const job of pendingJobs) {
            // Lock job atomically — only proceed if we successfully flipped it to running
            const lockResult = await env.DB.prepare(
                `UPDATE jobs SET status='running', locked_at=CURRENT_TIMESTAMP WHERE id=? AND status='queued'`
            ).bind(job.id).run();

            // If no rows changed, another worker grabbed this job — skip
            if (typeof lockResult.meta?.changes === 'number' && lockResult.meta.changes !== 1) {
                log.push(`Job ${job.id} already locked, skipping`);
                continue;
            }

            log.push(`Starting ${job.type} ID: ${job.id}`);

            try {
                if (job.type === 'DISCOVERY') {
                    const payload = JSON.parse(job.payload_json);
                    const { campaignId, niche, city, radius_km } = payload;

                    if (!campaignId || !niche || !city) throw new Error('Invalid DISCOVERY payload');

                    const businesses = await fetchOsmBusinesses(niche, city, Number(radius_km) || 10);
                    log.push(`Found ${businesses.length} businesses`);

                    for (const b of businesses) {
                        try {
                            await env.DB.prepare(`
                                INSERT OR IGNORE INTO businesses (osm_id, name, lat, lon, address, phone, website_raw)
                                VALUES (?, ?, ?, ?, ?, ?, ?)
                            `).bind(b.osm_id, b.name, b.lat, b.lon, b.address, b.phone, b.website).run();

                            const candidateLeadId = crypto.randomUUID();
                            let leadId = candidateLeadId;
                            await env.DB.prepare(`
                                INSERT OR IGNORE INTO leads (id, campaign_id, business_id, canonical_url)
                                VALUES (?, ?, ?, ?)
                            `).bind(candidateLeadId, campaignId, b.osm_id, b.website).run();

                            const { results: leadRows } = await env.DB.prepare(`
                                SELECT id FROM leads WHERE campaign_id = ? AND business_id = ? LIMIT 1
                            `).bind(campaignId, b.osm_id).all();

                            if (leadRows.length === 0) {
                                throw new Error(`Lead insert missing for business ${b.osm_id}`);
                            }
                            leadId = String(leadRows[0].id);

                            if (b.website && b.website.length > 5) {
                                const { results: existingAudits } = await env.DB.prepare(
                                    `SELECT id FROM audits WHERE lead_id = ? LIMIT 1`
                                ).bind(leadId).all();
                                if (existingAudits.length > 0) continue;

                                const auditJobId = crypto.randomUUID();
                                const auditPayload = JSON.stringify({ leadId, website: b.website });
                                await env.DB.prepare(`
                                    INSERT INTO jobs (id, type, payload_json) VALUES (?, 'AUDIT', ?)
                                `).bind(auditJobId, auditPayload).run();
                            }
                        } catch (insertE: any) {
                            const insertMsg = (insertE?.message || 'discovery insert error').substring(0, 300);
                            log.push(`Discovery item skipped (${b.osm_id}): ${insertMsg}`);
                        }
                    }

                } else if (job.type === 'AUDIT') {
                    const payload = JSON.parse(job.payload_json);
                    const { leadId, website } = payload;

                    if (!leadId || !website) throw new Error('Invalid AUDIT payload');
                    if (typeof website !== 'string' || website.length > 2048) throw new Error('Invalid website URL');

                    const auditRes = await performAudit(website);
                    log.push(`Audit time: ${auditRes.timeMs || 'err'}ms`);

                    if (auditRes.error) throw new Error(auditRes.error);

                    const auditId = crypto.randomUUID();
                    await env.DB.prepare(`
                        INSERT INTO audits (id, lead_id, final_url, https_supported, response_time_ms, html_bytes, has_form, has_booking, has_chat, evidence_json)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    `).bind(
                        auditId, leadId, auditRes.finalUrl, auditRes.httpsSupported, auditRes.timeMs,
                        auditRes.htmlBytes, auditRes.hasForm, auditRes.hasBooking, auditRes.hasChat, auditRes.evidenceJson
                    ).run();

                    // Scoring logic
                    let score = 100;
                    const reasons: string[] = [];
                    const bullets: string[] = [];

                    if (!auditRes.httpsSupported) { score -= 15; reasons.push('No HTTPS'); bullets.push('Site runs on HTTP — modern browsers show security warnings that deter customers.'); }
                    if (auditRes.timeMs && auditRes.timeMs > 2000) { score -= 20; reasons.push('Slow response (>2s)'); bullets.push('Website loads slowly, risking immediate user abandonment before they see your offer.'); }
                    if (auditRes.hasBooking === 0) { score -= 15; reasons.push('No booking integration'); bullets.push('No automated scheduling (no Calendly/Jobber/ServiceTitan) — every booking requires manual phone follow-up.'); }
                    if (auditRes.hasForm === 0) { score -= 20; reasons.push('No intake form'); bullets.push('Customers cannot request quotes directly — forces inefficient call-only contact cycles.'); }
                    if (auditRes.hasChat === 1) { score += 5; reasons.push('Has live chat'); }

                    score = Math.max(0, Math.min(100, score));

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
                    throw new Error(`Unknown job type: ${job.type}`);
                }

                await env.DB.prepare("UPDATE jobs SET status='done', updated_at=CURRENT_TIMESTAMP WHERE id=?").bind(job.id).run();
                jobsProcessed++;

            } catch (jobE: any) {
                const maxAttempts = 3;
                const nextStatus = (job.attempts + 1) >= maxAttempts ? 'failed' : 'queued';
                const errMsg = (jobE.message || 'unknown error').substring(0, 500); // Cap error log length
                log.push(`Job ${job.id} failed (attempt ${job.attempts + 1}/${maxAttempts}): ${errMsg}`);
                logEvent('error', 'jobs.run.job_failed', {
                    jobId: job.id,
                    type: job.type,
                    attempt: (job.attempts || 0) + 1,
                    nextStatus,
                    error: errMsg
                });
                await env.DB.prepare("UPDATE jobs SET status=?, attempts=attempts+1, last_error=?, locked_at=NULL, updated_at=CURRENT_TIMESTAMP WHERE id=?")
                    .bind(nextStatus, errMsg, job.id).run();
            }
        }

        return json({ msg: "Jobs run complete", processed: jobsProcessed, log });

    } catch (e: any) {
        logEvent('error', 'jobs.run.fatal_error', {
            message: e?.message || 'unknown'
        });
        return apiError(500, d1ErrorMessage(e, 'Fatal runner error'));
    }
}
