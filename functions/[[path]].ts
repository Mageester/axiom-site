import { isOpsHost, requireProtectedPage, servePublicAppShell, shouldBypassPublicShell } from './_utils/omniscient-page';

export async function onRequest(context: any) {
    const url = new URL(context.request.url);

    if (!isOpsHost(context.request)) {
        if (context.request.method === 'GET' || context.request.method === 'HEAD') {
            if (!shouldBypassPublicShell(url.pathname)) {
                return servePublicAppShell(context);
            }
        }

        return context.next();
    }

    const guarded = await requireProtectedPage(context);
    if (guarded) {
        return guarded;
    }

    return Response.redirect(`${url.origin}/dashboard`, 302);
}
