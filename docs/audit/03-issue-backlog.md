# Phase 0 Issue Backlog

## Status
- GitHub issues were **not** opened from this environment because `gh` is not installed/authenticated in the phase worktree.
- This file is the ready-to-file backlog derived from the Phase 0 audit.

## Ready-To-File Issues
| Priority | Proposed title | Phase | Why it exists |
| --- | --- | --- | --- |
| P0 | Fix touch-device motion suppression outside reduced-motion mode | Phase 4 | `src/lib/motionPreferences.ts` disables heavy motion for coarse pointers, matching the known regression class |
| P0 | Replace production Google Fonts and Fontshare loading with self-hosted brand fonts | Phase 1 / 6 | Current shell still pulls external font CSS in production |
| P0 | Generate sitemap from real route manifest and remove nonexistent `/services/*` entries | Phase 8 | Current `public/sitemap.xml` is stale and inaccurate |
| P0 | Collapse public site to a single form route at `/start-a-project` | Phase 3 / 5 | `/contact` and `/start-a-project` both currently ship forms |
| P0 | Build canonical `/services` and `/services/[slug]` routes | Phase 2 / 3 | Approved IA exists only in plan, not in code |
| P0 | Build canonical `/approach` route and retire process/about split | Phase 2 / 3 | “How we work” is currently fragmented |
| P0 | Replace fake concept brand identities with honest concept/self-initiated labeling | Phase 3 | Current concept work uses invented client-style names |
| P0 | Create and ship explicit 301 redirect map for all legacy marketing URLs | Phase 2 | Redirect behavior is fragmented and not documented |
| P1 | Rebuild nav/footer IA around services, approach, work, about, contact | Phase 2 | Current shell still centers pricing/process |
| P1 | Introduce a typed content layer for services and work entries | Phase 2 | Current public content is hardcoded in page files |
| P1 | Harmonize canonical paths in `src/lib/seo.ts` with final IA | Phase 8 | `services` points to `/pricing`; `approach` points to `/about` |
| P1 | Generate per-route OG images and richer JSON-LD | Phase 8 | Current pages share a single OG image pattern |
| P1 | Fix public contrast failures on home, work, process, and 404 | Phase 7 | Lighthouse flags color contrast failures |
| P1 | Fix heading-order failures on work and process | Phase 7 | Lighthouse flags non-sequential headings |
| P1 | Remove unused CSS/JS and reduce mobile performance debt on all public routes | Phase 6 | Mobile performance baseline is 64–68 |
| P1 | Repair the existing `test:intake` smoke harness before CI expansion | Phase 10 | Current baseline test run fails during Astro build/import resolution before assertions execute |
| P2 | Remove or quarantine stale React Router marketing shell code | Phase 2 / cleanup | `src/App.tsx` conflicts with Astro as the live routing source |
| P2 | Document Search Console, Bing, analytics, and env setup for owner handoff | Phase 8 / 9 / 11 | Required docs are not present |

## Owner Follow-Up
- Confirm whether any Vapi agent scripts, email signatures, or outreach templates outside this repo reference legacy URLs not discoverable in source control.
