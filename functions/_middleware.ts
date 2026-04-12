/**
 * Root middleware — runs on every Pages Functions request.
 *
 * Responsibilities:
 *  1. Detect social/search crawlers by User-Agent.
 *  2. For crawlers: return a lightweight HTML page with correct per-route
 *     meta tags so social previews (Facebook, LinkedIn, Slack, etc.) show
 *     accurate titles, descriptions, and OG images regardless of SPA JS.
 *  3. For real users on unknown routes: return the SPA shell with HTTP 404.
 *  4. For real users on known routes: pass through to the matching function
 *     file or the _redirects catch-all (HTTP 200).
 *
 * Static assets (/assets/*, images, fonts) are served by Cloudflare Pages
 * before Functions run — they never reach this middleware.
 */

// ─────────────────────────────────────────────────────────────────────────────
// 1. ROUTE META DATA
//    Single source of truth for all prerendered head tags.
//    Keep in sync with src/lib/seo.ts SEO_ROUTES.
// ─────────────────────────────────────────────────────────────────────────────

const SITE_URL = 'https://getaxiom.ca';
const SITE_NAME = 'Axiom';
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`;
const DEFAULT_DESCRIPTION = 'Axiom builds clear websites for established businesses. Service, proof, and contact stay easy to find.';

type RouteMeta = {
    title: string;
    description: string;
    canonicalPath: string;
    noIndex?: boolean;
};

/** Formats a bare title into "Title | Axiom" unless it already contains "Axiom". */
function formatTitle(title: string): string {
    return /axiom/i.test(title) ? title : `${title} | ${SITE_NAME}`;
}

const ROUTE_META: Record<string, RouteMeta> = {
    '/': {
        title: 'Clear websites for established businesses | Axiom',
        description: DEFAULT_DESCRIPTION,
        canonicalPath: '/',
    },
    '/works': {
        title: formatTitle('Selected work'),
        description: 'Live and working examples that show the issue, the change, and the result.',
        canonicalPath: '/works',
    },
    '/method': {
        title: formatTitle('How the work runs'),
        description: 'A four-step process from review to launch with clear checkpoints and no vague handoffs.',
        canonicalPath: '/method',
    },
    '/about': {
        title: formatTitle('About'),
        description: 'Clear websites that explain the offer, surface proof, and make the next step obvious.',
        canonicalPath: '/about',
    },
    '/start-a-project': {
        title: formatTitle('Start a Project'),
        description: 'A short intake for established businesses. Tell us what the business needs and we will reply within one business day.',
        canonicalPath: '/start-a-project',
    },
    '/contact': {
        title: formatTitle('Contact'),
        description: 'Send a question or note about an existing site. We will reply within one business day.',
        canonicalPath: '/contact',
    },
    '/pricing': {
        title: formatTitle('Pricing'),
        description: 'Website pricing for established businesses. Clear scope, no surprises, and a site you own.',
        canonicalPath: '/pricing',
    },
    '/services': {
        title: formatTitle('Services'),
        description: 'Website packages for local businesses with clear scope, practical deliverables, and no noise.',
        canonicalPath: '/services',
    },
    '/concepts': {
        title: formatTitle('Concepts'),
        description: 'Demo sites for HVAC, roofing, and landscaping businesses. Each one shows a clearer path to the next step.',
        canonicalPath: '/concepts',
    },
    '/manifesto': {
        title: formatTitle('Why weak sites cost money'),
        description: 'Why weak websites can cost money when busy days matter and calls need to land quickly.',
        canonicalPath: '/manifesto',
    },
    '/audit': {
        title: formatTitle('Site Review'),
        description: "Get a plain review of your site's speed, layout, and contact path.",
        canonicalPath: '/audit',
    },
    '/privacy': {
        title: formatTitle('Privacy Policy'),
        description: 'Privacy policy for the Axiom website and contact forms.',
        canonicalPath: '/privacy',
    },
    '/terms': {
        title: formatTitle('Terms of Service'),
        description: 'Terms for using the Axiom website and services.',
        canonicalPath: '/terms',
    },
    '/404': {
        title: formatTitle('Page not found'),
        description: 'The page you requested is not available.',
        canonicalPath: '/404',
        noIndex: true,
    },
};

// ─────────────────────────────────────────────────────────────────────────────
// 2. KNOWN CLIENT-SIDE ROUTES
//    Keep in sync with src/App.tsx <Routes>.
//    Dynamic segments use `:param` placeholders.
// ─────────────────────────────────────────────────────────────────────────────

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

const ROUTE_PATTERNS: RegExp[] = KNOWN_ROUTES.map((route) => {
    const pattern = route
        .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
        .replace(/:[\w]+/g, '[^/]+');
    return new RegExp(`^${pattern}$`);
});

function isKnownRoute(pathname: string): boolean {
    const normalized = pathname.length > 1 && pathname.endsWith('/')
        ? pathname.slice(0, -1)
        : pathname;
    return ROUTE_PATTERNS.some((re) => re.test(normalized));
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. BOT DETECTION
// ─────────────────────────────────────────────────────────────────────────────

// Covers the major social/search crawlers that don't execute JavaScript.
// Googlebot is included because serving static meta is faster and simpler
// than relying on Googlebot's JS rendering pipeline.
const BOT_UA_PATTERNS: RegExp[] = [
    /facebookexternalhit/i,
    /linkedinbot/i,
    /slackbot/i,
    /twitterbot/i,
    /xbot/i,                   // X/Twitter new crawler UA
    /whatsapp/i,
    /telegrambot/i,
    /discordbot/i,
    /applebot/i,
    /googlebot/i,
    /bingbot/i,
    /yandexbot/i,
    /duckduckbot/i,
    /ia_archiver/i,            // Alexa / Wayback Machine
    /semrushbot/i,
    /ahrefsbot/i,
    /mj12bot/i,
    /rogerbot/i,
    /embedly/i,
    /quora link preview/i,
    /outbrain/i,
    /pinterest/i,
    /developers\.google\.com\/\+\/web\/snippet/i,
];

function isBot(userAgent: string): boolean {
    return BOT_UA_PATTERNS.some((pattern) => pattern.test(userAgent));
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. HTML GENERATOR
//    Returns a minimal HTML document — just <head> meta tags and an empty
//    <body>.  Bots only read <head>; real users get the full SPA via JS.
// ─────────────────────────────────────────────────────────────────────────────

function escape(str: string): string {
    return str
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

function buildMetaHtml(meta: RouteMeta, status: number): Response {
    const canonical = `${SITE_URL}${meta.canonicalPath}`;
    const ogImage = DEFAULT_OG_IMAGE;
    const robots = meta.noIndex ? 'noindex,nofollow' : 'index,follow,max-image-preview:large';

    const t = escape(meta.title);
    const d = escape(meta.description);
    const c = escape(canonical);
    const img = escape(ogImage);

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${t}</title>
<meta name="description" content="${d}">
<meta name="robots" content="${robots}">
<link rel="canonical" href="${c}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${escape(SITE_NAME)}">
<meta property="og:url" content="${c}">
<meta property="og:title" content="${t}">
<meta property="og:description" content="${d}">
<meta property="og:image" content="${img}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${t}">
<meta name="twitter:description" content="${d}">
<meta name="twitter:image" content="${img}">
</head>
<body>
<h1>${t}</h1>
<p>${d}</p>
</body>
</html>`;

    return new Response(html, {
        status,
        headers: {
            'Content-Type': 'text/html; charset=utf-8',
            'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
            'X-Robots-Tag': robots,
        },
    });
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. SPA SHELL HELPER
//    Fetches /index.html from Cloudflare's ASSETS binding and returns it
//    with the supplied status code.
// ─────────────────────────────────────────────────────────────────────────────

async function serveSpaShell(context: any, status: number): Promise<Response | null> {
    const assets = context?.env?.ASSETS;
    if (!assets?.fetch) return null;

    const indexUrl = new URL('/index.html', context.request.url);
    const shellResponse = await assets.fetch(new Request(indexUrl.toString(), context.request));
    if (!shellResponse.ok) return null;

    const headers = new Headers(shellResponse.headers);
    headers.set('Cache-Control', 'no-store');
    if (status === 404) {
        headers.set('X-Robots-Tag', 'noindex, nofollow');
    }

    return new Response(shellResponse.body, { status, statusText: status === 404 ? 'Not Found' : 'OK', headers });
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. PATHS TO SKIP
//    These are handled by Pages or deeper middleware — never touch them here.
// ─────────────────────────────────────────────────────────────────────────────

function shouldSkip(pathname: string): boolean {
    return (
        pathname.startsWith('/api/') ||
        pathname.startsWith('/assets/') ||
        pathname.startsWith('/images/') ||
        pathname.startsWith('/photos/') ||
        pathname.startsWith('/cdn-cgi/')
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. MIDDLEWARE ENTRY POINT
// ─────────────────────────────────────────────────────────────────────────────

export async function onRequest(context: any): Promise<Response> {
    const url = new URL(context.request.url);
    const { pathname } = url;

    // Always skip API routes, static assets, and Cloudflare internals.
    if (shouldSkip(pathname)) {
        return context.next();
    }

    const ua = context.request.headers.get('User-Agent') || '';
    const crawlerRequest = isBot(ua);
    const knownRoute = isKnownRoute(pathname);

    // ── Crawler path ────────────────────────────────────────────────────────
    if (crawlerRequest) {
        // Normalize dynamic route paths to their static meta entry.
        // e.g. /works/some-slug → /works  (no dedicated meta, fall back)
        const normalizedPath = pathname.length > 1 && pathname.endsWith('/')
            ? pathname.slice(0, -1)
            : pathname;

        const meta = ROUTE_META[normalizedPath];

        if (meta) {
            return buildMetaHtml(meta, 200);
        }

        // Known route but no dedicated meta (e.g. /admin/inquiries/123) →
        // pass through; the per-route function handles auth before serving HTML.
        if (knownRoute) {
            return context.next();
        }

        // Unknown route for a crawler → serve noindex 404 meta page.
        return buildMetaHtml(
            { title: formatTitle('Page not found'), description: 'The page you requested is not available.', canonicalPath: pathname, noIndex: true },
            404,
        );
    }

    // ── Real user path ───────────────────────────────────────────────────────
    if (knownRoute) {
        // Pass through to the matching function file or _redirects catch-all.
        return context.next();
    }

    // Unknown route for a real user → SPA shell with 404 status.
    const shell = await serveSpaShell(context, 404);
    if (shell) return shell;

    // Last resort.
    return new Response('Not Found', { status: 404, headers: { 'Content-Type': 'text/plain' } });
}
