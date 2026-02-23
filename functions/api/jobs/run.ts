import { enrichWebsiteForBusiness, fetchOsmBusinesses } from '../_utils/osm';
import { performAudit } from '../_utils/audit';
import { apiError, d1ErrorMessage, json } from '../_utils/http';
import { logEvent } from '../_utils/log';
import { ensureDiscoverySchema } from '../_utils/schema';
import { auditLiteWebsite, expandNicheKeywords, normalizeDomain, normalizePhone, scoreOpportunity } from '../_utils/discovery';

export async function onRequestPost(context: any) {
    const { env, request } = context;
    let jobsProcessed = 0;
    const log: string[] = [];
    let prioritizedJobId: string | null = null;

    try {
        await ensureDiscoverySchema(env);

        const contentType = request.headers.get('Content-Type') || '';
        if (contentType.includes('application/json')) {
            let body: any = null;
            try {
                body = await request.json();
            } catch {
                return apiError(400, 'Invalid JSON body');
            }

            const campaignId = typeof body?.campaign_id === 'string' ? body.campaign_id.trim() : '';
            if (campaignId) {
                const { results: campaignRows } = await env.DB.prepare(
                    'SELECT id, niche, city, radius_km, COALESCE(mode, \'opportunity\') as mode FROM campaigns WHERE id = ? LIMIT 1'
                ).bind(campaignId).all();

                if (campaignRows.length === 0) {
                    return apiError(404, 'Campaign not found');
                }

                const campaign = campaignRows[0];
                prioritizedJobId = crypto.randomUUID();
                const payload = JSON.stringify({
                    campaignId: campaign.id,
                    niche: campaign.niche,
                    city: campaign.city,
                    radius_km: campaign.radius_km,
                    mode: campaign.mode === 'strict' ? 'strict' : 'opportunity'
                });

                await env.DB.prepare(
                    `INSERT INTO jobs (id, type, payload_json) VALUES (?, 'DISCOVERY', ?)`
                ).bind(prioritizedJobId, payload).run();
                log.push(`Queued DISCOVERY rerun for campaign ${campaign.id}`);
            }
        }

        // Only pick up queued jobs. 'running' jobs are in-flight or orphaned.
        // Orphaned jobs (locked > 5 min ago) get reset to queued automatically.
        await env.DB.prepare(`
            UPDATE jobs 
            SET status = 'queued', locked_at = NULL 
            WHERE status = 'running' 
            AND locked_at < datetime('now', '-5 minutes')
        `).run().catch(() => null); // ignore if locked_at column missing

        const pendingQuery = prioritizedJobId
            ? `
                SELECT id, type, payload_json, attempts
                FROM jobs
                WHERE status = 'queued'
                  AND run_after <= CURRENT_TIMESTAMP
                ORDER BY CASE WHEN id = ? THEN 0 ELSE 1 END, created_at ASC
                LIMIT 3
            `
            : `
                SELECT id, type, payload_json, attempts
                FROM jobs
                WHERE status = 'queued'
                  AND run_after <= CURRENT_TIMESTAMP
                ORDER BY created_at ASC
                LIMIT 3
            `;
        const pendingStmt = env.DB.prepare(pendingQuery);
        const { results: pendingJobs } = prioritizedJobId
            ? await pendingStmt.bind(prioritizedJobId).all()
            : await pendingStmt.all();

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
                    const mode = payload.mode === 'strict' ? 'strict' : 'opportunity';
                    const nicheKeywords = expandNicheKeywords(String(niche || ''));

                    if (!campaignId || !niche || !city) throw new Error('Invalid DISCOVERY payload');

                    const discoveryRes = await fetchOsmBusinesses(niche, city, Number(radius_km) || 10, env, mode);
                    const businesses = discoveryRes.businesses || [];
                    if (discoveryRes.meta?.broad_query_used) {
                        log.push(`broad_query_used city=${city} mode=${mode}`);
                        logEvent('info', 'discovery.broad_query_used', { campaignId, city, mode });
                    }
                    if (discoveryRes.meta?.strict_fallback_triggered) {
                        log.push(`strict_fallback_triggered city=${city}`);
                        logEvent('info', 'discovery.strict_fallback_triggered', { campaignId, city });
                    }
                    log.push(`Found ${businesses.length} businesses`);

                    let scoredCount = 0;
                    let emailsFoundCount = 0;
                    for (const b of businesses) {
                        try {
                            await env.DB.prepare(`
                                INSERT OR IGNORE INTO businesses (osm_id, name, lat, lon, address, phone, website_raw)
                                VALUES (?, ?, ?, ?, ?, ?, ?)
                            `).bind(b.osm_id, b.name, b.lat, b.lon, b.address, b.phone, b.website).run();

                            const websiteEnriched = await enrichWebsiteForBusiness(b, env);
                            if (websiteEnriched.error) {
                                log.push(`Website enrichment skipped (${b.osm_type || 'node'}:${b.osm_id}): ${websiteEnriched.error}`);
                            }
                            const resolvedWebsite = websiteEnriched.website || null;
                            const websiteStatus = websiteEnriched.website_status || 'unknown';
                            const websiteSource = websiteEnriched.website_source || null;

                            const domain = normalizeDomain(resolvedWebsite || b.website);
                            const phoneDigits = normalizePhone(b.phone);
                            const dedupeKey = domain ? `domain:${domain}` : (phoneDigits ? `phone:${phoneDigits}` : null);

                            let existingLead: any = null;
                            if (dedupeKey) {
                                const { results: dedupeRows } = await env.DB.prepare(
                                    `SELECT id, campaign_id, canonical_url FROM leads WHERE dedupe_key = ? LIMIT 1`
                                ).bind(dedupeKey).all();
                                if (dedupeRows.length > 0) existingLead = dedupeRows[0];
                            }
                            if (!existingLead) {
                                const { results: businessRows } = await env.DB.prepare(
                                    `SELECT id, campaign_id, canonical_url FROM leads WHERE business_id = ? LIMIT 1`
                                ).bind(b.osm_id).all();
                                if (businessRows.length > 0) existingLead = businessRows[0];
                            }

                            const candidateLeadId = crypto.randomUUID();
                            let leadId = candidateLeadId;

                            let intakePresent = 0;
                            let bookingPresent = 0;
                            let detectedEmail: string | null = null;
                            let finalUrl = resolvedWebsite;
                            let httpsSupported = resolvedWebsite && String(resolvedWebsite).startsWith('https://') ? 1 : 0;

                            if (resolvedWebsite) {
                                const lite = await auditLiteWebsite(String(resolvedWebsite));
                                if (lite) {
                                    intakePresent = lite.intakePresent;
                                    bookingPresent = lite.bookingPresent;
                                    detectedEmail = lite.detectedEmail;
                                    finalUrl = lite.finalUrl || finalUrl;
                                    httpsSupported = lite.httpsSupported;
                                    if (detectedEmail) emailsFoundCount++;
                                }
                            }

                            const scored = scoreOpportunity({
                                website: resolvedWebsite,
                                finalUrl,
                                phone: b.phone,
                                address: b.address,
                                name: b.name,
                                tags: b.tags || {},
                                intakePresent,
                                bookingPresent,
                                nicheKeywords
                            });
                            scoredCount++;

                            const shouldKeepByStrict =
                                mode !== 'strict' ||
                                scored.keywordHits > 0 ||
                                businesses.length < 20 ||
                                scored.score >= 8;
                            if (!shouldKeepByStrict) {
                                continue;
                            }

                            if (existingLead) {
                                leadId = String(existingLead.id);
                                await env.DB.prepare(`
                                    INSERT OR IGNORE INTO lead_campaigns (lead_id, campaign_id) VALUES (?, ?)
                                `).bind(leadId, campaignId).run();
                                await env.DB.prepare(`
                                    UPDATE leads
                                    SET canonical_url = COALESCE(canonical_url, ?),
                                        website_status = CASE WHEN ? = 'known' THEN 'known' ELSE COALESCE(website_status, ?) END,
                                        website_source = COALESCE(website_source, ?),
                                        opportunity_score = CASE WHEN opportunity_score IS NULL OR opportunity_score < ? THEN ? ELSE opportunity_score END,
                                        opportunity_reasons = CASE WHEN opportunity_score IS NULL OR opportunity_score < ? THEN ? ELSE opportunity_reasons END,
                                        intake_present = CASE WHEN intake_present = 1 THEN 1 ELSE ? END,
                                        booking_present = CASE WHEN booking_present = 1 THEN 1 ELSE ? END,
                                        detected_email = COALESCE(detected_email, ?),
                                        dedupe_key = COALESCE(dedupe_key, ?)
                                    WHERE id = ?
                                `).bind(
                                    finalUrl,
                                    websiteStatus, websiteStatus, websiteSource,
                                    scored.score, scored.score,
                                    scored.score, JSON.stringify(scored.reasons),
                                    intakePresent, bookingPresent, detectedEmail, dedupeKey, leadId
                                ).run().catch(() => null);
                            } else {
                                await env.DB.prepare(`
                                    INSERT OR IGNORE INTO leads (
                                        id, campaign_id, business_id, canonical_url,
                                        website_status, website_source,
                                        opportunity_score, opportunity_reasons, intake_present, booking_present, detected_email, dedupe_key
                                    )
                                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                                `).bind(
                                    candidateLeadId, campaignId, b.osm_id, finalUrl,
                                    websiteStatus, websiteSource,
                                    scored.score, JSON.stringify(scored.reasons), intakePresent, bookingPresent, detectedEmail, dedupeKey
                                ).run();
                                await env.DB.prepare(`
                                    INSERT OR IGNORE INTO lead_campaigns (lead_id, campaign_id) VALUES (?, ?)
                                `).bind(candidateLeadId, campaignId).run().catch(() => null);

                                const { results: leadRows } = await env.DB.prepare(`
                                    SELECT id FROM leads WHERE id = ? LIMIT 1
                                `).bind(candidateLeadId).all();
                                if (leadRows.length === 0) {
                                    throw new Error(`Lead insert missing for business ${b.osm_id}`);
                                }
                                leadId = String(leadRows[0].id);
                            }

                            if (resolvedWebsite && resolvedWebsite.length > 5) {
                                const { results: existingAudits } = await env.DB.prepare(
                                    `SELECT id FROM audits WHERE lead_id = ? LIMIT 1`
                                ).bind(leadId).all();
                                if (existingAudits.length > 0) continue;

                                const auditJobId = crypto.randomUUID();
                                const auditPayload = JSON.stringify({ leadId, website: resolvedWebsite });
                                await env.DB.prepare(`
                                    INSERT INTO jobs (id, type, payload_json) VALUES (?, 'AUDIT', ?)
                                `).bind(auditJobId, auditPayload).run();
                            }
                        } catch (insertE: any) {
                            const insertMsg = (insertE?.message || 'discovery insert error').substring(0, 300);
                            log.push(`Discovery item skipped (${b.osm_id}): ${insertMsg}`);
                        }
                    }
                    log.push(`leads_scored=${scoredCount}`);
                    log.push(`emails_found_count=${emailsFoundCount}`);
                    logEvent('info', 'discovery.leads_scored', { campaignId, count: scoredCount });
                    logEvent('info', 'discovery.emails_found_count', { campaignId, count: emailsFoundCount });

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
