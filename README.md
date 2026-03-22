# Axiom Site + Omniscient Ops

This repository now serves two jobs from one Cloudflare deployment:

- Public Axiom marketing site (`src/`)
- Protected internal Omniscient ops app for `operations.getaxiom.ca`

The internal app is not a static mock. It runs through Cloudflare Pages Functions with D1-backed auth/session state and protected Omniscient APIs for scraping, analytics, triage, vault access, exports, and runtime status.

## Platform

- Frontend: React 18 + Vite + React Router
- Edge runtime: Cloudflare Pages + Pages Functions
- Database: Cloudflare D1 binding `DB`
- Internal auth: D1-backed sessions via `axiom_session`
- Scraping: Cloudflare Browser Rendering when bound, local Playwright fallback for dev
- AI enrichment: Gemini server-side only

## Internal Routes

- `/dashboard`
- `/hunt`
- `/vault`
- `/triage`
- `/settings`
- `/lead/:id`
- `/admin/login`
- `/account`

Legacy internal routes are redirected:

- `/campaigns` -> `/hunt`
- `/leads` -> `/vault`
- `/leads/:id` -> `/lead/:id`

## Omniscient API Surface

- `GET /api/omniscient/leads`
- `GET /api/omniscient/leads/:id`
- `PATCH /api/omniscient/leads/:id`
- `DELETE /api/omniscient/leads/:id`
- `POST /api/omniscient/leads/delete`
- `POST /api/omniscient/leads/backfill`
- `GET /api/omniscient/leads/analytics`
- `GET /api/omniscient/leads/stats`
- `GET /api/omniscient/leads/triage`
- `GET /api/omniscient/leads/export`
- `GET /api/omniscient/runtime`
- `GET /api/omniscient/scrape`

All Omniscient API routes are session-protected. Scrape, export, settings/runtime, delete, and backfill are admin-only.

## Required Bindings / Env

Required:

- `DB`

Recommended / required for full Omniscient functionality:

- `GEMINI_API_KEY`
- `APP_BASE_URL`
- `RATE_LIMIT_MAX_EXPORT`
- `RATE_LIMIT_MAX_SCRAPE`
- `RATE_LIMIT_WINDOW_SECONDS`
- `SCRAPE_CONCURRENCY_LIMIT`
- `SCRAPE_TIMEOUT_MS`

Optional:

- `BROWSER`
- `ADMIN_ACCESS_TOKEN`
- `BOOTSTRAP_ENABLED`
- `BOOTSTRAP_ADMIN_USERNAME`
- `BOOTSTRAP_ADMIN_PASSWORD`
- `PBKDF2_ITERS`

## Migrations

Apply all migrations in order, including the Omniscient schema:

- `migrations/0000_schema.sql`
- `migrations/0001_secure_auth.sql`
- `migrations/0002_add_jobs_locked_by.sql`
- `migrations/0003_website_requests.sql`
- `migrations/0004_website_inquiries.sql`
- `migrations/0005_omniscient.sql`

## Local Development

Install dependencies:

```bash
npm install
```

Run the Vite app:

```bash
npm run dev
```

Build production assets:

```bash
npm run build
```

Pages Functions local dev remains Cloudflare-based. Typical flow:

```bash
npm run build
npx wrangler pages dev dist --local --d1 DB=axiom-site-local
```

This repo intentionally does not commit a `wrangler.jsonc` or `wrangler.toml` for production, so the existing Cloudflare Pages project remains the source of truth for bindings, domains, and deploy settings. Direct route hits are handled in-repo via committed `public/_redirects` rewrites plus protected Pages Functions handlers, which keeps `/dashboard`, `/vault`, `/lead/:id`, and `/admin/login` working without a dashboard-only SPA fallback toggle.

## Deployment

This repo is intended to deploy through the existing Cloudflare Pages Git integration already attached to the site. The operational model is:

1. Push to the connected GitHub branch
2. Cloudflare Pages rebuilds `dist`
3. Pages Functions deploy alongside the static bundle
4. `operations.getaxiom.ca` stays behind Cloudflare Access

Build settings:

- Build command: `npm run build`
- Output directory: `dist`
- Pages project settings stay in the existing Cloudflare dashboard project (`axiom-ops`)

## Security Notes

- Gemini is server-side only; it is never exposed to the client bundle
- Omniscient exports are protected and rate-limited
- Scrape execution is protected, rate-limited, audited, and concurrency-limited
- Protected internal pages are gated at the Pages route layer and by session-aware client routing
- The ops subdomain should remain behind Cloudflare Access
