# Phase 0 Lighthouse Baseline

Date: 2026-04-24
Command source: local Astro preview at `http://127.0.0.1:4321`
Raw reports: `docs/audit/lighthouse/*.json`

Some Lighthouse CLI invocations returned exit code 1 due to Windows temp-directory cleanup errors and `NO_LCP` traces. JSON reports were still written for all routes. `NA` means the category or metric was unavailable in the captured JSON.

| Route/report | Perf | A11y | Best | SEO | LCP ms | CLS | TBT ms |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| `/404.html` desktop | 98 | 95 | 100 | 69 | 889 | 0.000033 | 0 |
| `/404.html` mobile | NA | 96 | 100 | 69 | NA | 0 | NA |
| `/about/` desktop | 98 | 95 | 100 | 100 | 906 | 0.000033 | 0 |
| `/about/` mobile | NA | 96 | 100 | 100 | NA | 0 | NA |
| `/admin-shell/` desktop | 98 | 94 | 100 | 66 | 864 | 0.000096 | 0 |
| `/admin-shell/` mobile | NA | NA | NA | NA | NA | NA | NA |
| `/contact/` desktop | 98 | 96 | 100 | 100 | 900 | 0.000033 | 0 |
| `/contact/` mobile | 87 | 96 | 100 | 100 | 3182 | 0 | 0 |
| `/` desktop | 96 | 95 | 100 | 100 | 1089 | 0.000037 | 0 |
| `/` mobile | NA | 96 | 100 | 100 | NA | 0 | NA |
| `/pricing/` desktop | 98 | 96 | 100 | 100 | 886 | 0.000033 | 0 |
| `/pricing/` mobile | NA | 96 | 100 | 100 | NA | 0 | NA |
| `/privacy/` desktop | 98 | 95 | 100 | 100 | 901 | 0.000033 | 0 |
| `/privacy/` mobile | NA | 96 | 100 | 100 | NA | 0 | NA |
| `/process/` desktop | 98 | 93 | 100 | 100 | 910 | 0.000033 | 0 |
| `/process/` mobile | NA | 94 | 100 | 100 | NA | 0 | NA |
| `/start-a-project/` desktop | 98 | 96 | 100 | 100 | 916 | 0.000033 | 0 |
| `/start-a-project/` mobile | 84 | 96 | 100 | 100 | 3178 | 0 | 0 |
| `/start/` desktop | 97 | 96 | 96 | 100 | 958 | 0.000033 | 0 |
| `/start/` mobile | NA | 96 | 96 | 100 | NA | 0 | NA |
| `/terms/` desktop | 98 | 95 | 100 | 100 | 895 | 0.000033 | 0 |
| `/terms/` mobile | NA | 96 | 100 | 100 | NA | 0 | NA |
| `/work/` desktop | 98 | 94 | 100 | 100 | 953 | 0.000033 | 0 |
| `/work/` mobile | NA | 94 | 100 | 100 | NA | 0 | NA |

## Observations

- Desktop baseline is strong but not yet at final acceptance on accessibility for several pages.
- Mobile Lighthouse is unreliable in this local Windows run due to `NO_LCP`; Phase 10 should add a stable Playwright/Lighthouse harness or CI environment.
- `/contact/` and `/start-a-project/` mobile reports that did compute miss the Phase 6 target of Performance >= 95 and LCP < 2.0s.
- 404 and admin-shell SEO scores are low; 404 is expected to be noindex but should still be intentionally configured.
