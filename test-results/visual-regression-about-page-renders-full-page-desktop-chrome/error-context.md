# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: visual-regression.spec.ts >> about page >> renders full page
- Location: tests\visual-regression.spec.ts:28:5

# Error details

```
Error: expect(page).toHaveScreenshot(expected) failed

Timeout: 5000ms
  Failed to take two consecutive stable screenshots.

  Snapshot: about-full-page.png

Call log:
  - Expect "toHaveScreenshot(about-full-page.png)" with timeout 5000ms
    - generating new stable screenshot expectation
  - taking page screenshot
    - disabled all CSS animations
  - waiting for fonts to load...
  - fonts loaded
  - waiting 100ms before taking screenshot
  - taking page screenshot
    - disabled all CSS animations
  - waiting for fonts to load...
  - fonts loaded
  - 196790 pixels (ratio 0.03 of all image pixels) are different.
  - waiting 250ms before taking screenshot
  - Timeout 5000ms exceeded.

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
            - generic [ref=e32]: About
      - generic [ref=e33]:
        - generic [ref=e34]:
          - paragraph [ref=e35]: About
          - heading "A founder-led web design studio in Kitchener-Waterloo" [level=1] [ref=e36]:
            - text: A founder-led web design studio in
            - emphasis [ref=e37]: Kitchener-Waterloo
          - paragraph [ref=e38]: We are Aidan Magee and Riley Hinsperger, co-founders of Axiom International and Axiom Web, its web-focused subsidiary. Based in Kitchener-Waterloo and serving Canada, we lead every engagement directly—from strategy and design through development, launch, and support.
          - generic [ref=e39]:
            - link "Start a project" [ref=e40]:
              - /url: /start-a-project/
              - text: Start a project
              - img [ref=e41]
            - link "How we work" [ref=e43]:
              - /url: /approach/
        - complementary "Axiom Web at a glance" [ref=e45]:
          - generic [ref=e46]:
            - generic [ref=e47]:
              - term [ref=e48]: Founded by
              - definition [ref=e49]: Aidan Magee & Riley Hinsperger
            - generic [ref=e50]:
              - term [ref=e51]: Based in
              - definition [ref=e52]: Kitchener-Waterloo, Ontario
            - generic [ref=e53]:
              - term [ref=e54]: Serving
              - definition [ref=e55]: Waterloo Region, Guelph, Hamilton and clients across Canada
            - generic [ref=e56]:
              - term [ref=e57]: Parent company
              - definition [ref=e58]: Axiom International
            - generic [ref=e59]:
              - term [ref=e60]: Contact
              - definition [ref=e61]:
                - link "(226) 753-1833" [ref=e62]:
                  - /url: tel:+12267531833
                - link "contact@axiominternational.ca" [ref=e63]:
                  - /url: mailto:contact@axiominternational.ca
                  - text: contact@
                  - text: axiominternational.ca
    - region "The two people behind every project" [ref=e64]:
      - generic [ref=e65]:
        - generic [ref=e66]:
          - paragraph [ref=e67]: The founders
          - heading "The two people behind every project" [level=2] [ref=e68]
          - paragraph [ref=e69]: There are no account managers or hand-offs. The people you speak to on the first call are the people who plan, design, build and support your website.
        - generic [ref=e70]:
          - article [ref=e71]:
            - paragraph [ref=e72]: Co-founder · Strategy & client lead
            - heading "Aidan Magee" [level=3] [ref=e73]
            - paragraph [ref=e74]: Your first point of contact. Aidan runs discovery, scope and content so the site reflects how your customers actually decide, from the first call through launch.
          - article [ref=e75]:
            - paragraph [ref=e76]: Co-founder · Design & development
            - heading "Riley Hinsperger" [level=3] [ref=e77]
            - paragraph [ref=e78]: Riley designs and builds every site, handling development, performance and testing so it loads quickly and works properly on every device.
    - region "Launch is not the finish line" [ref=e79]:
      - generic [ref=e80]:
        - generic [ref=e81]:
          - paragraph [ref=e82]: What we believe
          - heading "Launch is not the finish line" [level=2] [ref=e83]
          - paragraph [ref=e84]: A polished launch matters, but a website also has to stay clear, fast and supported after it goes live. We focus on what helps customers trust a business and take the next step.
        - list [ref=e85]:
          - listitem [ref=e86]:
            - generic [ref=e87]: "01"
            - heading "The offer has to be obvious" [level=3] [ref=e88]
            - paragraph [ref=e89]: A visitor should understand what you do, who you serve and how to take the next step without decoding the site.
          - listitem [ref=e90]:
            - generic [ref=e91]: "02"
            - heading "Proof sits next to the decision" [level=3] [ref=e92]
            - paragraph [ref=e93]: Reviews, credentials, work examples and real photos belong near the price, the service and the contact button.
          - listitem [ref=e94]:
            - generic [ref=e95]: "03"
            - heading "Direct accountability matters" [level=3] [ref=e96]
            - paragraph [ref=e97]: You talk to the people shaping the message and building the site, with one clear support path after launch.
    - region "Built to the pixel" [ref=e98]:
      - generic [ref=e99]:
        - generic [ref=e100]:
          - paragraph [ref=e101]: Studio film
          - heading "Built to the pixel" [level=2] [ref=e102]
          - paragraph [ref=e103]: A short look at the care that goes into every site we make.
        - figure "Built to the pixel. A 32-second film about how we approach every website." [ref=e105]:
          - button "Play film 0:32" [ref=e108]:
            - img [ref=e110]
            - generic [ref=e112]:
              - text: Play film
              - generic [ref=e113]: 0:32
          - generic [ref=e114]: Built to the pixel. A 32-second film about how we approach every website.
    - region "Let’s build something clear together" [ref=e115]:
      - generic [ref=e116]:
        - generic [ref=e117]:
          - heading "Let’s build something clear together" [level=2] [ref=e119]:
            - text: Let’s build something clear
            - emphasis [ref=e120]: together
          - link "Start a project" [ref=e121]:
            - /url: /start-a-project/
            - generic [ref=e122]:
              - text: Start a
              - text: project
        - generic [ref=e123]:
          - generic [ref=e124]:
            - generic [ref=e125]: contact@axiominternational.ca
            - button "Copy" [ref=e126]
            - link "Email contact@axiominternational.ca" [ref=e127]:
              - /url: mailto:contact@axiominternational.ca
          - generic [ref=e128]:
            - link "(226) 753-1833" [ref=e129]:
              - /url: tel:+12267531833
            - generic [ref=e130]: 257 Kipling Ave, Kitchener, ON
  - contentinfo [ref=e131]:
    - generic [ref=e132]:
      - generic [ref=e133]:
        - generic [ref=e134]:
          - link "Axiom Web home" [ref=e135]:
            - /url: /
            - text: axiom
            - generic [ref=e136]: web
          - paragraph [ref=e137]: A two-person web studio in Kitchener-Waterloo. Websites for local businesses across Ontario, and quiet overflow work for agencies.
          - list [ref=e138]:
            - listitem [ref=e139]:
              - link "contact@ axiominternational.ca" [ref=e140]:
                - /url: mailto:contact@axiominternational.ca
                - text: contact@
                - text: axiominternational.ca
            - listitem [ref=e141]:
              - link "(226) 753-1833" [ref=e142]:
                - /url: tel:+12267531833
            - listitem [ref=e143]:
              - generic [ref=e144]: 257 Kipling Ave, Kitchener, ON
        - navigation "Footer" [ref=e145]:
          - generic [ref=e146]:
            - heading "Services" [level=2] [ref=e147]
            - list [ref=e148]:
              - listitem [ref=e149]:
                - link "Local Business Websites" [ref=e150]:
                  - /url: /services/local-business-websites/
              - listitem [ref=e151]:
                - link "Conversion-Focused Web Design" [ref=e152]:
                  - /url: /services/conversion-sites/
              - listitem [ref=e153]:
                - link "Website Redesigns" [ref=e154]:
                  - /url: /services/rebuilds/
              - listitem [ref=e155]:
                - link "All services" [ref=e156]:
                  - /url: /services/
              - listitem [ref=e157]:
                - link "Pricing" [ref=e158]:
                  - /url: /pricing/
          - generic [ref=e159]:
            - heading "Studio" [level=2] [ref=e160]
            - list [ref=e161]:
              - listitem [ref=e162]:
                - link "About" [ref=e163]:
                  - /url: /about/
              - listitem [ref=e164]:
                - link "Our process" [ref=e165]:
                  - /url: /approach/
              - listitem [ref=e166]:
                - link "Work" [ref=e167]:
                  - /url: /work/
              - listitem [ref=e168]:
                - link "For agencies" [ref=e169]:
                  - /url: /agencies/
              - listitem [ref=e170]:
                - link "Contact" [ref=e171]:
                  - /url: /contact/
              - listitem [ref=e172]:
                - link "Start a project" [ref=e173]:
                  - /url: /start-a-project/
          - generic [ref=e174]:
            - heading "Industries" [level=2] [ref=e175]
            - list [ref=e176]:
              - listitem [ref=e177]:
                - link "Contractors & home services" [ref=e178]:
                  - /url: /industries/home-services/
              - listitem [ref=e179]:
                - link "Clinics & health practices" [ref=e180]:
                  - /url: /industries/health-clinics/
              - listitem [ref=e181]:
                - link "Salons, spas & barbers" [ref=e182]:
                  - /url: /industries/salons-personal-care/
              - listitem [ref=e183]:
                - link "Restaurants & cafés" [ref=e184]:
                  - /url: /industries/restaurants-hospitality/
              - listitem [ref=e185]:
                - link "Law & professional services" [ref=e186]:
                  - /url: /industries/professional-services/
              - listitem [ref=e187]:
                - link "All industries" [ref=e188]:
                  - /url: /industries/
          - generic [ref=e189]:
            - heading "Service areas" [level=2] [ref=e190]
            - list [ref=e191]:
              - listitem [ref=e192]:
                - link "Web design Kitchener" [ref=e193]:
                  - /url: /web-design/kitchener/
              - listitem [ref=e194]:
                - link "Web design Waterloo" [ref=e195]:
                  - /url: /web-design/waterloo/
              - listitem [ref=e196]:
                - link "Web design Cambridge" [ref=e197]:
                  - /url: /web-design/cambridge/
              - listitem [ref=e198]:
                - link "Web design Guelph" [ref=e199]:
                  - /url: /web-design/guelph/
              - listitem [ref=e200]:
                - link "Web design Hamilton" [ref=e201]:
                  - /url: /web-design/hamilton/
              - listitem [ref=e202]:
                - link "All service areas" [ref=e203]:
                  - /url: /web-design/
      - generic [ref=e204]:
        - paragraph [ref=e205]: © 2026 Axiom Web. Co-founded by Aidan Magee and Riley Hinsperger. Axiom Web is the web-focused subsidiary of Axiom International.
        - list [ref=e206]:
          - listitem [ref=e207]:
            - link "Privacy Policy" [ref=e208]:
              - /url: /privacy/
          - listitem [ref=e209]:
            - link "Terms of Service" [ref=e210]:
              - /url: /terms/
  - generic [ref=e213]:
    - button "Menu" [ref=e214]:
      - img [ref=e216]
      - generic: Menu
    - button "Inspect" [ref=e220]:
      - img [ref=e222]
      - generic: Inspect
    - button "Audit" [ref=e224]:
      - generic [ref=e225]:
        - img [ref=e226]
        - img [ref=e229]
      - generic: Audit
    - button "Settings" [ref=e232]:
      - img [ref=e234]
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
> 30  |       await expect(page).toHaveScreenshot(`${name}-full-page.png`, { fullPage: true });
      |                          ^ Error: expect(page).toHaveScreenshot(expected) failed
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
  55  |       await expect(page.locator('h1')).toHaveCount(1);
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
```