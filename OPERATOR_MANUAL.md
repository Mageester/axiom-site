# OPERATOR_MANUAL.md

## Overview

This repo now contains both:

- The public Axiom website
- The protected Omniscient internal lead-finding system used through `ops.getaxiom.ca`

The internal app is mounted inside the same React build and backed by Cloudflare Pages Functions + D1.

## Runtime Reality

- Frontend: Vite + React Router
- API/runtime: Cloudflare Pages Functions
- DB binding: `DB`
- Internal session cookie: `axiom_session`
- Protected ops routes:
  - `/dashboard`
  - `/hunt`
  - `/vault`
  - `/triage`
  - `/settings`
  - `/lead/:id`
  - `/account`

## Security Model

There are now three layers of protection:

1. Cloudflare Access on `ops.getaxiom.ca`
2. Session-protected Pages Functions APIs
3. Session-checked protected internal page routes

Sensitive actions are admin-only:

- scrape
- export
- delete
- backfill
- runtime/settings access

Audit events are recorded for:

- scrape start / finish / failure
- exports
- lead edits
- lead deletes
- backfill runs

## Required Bindings

- `DB`

## Important Env Vars

- `APP_BASE_URL`
- `GEMINI_API_KEY`
- `RATE_LIMIT_MAX_EXPORT`
- `RATE_LIMIT_MAX_SCRAPE`
- `RATE_LIMIT_WINDOW_SECONDS`
- `SCRAPE_CONCURRENCY_LIMIT`
- `SCRAPE_TIMEOUT_MS`

Optional:

- `BROWSER`
- `BOOTSTRAP_ENABLED`
- `BOOTSTRAP_ADMIN_USERNAME`
- `BOOTSTRAP_ADMIN_PASSWORD`
- `ADMIN_ACCESS_TOKEN`
- `PBKDF2_ITERS`

## Migrations

Apply all migrations through `0005_omniscient.sql`.

New Omniscient tables:

- `omniscient_leads`
- `omniscient_audit_events`
- `omniscient_rate_limit_windows`
- `omniscient_scrape_runs`

## First Login / Bootstrap

Login endpoint:

- `POST /api/auth/login`

If bootstrap is enabled:

- a bootstrap admin can be auto-created
- first password rotation still happens through `/account`

Disable bootstrap after initial production setup.

## Normal Omniscient Workflow

1. Sign in at `/admin/login`
2. If prompted, rotate password at `/account`
3. Open `/dashboard` for status
4. Run extraction at `/hunt`
5. Review/search/export records in `/vault`
6. Speed-work the best leads in `/triage`
7. Open `/lead/:id` for dossier details and operator notes
8. Check `/settings` for runtime status if scrape/export issues appear

## Scrape Behavior

Endpoint:

- `GET /api/omniscient/scrape`

Behavior:

- admin-only
- SSE stream response
- Cloudflare Browser Rendering when `BROWSER` is bound
- local Playwright fallback for development
- server-side Gemini enrichment when `GEMINI_API_KEY` exists
- D1 persistence only, no local filesystem dependency
- rate-limited and concurrency-limited

## Export Behavior

Endpoint:

- `GET /api/omniscient/leads/export`

Supports:

- CSV
- XLSX

Protected:

- admin-only
- rate-limited
- audited

## Failure Modes

- `401 Unauthorized`
  - no session or expired session
- `403 Forbidden`
  - user is authenticated but not allowed for an admin-only action
- `409 Another scrape is already running`
  - current concurrency cap reached
- `429 ... rate limit exceeded`
  - scrape/export limit reached for the current window
- empty or partial scrape results
  - Maps/browser discovery returned weak public signals
- no AI enrichment
  - `GEMINI_API_KEY` missing or Gemini call failed; heuristic enrichment still runs

## Deployment Notes

- This repo is structured for Cloudflare Pages, not a separate Node server
- Push to the Git-connected branch to trigger deployment
- Do not add a repo-level `wrangler.jsonc` unless you intentionally want the repo to override the existing Pages project config
- Direct hits are handled in-repo through `public/_redirects` plus protected Pages Functions, so `/dashboard`, `/vault`, `/lead/:id`, and `/admin/login` do not depend on a hidden dashboard SPA fallback toggle
- Keep `ops.getaxiom.ca` attached to the Pages project and behind Cloudflare Access
- Ensure the Pages project has:
  - Functions enabled
  - D1 binding `DB`
  - Browser Rendering binding `BROWSER` if scrape should run in-cloud
  - the Omniscient env vars above
