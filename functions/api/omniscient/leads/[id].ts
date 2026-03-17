import { z } from 'zod';

import { apiError, json } from '../../_utils/http';
import {
    deleteOmniscientLeadById,
    getOmniscientClientIp,
    getOmniscientLeadById,
    requireOmniscientUser,
    updateOmniscientLeadById,
    writeOmniscientAuditEvent,
} from '../../_utils/omniscient';

const UpdateLeadSchema = z.object({
    callOpener: z.string().max(5000).optional(),
    contactName: z.string().max(255).nullable().optional(),
    email: z.string().max(255).nullable().optional(),
    followUpQuestion: z.string().max(5000).optional(),
    isArchived: z.boolean().optional(),
    phone: z.string().max(100).nullable().optional(),
    socialLink: z.string().max(1000).nullable().optional(),
    tacticalNote: z.string().max(5000).optional(),
    websiteUrl: z.string().max(1000).nullable().optional(),
});

function parseLeadId(context: any) {
    const leadId = Number(context.params?.id);
    return Number.isInteger(leadId) && leadId > 0 ? leadId : null;
}

export async function onRequestGet(context: any) {
    const auth = requireOmniscientUser(context);
    if ('response' in auth) {
        return auth.response;
    }

    const leadId = parseLeadId(context);
    if (!leadId) {
        return apiError(400, 'Invalid lead ID');
    }

    const lead = await getOmniscientLeadById(context.env, leadId);
    if (!lead) {
        return apiError(404, 'Lead not found');
    }

    return json({ lead });
}

export async function onRequestPatch(context: any) {
    const auth = requireOmniscientUser(context, { admin: true });
    if ('response' in auth) {
        return auth.response;
    }

    const leadId = parseLeadId(context);
    if (!leadId) {
        return apiError(400, 'Invalid lead ID');
    }

    let body: unknown;
    try {
        body = await context.request.json();
    } catch {
        return apiError(400, 'Invalid JSON body');
    }

    const parsed = UpdateLeadSchema.safeParse(body);
    if (!parsed.success) {
        return apiError(400, parsed.error.issues[0]?.message || 'Invalid lead update payload');
    }

    const updated = await updateOmniscientLeadById(context.env, leadId, parsed.data);
    if (!updated) {
        return apiError(404, 'Lead not found');
    }

    await writeOmniscientAuditEvent(context.env, {
        action: 'omniscient.lead.update',
        actorUserId: auth.user.id,
        actorUsername: auth.user.username,
        ipAddress: getOmniscientClientIp(context.request),
        metadata: { fields: Object.keys(parsed.data) },
        targetId: leadId,
        targetType: 'lead',
    });

    return json({ lead: updated });
}

export async function onRequestDelete(context: any) {
    const auth = requireOmniscientUser(context, { admin: true });
    if ('response' in auth) {
        return auth.response;
    }

    const leadId = parseLeadId(context);
    if (!leadId) {
        return apiError(400, 'Invalid lead ID');
    }

    const existing = await getOmniscientLeadById(context.env, leadId);
    if (!existing) {
        return apiError(404, 'Lead not found');
    }

    await deleteOmniscientLeadById(context.env, leadId);
    await writeOmniscientAuditEvent(context.env, {
        action: 'omniscient.lead.delete',
        actorUserId: auth.user.id,
        actorUsername: auth.user.username,
        ipAddress: getOmniscientClientIp(context.request),
        targetId: leadId,
        targetType: 'lead',
        metadata: {
            businessName: existing.businessName,
            city: existing.city,
            niche: existing.niche,
        },
    });

    return json({ success: true });
}
