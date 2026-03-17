import { apiError, json } from '../../_utils/http';
import { validateContact } from '../../_utils/omniscient-email';
import {
    computeAxiomScoreFromDbLead,
    generateDedupeKey,
    generatePersonalization,
} from '../../_utils/omniscient-intelligence';
import {
    getOmniscientClientIp,
    listOmniscientLeads,
    requireOmniscientUser,
    updateOmniscientLeadById,
    writeOmniscientAuditEvent,
} from '../../_utils/omniscient';

export async function onRequestPost(context: any) {
    const auth = requireOmniscientUser(context, { admin: true });
    if ('response' in auth) {
        return auth.response;
    }

    try {
        const leads = await listOmniscientLeads(context.env, {
            includeArchived: true,
            limit: 5000,
            sort: 'createdAt',
            sortDir: 'asc',
        });

        const seenKeys = new Set<string>();
        let processed = 0;
        let archived = 0;

        for (const lead of leads) {
            const contact = validateContact(lead.email, lead.phone, {
                businessWebsite: lead.websiteUrl,
                ownerName: lead.contactName,
            });
            const scoreResult = computeAxiomScoreFromDbLead({
                niche: lead.niche,
                category: lead.category,
                city: lead.city,
                rating: lead.rating,
                reviewCount: lead.reviewCount,
                websiteStatus: lead.websiteStatus,
                email: lead.email,
                phone: lead.phone,
                socialLink: lead.socialLink,
                contactName: lead.contactName,
                tacticalNote: lead.tacticalNote,
                contact,
            });
            const dedupe = generateDedupeKey(lead.businessName, lead.city, lead.phone, lead.websiteUrl, lead.address);
            const isDuplicate = seenKeys.has(dedupe.key);
            seenKeys.add(dedupe.key);

            const personalization = generatePersonalization({
                assessment: null,
                businessName: lead.businessName,
                city: lead.city,
                contactName: lead.contactName,
                niche: lead.niche,
                painSignals: scoreResult.painSignals,
                websiteStatus: lead.websiteStatus || 'MISSING',
            });

            if (isDuplicate) {
                archived += 1;
            }

            await updateOmniscientLeadById(context.env, lead.id, {
                callOpener: personalization.callOpener,
                followUpQuestion: personalization.followUpQuestion,
                isArchived: lead.isArchived || isDuplicate,
                tacticalNote: lead.tacticalNote,
            });

            await context.env.DB.prepare(
                `UPDATE omniscient_leads
                 SET axiom_score = ?,
                     axiom_tier = ?,
                     lead_score = ?,
                     score_breakdown = ?,
                     pain_signals = ?,
                     dedupe_key = ?,
                     dedupe_matched_by = ?,
                     email_type = ?,
                     email_confidence = ?,
                     phone_confidence = ?,
                     last_updated = ?
                 WHERE id = ?`
            ).bind(
                scoreResult.axiomScore,
                scoreResult.tier,
                scoreResult.axiomScore,
                JSON.stringify(scoreResult.breakdown),
                JSON.stringify(scoreResult.painSignals),
                dedupe.key,
                dedupe.matchedBy,
                contact.emailType,
                contact.emailConfidence,
                contact.phoneConfidence,
                new Date().toISOString(),
                lead.id,
            ).run();

            processed += 1;
        }

        await writeOmniscientAuditEvent(context.env, {
            action: 'omniscient.lead.backfill',
            actorUserId: auth.user.id,
            actorUsername: auth.user.username,
            ipAddress: getOmniscientClientIp(context.request),
            metadata: {
                archived,
                processed,
            },
            targetType: 'backfill',
        });

        return json({ archived, processed, success: true });
    } catch (error) {
        return apiError(500, error instanceof Error ? error.message : 'Failed to backfill leads');
    }
}
