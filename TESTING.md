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

### Campaigns UI -> Discovery Trigger Check

From `/campaigns`, clicking the `Run Discovery Job` button should now trigger:

1. `POST /api/campaigns` (201)
2. `POST /api/jobs/run` (200) immediately after campaign creation

Verify in DevTools Network:

- `POST /api/jobs/run` is visible exactly once per click
- request method is `POST`
- response is JSON and includes `msg`, `processed`, and `log`
- button shows `Running...` while the requests are in flight
- UI shows inline success or error text (no silent failure)

## Failure Drills (recommended)

1. Overpass timeout/network issue:
   - Run discovery with an invalid/slow network and confirm `/api/jobs/run` surfaces a clear error in `last_error`.
2. Audit timeout:
   - Use a known slow/broken site and confirm failed `AUDIT` job shows a clear timeout/network message.
3. Schema missing:
   - Test against a fresh DB without migrations and confirm API errors clearly mention missing/outdated schema.

## Geocode Sanity Test

Use this when discovery returns `0` leads with geocoding failures for valid cities.

1. Test city inputs in `/campaigns` using:
   - `Kitchener, ON`
   - `Toronto, ON`
   - `Dallas, TX`
2. Create a campaign and run discovery (or use `Run Again` on an existing campaign).
3. Inspect `/api/jobs/run` response `log[]`:
   - Expect geocoding to succeed (no `City not found` for valid inputs)
   - If no match exists, expect explicit text like:
     - `Geocode returned no results for q=..., country=...`
   - If Nominatim rate-limits/blocks, expect explicit text like:
     - `Geocode blocked/rate-limited: status=..., retry_after=...`
4. For Toronto plumbing (radius 10–25 km), confirm:
   - `/api/jobs/run` returns `processed > 0`
   - leads appear in `/leads?campaign_id=...`

## Website Enrichment / "No web presence" Sanity Test

Use this when leads are incorrectly shown as having no website because OSM omitted the website tag.

1. Run discovery for a campaign in a dense city (for example `plumbing`, `Toronto, ON`, radius `10-25`).
2. Open `/leads?campaign_id=...` and inspect rows that do not have a clickable website.
3. Verify labels:
   - `Website unknown (OSM)` means OSM did not provide a website and no enrichment confirmation exists yet.
   - `No website found` means enrichment was attempted and no website was found.
   - Clickable website rows may show a small `OSM` or `Nominatim` badge (source of website).
4. Run discovery again for the same area/campaign and check `/api/jobs/run` logs / timing:
   - Nominatim lookup volume should drop due to D1 `website_enrich_cache` hits (30-day TTL).
   - The app should still return leads and should not regress to `0` results.
5. For rows with a website, verify badges in `/leads`:
   - Source badge: `OSM`, `Nominatim`, or `Email`
   - Verify badge: `Live`, `Unreachable`, or `Unknown`
6. Re-run discovery and confirm website verification status persists/improves (cached for 30 days via `website_verify_cache`).

## Pipeline Operator Controls (Bulk / Tags / DNC / Quality)

1. Open `/leads?campaign_id=<id>` for a campaign with multiple rows.
2. Confirm new filters/chips work:
   - `Ready To Contact`
   - `No Website`
   - `Website Unreachable`
   - `Verified Live`
   - `High Opportunity`
   - `High Quality`
3. Select multiple rows and test bulk actions:
   - `Bulk Status` -> verify rows update
   - `Bulk Add Tag` -> verify tag badges appear
   - `Bulk Mark DNC` -> verify DNC badge appears and rows are excluded from ready-to-contact filter
   - `Export Selection` -> downloaded CSV contains selected rows only
4. Toggle `Show Duplicates` and confirm duplicate rows can be shown/hidden without errors.

## Lead Detail Enhancements (Tags / Notes History / DNC / Outreach)

1. Open `/leads/<leadId>`.
2. Verify website source + verify badges render in the detail panel.
3. Toggle DNC + set DNC reason -> Save -> refresh -> values persist.
4. Add a tag and remove a tag -> changes persist.
5. Add a timestamped note entry in Notes History -> entry appears with timestamp.
6. Confirm Outreach Assistant shows:
   - 3 (or fewer) angle suggestions
   - email template
   - SMS template

## Campaign Export Upgrades

1. On `/campaigns`, use both export buttons:
   - `Export CSV`
   - `Outreach CSV`
2. Standard CSV should include:
   - `website_status`, `website_verified`, `opportunity_score`, `quality_score`, `tags`, `last_contacted_at`, `status`, `notes_summary`
3. Outreach CSV should include:
   - `name,email,phone,website,city,niche,angle_reason`
4. DNC leads should be excluded by default from exports unless endpoint is called with `?include_dnc=1`.

## Discovery Reliability: FK Constraint Is 0

1. Run a discovery job for an existing campaign (or create a new campaign and trigger discovery).
2. Inspect `/api/jobs/run` response `log[]` and Cloudflare/Pages Functions logs.
3. Confirm there are no messages containing:
   - `FOREIGN KEY constraint failed`
   - `event":"discovery.persist_failed"` with FK errors
4. Confirm discovery summary log is present and includes:
   - `leads_found`
   - `leads_inserted`
   - `leads_linked`
   - `fk_failures_count=0`

## Discovery Reliability: Overpass Chunking / Throttling

1. Run discovery for a niche likely to fan out (examples: `salons`, `hvac`, `beauty`) in a dense area.
2. Confirm the run does not fail even if Overpass throttles.
3. Inspect `/api/jobs/run` `log[]` and server logs:
   - no fatal `Overpass query failed: Too many subrequests` job failure
   - if throttled, expect graceful degradation with structured log `event":"overpass.degraded"`
   - partial results are acceptable and discovery should continue
4. Confirm leads still populate (even if fewer than ideal during throttling).

## Login 500 Triage (Cloudflare Pages)

Use this when `POST /api/auth/login` returns `500` in production.

1. Check Cloudflare Pages deployment + Functions logs:
   - Cloudflare Dashboard -> Workers & Pages -> your Pages project -> Deployments (latest commit is deployed)
   - Then open Functions/Realtime logs for the deployment/environment and filter for `auth.login`
2. Check the response body in browser DevTools Network:
   - Expected safe JSON (never raw HTML/plain text)
   - `{"error":"DB binding missing"}`
   - `{"error":"DB schema missing/outdated. Run migrations / ensure correct D1 bound in Pages."}`
   - `{"error":"Login system error"}`
3. If `DB binding missing`:
   - Pages project configuration is missing D1 binding named `DB`
   - Add D1 binding `DB` in Pages project settings for the active environment (production/preview)
4. If schema missing/outdated:
   - The bound D1 database is wrong, empty, or missing migrations
   - Apply repo migrations to the correct D1 and confirm Pages is bound to that same database
5. Bootstrap checks (first-time admin only):
   - If `BOOTSTRAP_ENABLED=true`, also set `BOOTSTRAP_ADMIN_PASSWORD`
   - Optional: set `BOOTSTRAP_ADMIN_USERNAME` (defaults to `admin`)
   - First login should still force password change (`must_change_password=true`)

## Admin Access Hardening (Cloudflare Access + Optional Header Guard)

### App-level route hardening

1. Public `/login` should no longer render the admin login UI.
2. Visiting `/login` should redirect to `/`.
3. Admin login UI should be available at `/admin/login`.
4. Protected pages should redirect unauthenticated users to `/admin/login?next=...`.

### Cloudflare Access (recommended edge lock)

1. In Cloudflare Dashboard, open your Pages project and add an Access application for the production hostname.
2. Protect the admin paths at minimum:
   - `/admin/*`
   - `/api/*`
3. Require an identity policy (email allowlist / IdP group) for operators.
4. Verify behavior in browser:
   - Unauthenticated request to `/admin/login` is blocked by Cloudflare Access challenge
   - Authenticated operator can reach `/admin/login` and complete login flow
5. Verify API protection:
   - `/api/auth/login` and `/api/jobs/run` should be blocked by Access when not authenticated at the edge

### Optional second layer: `ADMIN_ACCESS_TOKEN`

If you want a simple header-based guard behind Cloudflare Access or an upstream proxy:

1. Set Pages environment variable:
   - `ADMIN_ACCESS_TOKEN=<long-random-secret>`
2. Ensure your edge/proxy sends header on admin traffic:
   - `X-Admin-Token: <same value>`
3. Verify blocking:
   - Request `/api/auth/me` without header -> `403` JSON `{ "error": "Forbidden: Admin edge token required" }`
   - Request `/admin/login` without header -> `403` JSON
4. Verify success:
   - Same requests with correct header pass through to normal auth/session handling

Note: The app never logs the token value; only path/method are logged on denial.

## Commands To Run Before Shipping

- `npm run build`

This repo currently does not define `test` or `lint` scripts in `package.json`.
