import { requireProtectedPage } from '../_utils/omniscient-page';

export async function onRequest(context: any) {
    const guarded = await requireProtectedPage(context);
    if (guarded) return guarded;
    const url = new URL(context.request.url);
    const id = context.params?.id ? `/${context.params.id}` : '';
    return Response.redirect(`${url.origin}/lead${id}${url.search}`, 302);
}
