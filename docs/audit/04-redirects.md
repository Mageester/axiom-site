# Redirect Map

## Goal
Map every legacy or drifted marketing URL to the new canonical IA so Phase 2 can ship explicit 301 behavior instead of relying on scattered inline redirects.

## Canonical Targets
- `/`
- `/services`
- `/services/[slug]`
- `/approach`
- `/about`
- `/work`
- `/work/[slug]`
- `/contact`
- `/start-a-project`
- `/pricing` (secondary investment page, still live)
- `/privacy`
- `/terms`

## Proposed 301 Map
| Current / legacy URL | Target canonical URL | Reason | Repo references found |
| --- | --- | --- | --- |
| `/` | `/` | canonical home | live Astro page |
| `/work` | `/work` | canonical work index | live Astro page |
| `/works` | `/work` | legacy plural alias | `src/App.tsx` |
| `/works/:slug` | `/work` until detail routes ship, then `/work/:slug` | legacy detail alias | `src/App.tsx` |
| `/deployments` | `/work` | legacy work alias | `src/App.tsx` |
| `/concepts` | `/work` | legacy work alias | `src/App.tsx` |
| `/pricing` | `/pricing` | secondary page stays live | live Astro page, nav/footer refs |
| `/services` | `/services` | canonical new IA | stale sitemap entry, stale React redirect in `src/App.tsx` |
| `/services/:slug` | `/services/:slug` | canonical new IA | stale sitemap entry only today |
| `/process` | `/approach` | process folds into canonical approach page | live Astro page, nav/footer refs, `scripts/prerender.mjs`, `public/_routes.json` |
| `/method` | `/approach` | legacy approach alias | `src/App.tsx`, `TESTING.md` |
| `/infrastructure` | `/approach` | legacy process alias | `src/App.tsx` |
| `/approach` | `/approach` | canonical new IA | stale React redirect in `src/App.tsx` |
| `/our-approach` | `/approach` | alias cleanup | `src/App.tsx` |
| `/manifesto` | `/approach` | alias cleanup | `src/App.tsx` |
| `/about` | `/about` | canonical page | live Astro page |
| `/architects` | `/about` | legacy about alias | `src/App.tsx` |
| `/contact` | `/contact` | canonical contact page remains live, but becomes no-form | live Astro page, CTA refs, testing docs |
| `/start-a-project` | `/start-a-project` | single intake form route | live Astro page |
| `/start` | `/start-a-project` | collapse duplicate entry point | live Astro page, `public/_routes.json`, `scripts/prerender.mjs` |
| `/apply` | `/start-a-project` | legacy intake alias | `src/App.tsx`, `scripts/intake-smoke.mjs`, `TESTING.md` |
| `/privacy` | `/privacy` | canonical legal route | live Astro page |
| `/terms` | `/terms` | canonical legal route | live Astro page |

## Admin / Non-Marketing Routes
- Preserve current rewrites to `/admin-shell`:
  - `/admin/*`
  - `/dashboard`
  - `/vault`
  - `/leads`
  - `/lead/*`
  - `/triage`
  - `/settings`
  - `/account`
  - `/hunt`
  - `/jobs`
  - `/campaigns`

## External-System Reference Check
### Found in repo
- Legacy intake alias `/apply`: `scripts/intake-smoke.mjs`, `TESTING.md`
- Legacy process/approach aliases: `src/App.tsx`, `TESTING.md`
- Legacy work aliases: `src/App.tsx`

### Not found in repo
- No repo-side Vapi cold-calling script references were found.
- No repo-side email signature source was found.
- No repo-side outreach template referencing marketing URLs was found beyond Omniscient CSV export code.

## Owner Confirmation Required Before Shipping Phase 2
Confirm whether any of the following live outside the repo and still reference old URLs:
- Vapi/calling-agent prompts
- email signatures
- proposal templates
- outreach copy docs
- CRM snippets
- social profile links
