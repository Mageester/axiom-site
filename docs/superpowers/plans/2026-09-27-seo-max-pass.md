# SEO max pass implementation plan

**Goal:** Improve Axiom Web's technical, local and on-page SEO with measured Brave evidence.
**Architecture:** Keep Astro's static pages and current visual system. Consolidate metadata and business identity, improve existing local content, and strengthen the production audit.
**Spec:** User's September 27 SEO request in this chat; repository AGENTS.md.
**Constraints:** Work only on `seo/max-pass`. No push, merge, deployment, account actions or fabricated proof. Preserve concept labels and homepage film. Build must pass before every commit. Exclude output and source MP4.

## Tasks

- [x] Capture live Brave render/search checks and mobile/desktop Lighthouse for every sitemap page. Save raw evidence under output/seo-max-pass.
- [x] Technical: consolidate src/lib/seo.ts identity; validate FAQ/video/breadcrumb schemas; complete robots, redirects, headers, manifest and private Function noindex. Extend scripts/audit-seo.mjs with build-output invariants and verify failure detection.
- [x] Content: improve src/content/cities.ts and city template with useful distinct buyer guidance; add a service-area hub, contextual links and visible breadcrumbs. Preserve design patterns and honest concept descriptions.
- [x] Performance/accessibility: use measured Lighthouse failures to fix critical rendering, image sizing, fonts, contrast and motion delays with minimal visual change.
- [x] Build, audit, run Brave local checks and every-page mobile/desktop Lighthouse; review diffs and document evidence, limitations and owner checklist in docs/SEO-MAX-PASS.md.
- [x] Commit logical groups, each after a successful npm run build.

## Review focus

- Crawlable noindex versus robots exclusions; Pages Functions do not inherit static headers.
- Exact sitemap/indexable-output parity and no orphaned pages or broken fragment links.
- Only verified business details; no invented address, reviews, client history or local office claims.
- JSON-LD must agree with visible FAQs, video and contact details.
- Lighthouse is lab evidence; production versus localhost is not a controlled field CWV comparison.

## Execution decisions

Proceed under the user's explicit implementation authorization. Use Playwright with the requested Brave executable. Preserve pre-existing .astro/settings.json, .codegraph, test-results and output work. No account access. Missing public business evidence is recorded for owner verification, not invented.
