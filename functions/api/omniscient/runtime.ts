import { apiError, json } from '../_utils/http';
import {
    getOmniscientRuntimeStatus,
    requireOmniscientUser,
} from '../_utils/omniscient';

export async function onRequestGet(context: any) {
    const auth = requireOmniscientUser(context, { admin: true });
    if ('response' in auth) {
        return auth.response;
    }

    try {
        const status = await getOmniscientRuntimeStatus(context.env);
        return json(status);
    } catch (error) {
        return apiError(500, error instanceof Error ? error.message : 'Failed to load runtime status');
    }
}
