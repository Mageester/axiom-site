# Phase 0 Report

Date: 2026-04-24
Branch: `phase/0-audit`

## What Shipped

- Created isolated worktree at `C:\Users\aidan\.config\superpowers\worktrees\axiom-site\phase-0-audit`.
- Committed raw audit evidence in `f912f6b` with message `chore(audit): capture phase 0 raw evidence`.
- Added:
  - `docs/audit/00-inventory.md`
  - `docs/audit/01-gaps.md`
  - `docs/audit/02-lighthouse.md`
  - `docs/audit/03-issues.md`
  - Raw Lighthouse JSON under `docs/audit/lighthouse/`
  - Raw axe JSON under `docs/audit/axe/`
  - Raw npm audit JSON under `docs/audit/raw/npm-audit.json`

## Baseline Verification

- `npm install`: completed; npm reports 8 vulnerabilities.
- `npm run build`: completed sequentially, 12 pages built.
- `npm run test:intake`: passed 1 test.
- Lighthouse: raw JSON captured for 12 routes in mobile and desktop modes. Many mobile runs returned CLI exit code 1 due to `NO_LCP` or Windows temp cleanup errors, but JSON files were still produced.
- axe: raw JSON captured for 12 routes. Public routes currently have automated violations.

## What Was Skipped

- No GitHub issues were opened. The backlog was captured in `docs/audit/03-issues.md` because connector/CLI auth was not verified during Phase 0.
- No fixes, refactors, dependency changes, route changes, admin changes, or content changes were made.
- External legacy URLs from Vapi, outreach docs, and email signatures were not discoverable in the repo and remain an owner-assisted Phase 2 input.

## Decisions Needing Owner Sign-Off

- Verify whether proof claims such as shipped-build counts, load-time claims, and any testimonials/avatar assets are real and approved.
- Confirmed founder brand policy: use "Axiom Web" in public copy and reserve "Axiom International" for parent-company/legal context.
- Provide external legacy URLs for the Phase 2 redirect map.
- Confirm whether any legacy React/Vite/Next files are still needed for demos or admin support before later removal.

## Risks And Surprises

- Running `npm run build` and `npm run test:intake` concurrently can corrupt the build output because the intake test also runs a build.
- The sitemap is stale and references non-existent service routes.
- `/contact`, `/start`, and `/start-a-project` all participate in form/intake behavior, so the single-conversion-path work is larger than a copy edit.
- The mobile Lighthouse harness was unstable locally; CI should use a more controlled browser environment.
- The JS motion helper still disables heavy motion for coarse pointers.

## Next Phase Dependencies

- Owner approval to begin Phase 1.
- Phase 1 should start from clean `origin/main` in branch/worktree `phase/1-design-system`.
- Use RTK only when public React state requires it; Phase 1 likely does not need RTK unless primitives introduce stateful demos or shared public state.
