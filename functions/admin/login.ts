import { servePublicAppShell } from '../_utils/omniscient-page';

export async function onRequest(context: any) {
    return servePublicAppShell(context);
}
