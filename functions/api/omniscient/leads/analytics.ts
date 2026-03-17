import { apiError, json } from '../../_utils/http';
import { getOmniscientAnalytics, requireOmniscientUser } from '../../_utils/omniscient';

export async function onRequestGet(context: any) {
    const auth = requireOmniscientUser(context);
    if ('response' in auth) {
        return auth.response;
    }

    try {
        const analytics = await getOmniscientAnalytics(context.env);
        return json(analytics);
    } catch (error) {
        return apiError(500, error instanceof Error ? error.message : 'Failed to load analytics');
    }
}
