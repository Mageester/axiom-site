# Concept demos

The concept sites shown on `/work/`. Each one is a fictional local business, built to make
someone say "wow, this is very impressive" on first look. They are labelled as concepts
everywhere and kept out of search.

## How they are built

Every demo is a static page on the main site, at `/work/<slug>/`.

- **One repo, one deploy.** No separate repositories, Workers or subdomains. A demo adds no
  hosting and no server compute: it is static files on the existing Cloudflare Pages project.
- **No photos or video.** Visuals are generated on the GPU, or drawn with SVG and CSS. That
  means nothing heavy in git, and each visual effect costs kilobytes.
- **One shared kit.** `_kit/` holds the motion libraries and GPU helpers. Vite puts shared code
  in hashed chunks cached forever, so a visitor downloads it once. The marketing site never
  loads any of it.

## Layout

```
src/demos/_kit/            shared kit: read every file before you start
src/demos/<slug>/          the demo's own code: main.ts, styles.css, shaders, scene code
src/pages/work/<slug>/index.astro    the page itself
```

A page looks like this:

```astro
---
import DemoLayout from '../../../demos/_kit/DemoLayout.astro';
import ConceptFooter from '../../../demos/_kit/ConceptFooter.astro';
import '../../../demos/example/styles.css';
---

<DemoLayout name="Example Co." title="Example Co. | What they do" description="One sentence." themeColor="#0b0b0f" pill="light">
  <header>...</header>
  <main id="main-content" tabindex="-1">
    <h1 data-reveal="lines" data-reveal-now>...</h1>
  </main>
  <footer>...</footer>
  <ConceptFooter name="Example Co." />
</DemoLayout>

<script>
  import '../../../demos/example/main.ts';
</script>
```

Put styles in the imported `styles.css`, not in an Astro `<style>` block: the dev server can
serve stale copies of those.

Fonts come from npm, so no font files enter git. Load only the Latin file, for example:

```css
@font-face {
  font-family: 'Fraunces';
  src: url('@fontsource-variable/fraunces/files/fraunces-latin-full-normal.woff2') format('woff2');
  font-weight: 100 900;
  font-display: swap;
}
```

## Rules

- **All content is real HTML in the page.** With JavaScript off or reduced motion on, everything
  must still be there and readable, and the canvas's parent shows a good-looking CSS stand-in.
  Use `data-reveal` for reveals. If you hide something in your own code, do it inside
  `if (!reducedMotion)`.
- **Nothing external.** The site's security policy blocks outside scripts, styles and fonts.
- **Keep it fast.** 60fps on a mid-range laptop and a usable effect on a phone. Use the kit's
  loops, which pause off screen. Do not animate layout properties on scroll.
- **Phones are first-class.** Check 390px wide. No sideways scroll, and tap targets of 44px or more.
  Anything pinned or horizontal on desktop must become a natural stack if it fights touch scrolling.
- **Accessible.** Semantic HTML, one `h1`, labelled controls, full keyboard use, visible focus,
  AA contrast, and `aria-live` for content that changes.

## Honesty

These are fictional businesses, and Axiom does not fabricate proof.

- No testimonials, reviews, star ratings, client counts, years in business, awards or logos.
- No statistics you cannot stand behind, like "98% satisfaction".
- Phone numbers use the reserved fictional range, like `(519) 555-0142`. Emails use `.example`
  domains. Street addresses are invented.
- Forms never send anything. On submit, show a tasteful confirmation that says this is a concept
  and nothing was sent.
- Copy reads like a real, confident business, in Canadian English. No lorem ipsum, and no
  builder-speak about the website itself.

## Checking your work

```bash
node scripts/demo-check.mjs <slug>
```

This drives the page in Chrome on the real GPU and writes screenshots to `test-results/demos/<slug>/`.
It reports frame rate, console errors, sideways scroll, outside requests and text left invisible.
Passing it is the minimum. Open the screenshots and judge them.

Closed panels should use the `hidden` attribute, which the check skips. If something is
deliberately invisible until an interaction and cannot use `hidden`, mark it `data-check-skip`.
