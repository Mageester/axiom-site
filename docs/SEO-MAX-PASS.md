# Axiom Web — SEO max pass

Audit date: **September 27, 2026**. Branch: **`seo/max-pass`**. Production: **https://getaxiom.ca/**.

## Scope and release status

The original audit was completed as local branch work, with no deployment or account actions. The user subsequently authorized pushing the branch, releasing it to the live site and managing Search Console under `aidanmageebusiness@gmail.com`. The release follow-up below records that later work. The homepage film and its click-to-play behaviour remain. Concept projects remain explicitly labelled.

The finished site has **19 indexable HTML pages**, including a new `/web-design/` hub, and four noindex pages (`/404/`, `/admin-shell/`, `/process/`, `/start/`). Private Function routes also receive HTTP noindex. All public pages are reachable from the homepage and appear exactly once in the sitemap.

## Measurement method and limitations

- Browser: **Brave**, launched explicitly from `C:/Program Files/BraveSoftware/Brave-Browser/Application/brave.exe`; Chromium engine **154.0.8037.58**. A Chromium user-agent in the report does not mean stock Chrome was used.
- Lighthouse **13.5.0**, all four categories, simulated mobile throttling (150 ms RTT, 1,638.4 Kbps throughput, 4× CPU slowdown, 412×823 viewport) and the actual desktop configuration (1350×940, desktop throttling). Report form factors were checked. An initial incorrectly configured desktop experiment was discarded and replaced.
- Before: public production URLs. After: the production Astro build served at `http://127.0.0.1:4321`. A separate **local Wrangler Pages runtime** at port 8788 verified redirects, Functions and response headers. Astro preview alone does not emulate Cloudflare configuration.
- The final table uses one successful run per page/device. Exploratory runs were used to diagnose failures. These are lab observations, not guaranteed scores or a controlled estimate of deployment impact: localhost lacks production latency, Cloudflare's injected scripts, security challenges and edge transforms.
- Lighthouse does not measure real-user INP. TBT is reported as a lab responsiveness indicator; field LCP/CLS/INP require Search Console/CrUX or owner-approved RUM after release.
- Raw Lighthouse JSON, rendered HTML, screenshots, search attempts, HTTP chains, QA results and experiment logs are in **`output/seo-max-pass/`**, deliberately uncommitted. The compact results file alongside this document preserves the reported scores and timing values in Git.
- Some Brave runs completed their reports but Windows retained a locked temporary Lighthouse profile during cleanup. Those reports were complete; runtime-error reports were excluded.

## Brave Lighthouse before → after

Scores are **Performance / Accessibility / Best Practices / SEO**, each out of 100. LCP is seconds. CLS is unitless. “New page” has no production baseline.

### Mobile — every indexable page

| Page | Before scores | After scores | LCP before → after | CLS before → after |
| --- | --- | --- | --- | --- |
| `/` | 73/96/81/100 | 97/100/100/100 | 5.51 → 2.48 | 0.000 → 0.000 |
| `/about/` | 99/96/100/100 | 99/100/100/100 | 2.02 → 1.96 | 0.005 → 0.000 |
| `/approach/` | 99/96/100/100 | 99/100/100/100 | 2.02 → 1.81 | 0.040 → 0.000 |
| `/contact/` | 98/96/100/100 | 99/100/100/100 | 2.01 → 1.96 | 0.063 → 0.000 |
| `/pricing/` | 94/96/100/100 | 99/100/100/100 | 2.77 → 2.11 | 0.000 → 0.000 |
| `/privacy/` | 99/96/81/100 | 99/100/100/100 | 1.83 → 1.81 | 0.000 → 0.000 |
| `/services/` | 99/96/100/100 | 99/100/100/100 | 1.84 → 1.96 | 0.049 → 0.000 |
| `/services/conversion-sites/` | 99/96/81/100 | 99/100/100/100 | 1.84 → 1.96 | 0.002 → 0.000 |
| `/services/local-business-websites/` | 90/96/81/100 | 99/100/100/100 | 1.83 → 1.96 | 0.194 → 0.000 |
| `/services/rebuilds/` | 91/96/77/100 | 99/100/100/100 | 1.40 → 1.96 | 0.195 → 0.000 |
| `/start-a-project/` | 99/96/81/100 | 99/100/100/100 | 1.83 → 1.81 | 0.002 → 0.000 |
| `/terms/` | 99/96/81/100 | 99/100/100/100 | 1.84 → 1.81 | 0.000 → 0.000 |
| `/web-design/` | New page | 99/100/100/100 | — → 2.11 | — → 0.000 |
| `/web-design/cambridge/` | 89/96/81/100 | 99/100/100/100 | 1.83 → 2.10 | 0.211 → 0.000 |
| `/web-design/guelph/` | 89/96/81/100 | 99/100/100/100 | 1.83 → 2.10 | 0.212 → 0.000 |
| `/web-design/hamilton/` | 89/96/81/100 | 99/100/100/100 | 1.84 → 2.10 | 0.212 → 0.000 |
| `/web-design/kitchener/` | 89/96/81/100 | 99/100/100/100 | 1.85 → 2.11 | 0.211 → 0.000 |
| `/web-design/waterloo/` | 89/96/81/100 | 99/100/100/100 | 1.83 → 2.11 | 0.212 → 0.000 |
| `/work/` | 97/96/81/100 | 96/100/100/100 | 2.44 → 2.56 | 0.048 → 0.000 |

### Desktop — every indexable page

| Page | Before scores | After scores | LCP before → after | CLS before → after |
| --- | --- | --- | --- | --- |
| `/` | 96/96/81/100 | 100/100/100/100 | 1.01 → 0.53 | 0.093 → 0.000 |
| `/about/` | 100/95/100/100 | 100/100/100/100 | 0.47 → 0.44 | 0.005 → 0.000 |
| `/approach/` | 100/95/100/100 | 100/100/100/100 | 0.47 → 0.44 | 0.004 → 0.000 |
| `/contact/` | 98/95/100/100 | 100/100/100/100 | 0.48 → 0.44 | 0.087 → 0.000 |
| `/pricing/` | 100/96/100/100 | 100/100/100/100 | 0.60 → 0.45 | 0.000 → 0.000 |
| `/privacy/` | 100/96/81/100 | 100/100/100/100 | 0.46 → 0.44 | 0.000 → 0.000 |
| `/services/` | 100/95/100/100 | 100/100/100/100 | 0.46 → 0.44 | 0.005 → 0.000 |
| `/services/conversion-sites/` | 100/95/81/100 | 100/100/100/100 | 0.47 → 0.44 | 0.045 → 0.000 |
| `/services/local-business-websites/` | 100/95/81/100 | 100/100/100/100 | 0.46 → 0.44 | 0.004 → 0.000 |
| `/services/rebuilds/` | 99/95/81/100 | 100/100/100/100 | 0.46 → 0.44 | 0.068 → 0.000 |
| `/start-a-project/` | 100/96/81/100 | 100/100/100/100 | 0.46 → 0.41 | 0.002 → 0.000 |
| `/terms/` | 100/96/81/100 | 100/100/100/100 | 0.46 → 0.44 | 0.000 → 0.000 |
| `/web-design/` | New page | 100/100/100/100 | — → 0.44 | — → 0.000 |
| `/web-design/cambridge/` | 100/95/81/100 | 100/100/100/100 | 0.45 → 0.45 | 0.006 → 0.000 |
| `/web-design/guelph/` | 98/95/81/100 | 100/100/100/100 | 0.45 → 0.45 | 0.085 → 0.000 |
| `/web-design/hamilton/` | 98/95/81/100 | 100/100/100/100 | 0.45 → 0.44 | 0.091 → 0.000 |
| `/web-design/kitchener/` | 100/95/81/100 | 100/100/100/100 | 0.46 → 0.44 | 0.007 → 0.000 |
| `/web-design/waterloo/` | 100/95/81/100 | 100/100/100/100 | 0.45 → 0.45 | 0.007 → 0.000 |
| `/work/` | 100/95/81/100 | 100/100/100/100 | 0.55 → 0.49 | 0.005 → 0.000 |

### What these results establish

- Final mobile performance: **96–99**; desktop: **100** throughout. All final pages score **100** for accessibility, best practices and SEO on both devices.
- Final CLS: **0.000 maximum**. All 38 measurements meet the requested <0.05 target.
- **10/19 mobile** and **19/19 desktop** measurements meet the stricter <2.0 s LCP target. Mobile pages still at or above 2.0 s: `/`, `/pricing/`, `/web-design/`, `/web-design/cambridge/`, `/web-design/guelph/`, `/web-design/hamilton/`, `/web-design/kitchener/`, `/web-design/waterloo/`, `/work/`.
- Final TBT: **0 ms** on both devices throughout. This supports good lab responsiveness; it does not establish field INP.
- Improvements are not universal: the final work-page mobile performance score is 96 versus 97 before, with LCP 2.56 s versus 2.44 s; several city LCP values also increased while layout shift disappeared. An earlier complete local run measured work at 98 / 2.26 s. The final matrix is retained without selecting the best score from repeated runs.
- Baseline SEO was already 100. Lighthouse's SEO category does not assess factual schema, local-content usefulness, all duplicate/orphan scenarios or business-profile quality; the additional build checks address those gaps.


## Issues found and changes

### Crawlability and delivery

| Finding | Change / verification |
| --- | --- |
| The old audit covered a fixed public-route allowlist and missed new routes and most errors. | The audit now parses every built HTML page with Cheerio. It checks exact sitemap parity, duplicate metadata, canonical URLs, private-page noindex, headings, links, fragment targets, reachability, schema content and assets. |
| `/process/` was indexable HTML even though the sitemap excluded it and production redirected it. | Marked the static fallback noindex and canonicalised it to `/approach/`. Kept both permanent redirects. |
| `/start/` did not redirect; only `/start` did. | Both variants now redirect directly to `/start-a-project/` with 301 in local Pages. |
| Slash variants of legacy service URLs returned 404. | Added 301s for both variants of custom-web-development, ai-integration and digital-infrastructure. Local Pages verifies the intended final service URL. |
| Private routes depended on static `_headers`, which do not apply to Function responses. | Added a root Pages middleware applying `X-Robots-Tag: noindex, nofollow` and `Cache-Control: no-store` to private routes, error/redirect responses on those routes, and the ops hostname. Authentication is unchanged. Tests verify status, body and Location preservation. |
| robots.txt blocked crawlers from seeing private-page noindex; account was absent from the sitemap exclusion list. | Private HTML and API/internal paths remain crawlable so HTTP noindex can be observed. Middleware covers API and `/functions/` responses too. Added account exclusion. Authentication remains the access control. |
| Static admin-shell and error-file HTTP directives were incomplete. | Added explicit admin-shell and 404 variants. The built shell also has HTML noindex. |
| Broad `index` headers were also applied to 404 responses under `/services/*`. | Removed redundant positive indexing headers; canonical public HTML declares indexing, while error HTML declares noindex. |
| Cache rules targeted `/assets/*`, but Astro emits hashed files under `/_astro/*`. | Immutable one-year caching now targets hashed Astro files. Unhashed images/media use bounded caching, not permanent immutable caching. Added logo/social-card caching. |
| Some canonical static paths, film assets, sitemaps and Astro assets were not excluded from Functions. | Completed static exclusions. Wrangler caught overlapping wildcard rules during implementation; they were removed and the audit now rejects overlaps. |
| Speculation rules broadly matched internal URLs and also prerendered pages. | Limited prefetch to a public-page allowlist with conservative eagerness. Removed speculative prerendering and avoided forms/private endpoints. |
| Sitemap contained guessed frequency/priority values. | Removed them. No fabricated lastmod dates were added. |
| Live `https://www.getaxiom.ca/` returns 200 without redirecting to the apex. | Confirmed in Brave. HTTP requests upgraded to HTTPS (307 observed), but www stayed www. The owner must add a permanent host redirect preserving path/query. Pages `_redirects` does not support domain-level redirects; no Cloudflare account settings were changed. |
| Error-page copy implied a missing page would appear later. | Replaced with direct navigation guidance. Unknown URLs return a real 404 on production and local Pages, with noindex HTML. The platform's explicit `/404` resource can return 200; it is noindex and absent from sitemap/navigation. |

Cloudflare's documented distinction between static headers and Functions is the reason for the middleware. See [Pages headers](https://developers.cloudflare.com/pages/configuration/headers/) and [redirect handling](https://developers.cloudflare.com/pages/configuration/redirects/).

### Metadata and structured data

| Finding | Change / verification |
| --- | --- |
| Business definitions used different IDs, types, phones, service areas and duplicated offer data. | Consolidated one Organization/LocalBusiness identity with the existing published email, E.164 phone, Kitchener/ON/CA locality, both founders and five named Ontario service areas. |
| General ProfessionalService is deprecated. | Use Organization + LocalBusiness with separate Service entities. This follows the current [Schema.org type notice](https://schema.org/ProfessionalService). |
| Founding year was not substantiated by the supplied facts. | Removed it. No street address, postal code, coordinates, business hours or social profiles were invented. |
| Company relationship needed corroboration. | Read the live Axiom International site in Brave; it identifies Axiom Web among its companies. Retained parentOrganization. |
| Pricing schema included two FAQs not present in the visible page. | Generate FAQPage directly from the visible pricing FAQ array. City FAQs likewise use the same data for HTML and schema. The audit compares questions and answers against rendered main content. |
| Legal pages lacked breadcrumb markup; breadcrumbs elsewhere were invisible to visitors. | Added fallback breadcrumb schema and a restrained visible breadcrumb component. Nested city breadcrumbs point to the new hub. |
| Business/website references were not consistently defined on detail pages. | Shared layout emits the same Organization/LocalBusiness and WebSite objects on each indexable page. Noindex pages omit public entity markup. |
| Homepage film lacked structured metadata. | Added VideoObject using the user-supplied upload date, duration, MP4 URL and WebP thumbnail. The audit checks that the video actually exists on the page and matches its source. |
| Shared OG asset was actually 640×640 while metadata declared 1200×630. | Generate 19 actual 1200×630 page-specific PNG cards at build time from route metadata and the existing brand logo. OG/Twitter titles, descriptions, URLs and image alt are present. The audit reads image dimensions with Sharp. |
| Service titles such as “Rebuilds” lacked standalone search context. | Use descriptive website redesign and conversion-focused web design titles and H1s. City titles identify city + Ontario + Axiom Web. |
| Manifest absent. | Added a browser-mode manifest with existing real icon files, language, name and theme. Existing favicon sizes are retained. |

Validation means JSON parsing, required project fields, identity consistency, visible FAQ parity, breadcrumb destinations and video/resource checks against the generated build. It does **not** mean Google has approved rich-result eligibility. No code or URL was submitted to an external validator because external interactions were read-only. FAQ rich results are generally restricted to authoritative government/health sites; adding valid FAQ markup does not make this studio eligible. See [Google's FAQ policy](https://developers.google.com/search/blog/2023/08/howto-faq-changes).

LocalBusiness contains only the published locality, region and country. Google may want a complete physical address for local rich-result features; an unknown/private address should not be fabricated to satisfy that requirement. See [Google's LocalBusiness guidance](https://developers.google.com/search/docs/appearance/structured-data/local-business). The film is supporting homepage content, not a dedicated watch page; VideoObject does not guarantee video indexing. See [Google's video requirements](https://developers.google.com/search/docs/appearance/structured-data/video).

### Local content and internal linking

- Created `/web-design/` as a service-area hub with links to all five city pages, project scope/pricing, the process and concept work.
- Replaced near-duplicate city introductions, unverified client/visit claims and repeated generic FAQs with useful decisions: Kitchener service versus premises journeys; Waterloo first-appointment/booking detail; Cambridge coverage and quote scope; Guelph referral evidence and maintainable content; Hamilton coverage, migration planning and remote review.
- Every city has three distinct planning sections and two specific FAQs. Shared pricing/ownership facts remain shared because the terms are the same. These are service-area pages, not claims of five offices.
- Removed unsupported claims of on-site photography, faster local turnaround, established customers in specific neighbourhoods and guaranteed retention of rankings. Corrected Guelph's region label to Guelph, Ontario.
- Added contextual links among city pages, the hub, services, pricing, founders, the process and work. Footer navigation now includes the process and service-area hub, plus the published Kitchener-Waterloo location.
- Repaired three homepage service links whose fragments did not exist; they now point to the relevant service detail pages.
- Homepage H1 now states “Web design for serious local businesses.” The supporting copy retains the Kitchener-Waterloo location. The three-line composition remains.
- Removed unsourced “most buyers” / booking behaviour claims. Kept concept labels; no reviews, ratings, testimonials, client logos, client results or quantified success claims were added.
- Changed the city-page “free site teardown” CTA to “Discuss your project,” matching the actual project-inquiry destination without an unverified free-offer promise.
- The target mapping is deliberate: homepage = brand + Kitchener-Waterloo studio; city pages = city-specific hiring/planning; services = scope and service type; pricing = investment; work = honestly labelled concepts. No city/neighbourhood page expansion was used to manufacture keyword coverage.

### Performance and accessibility

- Preserved Latin font subsets and all used weights/styles. Critical heading fonts preload; `font-display: optional` avoids late swaps that moved entire hero blocks. On a slow first visit a stable system fallback may remain for that navigation; subsequent visits can use cached fonts.
- Retained normal Astro stylesheet extraction and shared caching. An experiment inlining all CSS removed blocking requests but enlarged HTML and worsened several mobile LCP measurements; it was reverted.
- Reduced the homepage title/support reveal delay so the first screen becomes readable promptly. Later scene choreography remains; five Brave Playwright tests cover scene behaviour, work selection, native scrolling and reduced motion.
- The film poster is immediately visible and high priority. Responsive AVIF/WebP replaces a full-resolution poster download on phones. The 800-pixel AVIF is **12,212 bytes**, versus the original WebP's **340,344 bytes**. The supplied WebP URL remains available as the schema thumbnail and fallback.
- The MP4 remains unchanged, `preload="none"`, with no autoplay. Brave verifies no MP4 transfer before a click and actual playback after clicking. Captions and native playback controls remain.
- Added intrinsic dimensions to responsive portfolio images; generated 640/960 AVIF and WebP candidates for the four images that previously had only a large candidate. Homepage portfolio media is lazy and low priority.
- Compressed the existing logo from **18,002 to 8,890 bytes**. Kept its dimensions and appearance.
- Raised muted text contrast while preserving the neutral palette. Work cards now retain full text opacity during entry so text does not fail contrast mid-animation.
- Fixed the film button's accessible name so it includes its visible “Play film” text.
- Every page was checked in Brave at 390 and 1440 pixels: 38 checks, no horizontal overflow, broken eager images, blank main content or page errors. Mobile menu navigation, city FAQ expansion, film playback and work selection pass. Homepage and a city page remain readable with JavaScript disabled.

## Search and competitor observations

Requested searches were attempted in the Brave browser on both engines: `site:getaxiom.ca`, `"Axiom Web"`, and `web design Kitchener`. Google returned an unusual-traffic challenge; Brave Search returned HTTP 429 / CAPTCHA. No challenge was bypassed and no account was used. Exact live Google/Brave ranking positions and result snippets therefore remain **unverified**.

A separate available search index surfaced the homepage for the local query under “Web Design Kitchener-Waterloo | High-Trust Sites | Axiom Web”, while live HTML had a newer title. This is evidence of an indexed result, not a ranking measurement; search engines can cache or rewrite titles. Later narrow queries returned no results, which is not evidence that Google has deindexed the site.

Competitor sites surfaced by that search were inspected directly in Brave:

| Site | Observed pattern relevant to Axiom |
| --- | --- |
| [DigitalLabz](https://www.digitallabz.ca/) | Explicit geographic service headings, portfolio, FAQs, client-proof sections and supporting articles. Axiom can improve useful content now, but must earn its own client evidence. |
| [WEBRA Digital, Kitchener](https://webradigital.ca/web-design/kitchener) | City intent in the title/H1, visible starting investment, service scope, neighbouring-area links and FAQs. Axiom retains its own prices and positioning. |
| [Iteration Studio, Kitchener](https://iterationstudio.ca/web-design/kitchener) | Local scope, buyer categories, geography and FAQ coverage. Useful differentiation requires more than substituting city names. |
| [Alex Leuschner](https://alexleuschner.com/) | Clear personal identity, local service framing and a website showcase. Axiom's verified two-founder identity is an appropriate real trust signal. |

These are observations of their public pages, not endorsements or verified claims about their results. No competitor wording, testimonials or numbers were copied.

## Intentionally unchanged / remaining constraints

- No `sameAs` links: no genuine studio/founder profiles were verified. Parent-company identity is represented with parentOrganization, not treated as the same entity.
- No street/postal address, geo coordinates, opening hours or invented local office pages. Owner verification is needed before adding them.
- No AggregateRating/Review schema. No fabricated proof, blog volume, neighbourhood pages or guaranteed rankings.
- No `llms.txt`: it is not a substitute for crawling/indexing standards or a demonstrated organic-search improvement. The HTML, canonical links, sitemap and entity data are the useful foundation here.
- No hreflang because the site has one English-Canadian version. No SearchAction because there is no site search.
- No guessed sitemap lastmod. Legal policy text was not rewritten as part of an SEO exercise.
- No removal of the homepage film or wholesale design rewrite to chase a lab score. The strict **LCP <2.0 s** target is not achieved on every final mobile run; the detailed table makes the remaining pages explicit. **CLS <0.05** is evaluated separately. Real-user INP remains unmeasured.
- Final homepage diagnostics still flag approximately **16 KiB of unused CSS**, two render-blocking stylesheets (about **750 ms** estimated savings), the dependent font/CSS request chain, and approximately **26 KiB** of possible further image savings. Shared CSS serves responsive states and interactions; inlining it was measured and reverted after regressions. The remaining image estimate concerns the low-priority portfolio candidate at this emulated pixel density and further logo compression. Existing responsive candidates and logo quality are retained. These diagnostics remain in the compact results rather than being described as fully resolved.
- Production injects Rocket Loader, email obfuscation, analytics and Cloudflare challenge scripts. Some baseline Best Practices failures come from deprecated APIs inside the challenge script. Local improvements cannot prove those production-only issues resolved.
- Existing broad legacy tests include a stale reference to the absent `src/components/motion/Timeline.tsx` (also absent before this branch). A broad test attempt encountered that and tried to start the local intake stack; it was stopped. No external forms were submitted. Focused SEO tests, Brave interactions and the five current homepage tests are the relevant verified results; this report does not claim the entire legacy suite passes.
- Local Wrangler warned that its bundled runtime supports an older compatibility date than the repository requests. It nevertheless compiled and served the tested routing/middleware paths. No dependency-wide or deployment upgrade was attempted.

## Verification and repeatability

- Required gate: `npm run build` (`astro build && node scripts/audit-seo.mjs`) — must exit 0 before each commit.
- Focused regressions: `node --test tests/seo-audit.test.mjs tests/seo-middleware.test.mjs` — three tests, including twelve deliberately broken build variants and private-response matrices.
- Brave homepage suite: `npx playwright test --config output/seo-max-pass/playwright.config.mjs` — five tests.
- Full responsive/read-only checks: `node output/seo-max-pass/qa.mjs` — 38 page/viewport checks plus targeted interactions and no-JS checks.
- Lighthouse dependencies were installed into uncommitted `output/seo-tools/`, not the production dependency tree. Harness: `node output/seo-max-pass/lighthouse.mjs final-reviewed http://127.0.0.1:4321`. Each result must have the expected formFactor, non-null category scores and no runtimeError. The final matrix was repeated after the independent review corrections.
- Independent read-only review checked routing, identity/schema, local content, social resources and audit coverage. Its actionable findings were corrected: deprecated business type, API crawl/noindex policy, CTA wording, contact/area/founder checks, visible video poster parity and malformed breadcrumb handling.
- Local Pages runtime: `npx wrangler pages dev dist --local --ip 127.0.0.1 --port 8788 --show-interactive-dev-session=false`. Read-only Brave routes confirmed 301 aliases, canonical slash redirects, 404 status and private noindex.
- The final report's compact JSON records the audit version, browser, origin, timestamp, scores, LCP, CLS and TBT per run. Keep raw output locally if detailed trace analysis is needed.

## Owner action checklist — not performed

### Before deciding to release

- [ ] Review this branch and the copy; confirm the published phone **+1 226 753 1833**, email **aidanmageebusiness@gmail.com**, Kitchener base, five service areas, package scopes/prices and founder names.
- [ ] Confirm whether a public customer-facing address and regular hours exist. For a service-area business, follow Google's eligibility and address rules; do not list a virtual office or expose a private home merely for schema.
- [ ] Supply only real official profile URLs for `sameAs`, with consistent Axiom Web branding, contact details and a backlink to the canonical site.
- [ ] Review the slow-network font fallback and the shortened initial reveal in Brave. Review the page-specific social cards.
- [ ] Assess Cloudflare Rocket Loader and speculative/automatic optimizations on a preview. Disable or exclude only if a controlled test shows improvement and normal navigation, film playback, analytics and forms still work. Keep verified search crawlers accessible.
- [ ] **Fix the verified www duplicate:** configure a permanent Cloudflare host redirect from `www.getaxiom.ca` to `https://getaxiom.ca`, preserving path and query. Brave currently gets 200 on www. Verify HTTP variants too; the browser observed HTTPS upgrades, not proof of a server-side permanent redirect.
- [ ] Ensure preview `pages.dev` deployments and any other duplicate hosts are not independently indexed. Do not apply noindex to production.

### After an owner-approved future release

- [ ] In Search Console, verify the canonical domain property and submit `https://getaxiom.ca/sitemap-index.xml`. Inspect the homepage, hub, five city pages and changed services; check rendered content, selected canonical and indexing exclusions.
- [ ] Use Rich Results Test / Schema Markup Validator on deployed pages; resolve factual issues without inventing fields. Check video resource/thumbnail access, robots directives and the custom 404 from the public host.
- [ ] Inspect the production redirect chains, `_astro` caching and Function noindex headers. Confirm Cloudflare transforms do not rewrite or defer essential scripts incorrectly.
- [ ] Monitor CWV over the field-data window, segmented by mobile and page group. Target LCP <2 s, CLS <0.05 and good INP; Lighthouse TBT alone is not an INP measurement.
- [ ] Establish a query/page baseline for “Axiom Web” and the five city intents: impressions, clicks, CTR, selected landing page and qualified inquiries. Compare like periods and watch cannibalisation between homepage and city pages.
- [ ] Verify or create an eligible Google Business Profile using the true business name, appropriate category, real contact details and actual service area. Add genuine work/team photos. No keyword additions to the business name.
- [ ] Align Bing Places, Apple Business Connect and legitimate local business directories with the same identity where eligible. Prioritise relevant memberships and relationships over mass directory submissions.
- [ ] Ask actual clients for honest reviews without incentives, gating or prescribed wording. Publish real client projects only with permission, distinguishing deliverables from measured outcomes.
- [ ] Build useful supporting material from actual buyer questions: choosing a site scope, planning a rebuild, maintaining booking paths, and preparing project evidence. Add measured case studies when real data exists. Link these naturally from the relevant service/city page.
- [ ] Review indexing, broken links, actual inquiry quality and content accuracy regularly. Re-run the production build audit on every change; update prices and visible FAQ/schema data together.

## Commit record

Each implementation commit followed a successful `npm run build` with exit 0:

1. `64f2ee8` — `fix(seo): enforce crawl policy and accurate structured metadata`
2. `0cab0ca` — `feat(seo): add useful local guidance and service-area navigation`
3. `c35ea7f` — `perf(seo): stabilize rendering and optimize media and social cards`

This report, the compact measurement evidence and completed plan are committed separately as `docs(seo): record Brave audit results and owner actions`, also after a passing production build. Nothing under `output/` and no source 4K MP4 is included. Pre-existing unrelated working-tree changes are preserved.

## Authorized release follow-up — September 27, 2026

- The user authorized production release and Search Console work after reviewing the audit. The four reviewed commits were pushed to `main` by fast-forward, at `0b9de081ea19f31da625088e69b6693192d92159`, triggering Cloudflare Pages.
- Before release, `npm run build` and the three focused SEO regression tests passed again.
- Brave confirmed the signed-in account is `aidanmageebusiness@gmail.com` and the existing domain property is `sc-domain:getaxiom.ca`; no new account, ownership grant or property was required.
- Search Console showed the current sitemap index as Success, plus an old `/sitemap.xml` submission marked Couldn't fetch. Added a permanent legacy sitemap redirect and a production-audit assertion so old references resolve to the current sitemap index.
- Initial property overview: 18 search clicks, 35 indexed and 64 non-indexed historical URLs; 13 HTTPS / 0 non-HTTPS URLs, 9 valid / 0 invalid breadcrumbs, and no field Core Web Vitals data. These are historical Search Console observations, not immediate results from this release. The report also flagged two unused ownership tokens; they were left unchanged because this SEO task does not require changing access.
