# Phase 0 Lighthouse Baseline

## Notes
- Scores below are taken from the raw JSON in `docs/audit/lighthouse/`.
- `pricing-mobile.json` captured a bad run with Performance `0`; `pricing-mobile-rerun.json` is the usable baseline and is the score used below.
- 404 SEO is low by design because the page is blocked from indexing.

| Route | Mobile Perf | Mobile A11y | Mobile Best | Mobile SEO | Desktop Perf | Desktop A11y | Desktop Best | Desktop SEO |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| `/` | 64 | 96 | 100 | 100 | 94 | 95 | 100 | 100 |
| `/about` | 67 | 96 | 100 | 100 | 95 | 95 | 100 | 100 |
| `/contact` | 68 | 96 | 100 | 100 | 96 | 96 | 100 | 100 |
| `/pricing` | 66 | 96 | 100 | 100 | 95 | 96 | 100 | 100 |
| `/privacy` | 68 | 96 | 100 | 100 | 96 | 95 | 100 | 100 |
| `/process` | 66 | 94 | 100 | 100 | 95 | 93 | 100 | 100 |
| `/start` | 66 | 96 | 96 | 100 | 95 | 96 | 96 | 100 |
| `/start-a-project` | 67 | 96 | 100 | 100 | 96 | 96 | 100 | 100 |
| `/terms` | 67 | 96 | 100 | 100 | 96 | 95 | 100 | 100 |
| `/work` | 64 | 94 | 100 | 100 | 94 | 94 | 100 | 100 |
| `/404` | 68 | 96 | 100 | 69 | 96 | 95 | 100 | 69 |

## Fast Read
- Mobile performance baseline is currently the weakest category and sits far below the target on every public route.
- Accessibility is close to passing numerically on many routes, but none of the key public routes audited at 94–96 are ready to be treated as complete.
- Best Practices is mostly strong already.
- SEO is artificially inflated on the routes that exist today, but the site is missing major route and metadata primitives required by the approved IA.
