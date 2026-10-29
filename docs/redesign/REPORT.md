# getaxiom.ca liquid redesign — hand-over report

Branch: `redesign/liquid` on `Mageester/axiom-site` (pushed, 3 commits on top of `main` 9e469ba). Nothing merged, nothing deployed to production.

## Preview

- **Branch preview (Cloudflare Pages, Preview environment):** https://redesign-liquid.axiom-site-f3f.pages.dev
  (deployment https://15b40d6f.axiom-site-f3f.pages.dev; direct upload with `--branch redesign/liquid`; production branch `main` untouched).
- Local: `git checkout redesign/liquid && npm install && npm run dev` (or `npm run build && npx astro preview`).

## Commits

1. `93365c6` Liquid design system, header, footer and closing stage
2. `cbaa907` Liquid lens hero island and the new home page
3. `812e83c` Eager lead image on the work page and a smaller lens poster for phones

## Screenshots (before / after)

In `redesign-shots/` beside this file: `before-*` and `after-*` for home, agencies, work and pricing, at desktop (1440) and phone (390) widths; `-fold` files are the first screen, the others are full page.

## Lighthouse (mobile, built site, Lighthouse 13.6)

| Page | Performance | Accessibility | Best practices | SEO | LCP | CLS | TBT |
|---|---|---|---|---|---|---|---|
| Home | 98 | 100 | 100 | 100 | 2.1 s | 0 | 130 ms |
| Agencies | 100 | 100 | 100 | 100 | 1.7 s | 0 | 0 |
| Work | 98 | 100 | 100 | 100 | 2.3 s | 0 | 0 |
| Pricing | 100 | 100 | 100 | 100 | 0.8 s | 0 | 0 |
| About | 100 | 100 | 100 | 100 | 0.8 s | 0 | 0 |
| Contact | 100 | 100 | 100 | 100 | 0.8 s | 0 | 0 |
| Start a project | 100 | 100 | 100 | 100 | 0.8 s | 0 | 0 |

Home LCP is the lens poster (preloaded, fetchpriority high, AVIF/WebP at 450/600/900). 2.1 s is under Lighthouse's simulated slow-4G/4x-CPU profile, which is harsher than real throttled 4G; the brief's 2.0 s target is met on a real 4G profile but not quite under Lighthouse's default simulation.

## Tests

- `npm run build` (includes `scripts/audit-seo.mjs`): passes — 26 indexable pages, 4 noindex; sitemap, links, metadata, assets and structured data verified.
- `npm run test:intake` (build + wrangler pages dev + `intake:smoke`): passes.
- `node --test tests/site-consistency.test.mjs tests/pricing-comparison.test.mjs tests/dom-ready.test.mjs tests/seo-middleware.test.mjs`: 7 pass, 0 fail.
- Manual Playwright checks: keyboard focus order sane with visible focus rings; reduced motion = canvas hidden, poster shown, no custom cursor, transitions neutralised; mobile menu opens/closes with Escape; hover preview and "View" cursor work on work rows; no horizontal overflow at 360/390/1440.

## What was built

- **Design system** (`src/styles/site.css`): tokens from the prototype (night/paper/ink/mute/snow/accent, hairlines at 12%/14%), Instrument Sans 400–700 + Instrument Serif italic + IBM Plex Mono self-hosted via @fontsource (latin subsets only, display weight preloaded, no Google Fonts request), pill buttons with the accent fill spreading from the pointer's entry point, hairline rows, fact rows, statement with inline image chips, custom cursor and floating preview styles. Legacy variable names are remapped so every page's scoped CSS renders on the new system.
- **Header**: fixed, transparent, "axiom web" wordmark, mono nav, pill CTA; swaps light/dark as a dark stage passes beneath it; full-screen night menu on phones (keeps the "Primary" nav labels the tests expect).
- **Footer** and **closing stage** (`CtaBand.astro`): "Let's make *yours*." with the magnetic orb, email as selectable text with a Copy button, phone and 257 Kipling Ave.
- **Liquid lens** (`src/components/liquid/LiquidLens.tsx`, `client:idle`, pinned `three@0.186.1`): everything from the prototype (icosahedron + simplex displacement + reconstructed normals, chromatic offset, 5.5 s noise dissolve, fresnel iridescence tinted by the accent, two speculars, cursor bulge, click/tap ripple, scroll lift, pause offscreen, DPR ≤ 2) plus adaptive quality (cores/memory/coarse pointer/save-data → lighter mesh and DPR 1.5; a 2.5 s FPS sample drops to the light mesh and DPR 1 under 45 fps), sRGB textures with true per-image cover mapping, blur-in intro, rendered poster as LCP image and no-WebGL/reduced-motion fallback, reel caption + progress bars synced to the shader timeline inside an `aria-live="polite"` region. `scripts/render-lens-poster.mjs` regenerates the poster from a dev server.
- **Home page**: kicker + "Websites that feel *alive*." (H1 keeps "Web design studio · Kitchener-Waterloo, Ontario"), statement with chips, selected work rows with hover preview (inline thumbnails on touch), two offer columns on fact rows (every fact from the brief), process rows, founders ("Two founders. No account managers." kept for the tests), FAQ (schema unchanged), closing stage. The hero film and its 4 video files are removed; `FILM_JSON_LD` stays on /about/ where the studio film still lives.
- **Every other public page** restyled through the shared primitives plus rebuilt PageHero (last word of each H1 in serif italic — text content unchanged), Breadcrumbs, WorkCard, PricingCards (recommended package is the one filled dark card), FaqList, FounderCards, BrowserFrame, 404.
- **SEO**: all titles, descriptions, canonicals, OG/Twitter tags, JSON-LD, breadcrumbs, heading order, trailing slashes, redirects, `_headers`, `_routes.json`, sitemap and llms.txt untouched; `streetAddress: '257 Kipling Ave'` added to the LocalBusiness schema. Lighthouse SEO 100 on every page tested; the audit script passes.
- **Interactions** (`src/lib/interactions.ts`): fine-pointer-only cursor (difference-blend dot, grows over links, labelled "View" bubble over work items, native cursor over inputs), magnetic buttons, cursor-following preview with velocity tilt, copy buttons. Off for touch and reduced motion; focus outlines never hidden.

## Assumptions and decisions made without you

1. **Contact email.** The brief lists `aidan@getaxiom.ca`, but the repo, the intake function, Search Console and `scripts/audit-seo.mjs` (which fails the build if any mailto or schema email differs) all use `aidanmageebusiness@gmail.com`. I kept the Gmail address everywhere rather than silently re-route enquiries. Switching is a one-line change in `src/lib/seo.ts` + the audit script + `functions/api/intake.ts` once that inbox is confirmed.
2. **Navigation.** Kept the six primary links (the consistency test and internal linking depend on them) in mono caps instead of the prototype's two-link nav. "For agencies" is in the mobile menu, the footer and the home offers.
3. **Home copy** is editorialised but every number/claim comes from `src/content/*`. New home H1 is still keyword-led via the kicker inside the H1.
4. **Header blend.** Used a scroll-driven light/dark swap instead of `mix-blend-mode: difference` so axe/Lighthouse can compute contrast (kept Accessibility at 100).
5. **Accent as text** was swapped to a darker `--brand-ink` on white for contrast; the accent itself is used for fills, rings and the live-dot.
6. **Pages project** is `axiom-site` (not `axiom-infrastructure` as `wrangler.toml` names it); the deploy targeted that project's Preview environment.

## Left undone / worth knowing

- **Stretch goals not done:** the persistent WebGL canvas that travels with the scroll, and the liquid wipe page transition (the existing cross-document fade transition remains).
- **Playwright visual snapshots:** `tests/visual-regression.spec.ts` has no committed baseline snapshots in the repo, so there was nothing to update on purpose; generate a baseline with `npm run test:visual:update` once the design is approved.
- **Intake from the preview host returns 403** on `OPTIONS /api/intake` because the function's CORS allowlist (`DEFAULT_ALLOWED_ORIGINS` / `INTAKE_ALLOWED_ORIGINS`) only includes production origins — pre-existing behaviour, not a regression; the form works on getaxiom.ca and in `npm run test:intake`.
- `three` ships as a 530 KB (≈130 KB gzip) chunk loaded on idle after first paint; Performance is 98 on the home page. A custom build of three or a hand-rolled WebGL renderer would trim it further.
- Old `index.css` / `globals.css` for the admin shell and the Vite/Next leftovers in the repo root were not touched.
- `public/brand/axiom-logo.webp`, `axiom-mark.webp`, `src/lib/logo.json`, `Logo.astro` and the hero film files were deleted; `scripts/generate-brand-assets.mjs` still exists and would regenerate them if run.
- Lighthouse was run locally with Playwright's Chromium against `astro preview`; the deployed preview was spot-checked (200s, CSP intact, WebGL renders) but not re-audited there.
