# Axiom Professional Site Upgrade Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Apply the approved preserved-palette conversion-authority direction to the public Axiom marketing site.

**Architecture:** Keep the existing Astro structure and shared design tokens. Update public-page content, page flow, CTA language, work/proof framing, pricing clarity, and SEO metadata without changing the live color palette or touching admin/backend/demo surfaces.

**Tech Stack:** Astro 6, React islands where already present, TypeScript, Tailwind utility classes, existing SEO helpers in `src/lib/seo.ts`.

---

## File Structure

- Modify `src/pages/index.astro`: rewrite homepage content and section sequence toward a clear sales argument.
- Modify `src/pages/work.astro`: frame concept builds as honest proof-of-standard demos with weakness/change/why-it-works.
- Modify `src/pages/pricing.astro`: simplify tier names, tier descriptions, comparison labels, FAQ copy, and CTAs.
- Modify `src/pages/services.astro`: make service cards read as buyer entry points.
- Modify `src/pages/services/[slug].astro`: strengthen service detail page explanation and final CTA.
- Modify `src/pages/about.astro`: keep the two-person story but make it proof of accountability.
- Modify `src/pages/contact.astro`, `src/pages/start.astro`, `src/pages/start-a-project.astro`, and `src/components/site/IntakeForm.astro`: make intake feel selective, clear, and easy to understand.
- Modify `src/lib/seo.ts`: align SEO titles/descriptions/schema copy with the new plainspoken buyer-language.
- Test with `npm run build`, `npm run audit:seo`, and browser checks of `/`, `/pricing`, `/services`, `/work`, `/contact`, and `/start-a-project`.

---

### Task 1: Homepage Sales Argument

**Files:**
- Modify: `src/pages/index.astro`
- Verify: `dist/index.html` after build

- [ ] **Step 1: Replace homepage copy constants**

Use buyer-led section copy. Keep current imagery and palette.

```ts
const marquee = [
  'Clear offer in seconds',
  'Proof beside the decision',
  'Fast on every phone',
  'Booking path made obvious',
  'Managed hosting and support',
  'Direct line to the makers',
  'Clean custom code',
  'Defined launch path',
] as const;
```

- [ ] **Step 2: Rewrite hero headline and lead**

Set the `h1` lines to:

```astro
<span class="ax-line"><span class="ax-line-inner ax-mask" style="--i: 1">A sharper digital</span></span>
<span class="ax-line"><span class="ax-line-inner ax-mask" style="--i: 2">presence for serious</span></span>
<span class="ax-line"><span class="ax-line-inner ax-mask" style="--i: 3"><em>local businesses.</em></span></span>
```

Set the lead to:

```astro
Axiom builds fast, high-trust sites that make the offer clear, place proof where buyers decide, and turn attention into qualified inquiries.
```

- [ ] **Step 3: Align the remaining homepage sections**

Use section headings that match the approved flow:

```txt
Problem: Buyers judge the business before they call.
Solution: Make the right action feel obvious.
Work: Demonstration builds, not invented case studies.
Services: Three focused paths.
Why Axiom: Built for businesses that cannot afford to look unclear.
Process: Review, scope, build, launch.
Studio: Two partners, direct accountability.
Final CTA: Start a serious project conversation.
```

- [ ] **Step 4: Build check**

Run: `npm run build`

Expected: Astro build completes with all public pages generated.

---

### Task 2: Work Page Proof Framing

**Files:**
- Modify: `src/pages/work.astro`

- [ ] **Step 1: Replace project data shape**

Each project should include:

```ts
originalWeakness: string;
axiomChanged: string;
whyItWorks: string;
```

- [ ] **Step 2: Render the three proof fields**

Each work card should show:

```astro
<p class="work-card-kicker">Original weakness</p>
<p class="work-card-detail">{p.originalWeakness}</p>
<p class="work-card-kicker">Axiom changed</p>
<p class="work-card-detail">{p.axiomChanged}</p>
<p class="work-card-kicker">Why it works</p>
<p class="work-card-detail">{p.whyItWorks}</p>
```

- [ ] **Step 3: Keep proof honest**

Hero and footer copy must say these are concept or demonstration builds, not client case studies.

- [ ] **Step 4: Build check**

Run: `npm run build`

Expected: Work page builds and still has one `h1`.

---

### Task 3: Pricing Clarity

**Files:**
- Modify: `src/pages/pricing.astro`
- Modify: `src/lib/seo.ts`

- [ ] **Step 1: Rename tiers**

Use:

```ts
name: 'Managed Site Partnership'
name: 'Ownership Build'
name: 'Custom Scope'
```

- [ ] **Step 2: Simplify tier copy**

Replace corporate language with buyer-readable descriptions:

```txt
Managed Site Partnership: Best when you want the site launched and looked after without a large upfront payment.
Ownership Build: Best when you want to buy the site outright and control the code at launch.
Custom Scope: Best for larger rebuilds, ecommerce, integrations, or migration work.
```

- [ ] **Step 3: Simplify comparison labels**

Use labels:

```ts
'Starting Cost'
'Best Fit'
'Hosting'
'Updates'
'Ownership'
'Timeline'
'Support'
```

- [ ] **Step 4: Rewrite FAQ answers**

Answers should be short, plainspoken, and direct. Avoid procurement phrases and keep price/ownership terms clear.

- [ ] **Step 5: Build and SEO audit**

Run:

```bash
npm run build
npm run audit:seo
```

Expected: both pass.

---

### Task 4: Services And Service Details

**Files:**
- Modify: `src/pages/services.astro`
- Modify: `src/pages/services/[slug].astro`
- Modify: `src/content/services.ts`

- [ ] **Step 1: Rewrite service content around buyer fit**

Each service should state:

```txt
Who this is for.
What is broken before Axiom.
What changes after Axiom.
What the buyer gets.
Which pricing path usually fits.
```

- [ ] **Step 2: Update service cards**

Cards should prioritize buyer fit and post-Axiom outcome. Keep icons and current card styling.

- [ ] **Step 3: Update service detail final CTA**

Use:

```txt
Tell us what is unclear, what needs to convert, and which path feels closest. We will reply with the right next step within one business day.
```

- [ ] **Step 4: Build check**

Run: `npm run build`

Expected: `/services` and all `/services/*` pages generate.

---

### Task 5: Trust, Intake, And Contact UX

**Files:**
- Modify: `src/pages/about.astro`
- Modify: `src/pages/contact.astro`
- Modify: `src/pages/start.astro`
- Modify: `src/pages/start-a-project.astro`
- Modify: `src/components/site/IntakeForm.astro`

- [ ] **Step 1: Reframe About**

The two-person story should prove accountability:

```txt
Direct access to the people doing the work.
Clear roles.
No account layers.
Defined response expectations.
Ongoing support after launch.
```

- [ ] **Step 2: Reframe Contact**

Contact should say project work starts with intake because it produces a clearer reply, while direct email/phone remain available.

- [ ] **Step 3: Reframe Start pages**

Use "Start a project conversation" language. Explain response time, what the buyer receives, and what information helps scope.

- [ ] **Step 4: Improve form microcopy**

Success and error copy should be calm and specific:

```txt
Success: We received the brief. We will review the business, the current site, and the right next step.
Error: The brief did not send. Please try again or email contact@getaxiom.ca.
```

- [ ] **Step 5: Build check**

Run: `npm run build`

Expected: Contact and start pages generate without form markup errors.

---

### Task 6: Final SEO And Browser Verification

**Files:**
- Modify: `src/lib/seo.ts`
- Verify: built `dist/` output

- [ ] **Step 1: Update metadata**

Ensure titles/descriptions are plainspoken, keyword-aware, and accurate. Keep title length under 65 characters and descriptions between 70 and 170 characters.

- [ ] **Step 2: Run production checks**

Run:

```bash
npm run build
npm run audit:seo
```

Expected: both pass.

- [ ] **Step 3: Browser review**

Open local preview or built pages and inspect:

```txt
/
/pricing
/services
/work
/contact
/start-a-project
```

Expected:

- Average business owner can understand the offer without technical knowledge.
- CTAs are consistent and obvious.
- Pricing choices are clear.
- Work is honest about concept/demo status.
- Mobile text and buttons do not overlap.
- Palette remains the current live palette.

- [ ] **Step 4: Commit**

Commit the implementation once checks pass:

```bash
git add src docs package.json astro.config.mjs .gitignore
git commit -m "Upgrade marketing site copy and UX"
```
