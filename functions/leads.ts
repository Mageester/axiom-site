import { requireProtectedPage } from './_utils/omniscient-page';

export async function onRequest(context: any) {
    const guarded = await requireProtectedPage(context);
    if (guarded) return guarded;
    const url = new URL(context.request.url);
    return Response.redirect(`${url.origin}/vault${url.search}`, 302);
}
