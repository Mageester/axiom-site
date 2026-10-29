# getaxiom.ca liquid redesign — hand-over report

Branch: `redesign/liquid` on `Mageester/axiom-site`, PR #15 against `main` (ready for review). Nothing merged, nothing deployed to production.

## Preview

- **Branch preview (Cloudflare Pages, Preview environment):** https://redesign-liquid.axiom-site-f3f.pages.dev
  (direct upload with `--branch redesign/liquid`; production branch `main` is untouched; `pages.dev` hosts send `X-Robots-Tag: noindex` by design).
- Local: `git checkout redesign/liquid && npm install && npm run dev` (or `npm run build && npx astro preview`).

## What was built

- **Design system** (`src/styles/site.css`): the prototype's tokens (night/paper/ink/mute/snow/accent, hairlines at 12%/14%), Instrument Sans 400–700 and Instrument Serif italic self-hosted via @fontsource (latin only, display weight preloaded, no Google Fonts request), small sentence-case labels in Instrument Sans (the tracked uppercase monospace labels were dropped at Aidan's request), pill buttons with the accent fill spreading from the pointer's entry point, hairline rows, fact rows, the statement with inline image chips, cursor and preview styles. Legacy variable names are remapped so every page's scoped CSS renders on the new system.
- **Header**: fixed and transparent, "axiom web" wordmark, swaps light/dark as a dark stage passes beneath it; full-screen night menu on phones.
- **Footer** and **closing stage** (`CtaBand.astro`): "Let's make *yours*." with the magnetic orb, the email as selectable text with a Copy button, phone and 257 Kipling Ave.
- **Liquid lens** (`src/components/liquid/LiquidLens.tsx`, React island on `client:idle`, pinned `three@0.186.1`): everything from the prototype (icosahedron + simplex displacement with reconstructed normals, sites mapped with a chromatic offset, 5.5 s noise dissolve, fresnel iridescence tinted by the accent, two speculars, cursor bulge, click/tap ripple, pause when hidden, DPR ≤ 2) plus:
  - adaptive quality: cores / memory / coarse pointer / save-data choose a lighter mesh and DPR 1.5; a 2.5 s FPS sample drops to the light mesh and DPR 1 under 45 fps and hands back to the poster under 20 fps; software WebGL (SwiftShader, llvmpipe, GPU-less lab runners) keeps the poster;
  - sRGB textures with true per-image cover mapping;
  - a blur-in intro, a rendered poster (`scripts/render-lens-poster.mjs`, 450/720/900 AVIF+WebP) that is the LCP image and the no-WebGL / reduced-motion fallback;
  - a reel caption and progress bars synced to the shader timeline inside an `aria-live="polite"` region;
  - **one persistent canvas that travels with the scroll** (wide screens): large in the hero, beside the statement, into the work list where it follows the cursor and shows the hovered project, through the section heads, and docked as the closing orb (tinting with the accent on hover/focus). On phones the lens stays in the hero and fades as it scrolls away.
- **Liquid page wipe**: cross-document view transitions reveal each new page with an elliptical clip-path wipe from the bottom edge (Chrome/Safari; Firefox falls back to a plain navigation).
- **Home page**: kicker + "Websites that feel *alive*." (H1 keeps "Web design studio in Kitchener-Waterloo, Ontario"), statement with chips, selected work rows, two offer columns on fact rows (every fact from the brief), process rows, founders ("Two founders. No account managers."), FAQ (schema unchanged), closing stage. The hero film and its video files are removed; the studio film and `VideoObject` stay on /about/.
- **Every other public page** restyled via the shared primitives and rebuilt PageHero (last word of each H1 in serif italic, text unchanged), Breadcrumbs, WorkCard, PricingCards (the recommended package is the one filled dark card), FaqList, FounderCards, BrowserFrame, 404.
- **Interactions** (`src/lib/interactions.ts`): fine-pointer-only cursor (difference-blend dot, grows over links, labelled "View" bubble over work items, native cursor over inputs), magnetic buttons, cursor-following preview with velocity tilt on pages without the travelling lens, copy buttons. Off for touch and reduced motion; focus outlines never hidden.
- **Contact email**: every reference is now `contact@axiominternational.ca` — site copy, mailto links, LocalBusiness / ContactPoint schema, `scripts/audit-seo.mjs`, the intake function's recipients, reply-to and error copy, `.env.example`, `security.txt`, TESTING.md.
- **Intake API**: also accepts Cloudflare Pages branch-preview origins (`https://<branch>.axiom-site-f3f.pages.dev`), so the form works on previews.

## SEO

- Titles, meta descriptions, canonicals, OG/Twitter tags, JSON-LD (Organization/LocalBusiness, WebSite, WebPage, BreadcrumbList, FAQPage, Service, ItemList, Person, VideoObject), heading order, trailing slashes, redirects, `_headers`, `_routes.json`, sitemap and llms.txt are unchanged; `streetAddress: 257 Kipling Ave` was added to the LocalBusiness address.
- `npm run build` runs `scripts/audit-seo.mjs`: passes (26 indexable pages, 4 noindex; sitemap, links, metadata, assets and structured data verified).
- **Google Rich Results Test** (run in Chrome against the preview): LocalBusiness, Organization and BreadcrumbList all valid on / and /pricing/. The only note is the optional `postalCode` field, left out because the postal code for 257 Kipling Ave was not supplied (crowdsourced data suggests N2C 2C2 for that stretch of Kipling Ave but it is not verified — add it to `ORGANIZATION_SCHEMA.address` once confirmed). "URL is not available to Google" appears only because the preview host is `noindex`.
- **PageSpeed Insights** (Google's own lab, mobile, run in Chrome on the preview): Performance **99**, Accessibility **100**, Best Practices **96**, SEO 69 — the SEO deduction is solely "page is blocked from indexing" from the preview host's `X-Robots-Tag: noindex`; on getaxiom.ca that header is not sent. The Best Practices deduction is a console error from Cloudflare's own Web Analytics beacon being CORS-blocked on the `pages.dev` host; it does not occur on the production domain.
- **Lighthouse 13.6 locally** (mobile, built site): Home 97–98 / 100 / 100 / 100 (LCP 2.1–2.3 s simulated), Agencies 100 / 100 / 100 / 100, Work 98 / 100 / 100 / 100, Pricing, About, Contact, Start a project 100 across the board.

## Tests

- `npm run build` (with the SEO audit): passes.
- `npm run test:intake` (build + wrangler pages dev + `intake:smoke`): passes.
- `node --test tests/site-consistency.test.mjs tests/pricing-comparison.test.mjs tests/dom-ready.test.mjs tests/seo-middleware.test.mjs tests/seo-audit.test.mjs`: all pass (the SEO-audit test now tolerates CRLF checkouts).
- `npm run test:visual`: **99 passed** across desktop Chrome, mobile Safari (WebKit installed) and reduced-motion projects. The baseline snapshots (54 files, 22 MB) are committed; screenshot tests force reduced motion so the lens stays on its poster and cannot flake, and the dev toolbar's own console noise is ignored.
- Playwright checks: keyboard order and visible focus rings, reduced motion (static poster, no cursor), mobile menu open/Escape, cursor "View" bubble and lens hover on work rows, no horizontal overflow at 360/390/1440.

## Screenshots

`redesign-shots/` beside the notes copy of this report holds `before-*` and `after-*` captures of home, agencies, work and pricing at 1440 and 390 wide (`-fold` = first screen; the others are full page).

## Commits

1. `93365c6` Liquid design system, header, footer and closing stage
2. `cbaa907` Liquid lens hero island and the new home page
3. `812e83c` Eager lead image on the work page and a smaller lens poster for phones
4. `4003285` Add the liquid redesign hand-over report
5. `eaf718c` Travelling lens, liquid page wipe, contact email and snapshot baseline
6. `f9042da` Ignore Playwright run artifacts
7. `698e62a` Sentence-case sans labels, software-WebGL fallback and a lighter poster
8. (this commit) Stable visual baseline across all three Playwright projects; report

## Decisions made without you

1. Primary nav keeps the six links (consistency test and internal linking depend on them); "For agencies" is in the mobile menu, the footer and the home offers.
2. Home copy is editorialised but every number comes from `src/content/*`; the H1 stays keyword-led through its kicker.
3. The header swaps light/dark by scroll position rather than `mix-blend-mode: difference`, so accessibility tooling can compute contrast.
4. The accent is used for fills, rings and the live dot; small text on white uses a darker `--brand-ink`.
5. The Pages project is `axiom-site` (not `axiom-infrastructure` as `wrangler.toml` names it); deploys target its Preview environment.
6. `postalCode` was not added to the schema because it was not supplied.

## Still open

- Going live is a merge of PR #15 into `main` (Pages builds production from `main`), then verifying in Search Console. Not done, per the brief.
- The `three` chunk is ~530 KB (≈130 KB gzip), loaded on idle after first paint.
- Admin-shell styles (`index.css`, `globals.css`) and the Vite/Next leftovers in the repo root were not touched.
