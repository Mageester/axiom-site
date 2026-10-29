# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: visual-regression.spec.ts >> SEO validation >> industries has required meta tags
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
            - generic [ref=e32]: Industries
      - generic [ref=e34]:
        - paragraph [ref=e35]: Industries
        - heading "Websites planned around your kind of business" [level=1] [ref=e36]:
          - text: Websites planned around your kind of
          - emphasis [ref=e37]: business
        - paragraph [ref=e38]: A contractor, a clinic and a restaurant win customers in very different ways. Each guide below covers what buyers in that sector look for, the pages that usually matter and the package that typically fits.
        - generic [ref=e39]:
          - link "Start a project" [ref=e40]:
            - /url: /start-a-project/
            - text: Start a project
            - img [ref=e41]
          - link "See our work" [ref=e43]:
            - /url: /work/
    - region "Industries we work with" [ref=e44]:
      - generic [ref=e45]:
        - heading "Industries we work with" [level=2] [ref=e46]
        - generic [ref=e47]:
          - list [ref=e48]:
            - listitem [ref=e49]:
              - generic [ref=e50]: "01"
              - heading "Contractors & home services" [level=3] [ref=e51]:
                - link "Contractors & home services" [ref=e52]:
                  - /url: /industries/home-services/
              - paragraph [ref=e53]: Homeowners usually compare a few companies on their phone before calling one. Your site needs to show what you do, where you work and the quality of your work, then make calling or requesting a quote effortless.
              - paragraph [ref=e54]: Trades, roofing, landscaping, HVAC, cleaning, snow removal
              - img [ref=e56]
            - listitem [ref=e58]:
              - generic [ref=e59]: "02"
              - heading "Clinics & health practices" [level=3] [ref=e60]:
                - link "Clinics & health practices" [ref=e61]:
                  - /url: /industries/health-clinics/
              - paragraph [ref=e62]: New patients want to know they have found the right practice before they book. Your site should explain your services in plain language, introduce the practitioners and make booking or contacting the clinic simple.
              - paragraph [ref=e63]: Dental, physiotherapy, chiropractic, massage, wellness
              - img [ref=e65]
            - listitem [ref=e67]:
              - generic [ref=e68]: "03"
              - heading "Salons, spas & barbers" [level=3] [ref=e69]:
                - link "Salons, spas & barbers" [ref=e70]:
                  - /url: /industries/salons-personal-care/
              - paragraph [ref=e71]: Clients choose a salon on style and convenience. Your site should show your work at its best, make services and prices easy to compare and keep booking one tap away.
              - paragraph [ref=e72]: Hair and nail salons, spas, barbershops, aesthetics
              - img [ref=e74]
            - listitem [ref=e76]:
              - generic [ref=e77]: "04"
              - heading "Restaurants & cafés" [level=3] [ref=e78]:
                - link "Restaurants & cafés" [ref=e79]:
                  - /url: /industries/restaurants-hospitality/
              - paragraph [ref=e80]: Guests decide where to eat in seconds, usually on a phone. Your site should show the food and atmosphere, load the menu instantly and make reserving, ordering or finding you effortless.
              - paragraph [ref=e81]: Restaurants, cafés, bakeries, bars, catering
              - img [ref=e83]
            - listitem [ref=e85]:
              - generic [ref=e86]: "05"
              - heading "Law & professional services" [level=3] [ref=e87]:
                - link "Law & professional services" [ref=e88]:
                  - /url: /industries/professional-services/
              - paragraph [ref=e89]: Clients choosing a lawyer, accountant or adviser are looking for competence and clarity. Your site should explain what you handle, who you help and how to start, without asking them to read a wall of text.
              - paragraph [ref=e90]: Law firms, accountants, consultants, advisers
              - img [ref=e92]
          - generic [ref=e94]:
            - paragraph [ref=e95]:
              - strong [ref=e96]: Something else?
              - text: "The same principles apply to most local businesses: a clear offer, honest proof and an easy next step. Tell us what you do."
            - link "Tell us about your business" [ref=e97]:
              - /url: /start-a-project/
              - text: Tell us about your business
              - img [ref=e98]
    - region "Let’s make yours." [ref=e100]:
      - generic [ref=e101]:
        - generic [ref=e102]:
          - heading "Let’s make yours." [level=2] [ref=e104]:
            - text: Let’s make
            - emphasis [ref=e105]: yours.
          - link "Start a project" [ref=e106]:
            - /url: /start-a-project/
            - generic [ref=e107]:
              - text: Start a
              - text: project
        - generic [ref=e108]:
          - generic [ref=e109]:
            - generic [ref=e110]: contact@axiominternational.ca
            - button "Copy" [ref=e111]
            - link "Email contact@axiominternational.ca" [ref=e112]:
              - /url: mailto:contact@axiominternational.ca
          - generic [ref=e113]:
            - link "(226) 753-1833" [ref=e114]:
              - /url: tel:+12267531833
            - generic [ref=e115]: 257 Kipling Ave, Kitchener, ON
  - contentinfo [ref=e116]:
    - generic [ref=e117]:
      - generic [ref=e118]:
        - generic [ref=e119]:
          - link "Axiom Web home" [ref=e120]:
            - /url: /
            - text: axiom
            - generic [ref=e121]: web
          - paragraph [ref=e122]: A two-person web studio in Kitchener-Waterloo. Websites for local businesses across Ontario, and quiet overflow work for agencies.
          - list [ref=e123]:
            - listitem [ref=e124]:
              - link "contact@ axiominternational.ca" [ref=e125]:
                - /url: mailto:contact@axiominternational.ca
                - text: contact@
                - text: axiominternational.ca
            - listitem [ref=e126]:
              - link "(226) 753-1833" [ref=e127]:
                - /url: tel:+12267531833
            - listitem [ref=e128]:
              - generic [ref=e129]: 257 Kipling Ave, Kitchener, ON
        - navigation "Footer" [ref=e130]:
          - generic [ref=e131]:
            - heading "Services" [level=2] [ref=e132]
            - list [ref=e133]:
              - listitem [ref=e134]:
                - link "Local Business Websites" [ref=e135]:
                  - /url: /services/local-business-websites/
              - listitem [ref=e136]:
                - link "Conversion-Focused Web Design" [ref=e137]:
                  - /url: /services/conversion-sites/
              - listitem [ref=e138]:
                - link "Website Redesigns" [ref=e139]:
                  - /url: /services/rebuilds/
              - listitem [ref=e140]:
                - link "All services" [ref=e141]:
                  - /url: /services/
              - listitem [ref=e142]:
                - link "Pricing" [ref=e143]:
                  - /url: /pricing/
          - generic [ref=e144]:
            - heading "Studio" [level=2] [ref=e145]
            - list [ref=e146]:
              - listitem [ref=e147]:
                - link "About" [ref=e148]:
                  - /url: /about/
              - listitem [ref=e149]:
                - link "Our process" [ref=e150]:
                  - /url: /approach/
              - listitem [ref=e151]:
                - link "Work" [ref=e152]:
                  - /url: /work/
              - listitem [ref=e153]:
                - link "For agencies" [ref=e154]:
                  - /url: /agencies/
              - listitem [ref=e155]:
                - link "Contact" [ref=e156]:
                  - /url: /contact/
              - listitem [ref=e157]:
                - link "Start a project" [ref=e158]:
                  - /url: /start-a-project/
          - generic [ref=e159]:
            - heading "Industries" [level=2] [ref=e160]
            - list [ref=e161]:
              - listitem [ref=e162]:
                - link "Contractors & home services" [ref=e163]:
                  - /url: /industries/home-services/
              - listitem [ref=e164]:
                - link "Clinics & health practices" [ref=e165]:
                  - /url: /industries/health-clinics/
              - listitem [ref=e166]:
                - link "Salons, spas & barbers" [ref=e167]:
                  - /url: /industries/salons-personal-care/
              - listitem [ref=e168]:
                - link "Restaurants & cafés" [ref=e169]:
                  - /url: /industries/restaurants-hospitality/
              - listitem [ref=e170]:
                - link "Law & professional services" [ref=e171]:
                  - /url: /industries/professional-services/
              - listitem [ref=e172]:
                - link "All industries" [ref=e173]:
                  - /url: /industries/
          - generic [ref=e174]:
            - heading "Service areas" [level=2] [ref=e175]
            - list [ref=e176]:
              - listitem [ref=e177]:
                - link "Web design Kitchener" [ref=e178]:
                  - /url: /web-design/kitchener/
              - listitem [ref=e179]:
                - link "Web design Waterloo" [ref=e180]:
                  - /url: /web-design/waterloo/
              - listitem [ref=e181]:
                - link "Web design Cambridge" [ref=e182]:
                  - /url: /web-design/cambridge/
              - listitem [ref=e183]:
                - link "Web design Guelph" [ref=e184]:
                  - /url: /web-design/guelph/
              - listitem [ref=e185]:
                - link "Web design Hamilton" [ref=e186]:
                  - /url: /web-design/hamilton/
              - listitem [ref=e187]:
                - link "All service areas" [ref=e188]:
                  - /url: /web-design/
      - generic [ref=e189]:
        - paragraph [ref=e190]: © 2026 Axiom Web. Co-founded by Aidan Magee and Riley Hinsperger. Axiom Web is the web-focused subsidiary of Axiom International.
        - list [ref=e191]:
          - listitem [ref=e192]:
            - link "Privacy Policy" [ref=e193]:
              - /url: /privacy/
          - listitem [ref=e194]:
            - link "Terms of Service" [ref=e195]:
              - /url: /terms/
  - generic [ref=e198]:
    - button "Menu" [ref=e199]:
      - img [ref=e201]
      - generic: Menu
    - button "Inspect" [ref=e205]:
      - img [ref=e207]
      - generic: Inspect
    - button "Audit" [ref=e209]:
      - generic [ref=e210]:
        - img [ref=e211]
        - img [ref=e214]
      - generic: Audit
    - button "Settings" [ref=e217]:
      - img [ref=e219]
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