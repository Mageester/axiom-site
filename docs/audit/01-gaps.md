# Phase 0 Gaps

## Critical Bugs and Structural Drift
1. `src/lib/motionPreferences.ts` disables heavy motion for `(hover: none), (pointer: coarse)`, so touch/coarse devices lose intended motion even when `prefers-reduced-motion` is not set.
2. `src/layouts/BaseLayout.astro` still loads Google Fonts and Fontshare in production, which conflicts with the approved self-hosted font strategy and introduces render-blocking external CSS.
3. `public/sitemap.xml` is hand-authored and stale. It lists `/services/` and several `/services/*` URLs that do not exist in the current Astro route tree.
4. Routing truth is split between Astro pages, `_redirects`, `_routes.json`, and a stale `src/App.tsx` React Router map.
5. `/contact` and `/start-a-project` both ship forms today, which conflicts with the approved single-conversion-path model.

## Published Content and Proof Problems
- `/work` is explicitly labeled as concept work, but it still uses invented client-style names such as “Harrow & Calloway,” “Aurelia Dental Studio,” and “Blackline Barber Co.” for non-client pieces.
- Current work cards link to demo domains rather than case-study detail routes, so the marketing site has no durable typed work-detail system.
- No real case studies are present in the Astro route tree.
- No fake testimonial quotes were found on the currently audited public routes, but the repo still contains testimonial-capable components and avatar assets that could enable accidental proof drift later.

## SEO Gaps
- Canonical route mapping is inconsistent in `src/lib/seo.ts`:
  - `services` canonical points to `/pricing`
  - `approach` canonical points to `/about`
- No Astro routes exist for `/services`, `/services/[slug]`, `/approach`, or `/work/[slug]`.
- `public/sitemap.xml` is not generated from real routes and includes nonexistent URLs.
- No Search Console or Bing verification/setup docs are present.
- No route-specific OG image generation exists; pages fall back to the same default OG asset.
- No build-time route manifest exists for canonical tags, breadcrumbs, sitemap generation, or draft exclusion.
- 404 SEO score is intentionally low because the page is blocked from indexing, but the route still needs a redesigned recovery experience.

## Accessibility Findings
### axe / equivalent baseline
- `docs/audit/axe/*.json` reported **0 machine-detected violations** on the audited baseline routes: `/`, `/about`, `/contact`, `/pricing`, `/privacy`, `/process`, `/start`, `/start-a-project`, `/terms`, `/work`, `/404`.

### Lighthouse accessibility deductions
- Home: contrast failures
- Work: contrast failures and heading-order failures
- Process: contrast failures and heading-order failures
- 404: contrast failures
- About, contact, pricing, privacy, terms, start, and start-a-project are not at 100 either, despite zero axe violations, which suggests remaining manual or Lighthouse-only deductions

### Practical interpretation
- The current audit setup is not catching everything via axe alone.
- The public shell still has contrast debt and heading hierarchy debt that must be fixed in the rebuild.

## Performance Issues
- Mobile Lighthouse performance is well below the engagement target on every audited public route:
  - `/`: 64
  - `/about`: 67
  - `/contact`: 68
  - `/pricing`: 66 on rerun (`pricing-mobile-rerun.json`); first run recorded an invalid 0 baseline in `pricing-mobile.json`
  - `/privacy`: 68
  - `/process`: 66
  - `/start`: 66
  - `/start-a-project`: 67
  - `/terms`: 67
  - `/work`: 64
  - `/404`: 68
- Desktop performance is stronger but still short of the final target on several routes (94–96 range instead of 95+ everywhere).
- Current Lighthouse audit traces point to:
  - render-blocking requests
  - unused CSS
  - unused JavaScript
  - image delivery opportunities
  - inefficient cache lifetimes in the local audit run
- Build output still includes large client bundles tied to legacy SPA/admin surfaces (`_astro/index.*`, `OmniRoot.*`), which is risky for the final performance envelope.

## Copy and Positioning Drift
- Home headline and subhead are still low-ticket conversion copy (“Websites that turn visitors into booked calls”, “$0 down”, “$150-$200/mo”).
- About positions Axiom broadly across “every sector,” which weakens the tighter KW/Ontario owner-operator wedge.
- Work page explains concept work honestly but still uses invented brand identities.
- Pricing is currently a first-class navigation concept, while the approved IA treats it as secondary to services/approach/contact.
- Process and About both partially own the “how we work” story; neither is the canonical long-form editorial “Approach” page.

## Mobile-Specific Issues
- The codebase still contains coarse-pointer motion suppression logic, the exact class of bug called out in project context.
- Mobile performance scores remain 64–68 across the audited baseline routes.
- Contact and intake are both multi-step wizards on mobile, which creates duplicated conversion flow complexity.

## Routes and Redirect Gaps
- Live Astro routes do not match the approved canonical IA.
- No explicit marketing redirect map exists for:
  - `/services`
  - `/approach`
  - `/works`
  - `/deployments`
  - `/concepts`
  - `/method`
  - `/infrastructure`
  - `/manifesto`
  - `/apply`
  - `/architects`
- Repo references to old URLs still exist in source and docs (`src/App.tsx`, `TESTING.md`, `scripts/intake-smoke.mjs`).

## Tooling and Test Baseline Gaps
- The repo does not currently expose the full required local quality contract from the engagement brief:
  - no `lint` script exists in `package.json`
  - no general unit/integration/Playwright suite exists yet
- The only committed test command, `npm run test:intake`, is currently red on the audit baseline.
- Failure mode: the smoke harness rebuilds Astro, then crashes during static route generation because `dist/chunks/SiteLayout_*.mjs` imports a missing generated chunk (`BaseLayout_*.mjs`), so the test cannot complete its end-to-end assertions.
- This is now part of the baseline debt and must be addressed in the testing/CI phases rather than hidden by a docs-only commit.

## Console / Runtime Baseline
- `docs/audit/runtime-audit.json` captured no console errors or failed network requests on the audited public routes in the current local baseline.
- The known “Work render issues” were not reproduced as hard runtime failures in this audit pass, but the page remains structurally brittle and misaligned with the planned content model.
