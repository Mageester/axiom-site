import { resolveOmniscientUserFromRequest } from '../api/_utils/omniscient';

type PageGuardOptions = {
    admin?: boolean;
};

export function isOpsHost(request: Request) {
    const host = request.headers.get('Host') || '';
    const normalizedHost = host.toLowerCase();
    return /^ops\./i.test(host) || /^operations\./i.test(host) || normalizedHost === 'ops.getaxiom.ca' || normalizedHost === 'operations.getaxiom.ca';
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

async function fetchAppShell(context: any) {
    const assets = context?.env?.ASSETS;
    if (!assets?.fetch) {
        return null;
    }

    const indexUrl = new URL('/index.html', context.request.url);
    const response = await assets.fetch(new Request(indexUrl.toString(), context.request));
    if (!response.ok) {
        return null;
    }

    const headers = new Headers(response.headers);
    headers.set('Cache-Control', 'no-store');

    return new Response(response.body, {
        headers,
        status: response.status,
        statusText: response.statusText,
    });
}

export async function serveProtectedAppShell(context: any, options: PageGuardOptions = {}) {
    const guarded = await requireProtectedPage(context, options);
    if (guarded) {
        return guarded;
    }

    const shell = await fetchAppShell(context);
    return shell || context.next();
}

export async function servePublicAppShell(context: any) {
    const shell = await fetchAppShell(context);
    return shell || context.next();
}
