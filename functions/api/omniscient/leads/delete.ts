import { z } from 'zod';

import { apiError, json } from '../../_utils/http';
import {
    deleteOmniscientLeadById,
    getOmniscientClientIp,
    getOmniscientLeadById,
    requireOmniscientUser,
    writeOmniscientAuditEvent,
} from '../../_utils/omniscient';

const DeleteSchema = z.object({
    ids: z.array(z.number().int().positive()).min(1).max(100),
});

export async function onRequestPost(context: any) {
    const auth = requireOmniscientUser(context, { admin: true });
    if ('response' in auth) {
        return auth.response;
    }

    let body: unknown;
    try {
        body = await context.request.json();
    } catch {
        return apiError(400, 'Invalid JSON body');
    }

    const parsed = DeleteSchema.safeParse(body);
    if (!parsed.success) {
        return apiError(400, parsed.error.issues[0]?.message || 'Invalid delete payload');
    }

    const deleted: number[] = [];
    for (const id of parsed.data.ids) {
        const lead = await getOmniscientLeadById(context.env, id);
        if (!lead) continue;
        await deleteOmniscientLeadById(context.env, id);
        deleted.push(id);
    }

    await writeOmniscientAuditEvent(context.env, {
        action: 'omniscient.lead.bulk_delete',
        actorUserId: auth.user.id,
        actorUsername: auth.user.username,
        ipAddress: getOmniscientClientIp(context.request),
        metadata: { ids: deleted },
        targetType: 'lead',
    });

    return json({ deleted });
}
