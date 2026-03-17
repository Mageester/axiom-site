import { apiError, json } from '../../_utils/http';
import { getOmniscientStats, requireOmniscientUser } from '../../_utils/omniscient';

export async function onRequestGet(context: any) {
    const auth = requireOmniscientUser(context);
    if ('response' in auth) {
        return auth.response;
    }

    try {
        const stats = await getOmniscientStats(context.env);
        return json(stats);
    } catch (error) {
        return apiError(500, error instanceof Error ? error.message : 'Failed to load stats');
    }
}
