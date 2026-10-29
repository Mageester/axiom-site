# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: visual-regression.spec.ts >> SEO validation >> home has required meta tags
- Location: tests\visual-regression.spec.ts:37:5

# Error details

```
Error: expect(locator).toHaveCount(expected) failed

Locator:  locator('h1')
Expected: 1
Received: 4
Timeout:  5000ms

Call log:
  - Expect "toHaveCount" with timeout 5000ms
  - waiting for locator('h1')
    8 × locator resolved to 4 elements
      - unexpected value "4"

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
      - generic:
        - 'heading "Web design studio · Kitchener-Waterloo, Ontario : Websites that feel alive." [level=1]':
          - generic:
            - text: Web design studio · Kitchener-Waterloo, Ontario
            - generic: ":"
          - generic:
            - generic: Websites that
          - generic:
            - generic:
              - text: feel
              - emphasis: alive.
        - generic:
          - generic:
            - paragraph: A two-person studio building websites for local businesses across Ontario. Fixed prices from CAD $900, live in two to four weeks.
            - generic:
              - link "Start a project" [ref=e27]:
                - /url: /start-a-project/
                - text: Start a project
                - img [ref=e28]
              - link "Selected work" [ref=e30]:
                - /url: "#work"
                - text: Selected work
                - img [ref=e31]
          - generic:
            - generic: Now showing · move the cursor, click to splash
            - paragraph: 02 Northline Physio & Rehab · Concept
    - region "The studio" [ref=e33]:
      - generic [ref=e34]:
        - paragraph [ref=e35]: The studio
        - paragraph [ref=e36]:
          - text: We design
          - text: websites for local businesses, and build
          - text: quietly for agencies. Fast, clear, and
          - emphasis [ref=e41]: impossible to ignore.
    - region "Selected work" [ref=e42]:
      - generic [ref=e43]:
        - generic [ref=e44]:
          - heading "Selected work" [level=2] [ref=e45]:
            - text: Selected
            - emphasis [ref=e46]: work
          - paragraph [ref=e48]: 1 client site · 3 concepts
        - list [ref=e49]:
          - listitem [ref=e50]:
            - link "Reid’s Home & Yard Home services Client · Live (live client website, opens in a new tab)" [ref=e51]:
              - /url: https://reidshomeandyard.getaxiom.ca/
              - generic [ref=e53]: Reid’s Home & Yard
              - generic [ref=e54]:
                - generic [ref=e55]: Home services
                - generic [ref=e56]: Client · Live
                - generic [ref=e57]: (live client website, opens in a new tab)
          - listitem [ref=e58]:
            - link "Northline Physio & Rehab Health & wellness Concept (concept build, opens in a new tab)" [ref=e59]:
              - /url: https://physio.getaxiom.ca
              - generic [ref=e61]: Northline Physio & Rehab
              - generic [ref=e62]:
                - generic [ref=e63]: Health & wellness
                - generic [ref=e64]: Concept
                - generic [ref=e65]: (concept build, opens in a new tab)
          - listitem [ref=e66]:
            - link "Aurelia Dental Studio Dental Concept (concept build, opens in a new tab)" [ref=e67]:
              - /url: https://dental.getaxiom.ca
              - generic [ref=e69]: Aurelia Dental Studio
              - generic [ref=e70]:
                - generic [ref=e71]: Dental
                - generic [ref=e72]: Concept
                - generic [ref=e73]: (concept build, opens in a new tab)
          - listitem [ref=e74]:
            - link "Landscaping Studio Landscaping Concept (concept build, opens in a new tab)" [ref=e75]:
              - /url: https://landscaping.getaxiom.ca
              - generic [ref=e77]: Landscaping Studio
              - generic [ref=e78]:
                - generic [ref=e79]: Landscaping
                - generic [ref=e80]: Concept
                - generic [ref=e81]: (concept build, opens in a new tab)
        - generic [ref=e82]:
          - paragraph [ref=e83]: Concept builds are demonstrations designed by Axiom Web and labelled as such. They are not client results.
          - link "All work" [ref=e84]:
            - /url: /work/
            - text: All work
            - img [ref=e85]
    - region "What we offer" [ref=e87]:
      - generic [ref=e88]:
        - generic [ref=e89]:
          - paragraph [ref=e90]: For local businesses
          - heading "A site that makes you the obvious choice." [level=2] [ref=e91]:
            - text: A site that makes you the
            - emphasis [ref=e92]: obvious
            - text: choice.
          - generic [ref=e93]:
            - generic [ref=e94]:
              - term [ref=e95]: Fixed price
              - definition [ref=e96]: from CAD $900
            - generic [ref=e97]:
              - term [ref=e98]: Brief to live
              - definition [ref=e99]: 2–4 weeks
            - generic [ref=e100]:
              - term [ref=e101]: Payments
              - definition [ref=e102]: two, tied to milestones
            - generic [ref=e103]:
              - term [ref=e104]: Hosting
              - definition [ref=e105]: simple, annual
            - generic [ref=e106]:
              - term [ref=e107]: Ownership
              - definition [ref=e108]: your domain, your accounts
          - generic [ref=e109]:
            - link "Start a project" [ref=e110]:
              - /url: /start-a-project/
              - text: Start a project
              - img [ref=e111]
            - link "See pricing" [ref=e113]:
              - /url: /pricing/
          - list [ref=e114]:
            - listitem [ref=e115]:
              - link "Local Business Websites" [ref=e116]:
                - /url: /services/local-business-websites/
            - listitem [ref=e117]:
              - link "Conversion-Focused Web Design" [ref=e118]:
                - /url: /services/conversion-sites/
            - listitem [ref=e119]:
              - link "Website Redesigns" [ref=e120]:
                - /url: /services/rebuilds/
        - generic [ref=e121]:
          - paragraph [ref=e122]: For agencies
          - heading "Your name on it. Our hands on it." [level=2] [ref=e123]:
            - text: Your name on it.
            - emphasis [ref=e124]: Our hands
            - text: on it.
          - generic [ref=e125]:
            - generic [ref=e126]:
              - term [ref=e127]: Rate
              - definition [ref=e128]: CAD 50/hour
            - generic [ref=e129]:
              - term [ref=e130]: Quote
              - definition [ref=e131]: fixed, within 24 hours
            - generic [ref=e132]:
              - term [ref=e133]: Confidentiality
              - definition [ref=e134]: NDA by default
            - generic [ref=e135]:
              - term [ref=e136]: After launch
              - definition [ref=e137]: 30 days of free fixes
            - generic [ref=e138]:
              - term [ref=e139]: Platforms
              - definition [ref=e140]: custom, Shopify, WordPress
          - link "Send a first job" [ref=e142]:
            - /url: /agencies/
            - text: Send a first job
            - img [ref=e143]
    - region "First call to launch in four steps" [ref=e145]:
      - generic [ref=e146]:
        - generic [ref=e147]:
          - paragraph [ref=e148]: How it works
          - heading "First call to launch in four steps" [level=2] [ref=e149]:
            - text: First call to launch in
            - emphasis [ref=e150]: four
            - text: steps
          - paragraph [ref=e151]: Scope and price are agreed in writing before design starts, so there are no surprises later.
          - link "See the full process" [ref=e152]:
            - /url: /approach/
            - text: See the full process
            - img [ref=e153]
        - list [ref=e155]:
          - listitem [ref=e156]:
            - generic [ref=e157]: "01"
            - generic [ref=e158]:
              - paragraph [ref=e159]: Week 1
              - heading "Review" [level=3] [ref=e160]
              - paragraph [ref=e161]: We look at your business, your current site and how customers find and choose you, then agree what the new site has to do.
          - listitem [ref=e162]:
            - generic [ref=e163]: "02"
            - generic [ref=e164]:
              - paragraph [ref=e165]: Week 2
              - heading "Scope" [level=3] [ref=e166]
              - paragraph [ref=e167]: We confirm the pages, contact paths, content and price in writing before design starts. Decisions happen here, not mid-build.
          - listitem [ref=e168]:
            - generic [ref=e169]: "03"
            - generic [ref=e170]:
              - paragraph [ref=e171]: Weeks 2–3
              - heading "Design & build" [level=3] [ref=e172]
              - paragraph [ref=e173]: We design and build the full site from your material, edit the copy for clarity and share a private staging link for review.
          - listitem [ref=e174]:
            - generic [ref=e175]: "04"
            - generic [ref=e176]:
              - paragraph [ref=e177]: Weeks 3–4
              - heading "Launch & support" [level=3] [ref=e178]
              - paragraph [ref=e179]: We test on real devices, connect your domain, set up the SEO basics and go live — then stay on hand for thirty days.
    - region "Two founders. No account managers." [ref=e180]:
      - generic [ref=e181]:
        - generic [ref=e182]:
          - paragraph [ref=e183]: Who you’ll work with
          - heading "Two founders. No account managers." [level=2] [ref=e184]
          - paragraph [ref=e185]: Aidan Magee and Riley Hinsperger are the co-founders of Axiom Web, the web-focused subsidiary of Axiom International. You work directly with the people who plan, design and build your website.
          - link "About the studio" [ref=e186]:
            - /url: /about/
            - text: About the studio
            - img [ref=e187]
        - list [ref=e189]:
          - listitem [ref=e190]:
            - paragraph [ref=e191]: Co-founder · Strategy & client lead
            - heading "Aidan Magee" [level=3] [ref=e192]
            - paragraph [ref=e193]: Your first point of contact. Aidan runs discovery, scope and content so the site reflects how your customers actually decide, from the first call through launch.
          - listitem [ref=e194]:
            - paragraph [ref=e195]: Co-founder · Design & development
            - heading "Riley Hinsperger" [level=3] [ref=e196]
            - paragraph [ref=e197]: Riley designs and builds every site, handling development, performance and testing so it loads quickly and works properly on every device.
    - region "Straight answers" [ref=e198]:
      - generic [ref=e199]:
        - generic [ref=e200]:
          - paragraph [ref=e201]: FAQ
          - heading "Straight answers" [level=2] [ref=e202]:
            - text: Straight
            - emphasis [ref=e203]: answers
          - paragraph [ref=e204]: About cost, timing and what working with us looks like.
          - link "Ask something else" [ref=e205]:
            - /url: /contact/
            - text: Ask something else
            - img [ref=e206]
        - generic [ref=e208]:
          - group [ref=e209]:
            - generic "How much does a website cost?" [ref=e210]:
              - heading "How much does a website cost?" [level=3] [ref=e211]
              - img [ref=e213]
            - paragraph [ref=e216]: Our packages start at CAD $900 for a one-page Local Launch Special, CAD $1,200 for a Local Business Website of up to three pages, and CAD $1,500 for an Expanded Website of up to five pages. Online stores, accounts and custom systems are quoted after a review.
          - group [ref=e217]:
            - generic "How long does it take to build a website?" [ref=e218]:
              - heading "How long does it take to build a website?" [level=3] [ref=e219]
              - img [ref=e221]
          - group [ref=e222]:
            - generic "What do I need to provide?" [ref=e223]:
              - heading "What do I need to provide?" [level=3] [ref=e224]
              - img [ref=e226]
          - group [ref=e227]:
            - generic "Is hosting included?" [ref=e228]:
              - heading "Is hosting included?" [level=3] [ref=e229]
              - img [ref=e231]
          - group [ref=e232]:
            - generic "Do you only work with businesses in Kitchener-Waterloo?" [ref=e233]:
              - heading "Do you only work with businesses in Kitchener-Waterloo?" [level=3] [ref=e234]
              - img [ref=e236]
          - group [ref=e237]:
            - generic "What happens after I send my project details?" [ref=e238]:
              - heading "What happens after I send my project details?" [level=3] [ref=e239]
              - img [ref=e241]
    - region "Let’s make yours." [ref=e242]:
      - generic [ref=e243]:
        - generic [ref=e244]:
          - heading "Let’s make yours." [level=2] [ref=e246]:
            - text: Let’s make
            - emphasis [ref=e247]: yours.
          - link "Start a project" [ref=e248]:
            - /url: /start-a-project/
            - generic [ref=e249]:
              - text: Start a
              - text: project
        - generic [ref=e250]:
          - generic [ref=e251]:
            - generic [ref=e252]: contact@axiominternational.ca
            - button "Copy" [ref=e253]
            - link "Email contact@axiominternational.ca" [ref=e254]:
              - /url: mailto:contact@axiominternational.ca
          - generic [ref=e255]:
            - link "(226) 753-1833" [ref=e256]:
              - /url: tel:+12267531833
            - generic [ref=e257]: 257 Kipling Ave, Kitchener, ON
  - contentinfo [ref=e258]:
    - generic [ref=e259]:
      - generic [ref=e260]:
        - generic [ref=e261]:
          - link "Axiom Web home" [ref=e262]:
            - /url: /
            - text: axiom
            - generic [ref=e263]: web
          - paragraph [ref=e264]: A two-person web studio in Kitchener-Waterloo. Websites for local businesses across Ontario, and quiet overflow work for agencies.
          - list [ref=e265]:
            - listitem [ref=e266]:
              - link "contact@ axiominternational.ca" [ref=e267]:
                - /url: mailto:contact@axiominternational.ca
                - text: contact@
                - text: axiominternational.ca
            - listitem [ref=e268]:
              - link "(226) 753-1833" [ref=e269]:
                - /url: tel:+12267531833
            - listitem [ref=e270]:
              - generic [ref=e271]: 257 Kipling Ave, Kitchener, ON
        - navigation "Footer" [ref=e272]:
          - generic [ref=e273]:
            - heading "Services" [level=2] [ref=e274]
            - list [ref=e275]:
              - listitem [ref=e276]:
                - link "Local Business Websites" [ref=e277]:
                  - /url: /services/local-business-websites/
              - listitem [ref=e278]:
                - link "Conversion-Focused Web Design" [ref=e279]:
                  - /url: /services/conversion-sites/
              - listitem [ref=e280]:
                - link "Website Redesigns" [ref=e281]:
                  - /url: /services/rebuilds/
              - listitem [ref=e282]:
                - link "All services" [ref=e283]:
                  - /url: /services/
              - listitem [ref=e284]:
                - link "Pricing" [ref=e285]:
                  - /url: /pricing/
          - generic [ref=e286]:
            - heading "Studio" [level=2] [ref=e287]
            - list [ref=e288]:
              - listitem [ref=e289]:
                - link "About" [ref=e290]:
                  - /url: /about/
              - listitem [ref=e291]:
                - link "Our process" [ref=e292]:
                  - /url: /approach/
              - listitem [ref=e293]:
                - link "Work" [ref=e294]:
                  - /url: /work/
              - listitem [ref=e295]:
                - link "For agencies" [ref=e296]:
                  - /url: /agencies/
              - listitem [ref=e297]:
                - link "Contact" [ref=e298]:
                  - /url: /contact/
              - listitem [ref=e299]:
                - link "Start a project" [ref=e300]:
                  - /url: /start-a-project/
          - generic [ref=e301]:
            - heading "Industries" [level=2] [ref=e302]
            - list [ref=e303]:
              - listitem [ref=e304]:
                - link "Contractors & home services" [ref=e305]:
                  - /url: /industries/home-services/
              - listitem [ref=e306]:
                - link "Clinics & health practices" [ref=e307]:
                  - /url: /industries/health-clinics/
              - listitem [ref=e308]:
                - link "Salons, spas & barbers" [ref=e309]:
                  - /url: /industries/salons-personal-care/
              - listitem [ref=e310]:
                - link "Restaurants & cafés" [ref=e311]:
                  - /url: /industries/restaurants-hospitality/
              - listitem [ref=e312]:
                - link "Law & professional services" [ref=e313]:
                  - /url: /industries/professional-services/
              - listitem [ref=e314]:
                - link "All industries" [ref=e315]:
                  - /url: /industries/
          - generic [ref=e316]:
            - heading "Service areas" [level=2] [ref=e317]
            - list [ref=e318]:
              - listitem [ref=e319]:
                - link "Web design Kitchener" [ref=e320]:
                  - /url: /web-design/kitchener/
              - listitem [ref=e321]:
                - link "Web design Waterloo" [ref=e322]:
                  - /url: /web-design/waterloo/
              - listitem [ref=e323]:
                - link "Web design Cambridge" [ref=e324]:
                  - /url: /web-design/cambridge/
              - listitem [ref=e325]:
                - link "Web design Guelph" [ref=e326]:
                  - /url: /web-design/guelph/
              - listitem [ref=e327]:
                - link "Web design Hamilton" [ref=e328]:
                  - /url: /web-design/hamilton/
              - listitem [ref=e329]:
                - link "All service areas" [ref=e330]:
                  - /url: /web-design/
      - generic [ref=e331]:
        - paragraph [ref=e332]: © 2026 Axiom Web. Co-founded by Aidan Magee and Riley Hinsperger. Axiom Web is the web-focused subsidiary of Axiom International.
        - list [ref=e333]:
          - listitem [ref=e334]:
            - link "Privacy Policy" [ref=e335]:
              - /url: /privacy/
          - listitem [ref=e336]:
            - link "Terms of Service" [ref=e337]:
              - /url: /terms/
  - generic [ref=e340]:
    - button "Menu" [ref=e341]:
      - img [ref=e343]
      - generic: Menu
    - button "Inspect" [ref=e347]:
      - img [ref=e349]
      - generic: Inspect
    - button "Audit" [ref=e351]:
      - generic [ref=e352]:
        - img [ref=e353]
        - img [ref=e356]
      - generic: Audit
    - button "Settings" [ref=e359]:
      - img [ref=e361]
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