import { apiError, json } from '../../_utils/http';
import {
    ensureOmniscientSchema,
    listOmniscientLeads,
    requireOmniscientUser,
} from '../../_utils/omniscient';

function parseBooleanParam(value: string | null) {
    if (value == null || value === '') return null;
    return value === '1' || value === 'true';
}

export async function onRequestGet(context: any) {
    const auth = requireOmniscientUser(context);
    if ('response' in auth) {
        return auth.response;
    }

    try {
        await ensureOmniscientSchema(context.env);

        const url = new URL(context.request.url);
        const tier = url.searchParams.get('tier');
        const minRating = Number(url.searchParams.get('minRating') || '0');

        const leads = await listOmniscientLeads(context.env, {
            city: url.searchParams.get('city') || null,
            hasEmail: parseBooleanParam(url.searchParams.get('hasEmail')),
            hasPhone: parseBooleanParam(url.searchParams.get('hasPhone')),
            includeArchived: url.searchParams.get('includeArchived') === '1',
            limit: Number(url.searchParams.get('limit') || '250'),
            minRating: Number.isFinite(minRating) && minRating > 0 ? minRating : null,
            niche: url.searchParams.get('niche') || null,
            noWebsite: url.searchParams.get('noWebsite') === '1',
            search: url.searchParams.get('search') || null,
            sort: (url.searchParams.get('sort') as any) || 'createdAt',
            sortDir: (url.searchParams.get('sortDir') as any) || 'desc',
            tier: tier ? tier.split(',').map((value) => value.trim()).filter(Boolean) : null,
            websiteStatus: url.searchParams.get('websiteStatus') || null,
        });

        return json({ leads });
    } catch (error) {
        return apiError(500, error instanceof Error ? error.message : 'Failed to list leads');
    }
}
