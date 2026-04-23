# Phase 0 Report

## What shipped
- Raw Lighthouse evidence committed under `docs/audit/lighthouse/`
- Raw accessibility evidence committed under `docs/audit/axe/`
- Runtime route audit committed in `docs/audit/runtime-audit.json`
- Inventory report: `docs/audit/00-inventory.md`
- Gap report: `docs/audit/01-gaps.md`
- Lighthouse summary: `docs/audit/02-lighthouse.md`
- Ready-to-file issue backlog: `docs/audit/03-issue-backlog.md`
- Redirect map draft: `docs/audit/04-redirects.md`

## What was skipped
- GitHub issue creation was skipped because `gh` is not available/authenticated in this environment.
- No code fixes were made to public pages, routing, or styling beyond generating audit evidence.
- A lint run was not possible because `package.json` does not currently define a `lint` script.

## Decisions needing owner sign-off
- Confirm the redirect map for any legacy URLs referenced outside the repo, especially email signatures and any Vapi/calling-agent scripts.
- Confirm whether concept/demo work currently on `/work` should be retained during the rebuild until the first real case study ships.

## New risks or surprises
- The repo is Astro-first today, with a second stale React-router marketing implementation still present in `src/App.tsx`.
- Current public pages already have a large amount of content and motion debt, but the live runtime baseline is at least stable: no console or network errors surfaced in the audited routes.
- The site currently has two separate public form flows, which will create migration risk when we collapse to a single intake route.
- The only committed automated test (`npm run test:intake`) is already failing on the baseline because its smoke harness cannot complete an Astro build/import cycle.

## Next phase dependencies
- None required to begin Phase 1 implementation in-repo.
- External dependency for later phases: owner confirmation of redirect consumers outside source control.
