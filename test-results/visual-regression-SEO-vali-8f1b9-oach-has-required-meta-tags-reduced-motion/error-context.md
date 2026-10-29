# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: visual-regression.spec.ts >> SEO validation >> approach has required meta tags
- Location: tests\visual-regression.spec.ts:37:5

# Error details

```
Error: expect(locator).toHaveCount(expected) failed

Locator:  locator('h1')
Expected: 1
Received: 5
Timeout:  5000ms

Call log:
  - Expect "toHaveCount" with timeout 5000ms
  - waiting for locator('h1')
    9 × locator resolved to 5 elements
      - unexpected value "5"

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - link "Skip to content" [ref=e2]:
    - /url: "#main-content"
  - banner [ref=e3]:
    - generic [ref=e4]:
      - link "Axiom Web home" [ref=e5]:
        - /url: /
        - text: axiom
        - generic [ref=e6]: web
      - navigation "Primary" [ref=e7]:
        - list [ref=e8]:
          - listitem [ref=e9]:
            - link "Services" [ref=e10]:
              - /url: /services/
          - listitem [ref=e11]:
            - link "Work" [ref=e12]:
              - /url: /work/
          - listitem [ref=e13]:
            - link "Pricing" [ref=e14]:
              - /url: /pricing/
          - listitem [ref=e15]:
            - link "Process" [ref=e16]:
              - /url: /approach/
          - listitem [ref=e17]:
            - link "About" [ref=e18]:
              - /url: /about/
          - listitem [ref=e19]:
            - link "Contact" [ref=e20]:
              - /url: /contact/
      - link "Start a project" [ref=e22]:
        - /url: /start-a-project/
  - main [ref=e23]:
    - generic [ref=e25]:
      - navigation "Breadcrumb" [ref=e26]:
        - list [ref=e27]:
          - listitem [ref=e28]:
            - link "Home" [ref=e29]:
              - /url: /
          - listitem [ref=e30]:
            - generic [ref=e31]: /
            - generic [ref=e32]: Process
      - generic [ref=e33]:
        - generic [ref=e34]:
          - paragraph [ref=e35]: Process
          - heading "How a website project works" [level=1] [ref=e36]:
            - text: How a website project
            - emphasis [ref=e37]: works
          - paragraph [ref=e38]: Four clear steps from first conversation to launch. Standard packages usually go live in two to four weeks, with the scope and price agreed in writing before design starts.
          - generic [ref=e39]:
            - link "Start a project" [ref=e40]:
              - /url: /start-a-project/
              - text: Start a project
              - img [ref=e41]
            - link "See pricing" [ref=e43]:
              - /url: /pricing/
        - list "Process overview" [ref=e45]:
          - listitem [ref=e46]:
            - generic [ref=e47]: "01"
            - generic [ref=e48]: Review
            - generic [ref=e49]: Week 1
          - listitem [ref=e50]:
            - generic [ref=e51]: "02"
            - generic [ref=e52]: Scope
            - generic [ref=e53]: Week 2
          - listitem [ref=e54]:
            - generic [ref=e55]: "03"
            - generic [ref=e56]: Design & build
            - generic [ref=e57]: Weeks 2–3
          - listitem [ref=e58]:
            - generic [ref=e59]: "04"
            - generic [ref=e60]: Launch & support
            - generic [ref=e61]: Weeks 3–4
    - region "What happens, and when" [ref=e62]:
      - generic [ref=e63]:
        - generic [ref=e64]:
          - paragraph [ref=e65]: Step by step
          - heading "What happens, and when" [level=2] [ref=e66]
          - paragraph [ref=e67]: Each step has a clear output and a clear decision, so you always know where the project stands and what comes next.
        - list [ref=e68]:
          - listitem [ref=e69]:
            - generic [ref=e71]: "01"
            - generic [ref=e72]:
              - paragraph [ref=e73]: Step 01 · Week 1
              - heading "Review" [level=3] [ref=e74]
              - paragraph [ref=e75]: We look at your business, your current site and how customers find and choose you, then agree what the new site has to do.
              - generic [ref=e76]:
                - generic [ref=e77]:
                  - heading "What happens" [level=4] [ref=e78]
                  - list [ref=e79]:
                    - listitem [ref=e80]: A conversation about your services, customers and goals
                    - listitem [ref=e81]: A review of your current site, if you have one
                    - listitem [ref=e82]: A recommended package and next step
                - generic [ref=e83]:
                  - heading "What we need from you" [level=4] [ref=e84]
                  - paragraph [ref=e85]: Share your current site, your main services and what you want visitors to do.
          - listitem [ref=e86]:
            - generic [ref=e88]: "02"
            - generic [ref=e89]:
              - paragraph [ref=e90]: Step 02 · Week 2
              - heading "Scope" [level=3] [ref=e91]
              - paragraph [ref=e92]: We confirm the pages, contact paths, content and price in writing before design starts. Decisions happen here, not mid-build.
              - generic [ref=e93]:
                - generic [ref=e94]:
                  - heading "What happens" [level=4] [ref=e95]
                  - list [ref=e96]:
                    - listitem [ref=e97]: A written scope with a fixed project price
                    - listitem [ref=e98]: Page list and the main action for each page
                    - listitem [ref=e99]: A simple checklist of the content we need from you
                - generic [ref=e100]:
                  - heading "What we need from you" [level=4] [ref=e101]
                  - paragraph [ref=e102]: Approve the scope, sign the agreement and pay the 50% deposit.
          - listitem [ref=e103]:
            - generic [ref=e105]: "03"
            - generic [ref=e106]:
              - paragraph [ref=e107]: Step 03 · Weeks 2–3
              - heading "Design & build" [level=3] [ref=e108]
              - paragraph [ref=e109]: We design and build the full site from your material, edit the copy for clarity and share a private staging link for review.
              - generic [ref=e110]:
                - generic [ref=e111]:
                  - heading "What happens" [level=4] [ref=e112]
                  - list [ref=e113]:
                    - listitem [ref=e114]: Custom design and development for every agreed page
                    - listitem [ref=e115]: Mobile layout, speed and accessibility built in from the start
                    - listitem [ref=e116]: Two consolidated revision rounds on the staging site
                - generic [ref=e117]:
                  - heading "What we need from you" [level=4] [ref=e118]
                  - paragraph [ref=e119]: Send logo, photos and text, then gather feedback into each revision round.
          - listitem [ref=e120]:
            - generic [ref=e122]: "04"
            - generic [ref=e123]:
              - paragraph [ref=e124]: Step 04 · Weeks 3–4
              - heading "Launch & support" [level=3] [ref=e125]
              - paragraph [ref=e126]: We test on real devices, connect your domain, set up the SEO basics and go live — then stay on hand for thirty days.
              - generic [ref=e127]:
                - generic [ref=e128]:
                  - heading "What happens" [level=4] [ref=e129]
                  - list [ref=e130]:
                    - listitem [ref=e131]: Launch testing of pages, forms and links across devices
                    - listitem [ref=e132]: Domain connection and first-year basic hosting
                    - listitem [ref=e133]: Thirty days of post-launch defect support
                - generic [ref=e134]:
                  - heading "What we need from you" [level=4] [ref=e135]
                  - paragraph [ref=e136]: Approve the staging site and pay the remaining 50% before launch.
    - region "The rules every site follows" [ref=e137]:
      - generic [ref=e138]:
        - generic [ref=e139]:
          - paragraph [ref=e140]: Our standards
          - heading "The rules every site follows" [level=2] [ref=e141]
          - paragraph [ref=e142]: Whatever the package, these principles shape every page we design and build.
        - list [ref=e143]:
          - listitem [ref=e144]:
            - generic [ref=e145]: "01"
            - heading "Written in your customers’ language" [level=3] [ref=e146]
            - paragraph [ref=e147]: Pages explain what you do and why it matters in plain words, not industry jargon or technical detail.
          - listitem [ref=e148]:
            - generic [ref=e149]: "02"
            - heading "Honest proof only" [level=3] [ref=e150]
            - paragraph [ref=e151]: Reviews, results and credentials appear only when they are real and you can stand behind them. Concepts are labelled as concepts.
          - listitem [ref=e152]:
            - generic [ref=e153]: "03"
            - heading "Phone first, always" [level=3] [ref=e154]
            - paragraph [ref=e155]: Layouts, tap targets, forms and image crops are judged on a phone first, because that is where most local decisions happen.
          - listitem [ref=e156]:
            - generic [ref=e157]: "04"
            - heading "One clear next step" [level=3] [ref=e158]
            - paragraph [ref=e159]: Every page leads to a single, obvious action, whether that is a call, a booking or a quote request.
    - region "Process questions" [ref=e160]:
      - generic [ref=e161]:
        - generic [ref=e162]:
          - paragraph [ref=e163]: FAQ
          - heading "Process questions" [level=2] [ref=e164]
          - paragraph [ref=e165]:
            - text: More about pricing and payments is on the
            - link "pricing page" [ref=e166]:
              - /url: /pricing/
            - text: .
        - generic [ref=e167]:
          - group [ref=e168]:
            - generic "What counts as a revision round?" [ref=e169]:
              - heading "What counts as a revision round?" [level=3] [ref=e170]
              - img [ref=e172]
          - group [ref=e173]:
            - generic "What if my content isn’t ready yet?" [ref=e174]:
              - heading "What if my content isn’t ready yet?" [level=3] [ref=e175]
              - img [ref=e177]
          - group [ref=e178]:
            - generic "Do we need to meet in person?" [ref=e179]:
              - heading "Do we need to meet in person?" [level=3] [ref=e180]
              - img [ref=e182]
          - group [ref=e183]:
            - generic "What happens after launch?" [ref=e184]:
              - heading "What happens after launch?" [level=3] [ref=e185]
              - img [ref=e187]
    - region "Let’s make yours." [ref=e188]:
      - generic [ref=e189]:
        - generic [ref=e190]:
          - heading "Let’s make yours." [level=2] [ref=e192]:
            - text: Let’s make
            - emphasis [ref=e193]: yours.
          - link "Start a project" [ref=e194]:
            - /url: /start-a-project/
            - generic [ref=e195]:
              - text: Start a
              - text: project
        - generic [ref=e196]:
          - generic [ref=e197]:
            - generic [ref=e198]: contact@axiominternational.ca
            - button "Copy" [ref=e199]
            - link "Email contact@axiominternational.ca" [ref=e200]:
              - /url: mailto:contact@axiominternational.ca
          - generic [ref=e201]:
            - link "(226) 753-1833" [ref=e202]:
              - /url: tel:+12267531833
            - generic [ref=e203]: 257 Kipling Ave, Kitchener, ON
  - contentinfo [ref=e204]:
    - generic [ref=e205]:
      - generic [ref=e206]:
        - generic [ref=e207]:
          - link "Axiom Web home" [ref=e208]:
            - /url: /
            - text: axiom
            - generic [ref=e209]: web
          - paragraph [ref=e210]: A two-person web studio in Kitchener-Waterloo. Websites for local businesses across Ontario, and quiet overflow work for agencies.
          - list [ref=e211]:
            - listitem [ref=e212]:
              - link "contact@ axiominternational.ca" [ref=e213]:
                - /url: mailto:contact@axiominternational.ca
                - text: contact@
                - text: axiominternational.ca
            - listitem [ref=e214]:
              - link "(226) 753-1833" [ref=e215]:
                - /url: tel:+12267531833
            - listitem [ref=e216]:
              - generic [ref=e217]: 257 Kipling Ave, Kitchener, ON
        - navigation "Footer" [ref=e218]:
          - generic [ref=e219]:
            - heading "Services" [level=2] [ref=e220]
            - list [ref=e221]:
              - listitem [ref=e222]:
                - link "Local Business Websites" [ref=e223]:
                  - /url: /services/local-business-websites/
              - listitem [ref=e224]:
                - link "Conversion-Focused Web Design" [ref=e225]:
                  - /url: /services/conversion-sites/
              - listitem [ref=e226]:
                - link "Website Redesigns" [ref=e227]:
                  - /url: /services/rebuilds/
              - listitem [ref=e228]:
                - link "All services" [ref=e229]:
                  - /url: /services/
              - listitem [ref=e230]:
                - link "Pricing" [ref=e231]:
                  - /url: /pricing/
          - generic [ref=e232]:
            - heading "Studio" [level=2] [ref=e233]
            - list [ref=e234]:
              - listitem [ref=e235]:
                - link "About" [ref=e236]:
                  - /url: /about/
              - listitem [ref=e237]:
                - link "Our process" [ref=e238]:
                  - /url: /approach/
              - listitem [ref=e239]:
                - link "Work" [ref=e240]:
                  - /url: /work/
              - listitem [ref=e241]:
                - link "For agencies" [ref=e242]:
                  - /url: /agencies/
              - listitem [ref=e243]:
                - link "Contact" [ref=e244]:
                  - /url: /contact/
              - listitem [ref=e245]:
                - link "Start a project" [ref=e246]:
                  - /url: /start-a-project/
          - generic [ref=e247]:
            - heading "Industries" [level=2] [ref=e248]
            - list [ref=e249]:
              - listitem [ref=e250]:
                - link "Contractors & home services" [ref=e251]:
                  - /url: /industries/home-services/
              - listitem [ref=e252]:
                - link "Clinics & health practices" [ref=e253]:
                  - /url: /industries/health-clinics/
              - listitem [ref=e254]:
                - link "Salons, spas & barbers" [ref=e255]:
                  - /url: /industries/salons-personal-care/
              - listitem [ref=e256]:
                - link "Restaurants & cafés" [ref=e257]:
                  - /url: /industries/restaurants-hospitality/
              - listitem [ref=e258]:
                - link "Law & professional services" [ref=e259]:
                  - /url: /industries/professional-services/
              - listitem [ref=e260]:
                - link "All industries" [ref=e261]:
                  - /url: /industries/
          - generic [ref=e262]:
            - heading "Service areas" [level=2] [ref=e263]
            - list [ref=e264]:
              - listitem [ref=e265]:
                - link "Web design Kitchener" [ref=e266]:
                  - /url: /web-design/kitchener/
              - listitem [ref=e267]:
                - link "Web design Waterloo" [ref=e268]:
                  - /url: /web-design/waterloo/
              - listitem [ref=e269]:
                - link "Web design Cambridge" [ref=e270]:
                  - /url: /web-design/cambridge/
              - listitem [ref=e271]:
                - link "Web design Guelph" [ref=e272]:
                  - /url: /web-design/guelph/
              - listitem [ref=e273]:
                - link "Web design Hamilton" [ref=e274]:
                  - /url: /web-design/hamilton/
              - listitem [ref=e275]:
                - link "All service areas" [ref=e276]:
                  - /url: /web-design/
      - generic [ref=e277]:
        - paragraph [ref=e278]: © 2026 Axiom Web. Co-founded by Aidan Magee and Riley Hinsperger. Axiom Web is the web-focused subsidiary of Axiom International.
        - list [ref=e279]:
          - listitem [ref=e280]:
            - link "Privacy Policy" [ref=e281]:
              - /url: /privacy/
          - listitem [ref=e282]:
            - link "Terms of Service" [ref=e283]:
              - /url: /terms/
  - generic [ref=e286]:
    - button "Menu" [ref=e287]:
      - img [ref=e289]
      - generic: Menu
    - button "Inspect" [ref=e293]:
      - img [ref=e295]
      - generic: Inspect
    - button "Audit" [ref=e297]:
      - generic [ref=e298]:
        - img [ref=e299]
        - img [ref=e302]
      - generic: Audit
    - button "Settings" [ref=e305]:
      - img [ref=e307]
      - generic: Settings
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | 
  3   | // Snapshots are platform-specific: regenerate with `npm run test:visual:update` after design changes.
  4   | const PUBLIC_PAGES = [
  5   |   { name: 'home', path: '/' },
  6   |   { name: 'services', path: '/services/' },
  7   |   { name: 'work', path: '/work/' },
  8   |   { name: 'pricing', path: '/pricing/' },
  9   |   { name: 'approach', path: '/approach/' },
  10  |   { name: 'about', path: '/about/' },
  11  |   { name: 'industries', path: '/industries/' },
  12  |   { name: 'contact', path: '/contact/' },
  13  |   { name: 'start-a-project', path: '/start-a-project/' },
  14  | ] as const;
  15  | 
  16  | for (const { name, path } of PUBLIC_PAGES) {
  17  |   test.describe(`${name} page`, () => {
  18  |     // Snapshots capture the static design: with reduced motion the liquid lens
  19  |     // stays on its rendered poster and the custom cursor is off, so the
  20  |     // WebGL animation cannot make a pixel comparison flake.
  21  |     test.use({ reducedMotion: 'reduce' });
  22  | 
  23  |     test(`renders above the fold`, async ({ page }) => {
  24  |       await page.goto(path, { waitUntil: 'networkidle' });
  25  |       await expect(page).toHaveScreenshot(`${name}-above-fold.png`, { fullPage: false });
  26  |     });
  27  | 
  28  |     test(`renders full page`, async ({ page }) => {
  29  |       await page.goto(path, { waitUntil: 'networkidle' });
  30  |       await expect(page).toHaveScreenshot(`${name}-full-page.png`, { fullPage: true });
  31  |     });
  32  |   });
  33  | }
  34  | 
  35  | test.describe('SEO validation', () => {
  36  |   for (const { name, path } of PUBLIC_PAGES) {
  37  |     test(`${name} has required meta tags`, async ({ page }) => {
  38  |       await page.goto(path, { waitUntil: 'domcontentloaded' });
  39  | 
  40  |       const title = await page.title();
  41  |       expect(title.length).toBeGreaterThan(10);
  42  |       expect(title.length).toBeLessThanOrEqual(65);
  43  | 
  44  |       const description = await page.getAttribute('meta[name="description"]', 'content');
  45  |       expect(description!.length).toBeGreaterThan(70);
  46  |       expect(description!.length).toBeLessThanOrEqual(160);
  47  | 
  48  |       const canonical = await page.getAttribute('link[rel="canonical"]', 'href');
  49  |       expect(canonical).toMatch(/^https:\/\/getaxiom\.ca\/.*\/?$/);
  50  | 
  51  |       for (const property of ['og:title', 'og:description', 'og:image']) {
  52  |         expect(await page.getAttribute(`meta[property="${property}"]`, 'content')).toBeTruthy();
  53  |       }
  54  |       expect(await page.getAttribute('meta[name="twitter:card"]', 'content')).toBe('summary_large_image');
> 55  |       await expect(page.locator('h1')).toHaveCount(1);
      |                                        ^ Error: expect(locator).toHaveCount(expected) failed
  56  |     });
  57  |   }
  58  | 
  59  |   test('homepage has business, website and FAQ structured data', async ({ page }) => {
  60  |     await page.goto('/', { waitUntil: 'domcontentloaded' });
  61  |     const types = (
  62  |       await page.$$eval('script[type="application/ld+json"]', (els) => els.map((el) => JSON.parse(el.textContent || '{}')['@type']))
  63  |     ).flat();
  64  |     expect(types).toContain('LocalBusiness');
  65  |     expect(types).toContain('WebSite');
  66  |     expect(types).toContain('FAQPage');
  67  |   });
  68  | 
  69  |   test('pricing page has FAQ schema', async ({ page }) => {
  70  |     await page.goto('/pricing/', { waitUntil: 'domcontentloaded' });
  71  |     const types = (
  72  |       await page.$$eval('script[type="application/ld+json"]', (els) => els.map((el) => JSON.parse(el.textContent || '{}')['@type']))
  73  |     ).flat();
  74  |     expect(types).toContain('FAQPage');
  75  |   });
  76  | });
  77  | 
  78  | test.describe('performance basics', () => {
  79  |   test('no layout shift from font loading', async ({ page }) => {
  80  |     await page.goto('/', { waitUntil: 'networkidle' });
  81  |     const cls = await page.evaluate(
  82  |       () =>
  83  |         new Promise<number>((resolve) => {
  84  |           let cumulative = 0;
  85  |           const observer = new PerformanceObserver((list) => {
  86  |             for (const entry of list.getEntries()) {
  87  |               if (!(entry as any).hadRecentInput) cumulative += (entry as any).value;
  88  |             }
  89  |           });
  90  |           observer.observe({ type: 'layout-shift', buffered: true });
  91  |           setTimeout(() => {
  92  |             observer.disconnect();
  93  |             resolve(cumulative);
  94  |           }, 3000);
  95  |         })
  96  |     );
  97  |     expect(cls).toBeLessThan(0.1);
  98  |   });
  99  | 
  100 |   test('no console errors on public pages', async ({ page }) => {
  101 |     const errors: string[] = [];
  102 |     page.on('console', (msg) => {
  103 |       if (msg.type() === 'error') errors.push(msg.text());
  104 |     });
  105 |     for (const { path } of PUBLIC_PAGES) {
  106 |       await page.goto(path, { waitUntil: 'networkidle' });
  107 |     }
  108 |     expect(errors).toEqual([]);
  109 |   });
  110 | 
  111 |   test('pages never scroll sideways on a phone', async ({ page }) => {
  112 |     await page.setViewportSize({ width: 375, height: 812 });
  113 |     for (const { path } of PUBLIC_PAGES) {
  114 |       await page.goto(path, { waitUntil: 'networkidle' });
  115 |       const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  116 |       expect(overflow, path).toBeLessThanOrEqual(0);
  117 |     }
  118 |   });
  119 | });
  120 | 
  121 | test.describe('navigation consistency', () => {
  122 |   test('primary nav links are consistent across pages', async ({ page }) => {
  123 |     const navLinks: string[][] = [];
  124 |     for (const { path } of PUBLIC_PAGES) {
  125 |       await page.goto(path, { waitUntil: 'domcontentloaded' });
  126 |       navLinks.push(await page.$$eval('nav[aria-label="Primary"] a[href]', (els) => els.map((a) => a.getAttribute('href') || '')));
  127 |     }
  128 |     for (const links of navLinks) expect(links).toEqual(navLinks[0]);
  129 |   });
  130 | });
  131 | 
```