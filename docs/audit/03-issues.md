# Phase 0 Backlog

Date: 2026-04-24
Source: Phase 0 inventory, Lighthouse, axe, build/test baseline

## Phase 1 - Design System Foundation

1. Replace current token sprawl with `src/design/tokens.ts` and Tailwind alignment.
2. Keep public-page typography on the self-hosted Inter + Inter Display system, with JetBrains Mono for technical UI.
3. Remove public hardcoded colors, arbitrary pixel spacing, pill radii, glow-heavy shadows, and component-level font families.
4. Build the planned primitives under `src/components/primitives/`.
5. Document WCAG AA token pairings and primitive usage.

## Phase 2 - Global Architecture

1. Add canonical routes `/services`, `/services/[slug]`, `/approach`, and `/work/[slug]`.
2. Implement 301 redirects for `/process -> /approach` and `/start -> /start-a-project`.
3. Produce a full redirect map including external legacy URLs from outreach, Vapi, and email systems.
4. Rebuild nav/footer/404/skip link on primitives and tokens.
5. Create typed local content and a route manifest for SEO, sitemap, breadcrumbs, OG, and draft rules.
6. Preserve admin rewrites and avoid modifying admin routes unless compatibility requires it.

## Phase 3 - Page Rebuild

1. Remove `/contact` form; route contact conversion intent to `/start-a-project`.
2. Retire or redirect `/start` as a separate intake path.
3. Rebuild Home, Work, Services, Approach, About, Contact, Start-a-Project, Legal, and 404 in order.
4. Add enforced case-study schema with `kind: 'client' | 'concept'`, `draft`, and automatic concept labels.
5. Verify or remove proof claims, avatar/testimonial assets, and metrics.
6. Keep `/pricing` live but out of primary nav.
7. Add RTK when public React island state first needs shared/non-trivial state.

## Phase 4 - Motion

1. Fix `shouldDisableHeavyMotion()` so coarse pointer alone does not disable motion.
2. Audit `BaseLayout.astro` pointer/coarse motion logic and remove decorative cursor/glow effects from public pages.
3. Standardize `RevealBlock` and add reduced-motion/touch regression coverage.
4. Gate hover-only effects behind `@media (hover: hover)`.

## Phase 5 - Forms And Conversion

1. Consolidate `/api/contact` and `/api/intake` around one intake schema/path.
2. Share Zod validation between client and Pages Function.
3. Add/verify honeypot, Turnstile, rate limiting, inline success, field errors, input preservation, and analytics events.
4. Confirm D1 and Resend behavior with real environment bindings.

## Phase 6 - Performance

1. Remove external font loading and preload only required self-hosted font weights.
2. Optimize images with AVIF/WebP, dimensions, source sets, lazy loading, and LCP priority.
3. Remove unused dependencies and stale app artifacts after confirming admin/demo safety.
4. Split public/admin JS concerns and keep public route JS below target.
5. Add/verify Cloudflare cache headers.

## Phase 7 - Accessibility

1. Fix global nav/CTA contrast violation present on every public route.
2. Fix heading order on `/process` and `/work`.
3. Verify mobile nav focus trap, Escape close, body scroll lock, and focus restore.
4. Add axe automation and manual keyboard/screen-reader smoke checks.

## Phase 8 - SEO

1. Replace `public/sitemap.xml` with build-time generation from route manifest.
2. Fix robots rules to block `/api/`, admin, and draft routes.
3. Consolidate SEO metadata into static Astro-rendered metadata.
4. Generate per-page OG images.
5. Add full JSON-LD coverage for Organization, LocalBusiness, WebSite, Service, CreativeWork, and BreadcrumbList.
6. Prepare Search Console and Bing owner setup docs.

## Phase 9 - Analytics

1. Add Cloudflare Web Analytics or owner-approved alternative.
2. Track pageviews, CTA clicks, intake funnel, email/phone/external links, and long-page scroll depth.
3. Add event dictionary and setup runbook.
4. Add React error boundary logging for public islands.

## Phase 10 - Testing And CI

1. Add `lint`, `typecheck`, `test`, and CI scripts.
2. Add Vitest and React Testing Library coverage where appropriate.
3. Add Playwright route smoke, critical path, axe, mobile, and reduced-motion tests.
4. Ensure CI runs build and intake tests sequentially to avoid `dist` write races.
5. Add a CI-based Lighthouse harness as a required deliverable, using GitHub Actions plus Lighthouse CI or an equivalent controlled browser runner. Local Windows Lighthouse output is not sufficient for Phase 6 acceptance; CI must run mobile and desktop budgets against the built preview, upload reports, and fail when Phase 6 thresholds are missed.

## Phase 11 - Documentation

1. Complete contributor docs for local dev, deploy, content, design system, env vars, SEO, analytics, forms, fonts, and rollback.
2. Add ADRs for token system, content layer, route manifest, RTK usage, and form architecture.

## Phase 12 - Release

1. Verify production Cloudflare Pages settings, preview deploys, env vars, redirects, and headers.
2. Run production smoke and Lighthouse.
3. Tag `v1.0.0` only after all global acceptance criteria pass.
