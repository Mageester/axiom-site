import { requireProtectedPage } from './_utils/omniscient-page';

export async function onRequest(context: any) {
    const guarded = await requireProtectedPage(context, { admin: true });
    if (guarded) return guarded;
    return context.next();
}
