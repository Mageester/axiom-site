# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: visual-regression.spec.ts >> SEO validation >> start-a-project has required meta tags
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
  - main [ref=e21]:
    - generic [ref=e23]:
      - navigation "Breadcrumb" [ref=e24]:
        - list [ref=e25]:
          - listitem [ref=e26]:
            - link "Home" [ref=e27]:
              - /url: /
          - listitem [ref=e28]:
            - generic [ref=e29]: /
            - generic [ref=e30]: Start a project
      - generic [ref=e32]:
        - paragraph [ref=e33]: Start a project
        - heading "Tell us about your project" [level=1] [ref=e34]:
          - text: Tell us about your
          - emphasis [ref=e35]: project
        - paragraph [ref=e36]: It takes about two minutes. We reply within one business day with the right package, a clear price and the next step. No obligation.
    - generic [ref=e38]:
      - generic [ref=e39]:
        - generic [ref=e40]:
          - heading "Your project details" [level=2] [ref=e41]
          - paragraph [ref=e42]: Plain language is perfect. Tell us what the business does and what the website needs to do.
        - generic [ref=e43]:
          - generic [ref=e44]:
            - generic [ref=e45]:
              - generic [ref=e46]: Name
              - textbox "Name" [ref=e47]
            - generic [ref=e48]:
              - generic [ref=e49]: Email
              - textbox "Email" [ref=e50]
            - generic [ref=e51]:
              - generic [ref=e52]: Phone (optional)
              - textbox "Phone (optional)" [ref=e53]
            - generic [ref=e54]:
              - generic [ref=e55]: Business name (optional)
              - textbox "Business name (optional)" [ref=e56]
            - generic [ref=e57]:
              - generic [ref=e58]: Current website (optional)
              - textbox "Current website (optional)" [ref=e59]:
                - /placeholder: yourbusiness.ca
          - group "Which package are you considering?" [ref=e60]:
            - generic [ref=e61]: Which package are you considering?
            - generic [ref=e62]:
              - generic [ref=e63]:
                - radio "Local Launch Special" [ref=e64] [cursor=pointer]
                - generic [ref=e65]: Local Launch Special
              - generic [ref=e66]:
                - radio "Local Business Website" [ref=e67] [cursor=pointer]
                - generic [ref=e68]: Local Business Website
              - generic [ref=e69]:
                - radio "Expanded Website" [ref=e70] [cursor=pointer]
                - generic [ref=e71]: Expanded Website
              - generic [ref=e72]:
                - radio "Custom" [ref=e73] [cursor=pointer]
                - generic [ref=e74]: Custom
              - generic [ref=e75]:
                - radio "Not sure yet" [checked] [ref=e76] [cursor=pointer]
                - generic [ref=e77]: Not sure yet
            - paragraph [ref=e78]:
              - text: Not sure is fine. We will recommend the right fit.
              - link "Compare packages" [ref=e79]:
                - /url: /pricing/
          - generic [ref=e80]:
            - generic [ref=e81]: About the project
            - textbox "About the project" [ref=e82]:
              - /placeholder: What does the business do, what should the website help with, and when would you like to launch?
          - generic [ref=e83]:
            - text: Leave this field blank
            - textbox [ref=e84]
          - generic [ref=e85]:
            - button "Send project details" [ref=e86]:
              - generic [ref=e87]: Send project details
              - img [ref=e88]
            - paragraph [ref=e90]:
              - text: Prefer to talk? Call
              - link "(226) 753-1833" [ref=e91]:
                - /url: tel:+12267531833
              - text: or email
              - link "contact@axiominternational.ca" [ref=e92]:
                - /url: mailto:contact@axiominternational.ca
                - text: contact@
                - text: axiominternational.ca
              - text: .
      - complementary "What to expect" [ref=e93]:
        - generic [ref=e94]:
          - heading "What happens next" [level=2] [ref=e95]
          - list [ref=e96]:
            - listitem [ref=e97]:
              - generic [ref=e98]: "1"
              - generic [ref=e99]:
                - heading "We review your business" [level=3] [ref=e100]
                - paragraph [ref=e101]: We look at what you sent and your current site, if you have one.
            - listitem [ref=e102]:
              - generic [ref=e103]: "2"
              - generic [ref=e104]:
                - heading "You hear back within one business day" [level=3] [ref=e105]
                - paragraph [ref=e106]: A reply from the founders with the package we recommend and the price.
            - listitem [ref=e107]:
              - generic [ref=e108]: "3"
              - generic [ref=e109]:
                - heading "You decide, with no pressure" [level=3] [ref=e110]
                - paragraph [ref=e111]: If it’s a fit, we send a written scope. If not, we’ll tell you honestly.
        - generic [ref=e112]:
          - heading "Packages at a glance" [level=2] [ref=e113]
          - list [ref=e114]:
            - listitem [ref=e115]:
              - generic [ref=e116]:
                - text: Local Launch Special
                - generic [ref=e117]: One page, up to six sections
              - strong [ref=e118]: From CAD $900
            - listitem [ref=e119]:
              - generic [ref=e120]:
                - text: Local Business Website
                - generic [ref=e121]: Up to three pages
              - strong [ref=e122]: From CAD $1,200
            - listitem [ref=e123]:
              - generic [ref=e124]:
                - text: Expanded Website
                - generic [ref=e125]: Up to five pages
              - strong [ref=e126]: From CAD $1,500
            - listitem [ref=e127]:
              - generic [ref=e128]:
                - text: Custom
                - generic [ref=e129]: Defined in a written scope
              - strong [ref=e130]: Quoted
          - link "Compare packages" [ref=e131]:
            - /url: /pricing/
            - text: Compare packages
            - img [ref=e132]
        - generic [ref=e134]:
          - heading "Prefer to talk?" [level=2] [ref=e135]
          - link "(226) 753-1833" [ref=e136]:
            - /url: tel:+12267531833
            - img [ref=e137]
            - text: (226) 753-1833
          - link "contact@ axiominternational.ca" [ref=e139]:
            - /url: mailto:contact@axiominternational.ca
            - img [ref=e140]
            - text: contact@
            - text: axiominternational.ca
  - contentinfo [ref=e143]:
    - generic [ref=e144]:
      - generic [ref=e145]:
        - generic [ref=e146]:
          - link "Axiom Web home" [ref=e147]:
            - /url: /
            - text: axiom
            - generic [ref=e148]: web
          - paragraph [ref=e149]: A two-person web studio in Kitchener-Waterloo. Websites for local businesses across Ontario, and quiet overflow work for agencies.
          - list [ref=e150]:
            - listitem [ref=e151]:
              - link "contact@ axiominternational.ca" [ref=e152]:
                - /url: mailto:contact@axiominternational.ca
                - text: contact@
                - text: axiominternational.ca
            - listitem [ref=e153]:
              - link "(226) 753-1833" [ref=e154]:
                - /url: tel:+12267531833
            - listitem [ref=e155]:
              - generic [ref=e156]: 257 Kipling Ave, Kitchener, ON
        - navigation "Footer" [ref=e157]:
          - generic [ref=e158]:
            - heading "Services" [level=2] [ref=e159]
            - list [ref=e160]:
              - listitem [ref=e161]:
                - link "Local Business Websites" [ref=e162]:
                  - /url: /services/local-business-websites/
              - listitem [ref=e163]:
                - link "Conversion-Focused Web Design" [ref=e164]:
                  - /url: /services/conversion-sites/
              - listitem [ref=e165]:
                - link "Website Redesigns" [ref=e166]:
                  - /url: /services/rebuilds/
              - listitem [ref=e167]:
                - link "All services" [ref=e168]:
                  - /url: /services/
              - listitem [ref=e169]:
                - link "Pricing" [ref=e170]:
                  - /url: /pricing/
          - generic [ref=e171]:
            - heading "Studio" [level=2] [ref=e172]
            - list [ref=e173]:
              - listitem [ref=e174]:
                - link "About" [ref=e175]:
                  - /url: /about/
              - listitem [ref=e176]:
                - link "Our process" [ref=e177]:
                  - /url: /approach/
              - listitem [ref=e178]:
                - link "Work" [ref=e179]:
                  - /url: /work/
              - listitem [ref=e180]:
                - link "For agencies" [ref=e181]:
                  - /url: /agencies/
              - listitem [ref=e182]:
                - link "Contact" [ref=e183]:
                  - /url: /contact/
              - listitem [ref=e184]:
                - link "Start a project" [ref=e185]:
                  - /url: /start-a-project/
          - generic [ref=e186]:
            - heading "Industries" [level=2] [ref=e187]
            - list [ref=e188]:
              - listitem [ref=e189]:
                - link "Contractors & home services" [ref=e190]:
                  - /url: /industries/home-services/
              - listitem [ref=e191]:
                - link "Clinics & health practices" [ref=e192]:
                  - /url: /industries/health-clinics/
              - listitem [ref=e193]:
                - link "Salons, spas & barbers" [ref=e194]:
                  - /url: /industries/salons-personal-care/
              - listitem [ref=e195]:
                - link "Restaurants & cafés" [ref=e196]:
                  - /url: /industries/restaurants-hospitality/
              - listitem [ref=e197]:
                - link "Law & professional services" [ref=e198]:
                  - /url: /industries/professional-services/
              - listitem [ref=e199]:
                - link "All industries" [ref=e200]:
                  - /url: /industries/
          - generic [ref=e201]:
            - heading "Service areas" [level=2] [ref=e202]
            - list [ref=e203]:
              - listitem [ref=e204]:
                - link "Web design Kitchener" [ref=e205]:
                  - /url: /web-design/kitchener/
              - listitem [ref=e206]:
                - link "Web design Waterloo" [ref=e207]:
                  - /url: /web-design/waterloo/
              - listitem [ref=e208]:
                - link "Web design Cambridge" [ref=e209]:
                  - /url: /web-design/cambridge/
              - listitem [ref=e210]:
                - link "Web design Guelph" [ref=e211]:
                  - /url: /web-design/guelph/
              - listitem [ref=e212]:
                - link "Web design Hamilton" [ref=e213]:
                  - /url: /web-design/hamilton/
              - listitem [ref=e214]:
                - link "All service areas" [ref=e215]:
                  - /url: /web-design/
      - generic [ref=e216]:
        - paragraph [ref=e217]: © 2026 Axiom Web. Co-founded by Aidan Magee and Riley Hinsperger. Axiom Web is the web-focused subsidiary of Axiom International.
        - list [ref=e218]:
          - listitem [ref=e219]:
            - link "Privacy Policy" [ref=e220]:
              - /url: /privacy/
          - listitem [ref=e221]:
            - link "Terms of Service" [ref=e222]:
              - /url: /terms/
  - generic [ref=e225]:
    - button "Menu" [ref=e226]:
      - img [ref=e228]
      - generic: Menu
    - button "Inspect" [ref=e232]:
      - img [ref=e234]
      - generic: Inspect
    - button "Audit" [ref=e236]:
      - generic [ref=e237]:
        - img [ref=e238]
        - img [ref=e241]
      - generic: Audit
    - button "Settings" [ref=e244]:
      - img [ref=e246]
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