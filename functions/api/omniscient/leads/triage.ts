import { apiError, json } from '../../_utils/http';
import { listOmniscientLeads, requireOmniscientUser } from '../../_utils/omniscient';

export async function onRequestGet(context: any) {
    const auth = requireOmniscientUser(context);
    if ('response' in auth) {
        return auth.response;
    }

    try {
        const url = new URL(context.request.url);
        const tier = url.searchParams.get('tier');
        const minRating = Number(url.searchParams.get('minRating') || '0');

        const leads = await listOmniscientLeads(context.env, {
            city: url.searchParams.get('city') || null,
            hasEmail: url.searchParams.get('hasEmail') === '1' ? true : null,
            hasPhone: url.searchParams.get('hasPhone') === '1' ? true : null,
            includeArchived: false,
            limit: Math.min(Number(url.searchParams.get('limit') || '200'), 500),
            minRating: Number.isFinite(minRating) && minRating > 0 ? minRating : null,
            niche: url.searchParams.get('niche') || null,
            noWebsite: url.searchParams.get('noWebsite') === '1',
            sort: url.searchParams.get('sort') === 'recent' ? 'createdAt' : 'axiomScore',
            sortDir: 'desc',
            tier: tier ? tier.split(',').map((value) => value.trim()).filter(Boolean) : ['S', 'A', 'B'],
        });

        return json({ leads });
    } catch (error) {
        return apiError(500, error instanceof Error ? error.message : 'Failed to load triage leads');
    }
}
