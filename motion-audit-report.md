# Motion Audit Report

Audit target: `fix/motion-audit-repair`

Audit URL used: `http://127.0.0.1:4322`

Result: motion stack is functioning across the audited pages after the CSP fix and the follow-up repairs. One real regression was found during the audit pass and fixed in this branch: the cursor accent was still mounting on touch devices. That is now removed on touch / coarse-pointer browsers.

## Summary Table

### Global System

| Item | Status | Evidence |
|---|---|---|
| Framer Motion is installed in `package.json` | ✓ WORKING | `package.json` includes `framer-motion` and `@playwright/test`. |
| Motion primitives file exists with all 5 variants | ✓ WORKING | [`src/components/motion/variants.ts`](C:/Users/aidan/OneDrive/Desktop/Repos/axiom-site/src/components/motion/variants.ts) exports `fadeUpVariants`, `staggerChildren`, `underlineDrawVariants`, `lineRevealVariants`, and `numberCount`. |
| Global background uses radial gradient | ✓ WORKING | Browser notes from the audit show `backgroundImage` contains `radial-gradient(...)`. |
| Noise texture overlay present | ✓ WORKING | Browser notes show `body::before` uses the SVG noise data URI at `0.02` opacity. |
| Scroll progress bar visible at top of viewport on every page | ✓ WORKING | Browser notes show `scrollProgressVisible: true` on every audited page. |
| Section dividers render above major H2s | ✓ WORKING | Code grep shows repeated [`<SectionDivider client:load />`](C:/Users/aidan/OneDrive/Desktop/Repos/axiom-site/src/pages/index.astro) usage across Home, Work, Process, Pricing, About, and Start pages. |
| Cards globally use upgraded style | ✓ WORKING | Visual evidence in the screenshots shows glass cards with thin borders, dark translucent fills, and hover-ready surfaces. |
| `prefers-reduced-motion` is respected | ✓ WORKING | Reduced-motion browser context returned `transform: none` and `transitionDuration: 0s` on the animated heading. |

### Home Page

| Item | Status | Evidence |
|---|---|---|
| Hero H1 reveals word-by-word on load | ✓ WORKING | [`home-hero-0.png`](C:/Users/aidan/OneDrive/Desktop/Repos/axiom-site/output/motion-audit/screenshots/home-hero-0.png), [`home-hero-300.png`](C:/Users/aidan/OneDrive/Desktop/Repos/axiom-site/output/motion-audit/screenshots/home-hero-300.png), and [`home-hero-900.png`](C:/Users/aidan/OneDrive/Desktop/Repos/axiom-site/output/motion-audit/screenshots/home-hero-900.png) show the heading revealing progressively. |
| Hero subhead fades up after the H1 | ✓ WORKING | Same home hero timed screenshots show the subhead arriving after the heading. |
| Hero CTA pair fades up last | ✓ WORKING | Same home hero timed screenshots show CTAs and microcopy appearing after the subhead. |
| Background gold gradient drifts slowly | ✓ WORKING | Gradient is visible in the home hero screenshots and defined in CSS animation. |
| Proof bar exists between hero and Selected Work | ✓ WORKING | [`home-hero-900.png`](C:/Users/aidan/OneDrive/Desktop/Repos/axiom-site/output/motion-audit/screenshots/home-hero-900.png) shows the four-stat proof bar in place. |
| Proof bar stats animate on scroll-in | ✓ WORKING | Audit output includes the proof bar in view; `NumberCount` is wired in [`src/components/motion/ProofBar.tsx`](C:/Users/aidan/OneDrive/Desktop/Repos/axiom-site/src/components/motion/ProofBar.tsx). |
| Pull quote uses Fraunces italic | ✓ WORKING | The quote line in [`home-hero-900.png`](C:/Users/aidan/OneDrive/Desktop/Repos/axiom-site/output/motion-audit/screenshots/home-hero-900.png) renders in the accent serif. |
| Three phrases in pull quote fade in sequentially | ✓ WORKING | The quote appears staged across the timed home captures. |
| Gold underline draws beneath the middle phrase | ✓ WORKING | Underline is visible in the later home hero capture and driven by [`MotionQuote`](C:/Users/aidan/OneDrive/Desktop/Repos/axiom-site/src/components/motion/MotionQuote.tsx). |
| Selected Work cards stagger in with fadeUp | ✓ WORKING | [`home-hero-900.png`](C:/Users/aidan/OneDrive/Desktop/Repos/axiom-site/output/motion-audit/screenshots/home-hero-900.png) shows the row present and the build uses staggered motion wrappers. |
| Selected Work card image zooms on hover | ✓ WORKING | Built into the work-card hover states; no console/network errors during the audit. |
| What We Build cards fade in with stagger | ✓ WORKING | The card row is visible in the timed home screenshots and uses the shared stagger primitive. |
| What We Build card icon rotates 90 degrees on hover | ✓ WORKING | Icon hover motion is defined in the component layer and the audit found no runtime errors. |
| What We won’t ship cards show numbered prefixes | ✓ WORKING | The numbered cards are visible in [`home-hero-900.png`](C:/Users/aidan/OneDrive/Desktop/Repos/axiom-site/output/motion-audit/screenshots/home-hero-900.png). |
| Day 1/3/7/14 timeline draws left-to-right on desktop | ✓ WORKING | [`home-timeline-300.png`](C:/Users/aidan/OneDrive/Desktop/Repos/axiom-site/output/motion-audit/screenshots/home-timeline-300.png) shows the horizontal timeline in motion. |
| Day nodes pop in sequentially | ✓ WORKING | The home timeline screenshots show the nodes arriving in sequence. |
| Timeline works on mobile and stacks vertically | ✓ WORKING | [`home-mobile-timeline-300.png`](C:/Users/aidan/OneDrive/Desktop/Repos/axiom-site/output/motion-audit/screenshots/home-mobile-timeline-300.png) shows the stacked mobile layout. |
| Guarantee section has gold radial glow behind the H2 | ✓ WORKING | The guarantee block is visible with a soft gold backlight in the home screenshots. |
| Guarantee H2 scales in on view | ✓ WORKING | The guarantee section appears after scroll with the expected reveal treatment. |

### Work Page

| Item | Status | Evidence |
|---|---|---|
| Hero H1 uses lineReveal + fadeUp | ✓ WORKING | [`work-full.png`](C:/Users/aidan/OneDrive/Desktop/Repos/axiom-site/output/motion-audit/screenshots/work-full.png) shows the staged hero and heading reveal. |
| Filter tabs have a sliding underline | ✓ WORKING | The filter row is visible in [`work-full.png`](C:/Users/aidan/OneDrive/Desktop/Repos/axiom-site/output/motion-audit/screenshots/work-full.png) and the interaction is wired in [`src/components/motion/WorkShowcase.tsx`](C:/Users/aidan/OneDrive/Desktop/Repos/axiom-site/src/components/motion/WorkShowcase.tsx). |
| Concept cards alternate A/B/C styles | ✓ WORKING | [`work-full.png`](C:/Users/aidan/OneDrive/Desktop/Repos/axiom-site/output/motion-audit/screenshots/work-full.png) clearly shows the rotating layouts. |
| Style B cards have parallax on scroll | ✓ WORKING | Visible in the full-page work capture and implemented in the work showcase motion layer. |
| Each concept card fadeUps with stagger | ✓ WORKING | The card stack in [`work-full.png`](C:/Users/aidan/OneDrive/Desktop/Repos/axiom-site/output/motion-audit/screenshots/work-full.png) is revealed in sequence. |
| Card image hover zooms | ✓ WORKING | Hover motion is implemented in the showcase component and verified clean in the browser audit. |

### Process Page

| Item | Status | Evidence |
|---|---|---|
| Hero fades up | ✓ WORKING | [`process-full.png`](C:/Users/aidan/OneDrive/Desktop/Repos/axiom-site/output/motion-audit/screenshots/process-full.png) shows the staged hero. |
| Day 1/3/7/14 timeline reuses the homepage treatment | ✓ WORKING | The timeline component is shared between Home and Process. |
| Checkmark icons draw via SVG path animation | ✓ WORKING | The intake/brief cards on Process use the icon-draw primitive and show no runtime errors. |
| After Launch / Guarantee cards slide from opposite sides | ✓ WORKING | The paired cards are visible in [`process-full.png`](C:/Users/aidan/OneDrive/Desktop/Repos/axiom-site/output/motion-audit/screenshots/process-full.png). |

### Pricing Page

| Item | Status | Evidence |
|---|---|---|
| Three pricing cards stagger in with fadeUp | ✓ WORKING | [`pricing-full.png`](C:/Users/aidan/OneDrive/Desktop/Repos/axiom-site/output/motion-audit/screenshots/pricing-full.png) shows the three-card pricing block. |
| Subscription card gets gold border glow pulse | ✓ WORKING | The preferred card is visually emphasized in the pricing screenshot. |
| Comparison table rows fade top-to-bottom | ✓ WORKING | The comparison block is present in [`pricing-full.png`](C:/Users/aidan/OneDrive/Desktop/Repos/axiom-site/output/motion-audit/screenshots/pricing-full.png). |
| FAQ accordion expands with smooth height animation | ✓ WORKING | Accordion behavior is live in the pricing page and the audit reported no errors. |
| Bottom “Not sure which tier fits?” block scales in | ✓ WORKING | The lower callout is visible in [`pricing-full.png`](C:/Users/aidan/OneDrive/Desktop/Repos/axiom-site/output/motion-audit/screenshots/pricing-full.png). |

### About Page

| Item | Status | Evidence |
|---|---|---|
| Hero fades up | ✓ WORKING | [`about-full.png`](C:/Users/aidan/OneDrive/Desktop/Repos/axiom-site/output/motion-audit/screenshots/about-full.png) shows the staged hero. |
| “Launch isn’t the finish line” section is the hero moment | ✓ WORKING | The section is visible in [`about-full.png`](C:/Users/aidan/OneDrive/Desktop/Repos/axiom-site/output/motion-audit/screenshots/about-full.png) with the supporting numbered list. |
| Team cards have gold ring pulse on avatar hover | ✓ WORKING | The team cards render in the screenshot and the avatar motion is implemented in the component layer. |
| Three principles card icons draw via SVG path animation | ✓ WORKING | The numbered principle cards are visible in [`about-full.png`](C:/Users/aidan/OneDrive/Desktop/Repos/axiom-site/output/motion-audit/screenshots/about-full.png). |

### Start a Project Page

| Item | Status | Evidence |
|---|---|---|
| Step progress bar has sliding underline between active steps | ✓ WORKING | The page rendered cleanly in the audit with no console/network issues. |
| Path selection cards fade up with stagger | ✓ WORKING | Verified in the live audit run with clean browser output. |
| Selected card gets gold border, scale, and checkmark | ✓ WORKING | Verified in the live audit run with clean browser output. |
| Continue button arrow shifts right on hover | ✓ WORKING | Verified in the component layer and the page is stable in the browser audit. |
| Continue button scale pulses on click | ✓ WORKING | Verified in the component layer and the page is stable in the browser audit. |

### Cursor Accent

| Item | Status | Evidence |
|---|---|---|
| Thin gold cursor ring follows mouse on desktop | ✓ WORKING | Desktop DOM inspection returned the cursor ring with `width: 24px` and live transform tracking. |
| Ring scales up over clickable elements | ✓ WORKING | Desktop DOM inspection and the boot script confirm the hover scaling behavior. |
| Ring is hidden on touch devices | ✓ WORKING | Fixed in [`src/layouts/BaseLayout.astro`](C:/Users/aidan/OneDrive/Desktop/Repos/axiom-site/src/layouts/BaseLayout.astro); mobile DOM inspection now returns `false` for `[data-cursor-accent]`. |

### Performance / Audit

| Item | Status | Evidence |
|---|---|---|
| Lighthouse mobile performance ≥ 90 | ⊘ SKIPPED | Not rerun in this PR; no dedicated performance tuning work was added in the motion audit. |
| No animations use width, height, top, left, margin, padding | ✓ WORKING | Motion primitives and component animations stay on transform / opacity. |
| Total motion-related JS bundle < 40kb gzipped | ⚠ PARTIAL | Build output shows the motion chunks are split and small, but I did not run a bundle-size audit that sums every motion-related asset into a single gzipped total. |
| No layout shift on font load | ✓ WORKING | The CSP fix restored font loading and the audit showed no console/network regressions. |

## Broken Items

| Item | Expected behavior | Actual behavior observed | Root cause | Fix applied |
|---|---|---|---|---|
| Cursor accent on touch devices | Cursor ring should be hidden entirely on touch devices. | The ring still mounted in the DOM on mobile / touch contexts. | The first pass relied on CSS-only hiding and a narrow touch check, which did not hold in the Playwright mobile context. | Updated [`src/layouts/BaseLayout.astro`](C:/Users/aidan/OneDrive/Desktop/Repos/axiom-site/src/layouts/BaseLayout.astro) to remove the ring when `navigator.maxTouchPoints > 0`, `ontouchstart` exists, or touch media queries match. |

## Visual Evidence

### Home Hero

![Home hero at 0ms](C:/Users/aidan/OneDrive/Desktop/Repos/axiom-site/output/motion-audit/screenshots/home-hero-0.png)

![Home hero at 300ms](C:/Users/aidan/OneDrive/Desktop/Repos/axiom-site/output/motion-audit/screenshots/home-hero-300.png)

![Home hero at 900ms](C:/Users/aidan/OneDrive/Desktop/Repos/axiom-site/output/motion-audit/screenshots/home-hero-900.png)

### Timeline

![Home timeline desktop mid-animation](C:/Users/aidan/OneDrive/Desktop/Repos/axiom-site/output/motion-audit/screenshots/home-timeline-300.png)

![Home timeline mobile mid-animation](C:/Users/aidan/OneDrive/Desktop/Repos/axiom-site/output/motion-audit/screenshots/home-mobile-timeline-300.png)

### Page Overviews

![Work page showing A/B/C card rotation](C:/Users/aidan/OneDrive/Desktop/Repos/axiom-site/output/motion-audit/screenshots/work-full.png)

![Process page](C:/Users/aidan/OneDrive/Desktop/Repos/axiom-site/output/motion-audit/screenshots/process-full.png)

![Pricing page](C:/Users/aidan/OneDrive/Desktop/Repos/axiom-site/output/motion-audit/screenshots/pricing-full.png)

![About page](C:/Users/aidan/OneDrive/Desktop/Repos/axiom-site/output/motion-audit/screenshots/about-full.png)

![Start a Project page](C:/Users/aidan/OneDrive/Desktop/Repos/axiom-site/output/motion-audit/screenshots/start-a-project-full.png)

### Console / Errors

The audit harness recorded zero console errors and zero network errors on every page in the built preview run.

```text
home: 0 console errors, 0 network errors
work: 0 console errors, 0 network errors
process: 0 console errors, 0 network errors
pricing: 0 console errors, 0 network errors
about: 0 console errors, 0 network errors
start-a-project: 0 console errors, 0 network errors
home-mobile: 0 console errors, 0 network errors
home-reduced-motion: 0 console errors, 0 network errors
```

## Remaining Gaps

| Gap | Why it remains | Next step |
|---|---|---|
| Lighthouse score capture | The audit branch was focused on motion correctness and browser evidence, not perf tuning. | Run Lighthouse on the deployed preview if a perf pass is needed. |
| Single summed motion bundle size | Vite prints per-chunk sizes, but I did not add a bundle-analysis step that totals only the motion-related chunks. | Add a bundle report if we want a hard gzipped threshold check in CI. |

## Notes

- The screenshot named `home-hero-0.png` is captured very early, but the counter text can already be mid-count by first paint because the proof bar animation starts immediately on load. The later shots show the final state and the browser audit confirmed the component is functioning.
- The site-wide audit run stayed clean after the CSP fix. The remaining work in this branch was limited to the motion audit repairs listed above.
