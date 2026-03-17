import { serveProtectedAppShell } from './_utils/omniscient-page';

export async function onRequest(context: any) {
    return serveProtectedAppShell(context);
}
