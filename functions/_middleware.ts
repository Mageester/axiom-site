/**
 * Root middleware — runs on every Pages Functions request.
 *
 * Purpose: return HTTP 404 (with the SPA shell) for paths that don't match
 * any known client-side route.  Valid routes and all /api/* or static-asset
 * requests pass through untouched.
 *
 * How it works with Cloudflare Pages:
 *  1. Static assets (/assets/*, images, fonts, etc.) are served by Pages
 *     *before* Functions run, so they never reach this middleware.
 *  2. Requests that match a more-specific function file (e.g.
 *     functions/dashboard.ts, functions/api/*) continue via context.next().
 *  3. The _redirects catch-all `/* /index.html 200` fires *after* Functions,
 *     so any request that falls through here still gets the SPA shell — but
 *     this middleware intercepts unmatched routes first and overrides the
 *     status to 404.
 */

// ── Known client-side routes ────────────────────────────────────────
// Keep this in sync with src/App.tsx <Routes>.
// Dynamic segments use a simple `:param` placeholder — matched below.
const KNOWN_ROUTES: readonly string[] = [
    '/',
    '/method',
    '/infrastructure',
    '/works',
    '/works/:slug',
    '/deployments',
    '/pricing',
    '/services',
    '/concepts',
    '/manifesto',
    '/audit',
    '/start-a-project',
    '/apply',
    '/contact',
    '/about',
    '/architects',
    '/404',
    '/privacy',
    '/terms',
    // Protected / admin routes
    '/admin/login',
    '/admin/inquiries',
    '/admin/inquiries/:id',
    '/account',
    '/dashboard',
    '/hunt',
    '/vault',
    '/triage',
    '/settings',
    '/lead/:id',
    '/campaigns',
    '/leads',
    '/leads/:id',
    '/jobs',
];

// Pre-compile route patterns once at module level.
const ROUTE_PATTERNS: RegExp[] = KNOWN_ROUTES.map((route) => {
    // Escape special regex chars, then replace `:param` with a segment matcher
    const pattern = route
        .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
        .replace(/:[\w]+/g, '[^/]+');
    return new RegExp(`^${pattern}$`);
});

function isKnownRoute(pathname: string): boolean {
    // Strip trailing slash for matching (but keep "/" as-is)
    const normalized = pathname.length > 1 && pathname.endsWith('/')
        ? pathname.slice(0, -1)
        : pathname;
    return ROUTE_PATTERNS.some((re) => re.test(normalized));
}

// Paths handled before Functions or by deeper middleware — skip entirely.
function shouldSkip(pathname: string): boolean {
    return (
        pathname.startsWith('/api/') ||
        pathname.startsWith('/assets/') ||
        pathname.startsWith('/images/') ||
        pathname.startsWith('/photos/') ||
        pathname.startsWith('/cdn-cgi/')
    );
}

// ── Middleware entry point ───────────────────────────────────────────

export async function onRequest(context: any) {
    const url = new URL(context.request.url);

    // Let API routes, static assets, and Cloudflare internals pass through.
    if (shouldSkip(url.pathname)) {
        return context.next();
    }

    // Known SPA route → continue normally (200 via _redirects catch-all or
    // a more-specific function file).
    if (isKnownRoute(url.pathname)) {
        return context.next();
    }

    // ── Unknown route → serve the SPA shell with 404 status ─────────
    const assets = context?.env?.ASSETS;
    if (assets?.fetch) {
        const indexUrl = new URL('/index.html', context.request.url);
        const shellResponse = await assets.fetch(
            new Request(indexUrl.toString(), context.request),
        );

        if (shellResponse.ok) {
            const headers = new Headers(shellResponse.headers);
            // Prevent caching of 404 responses
            headers.set('Cache-Control', 'no-store');
            // Tell crawlers not to index 404 pages
            headers.set('X-Robots-Tag', 'noindex, nofollow');

            return new Response(shellResponse.body, {
                status: 404,
                statusText: 'Not Found',
                headers,
            });
        }
    }

    // Absolute fallback — plain-text 404 if ASSETS is unavailable.
    return new Response('Not Found', {
        status: 404,
        headers: { 'Content-Type': 'text/plain' },
    });
}
