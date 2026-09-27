// Static _headers rules do not apply to Pages Function responses.
const privatePath = /^\/(?:admin(?:-shell)?|account|dashboard|hunt|vault|triage|settings|lead|leads|jobs|campaigns|api|functions)(?:\/|$)/;

export async function onRequest(context: { request: Request; next: () => Promise<Response> }) {
  const response = await context.next();
  const url = new URL(context.request.url);
  const pagesHost = url.hostname === 'axiom-site.pages.dev' || url.hostname.endsWith('.axiom-site.pages.dev');
  if (!privatePath.test(url.pathname) && !url.hostname.startsWith('ops.') && !pagesHost) return response;
  const headers = new Headers(response.headers);
  headers.set('X-Robots-Tag', 'noindex, nofollow');
  headers.set('Cache-Control', 'no-store');
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
}
