# TESTING.md

This project is a Cloudflare Pages + Pages Functions + D1 app with a React admin UI.

This checklist verifies the production-critical flow:

`login -> campaigns -> discovery -> D1 write -> jobs -> audit -> scoring -> outreach bullets -> CRM status update`

## Prerequisites

- Node.js 18+ and npm available on your machine.
- Cloudflare Wrangler installed (via `npx wrangler` is fine).
- A D1 database with migrations applied from `migrations/`.
- A Pages Functions D1 binding named `DB`.

## Required env vars (from code)

- `PBKDF2_ITERS` (optional, defaults to `100000`; enforced min/max in code)
- `BOOTSTRAP_ENABLED` (`true`/`1` only when intentionally bootstrapping admin locally)

## Local Setup (exact flow)

1. Install dependencies:
   - `npm install`
2. Apply D1 migrations to your local/preview DB before testing:
   - `npx wrangler d1 migrations apply <YOUR_DB_NAME> --local`
   - If you are testing against remote D1: `npx wrangler d1 migrations apply <YOUR_DB_NAME> --remote`
3. Start local dev:
   - `npx wrangler pages dev dist --d1 DB=<YOUR_DB_NAME>`
   - In a second terminal, build/watch frontend as needed (repo uses Vite):
   - `npm run build` (for `dist`) or your existing local Pages workflow

Note: This repo currently has no committed `wrangler.toml`, so local D1 binding config must be provided via CLI/dashboard config.

## Browser Verification Checklist (Local)

1. Open `/login`.
2. Log in with a valid admin user.
3. Confirm redirect:
   - If `must_change_password=true`, you should land on `/account`.
   - Otherwise you should land on `/campaigns`.
4. On `/campaigns`, create a campaign (`niche`, `city`, `radius`).
5. Verify a new campaign appears in the list.
6. Open `/jobs`.
7. Click `Force Queue Execution` until:
   - `DISCOVERY` job becomes `done`
   - `AUDIT` jobs appear and then become `done`
8. Open the campaign lead list (`/leads?campaign_id=<id>`).
9. Open one lead detail page (`/leads/:id`).
10. Verify:
   - score is shown (or pending if audit not complete yet)
   - response time / form / booking fields render
   - outreach bullets render when present
11. Change pipeline status + notes and save.
12. Refresh the page and confirm status/notes persisted.

## Browser Network Tab Validation (Production)

Use Chrome DevTools -> Network (Preserve log ON, Disable cache ON).

### Expected request sequence (common path)

1. `POST /api/auth/login`
2. `GET /api/auth/me` (route protection after redirect)
3. `GET /api/campaigns`
4. `POST /api/campaigns` (create campaign)
5. `GET /api/campaigns` (reload list)
6. `GET /api/jobs` (jobs page load)
7. `POST /api/jobs/run` (manual queue run)
8. `GET /api/jobs` (refresh/poll)
9. `GET /api/leads?campaign_id=...`
10. `GET /api/leads/<leadId>`
11. `PATCH /api/leads/<leadId>` (status/notes save)

### What to verify in each API response

- `Content-Type` is JSON for API success/error responses.
- No `500` text/plain responses.
- `401/403` responses include JSON `{ "error": "..." }`.
- `/api/jobs/run` response contains `log[]` and useful error text if a job fails.

## Failure Drills (recommended)

1. Overpass timeout/network issue:
   - Run discovery with an invalid/slow network and confirm `/api/jobs/run` surfaces a clear error in `last_error`.
2. Audit timeout:
   - Use a known slow/broken site and confirm failed `AUDIT` job shows a clear timeout/network message.
3. Schema missing:
   - Test against a fresh DB without migrations and confirm API errors clearly mention missing/outdated schema.

## Commands To Run Before Shipping

- `npm run build`

This repo currently does not define `test` or `lint` scripts in `package.json`.
