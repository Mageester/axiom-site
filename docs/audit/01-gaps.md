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

### BLOCKING: Testimonial Avatar Owner Verification

These image assets are BLOCKING for Phase 3 Home and About page rebuilds until the owner confirms each person, image license/permission, and the testimonial copy attached to the asset. Current source search found no page or testimonial component that attaches these avatar files to testimonial copy; they are only listed in the image optimizer.

| Asset | Current source attachment | Testimonial copy currently attached | Phase blocker |
| --- | --- | --- | --- |
| `public/images/avatar-daniel.jpg` | `scripts/optimize-images.mjs:86-89` | None found in tracked page/component source. | BLOCKING Phase 3 Home and About rebuilds pending owner verification. |
| `public/images/avatar-jake.jpg` | `scripts/optimize-images.mjs:98-101` | None found in tracked page/component source. | BLOCKING Phase 3 Home and About rebuilds pending owner verification. |
| `public/images/avatar-sarah.jpg` | `scripts/optimize-images.mjs:92-95` | None found in tracked page/component source. | BLOCKING Phase 3 Home and About rebuilds pending owner verification. |

### BLOCKING: Proof Claim Owner Verification

The following public or legacy-public claims are BLOCKING until the owner verifies the evidence, approves the exact language, or removes the claim. Phase 3 cannot preserve these claims on Home/About without verification.

| Claim | Location | Notes | Phase blocker |
| --- | --- | --- | --- |
| `14 DAYS` / 14-day turnaround | `src/components/motion/ProofBar.tsx:11`, `src/components/motion/ProofBar.tsx:51`, `src/components/site/HomepageStats.tsx:125`, `src/pages/index.astro:180`, `src/pages/index.astro:226`, `src/pages/pricing.astro:165` | Delivery-speed proof/offer claim. | BLOCKING Phase 3 Home and About rebuilds pending owner verification. |
| `Day 1`, `Day 3`, `Day 7`, `Day 14`, `Day 14-21` schedule claims | `src/pages/index.astro:86`, `src/pages/index.astro:92`, `src/pages/index.astro:98`, `src/pages/index.astro:104`, `src/react-pages/Infrastructure.tsx:27`, `src/react-pages/Infrastructure.tsx:38`, `src/react-pages/Infrastructure.tsx:49`, `src/react-pages/Infrastructure.tsx:60`, `src/react-pages/Infrastructure.tsx:191` | Process timeline claims; must match actual delivery capacity. | BLOCKING Phase 3 Home and About rebuilds pending owner verification. |
| `$0 DOWN` / `$0 down` | `src/components/motion/ProofBar.tsx:15`, `src/pages/index.astro:180`, `src/pages/index.astro:393`, `src/pages/pricing.astro:19`, `src/pages/pricing.astro:65`, `src/pages/pricing.astro:130`, `src/pages/pricing.astro:178`, `src/pages/pricing.astro:437` | Pricing/investment proof claim; must match real offer terms. | BLOCKING Phase 3 Home and About rebuilds pending owner verification. |
| `<1s LOAD`, `<1s`, `Sub-second`, `over one second`, `Under one second`, `Sub-1s load times` | `src/components/motion/ProofBar.tsx:19`, `src/components/site/HomepageStats.tsx:126`, `src/components/site/SocialProof.tsx:27`, `src/pages/index.astro:30`, `src/pages/index.astro:73`, `src/pages/index.astro:226`, `src/pages/index.astro:375`, `src/react-pages/Home.tsx:76`, `src/react-pages/Home.tsx:160` | Performance guarantee/proof claim; Phase 6 acceptance also needs CI Lighthouse evidence. | BLOCKING Phase 3 Home and About rebuilds pending owner verification. |
| `1 TAP` booking path | `src/pages/index.astro:40` | Conversion-path metric-like claim on a concept work card. | BLOCKING Phase 3 Home and About rebuilds pending owner verification. |
| `98+` mobile target | `src/pages/index.astro:50` | Metric-like proof claim for concept work card. | BLOCKING Phase 3 Home and About rebuilds pending owner verification. |
| `$150-$200/mo`, `From $150/mo`, `$3,500`, `$1,200`, `$2,200` pricing claims | `src/pages/index.astro:194`, `src/pages/index.astro:393`, `src/pages/pricing.astro:20`, `src/pages/pricing.astro:33`, `src/pages/pricing.astro:71`, `src/pages/pricing.astro:72`, `src/pages/pricing.astro:140`, `src/pages/pricing.astro:179`, `src/pages/pricing.astro:452`, `src/react-pages/PricingPage.tsx:40`, `src/react-pages/PricingPage.tsx:56`, `src/react-pages/PricingPage.tsx:70`, `src/react-pages/PricingPage.tsx:85` | Pricing claims; must match approved current offer. | BLOCKING Phase 3 Home and About rebuilds pending owner verification. |
| `$5K+` upfront-hit comparison | `src/pages/pricing.astro:130` | Market/pricing comparison claim; should be owner-approved or softened. | BLOCKING Phase 3 Home and About rebuilds pending owner verification. |
| `No 60-day Slack silences`, `No lock-in after 6 months` | `src/pages/pricing.astro:165`, `src/react-pages/PricingPage.tsx:41` | Competitive/support-term claims; must match owner-approved terms. | BLOCKING Phase 3 Home and About rebuilds pending owner verification. |
| `$50K hardscape projects` / `$200 websites` | `src/react-pages/Deployments.tsx:128` | Legacy public comparison claim. | BLOCKING Phase 3 Home and About rebuilds pending owner verification if reused publicly. |
| `12+ builds shipped` | `src/react-pages/Home.tsx:72` | Legacy public SPA proof claim. | BLOCKING Phase 3 Home and About rebuilds pending owner verification. |
| `within 24 hours` audit turnaround | `src/react-pages/AuditPage.tsx:146`, `src/react-pages/AuditPage.tsx:174` | Admin-linked legacy audit page offer claim. | BLOCKING Phase 3 Home and About rebuilds pending owner verification if reused publicly. |

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
