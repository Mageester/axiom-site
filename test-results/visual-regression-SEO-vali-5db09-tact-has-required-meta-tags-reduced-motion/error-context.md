# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: visual-regression.spec.ts >> SEO validation >> contact has required meta tags
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
            - generic [ref=e32]: Contact
      - generic [ref=e34]:
        - paragraph [ref=e35]: Contact
        - heading "Contact Axiom Web" [level=1] [ref=e36]:
          - text: Contact Axiom
          - emphasis [ref=e37]: Web
        - paragraph [ref=e38]: Questions about a website, pricing or timing? Call, email or send a message. We reply within one business day.
    - region "Talk to us directly" [ref=e39]:
      - generic [ref=e40]:
        - generic [ref=e41]:
          - heading "Talk to us directly" [level=2] [ref=e42]
          - list [ref=e43]:
            - listitem [ref=e44]:
              - img [ref=e46]
              - generic [ref=e48]:
                - heading "Phone" [level=3] [ref=e49]
                - link "(226) 753-1833" [ref=e50]:
                  - /url: tel:+12267531833
            - listitem [ref=e51]:
              - img [ref=e53]
              - generic [ref=e56]:
                - heading "Email" [level=3] [ref=e57]
                - link "contact@axiominternational.ca" [ref=e58]:
                  - /url: mailto:contact@axiominternational.ca
                  - text: contact@
                  - text: axiominternational.ca
            - listitem [ref=e59]:
              - img [ref=e61]
              - generic [ref=e64]:
                - heading "Location" [level=3] [ref=e65]
                - paragraph [ref=e66]: Kitchener-Waterloo, Ontario. Working with businesses across Waterloo Region, Guelph, Hamilton and Canada.
            - listitem [ref=e67]:
              - img [ref=e69]
              - generic [ref=e72]:
                - heading "Response time" [level=3] [ref=e73]
                - paragraph [ref=e74]: Within one business day.
          - generic [ref=e75]:
            - heading "Ready to start a project?" [level=3] [ref=e76]
            - paragraph [ref=e77]: The project form asks a few more questions so we can recommend a package and price straight away.
            - link "Go to the project form" [ref=e78]:
              - /url: /start-a-project/
              - text: Go to the project form
              - img [ref=e79]
        - generic [ref=e81]:
          - generic [ref=e82]:
            - heading "Send a message" [level=2] [ref=e83]
            - paragraph [ref=e84]: For quick questions, follow-ups or anything else.
          - generic [ref=e85]:
            - generic [ref=e86]:
              - generic [ref=e87]:
                - generic [ref=e88]: Name
                - textbox "Name" [ref=e89]
              - generic [ref=e90]:
                - generic [ref=e91]: Email
                - textbox "Email" [ref=e92]
              - generic [ref=e93]:
                - generic [ref=e94]: Business name (optional)
                - textbox "Business name (optional)" [ref=e95]
            - generic [ref=e96]:
              - generic [ref=e97]: Message
              - textbox "Message" [ref=e98]:
                - /placeholder: How can we help?
            - generic [ref=e99]:
              - text: Leave this field blank
              - textbox [ref=e100]
            - generic [ref=e101]:
              - button "Send message" [ref=e102]:
                - generic [ref=e103]: Send message
                - img [ref=e104]
              - paragraph [ref=e106]:
                - text: Prefer to talk? Call
                - link "(226) 753-1833" [ref=e107]:
                  - /url: tel:+12267531833
                - text: or email
                - link "contact@axiominternational.ca" [ref=e108]:
                  - /url: mailto:contact@axiominternational.ca
                  - text: contact@
                  - text: axiominternational.ca
                - text: .
    - region "After you get in touch" [ref=e109]:
      - generic [ref=e110]:
        - generic [ref=e111]:
          - paragraph [ref=e112]: What happens next
          - heading "After you get in touch" [level=2] [ref=e113]
        - list [ref=e114]:
          - listitem [ref=e115]:
            - generic [ref=e116]: "1"
            - heading "You reach out" [level=3] [ref=e117]
            - paragraph [ref=e118]: Call, email or send the form with a few details about your business.
          - listitem [ref=e119]:
            - generic [ref=e120]: "2"
            - heading "We reply within one business day" [level=3] [ref=e121]
            - paragraph [ref=e122]: You hear from Aidan or Riley directly, not a sales team.
          - listitem [ref=e123]:
            - generic [ref=e124]: "3"
            - heading "You get a clear recommendation" [level=3] [ref=e125]
            - paragraph [ref=e126]: If there is a fit, we explain the right package, the timeline and the price.
  - contentinfo [ref=e127]:
    - generic [ref=e128]:
      - generic [ref=e129]:
        - generic [ref=e130]:
          - link "Axiom Web home" [ref=e131]:
            - /url: /
            - text: axiom
            - generic [ref=e132]: web
          - paragraph [ref=e133]: A two-person web studio in Kitchener-Waterloo. Websites for local businesses across Ontario, and quiet overflow work for agencies.
          - list [ref=e134]:
            - listitem [ref=e135]:
              - link "contact@ axiominternational.ca" [ref=e136]:
                - /url: mailto:contact@axiominternational.ca
                - text: contact@
                - text: axiominternational.ca
            - listitem [ref=e137]:
              - link "(226) 753-1833" [ref=e138]:
                - /url: tel:+12267531833
            - listitem [ref=e139]:
              - generic [ref=e140]: 257 Kipling Ave, Kitchener, ON
        - navigation "Footer" [ref=e141]:
          - generic [ref=e142]:
            - heading "Services" [level=2] [ref=e143]
            - list [ref=e144]:
              - listitem [ref=e145]:
                - link "Local Business Websites" [ref=e146]:
                  - /url: /services/local-business-websites/
              - listitem [ref=e147]:
                - link "Conversion-Focused Web Design" [ref=e148]:
                  - /url: /services/conversion-sites/
              - listitem [ref=e149]:
                - link "Website Redesigns" [ref=e150]:
                  - /url: /services/rebuilds/
              - listitem [ref=e151]:
                - link "All services" [ref=e152]:
                  - /url: /services/
              - listitem [ref=e153]:
                - link "Pricing" [ref=e154]:
                  - /url: /pricing/
          - generic [ref=e155]:
            - heading "Studio" [level=2] [ref=e156]
            - list [ref=e157]:
              - listitem [ref=e158]:
                - link "About" [ref=e159]:
                  - /url: /about/
              - listitem [ref=e160]:
                - link "Our process" [ref=e161]:
                  - /url: /approach/
              - listitem [ref=e162]:
                - link "Work" [ref=e163]:
                  - /url: /work/
              - listitem [ref=e164]:
                - link "For agencies" [ref=e165]:
                  - /url: /agencies/
              - listitem [ref=e166]:
                - link "Contact" [ref=e167]:
                  - /url: /contact/
              - listitem [ref=e168]:
                - link "Start a project" [ref=e169]:
                  - /url: /start-a-project/
          - generic [ref=e170]:
            - heading "Industries" [level=2] [ref=e171]
            - list [ref=e172]:
              - listitem [ref=e173]:
                - link "Contractors & home services" [ref=e174]:
                  - /url: /industries/home-services/
              - listitem [ref=e175]:
                - link "Clinics & health practices" [ref=e176]:
                  - /url: /industries/health-clinics/
              - listitem [ref=e177]:
                - link "Salons, spas & barbers" [ref=e178]:
                  - /url: /industries/salons-personal-care/
              - listitem [ref=e179]:
                - link "Restaurants & cafés" [ref=e180]:
                  - /url: /industries/restaurants-hospitality/
              - listitem [ref=e181]:
                - link "Law & professional services" [ref=e182]:
                  - /url: /industries/professional-services/
              - listitem [ref=e183]:
                - link "All industries" [ref=e184]:
                  - /url: /industries/
          - generic [ref=e185]:
            - heading "Service areas" [level=2] [ref=e186]
            - list [ref=e187]:
              - listitem [ref=e188]:
                - link "Web design Kitchener" [ref=e189]:
                  - /url: /web-design/kitchener/
              - listitem [ref=e190]:
                - link "Web design Waterloo" [ref=e191]:
                  - /url: /web-design/waterloo/
              - listitem [ref=e192]:
                - link "Web design Cambridge" [ref=e193]:
                  - /url: /web-design/cambridge/
              - listitem [ref=e194]:
                - link "Web design Guelph" [ref=e195]:
                  - /url: /web-design/guelph/
              - listitem [ref=e196]:
                - link "Web design Hamilton" [ref=e197]:
                  - /url: /web-design/hamilton/
              - listitem [ref=e198]:
                - link "All service areas" [ref=e199]:
                  - /url: /web-design/
      - generic [ref=e200]:
        - paragraph [ref=e201]: © 2026 Axiom Web. Co-founded by Aidan Magee and Riley Hinsperger. Axiom Web is the web-focused subsidiary of Axiom International.
        - list [ref=e202]:
          - listitem [ref=e203]:
            - link "Privacy Policy" [ref=e204]:
              - /url: /privacy/
          - listitem [ref=e205]:
            - link "Terms of Service" [ref=e206]:
              - /url: /terms/
  - generic [ref=e209]:
    - button "Menu" [ref=e210]:
      - img [ref=e212]
      - generic: Menu
    - button "Inspect" [ref=e216]:
      - img [ref=e218]
      - generic: Inspect
    - button "Audit" [ref=e220]:
      - generic [ref=e221]:
        - img [ref=e222]
        - img [ref=e225]
      - generic: Audit
    - button "Settings" [ref=e228]:
      - img [ref=e230]
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