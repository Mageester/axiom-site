# OPERATOR_MANUAL.md

## Overview

This repository contains:

- Public marketing site (React/Vite in `src/`)
- Admin lead finder UI (same React app)
- Cloudflare Pages Functions API (`functions/api/*`)
- D1-backed auth, campaigns, leads, jobs, audits, scores, summaries

## Platform Constraints (current repo reality)

- Cloudflare Pages + Pages Functions + D1
- Auth uses server-side sessions with hashed session tokens in D1
- Admin auth cookie: `axiom_session` (`HttpOnly; Secure; SameSite=Strict`)
- Middleware route protection in `functions/api/_middleware.ts`

## Required D1 Binding

- Binding name must be exactly: `DB`

If `DB` is missing or points to the wrong database, all admin API routes will fail.

## Migrations

Migrations are stored in:

- `migrations/0000_schema.sql`
- `migrations/0001_secure_auth.sql`
- `migrations/0002_add_jobs_locked_by.sql`

Apply migrations before first use and whenever schema changes.

## Auth / First Login

Login endpoint:

- `POST /api/auth/login`

Bootstrap behavior:

- `BOOTSTRAP_ENABLED=true` (or `1`) allows auto-creation of `admin` user only when no admin exists.
- Default bootstrap password is `admin` and `must_change_password=1`.
- Operator must rotate password on first login (`/account`).

Disable bootstrap in production after setup.

## Operator Workflow (Normal Use)

1. Log in at `/login`
2. If prompted, rotate password at `/account`
3. Go to `/campaigns`
4. Create a campaign (niche/city/radius)
5. Open `/jobs`
6. Run queue (`Force Queue Execution`) until discovery/audits complete
7. Open lead list (`/leads?campaign_id=...`)
8. Open a lead detail page (`/leads/:id`)
9. Review audit score + outreach bullets
10. Update pipeline status and notes (CRM-style status tracking)

## Job Types

- `DISCOVERY`
  - Uses Nominatim + Overpass (server-side) to find businesses
  - Writes `businesses`, `leads`, and enqueues `AUDIT` jobs when a website exists
- `AUDIT`
  - Audits website reachability/basic conversion signals
  - Writes `audits`, `scores`, `summaries`
  - Updates `leads.last_audit_at`

## Job Runner Operations

Endpoint:

- `POST /api/jobs/run`

Behavior:

- Resets orphaned `running` jobs older than 5 minutes back to `queued`
- Processes up to 3 queued jobs per run
- Retries failed jobs up to 3 attempts
- Writes truncated `last_error` on failure

Use `/jobs` to monitor queue status and failures.

## Observability (current)

- API returns JSON error bodies for admin-facing endpoints
- Structured server logs added for:
  - auth login failures / rate limits / internal errors
  - job runner fatal errors
  - per-job pipeline failures

No secrets are logged. Session tokens and passwords are not logged.

## Security Notes (unchanged)

- Password hashing: PBKDF2 SHA-256 with format `iterations:salt:hash`
- Constant-time comparison retained
- Session tokens are hashed in DB (SHA-256)
- Cookie remains `HttpOnly + Secure + SameSite=Strict`
- Middleware protection remains in place for `/api/*`
- SQL remains parameterized

## Common Failures and What They Mean

- `401 Unauthorized` on admin APIs:
  - Session expired/revoked or no cookie
- `403 Forbidden: Must change password`:
  - Operator must complete `/account` password change first
- `...schema is missing or migrations were not applied`:
  - D1 migrations not applied to the active DB
- `Overpass query failed: Overpass timeout`:
  - External OSM infra issue; retry job later
- `Failed to connect (fallback): Request timed out` (AUDIT):
  - Target site unreachable/slow; job will retry up to max attempts

## Deployment Notes

- This repo currently has no committed `wrangler.toml`
- Ensure the Cloudflare Pages project has:
  - Functions enabled
  - D1 binding `DB`
  - required env vars (`PBKDF2_ITERS`, `BOOTSTRAP_ENABLED` as needed)
- `public/_headers` contains static header rules (including CSP/security headers)
