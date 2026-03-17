import { resolveOmniscientUserFromRequest } from '../api/_utils/omniscient';

type PageGuardOptions = {
    admin?: boolean;
};

export function isOpsHost(request: Request) {
    const host = request.headers.get('Host') || '';
    return /^ops\./i.test(host) || host.toLowerCase() === 'ops.getaxiom.ca';
}

export async function requireProtectedPage(context: any, options: PageGuardOptions = {}) {
    const user = await resolveOmniscientUserFromRequest(context.request, context.env);
    const url = new URL(context.request.url);

    if (!user) {
        const next = encodeURIComponent(`${url.pathname}${url.search}`);
        return Response.redirect(`${url.origin}/admin/login?next=${next}`, 302);
    }

    if (user.must_change_password && url.pathname !== '/account') {
        return Response.redirect(`${url.origin}/account`, 302);
    }

    if (options.admin && user.role !== 'admin') {
        return Response.redirect(`${url.origin}/dashboard`, 302);
    }

    return null;
}
