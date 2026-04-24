# Phase 0 Gap Analysis

Date: 2026-04-24
Branch: `phase/0-audit`

## Critical Bugs And Regressions

- Motion regression remains in the JS layer: `src/lib/motionPreferences.ts` disables heavy motion when `(hover: none), (pointer: coarse)` matches. This means coarse pointers can still suppress motion even when the user has not requested reduced motion.
- `BaseLayout.astro` also contains pointer/coarse checks around cursor and decorative motion behavior. The public motion layer needs one consistent rule: only `prefers-reduced-motion: reduce` disables reveal motion.
- `/contact` still renders `QuickContactWizard`, so there are multiple conversion forms.
- `/start` remains a second intake route using `IntakeForm.astro`.
- Static sitemap references routes that do not exist: `/services/`, `/services/custom-web-development/`, `/services/ai-integration/`, `/services/digital-infrastructure/`.
- Canonical IA routes are missing: `/services`, `/services/[slug]`, `/approach`, `/work/[slug]`.

## Placeholder Or Unverified Proof Risk

- `public/images/avatar-daniel.jpg`, `avatar-jake.jpg`, and `avatar-sarah.jpg` suggest possible fabricated or placeholder testimonial assets. No verified testimonial content layer exists.
- Work entries are presented as concept builds in copy, but there is no enforced `kind: 'client' | 'concept'` schema and no automatic concept badge policy.
- Home/legacy React copy includes proof-like claims such as `12+ builds shipped` and `Sub-1s load times`; these need owner verification before they remain public.
- Terms copy explicitly reserves the right to deploy with "functional placeholders." That is legal copy, not page placeholder content, but it conflicts tonally with the new no-placeholder operating standard and should be reviewed.

## SEO And Discoverability Gaps

- `public/sitemap.xml` is stale and hand-authored.
- `robots.txt` allows all routes and does not block `/api/`, admin, or draft routes.
- SEO metadata is split between static Astro layout, `src/lib/seo.ts`, and client-side `src/components/SEO.tsx`.
- Some planned route metadata is mapped to the wrong canonical destination: `services` points to `/pricing`; `approach` points to `/about`.
- OG image is a single static `public/og-image.png`, not generated per page.
- JSON-LD exists for home/pricing/about but is incomplete for the v2 requirement set: service pages, case studies, breadcrumbs, and full local business data are missing.
- Lighthouse SEO score is 69 for 404 and 66 for admin-shell; public content pages generally score 100 in captured reports.

## Accessibility Gaps

Raw axe files: `docs/audit/axe/*.json`.

- Every public route has `color-contrast` violations, usually on nav CTA/link elements.
- `/process` and `/work` also have `heading-order` violations.
- `/admin-shell` has landmark and skip-link issues. Admin is out of scope for redesign, but this should be preserved as a known admin gap.
- Mobile nav focus trap, Escape close, and focus restore still need dedicated verification in later phases.

## Performance Gaps

Raw Lighthouse files: `docs/audit/lighthouse/*.json`.

- Desktop performance scores are high in local preview, generally 96-98.
- Mobile Lighthouse had repeated `NO_LCP` and Windows temp cleanup failures. Some mobile reports still produced scores, but many have `performance = NA`.
- Captured mobile scores that did compute are below target: `/contact` 87 and `/start-a-project` 84.
- Google Fonts and Fontshare still load externally and block the Phase 6 self-hosting target.
- Public pages include many hydrated islands and legacy React/React Router code still exists in the repo.
- Build output contains large public/admin chunks, including `index.*.js` around 134.65 kB and `OmniRoot.*.js` around 128.06 kB before gzip. Phase 6 should separate public and admin concerns carefully.

## Copy And Positioning Drift

- Brand naming alternates around "Axiom Infrastructure" while the brief refers to Axiom/getaxiom.ca.
- Current tagline is "Websites built to convert. Not to decorate."; the v2 brief asks for more premium buyer-language and avoids low-frame builder phrasing.
- `/process` is the current process route; the planned route is `/approach`.
- Contact metadata says "Use this form for a quick question or short note," but v2 requires no contact form.
- Service metadata exists in `SEO_ROUTES`, but no services hub or detail pages exist.

## Mobile-Specific Issues

- Coarse pointer still disables heavy motion in JS.
- Mobile Lighthouse frequently failed to compute LCP locally, which needs a more reliable CI/browser harness in Phase 10.
- Contact and start-a-project mobile performance scores that did compute are below the global acceptance target.
- The current mobile nav needs focus-management testing; no automated coverage exists yet.

## Stack Mismatch Reconciliation

System of record: Astro static site + React islands.

Outdated/legacy stack artifacts remain:

- `vite.config.ts`, `index.html`, `next.config.mjs`, and `next-env.d.ts`.
- `src/react-pages/*` uses `react-router-dom` and reads like an older Vite SPA surface.
- `eslint.config.mjs` imports Next ESLint config.

These should be catalogued and either removed or isolated in later phases only after confirming they are not needed by admin/demo tooling.

## Baseline Build And Test

Sequential verification:

- `npm install`: completed; 8 npm audit vulnerabilities reported.
- `npm run build`: completed, 12 pages built.
- `npm run test:intake`: passed 1 test. Local run logs expected `missing_resend_api_key` and returns 503 for valid payload in local mode.

Note: an initial parallel run of `npm run build` and `npm run test:intake` failed because both commands wrote `dist` concurrently. This is an audit-method finding and should inform CI sequencing.
