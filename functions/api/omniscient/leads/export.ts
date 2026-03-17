import { apiError } from '../../_utils/http';
import {
    buildOmniscientCsv,
    consumeOmniscientRateLimit,
    getOmniscientClientIp,
    getOmniscientEnv,
    listOmniscientLeads,
    requireOmniscientUser,
    writeOmniscientAuditEvent,
} from '../../_utils/omniscient';
import {
    buildOmniscientExportFilename,
    generateOmniscientXlsx,
    sortOmniscientLeadsDeterministic,
} from '../../_utils/omniscient-export';

export async function onRequestGet(context: any) {
    const auth = requireOmniscientUser(context, { admin: true });
    if ('response' in auth) {
        return auth.response;
    }

    try {
        const env = getOmniscientEnv(context.env);
        const ipAddress = getOmniscientClientIp(context.request);
        const rateLimit = await consumeOmniscientRateLimit(context.env, {
            identifier: `${auth.user.id}:${ipAddress}`,
            limit: env.rateLimitMaxExport,
            scope: 'omniscient_export',
            windowSeconds: env.rateLimitWindowSeconds,
        });

        if (!rateLimit.allowed) {
            return apiError(429, `Export rate limit exceeded. Try again after ${rateLimit.resetAt.toISOString()}.`, {
                resetAt: rateLimit.resetAt.toISOString(),
            });
        }

        const url = new URL(context.request.url);
        const tier = url.searchParams.get('tier');
        const format = url.searchParams.get('format') === 'xlsx' ? 'xlsx' : 'csv';
        const city = url.searchParams.get('city') || null;
        const niche = url.searchParams.get('niche') || null;

        const leads = await listOmniscientLeads(context.env, {
            city,
            hasEmail: url.searchParams.get('hasEmail') === '1' ? true : null,
            hasPhone: url.searchParams.get('hasPhone') === '1' ? true : null,
            includeArchived: url.searchParams.get('includeArchived') === '1',
            limit: 5000,
            niche,
            noWebsite: url.searchParams.get('noWebsite') === '1',
            search: url.searchParams.get('search') || null,
            sort: (url.searchParams.get('sort') as any) || 'axiomScore',
            sortDir: (url.searchParams.get('sortDir') as any) || 'desc',
            tier: tier ? tier.split(',').map((value) => value.trim()).filter(Boolean) : null,
            websiteStatus: url.searchParams.get('websiteStatus') || null,
        });

        sortOmniscientLeadsDeterministic(leads);

        const filename = buildOmniscientExportFilename(format, {
            city,
            niche,
            preset: 'call-sheet',
            tier: tier ? tier.split(',').map((value) => value.trim()).filter(Boolean) : null,
        });

        await writeOmniscientAuditEvent(context.env, {
            action: 'omniscient.export',
            actorUserId: auth.user.id,
            actorUsername: auth.user.username,
            ipAddress,
            metadata: {
                city,
                format,
                niche,
                rowCount: leads.length,
                tier,
            },
            targetType: 'export',
        });

        if (format === 'xlsx') {
            const buffer = await generateOmniscientXlsx(leads);
            return new Response(buffer, {
                status: 200,
                headers: {
                    'Cache-Control': 'no-store',
                    'Content-Disposition': `attachment; filename="${filename}"`,
                    'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                },
            });
        }

        const csv = buildOmniscientCsv(leads);
        return new Response(csv, {
            status: 200,
            headers: {
                'Cache-Control': 'no-store',
                'Content-Disposition': `attachment; filename="${filename}"`,
                'Content-Type': 'text/csv; charset=utf-8',
            },
        });
    } catch (error) {
        return apiError(500, error instanceof Error ? error.message : 'Failed to export leads');
    }
}
