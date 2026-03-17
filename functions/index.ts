import { isOpsHost, requireProtectedPage } from './_utils/omniscient-page';

export async function onRequest(context: any) {
    if (!isOpsHost(context.request)) {
        return context.next();
    }

    const guarded = await requireProtectedPage(context);
    if (guarded) {
        return guarded;
    }

    const url = new URL(context.request.url);
    return Response.redirect(`${url.origin}/dashboard`, 302);
}
