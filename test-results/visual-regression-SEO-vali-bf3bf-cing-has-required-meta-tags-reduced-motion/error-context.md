# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: visual-regression.spec.ts >> SEO validation >> pricing has required meta tags
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
            - generic [ref=e32]: Pricing
      - generic [ref=e34]:
        - paragraph [ref=e35]: Pricing
        - heading "Simple, published website pricing" [level=1] [ref=e36]:
          - text: Simple, published website
          - emphasis [ref=e37]: pricing
        - paragraph [ref=e38]: Four packages, with prices on the page. Your exact price is confirmed in a written scope before any work begins, and it doesn’t change unless the scope does.
    - region "Website packages" [ref=e39]:
      - generic [ref=e40]:
        - heading "Website packages" [level=2] [ref=e41]
        - generic [ref=e42]:
          - article [ref=e43]:
            - generic [ref=e44]:
              - paragraph [ref=e45]: Local Launch Special
              - generic [ref=e46]: Introductory
            - paragraph [ref=e47]:
              - generic [ref=e48]: CAD $900
              - generic [ref=e49]: Starting at
            - heading "One page, up to six sections" [level=3] [ref=e50]
            - paragraph [ref=e51]: An introductory package for very small local businesses that need a straightforward, professional presence.
            - list [ref=e52]:
              - listitem [ref=e53]: Single page with up to six sections
              - listitem [ref=e54]: Call, email and directions links
              - listitem [ref=e55]: Existing booking link connected
              - listitem [ref=e56]: First year of basic hosting included
            - link "Start with Launch" [ref=e57]:
              - /url: /start-a-project/?path=local-launch
              - text: Start with Launch
              - img [ref=e58]
          - article [ref=e60]:
            - generic [ref=e61]:
              - paragraph [ref=e62]: Local Business Website
              - generic [ref=e63]: Recommended
            - paragraph [ref=e64]:
              - generic [ref=e65]: CAD $1,200
              - generic [ref=e66]: Starting at
            - heading "Up to three pages" [level=3] [ref=e67]
            - paragraph [ref=e68]: "Our recommended package for an independent local business: a focused Home, Services and Contact structure."
            - list [ref=e69]:
              - listitem [ref=e70]: Home, Services and Contact pages
              - listitem [ref=e71]: Gallery where it strengthens the decision
              - listitem [ref=e72]: Quote, call, directions and booking paths
              - listitem [ref=e73]: First year of basic hosting included
            - link "Choose Local Business" [ref=e74]:
              - /url: /start-a-project/?path=local-business
              - text: Choose Local Business
              - img [ref=e75]
          - article [ref=e77]:
            - paragraph [ref=e79]: Expanded Website
            - paragraph [ref=e80]:
              - generic [ref=e81]: CAD $1,500
              - generic [ref=e82]: Starting at
            - heading "Up to five pages" [level=3] [ref=e83]
            - paragraph [ref=e84]: For businesses with more to explain and show, while keeping the build straightforward.
            - list [ref=e85]:
              - listitem [ref=e86]: About, Services, Gallery, Contact and more
              - listitem [ref=e87]: Room for a broader service story
              - listitem [ref=e88]: Quote, call, directions and booking paths
              - listitem [ref=e89]: First year of basic hosting included
            - link "Choose Expanded" [ref=e90]:
              - /url: /start-a-project/?path=expanded
              - text: Choose Expanded
              - img [ref=e91]
          - article [ref=e93]:
            - paragraph [ref=e95]: Custom
            - paragraph [ref=e96]:
              - generic [ref=e97]: Quoted
              - generic [ref=e98]: Scoped to the project
            - heading "Defined in a written scope" [level=3] [ref=e99]
            - paragraph [ref=e100]: "For requirements beyond a standard website: online stores, accounts, custom systems or larger migrations."
            - list [ref=e101]:
              - listitem [ref=e102]: E-commerce and online payments
              - listitem [ref=e103]: Databases and customer accounts
              - listitem [ref=e104]: Custom booking systems or software
              - listitem [ref=e105]: Substantial migrations and redirect plans
            - link "Request a quote" [ref=e106]:
              - /url: /start-a-project/?path=custom
              - text: Request a quote
              - img [ref=e107]
        - paragraph [ref=e109]: All prices are in Canadian dollars. The Local Launch Special is an introductory package with a restricted scope; projects needing more pages or custom functionality use another package.
    - region "What’s included" [ref=e110]:
      - generic [ref=e111]:
        - generic [ref=e112]:
          - paragraph [ref=e113]: Every standard package
          - heading "What’s included" [level=2] [ref=e114]
          - paragraph [ref=e115]: The package price covers the full delivery standard, from scope to launch. The Local Launch Special follows the same standard within its one-page scope.
        - generic [ref=e116]:
          - list [ref=e117]:
            - listitem [ref=e118]: Custom responsive design and development
            - listitem [ref=e119]: Mobile optimization
            - listitem [ref=e120]: First year of basic hosting
            - listitem [ref=e121]: Domain connection
            - listitem [ref=e122]: "SEO basics: page titles and metadata"
            - listitem [ref=e123]: Existing booking-platform integration when applicable
            - listitem [ref=e124]: Light editing of client-supplied text
            - listitem [ref=e125]: Your logo and images placed and optimized
            - listitem [ref=e126]: Launch testing across devices
            - listitem [ref=e127]: Two consolidated revision rounds
            - listitem [ref=e128]: Thirty days of post-launch defect support
          - paragraph [ref=e129]: Booksy and other booking platforms remain your account and expense. Your domain, accounts and supplied assets stay yours.
    - region "Compare packages side by side" [ref=e130]:
      - generic [ref=e131]:
        - generic [ref=e132]:
          - paragraph [ref=e133]: Compare
          - heading "Compare packages side by side" [level=2] [ref=e134]
          - paragraph [ref=e135]: The same quality standard applies throughout. The differences are page scope and whether the project needs custom systems.
        - region "Package comparison table, scrollable" [ref=e136]:
          - table [ref=e137]:
            - rowgroup [ref=e138]:
              - row "Feature Local Launch Special Recommended Local Business Website Expanded Website Custom" [ref=e139]:
                - columnheader "Feature" [ref=e140]:
                  - generic [ref=e141]: Feature
                - columnheader "Local Launch Special" [ref=e142]:
                  - generic [ref=e143]: Local Launch Special
                - columnheader "Recommended Local Business Website" [ref=e144]:
                  - generic [ref=e145]: Recommended
                  - generic [ref=e146]: Local Business Website
                - columnheader "Expanded Website" [ref=e147]:
                  - generic [ref=e148]: Expanded Website
                - columnheader "Custom" [ref=e149]:
                  - generic [ref=e150]: Custom
            - rowgroup [ref=e151]:
              - row "Starting price CAD $900 CAD $1,200 CAD $1,500 Quoted" [ref=e152]:
                - rowheader "Starting price" [ref=e153]
                - cell "CAD $900" [ref=e154]
                - cell "CAD $1,200" [ref=e155]
                - cell "CAD $1,500" [ref=e156]
                - cell "Quoted" [ref=e157]
              - row "Pages 1 page, up to 6 sections Up to 3 pages Up to 5 pages Defined in scope" [ref=e158]:
                - rowheader "Pages" [ref=e159]
                - cell "1 page, up to 6 sections" [ref=e160]
                - cell "Up to 3 pages" [ref=e161]
                - cell "Up to 5 pages" [ref=e162]
                - cell "Defined in scope" [ref=e163]
              - row "Best fit Very small local business Independent local business More content, still straightforward Complex or unusual requirements" [ref=e164]:
                - rowheader "Best fit" [ref=e165]
                - cell "Very small local business" [ref=e166]
                - cell "Independent local business" [ref=e167]
                - cell "More content, still straightforward" [ref=e168]
                - cell "Complex or unusual requirements" [ref=e169]
              - row "Typical structure One focused page Home, Services, Contact About, Services, Gallery, Contact Custom pages and flows" [ref=e170]:
                - rowheader "Typical structure" [ref=e171]
                - cell "One focused page" [ref=e172]
                - cell "Home, Services, Contact" [ref=e173]
                - cell "About, Services, Gallery, Contact" [ref=e174]
                - cell "Custom pages and flows" [ref=e175]
              - row "Booking Existing platform link Existing platform link Existing platform link Custom systems quoted" [ref=e176]:
                - rowheader "Booking" [ref=e177]
                - cell "Existing platform link" [ref=e178]
                - cell "Existing platform link" [ref=e179]
                - cell "Existing platform link" [ref=e180]
                - cell "Custom systems quoted" [ref=e181]
              - row "Hosting after year one From CAD $120/year From CAD $120/year From CAD $120/year Defined in scope" [ref=e182]:
                - rowheader "Hosting after year one" [ref=e183]
                - cell "From CAD $120/year" [ref=e184]
                - cell "From CAD $120/year" [ref=e185]
                - cell "From CAD $120/year" [ref=e186]
                - cell "Defined in scope" [ref=e187]
              - row "Revisions & support 2 rounds + 30 days 2 rounds + 30 days 2 rounds + 30 days Defined in scope" [ref=e188]:
                - rowheader "Revisions & support" [ref=e189]
                - cell "2 rounds + 30 days" [ref=e190]
                - cell "2 rounds + 30 days" [ref=e191]
                - cell "2 rounds + 30 days" [ref=e192]
                - cell "Defined in scope" [ref=e193]
              - row "Get started Choose Local Launch Special Choose Local Business Website Choose Expanded Website Choose Custom" [ref=e194]:
                - rowheader "Get started" [ref=e195]:
                  - generic [ref=e196]: Get started
                - cell "Choose Local Launch Special" [ref=e197]:
                  - link "Choose Local Launch Special" [ref=e198]:
                    - /url: /start-a-project/?path=local-launch
                    - text: Choose
                    - generic [ref=e199]: Local Launch Special
                - cell "Choose Local Business Website" [ref=e200]:
                  - link "Choose Local Business Website" [ref=e201]:
                    - /url: /start-a-project/?path=local-business
                    - text: Choose
                    - generic [ref=e202]: Local Business Website
                - cell "Choose Expanded Website" [ref=e203]:
                  - link "Choose Expanded Website" [ref=e204]:
                    - /url: /start-a-project/?path=expanded
                    - text: Choose
                    - generic [ref=e205]: Expanded Website
                - cell "Choose Custom" [ref=e206]:
                  - link "Choose Custom" [ref=e207]:
                    - /url: /start-a-project/?path=custom
                    - text: Choose
                    - generic [ref=e208]: Custom
    - region "How payment works" [ref=e209]:
      - generic [ref=e210]:
        - generic [ref=e211]:
          - paragraph [ref=e212]: Payments
          - heading "How payment works" [level=2] [ref=e213]
          - paragraph [ref=e214]: Two payments tied to clear milestones, then simple annual hosting. No hourly billing.
        - list [ref=e215]:
          - listitem [ref=e216]:
            - generic [ref=e217]: "1"
            - heading "50% to begin" [level=3] [ref=e218]
            - paragraph [ref=e219]: Due once the written scope is approved and the agreement is signed.
          - listitem [ref=e220]:
            - generic [ref=e221]: "2"
            - heading "50% before launch" [level=3] [ref=e222]
            - paragraph [ref=e223]: Due after you approve the finished staging site, before it goes public.
          - listitem [ref=e224]:
            - generic [ref=e225]: "3"
            - heading "Hosting after year one" [level=3] [ref=e226]
            - paragraph [ref=e227]: Basic hosting from CAD $120 per year. Domain renewal stays in your name at the registrar’s price.
    - region "Pricing questions" [ref=e228]:
      - generic [ref=e229]:
        - generic [ref=e230]:
          - paragraph [ref=e231]: FAQ
          - heading "Pricing questions" [level=2] [ref=e232]
          - paragraph [ref=e233]: Can’t find your answer? Call or email us and we’ll explain how your project would be priced.
        - generic [ref=e234]:
          - group [ref=e235]:
            - generic "What is the Local Launch Special?" [ref=e236]:
              - heading "What is the Local Launch Special?" [level=3] [ref=e237]
              - img [ref=e239]
          - group [ref=e240]:
            - generic "What is the Local Business Website?" [ref=e241]:
              - heading "What is the Local Business Website?" [level=3] [ref=e242]
              - img [ref=e244]
          - group [ref=e245]:
            - generic "What is the Expanded Website?" [ref=e246]:
              - heading "What is the Expanded Website?" [level=3] [ref=e247]
              - img [ref=e249]
          - group [ref=e250]:
            - generic "Does the price include booking software?" [ref=e251]:
              - heading "Does the price include booking software?" [level=3] [ref=e252]
              - img [ref=e254]
          - group [ref=e255]:
            - generic "When is Custom needed?" [ref=e256]:
              - heading "When is Custom needed?" [level=3] [ref=e257]
              - img [ref=e259]
          - group [ref=e260]:
            - generic "How are payments handled?" [ref=e261]:
              - heading "How are payments handled?" [level=3] [ref=e262]
              - img [ref=e264]
          - group [ref=e265]:
            - generic "What happens after the first year?" [ref=e266]:
              - heading "What happens after the first year?" [level=3] [ref=e267]
              - img [ref=e269]
    - region "Not sure which package fits?" [ref=e270]:
      - generic [ref=e271]:
        - generic [ref=e272]:
          - generic [ref=e273]:
            - heading "Not sure which package fits?" [level=2] [ref=e274]:
              - text: Not sure which package
              - emphasis [ref=e275]: fits?
            - paragraph [ref=e276]: Send a few details about your business. We’ll recommend the right package and confirm the price within one business day.
          - link "Start a project" [ref=e277]:
            - /url: /start-a-project/
            - generic [ref=e278]:
              - text: Start a
              - text: project
        - generic [ref=e279]:
          - generic [ref=e280]:
            - generic [ref=e281]: contact@axiominternational.ca
            - button "Copy" [ref=e282]
            - link "Email contact@axiominternational.ca" [ref=e283]:
              - /url: mailto:contact@axiominternational.ca
          - generic [ref=e284]:
            - link "(226) 753-1833" [ref=e285]:
              - /url: tel:+12267531833
            - generic [ref=e286]: 257 Kipling Ave, Kitchener, ON
  - contentinfo [ref=e287]:
    - generic [ref=e288]:
      - generic [ref=e289]:
        - generic [ref=e290]:
          - link "Axiom Web home" [ref=e291]:
            - /url: /
            - text: axiom
            - generic [ref=e292]: web
          - paragraph [ref=e293]: A two-person web studio in Kitchener-Waterloo. Websites for local businesses across Ontario, and quiet overflow work for agencies.
          - list [ref=e294]:
            - listitem [ref=e295]:
              - link "contact@ axiominternational.ca" [ref=e296]:
                - /url: mailto:contact@axiominternational.ca
                - text: contact@
                - text: axiominternational.ca
            - listitem [ref=e297]:
              - link "(226) 753-1833" [ref=e298]:
                - /url: tel:+12267531833
            - listitem [ref=e299]:
              - generic [ref=e300]: 257 Kipling Ave, Kitchener, ON
        - navigation "Footer" [ref=e301]:
          - generic [ref=e302]:
            - heading "Services" [level=2] [ref=e303]
            - list [ref=e304]:
              - listitem [ref=e305]:
                - link "Local Business Websites" [ref=e306]:
                  - /url: /services/local-business-websites/
              - listitem [ref=e307]:
                - link "Conversion-Focused Web Design" [ref=e308]:
                  - /url: /services/conversion-sites/
              - listitem [ref=e309]:
                - link "Website Redesigns" [ref=e310]:
                  - /url: /services/rebuilds/
              - listitem [ref=e311]:
                - link "All services" [ref=e312]:
                  - /url: /services/
              - listitem [ref=e313]:
                - link "Pricing" [ref=e314]:
                  - /url: /pricing/
          - generic [ref=e315]:
            - heading "Studio" [level=2] [ref=e316]
            - list [ref=e317]:
              - listitem [ref=e318]:
                - link "About" [ref=e319]:
                  - /url: /about/
              - listitem [ref=e320]:
                - link "Our process" [ref=e321]:
                  - /url: /approach/
              - listitem [ref=e322]:
                - link "Work" [ref=e323]:
                  - /url: /work/
              - listitem [ref=e324]:
                - link "For agencies" [ref=e325]:
                  - /url: /agencies/
              - listitem [ref=e326]:
                - link "Contact" [ref=e327]:
                  - /url: /contact/
              - listitem [ref=e328]:
                - link "Start a project" [ref=e329]:
                  - /url: /start-a-project/
          - generic [ref=e330]:
            - heading "Industries" [level=2] [ref=e331]
            - list [ref=e332]:
              - listitem [ref=e333]:
                - link "Contractors & home services" [ref=e334]:
                  - /url: /industries/home-services/
              - listitem [ref=e335]:
                - link "Clinics & health practices" [ref=e336]:
                  - /url: /industries/health-clinics/
              - listitem [ref=e337]:
                - link "Salons, spas & barbers" [ref=e338]:
                  - /url: /industries/salons-personal-care/
              - listitem [ref=e339]:
                - link "Restaurants & cafés" [ref=e340]:
                  - /url: /industries/restaurants-hospitality/
              - listitem [ref=e341]:
                - link "Law & professional services" [ref=e342]:
                  - /url: /industries/professional-services/
              - listitem [ref=e343]:
                - link "All industries" [ref=e344]:
                  - /url: /industries/
          - generic [ref=e345]:
            - heading "Service areas" [level=2] [ref=e346]
            - list [ref=e347]:
              - listitem [ref=e348]:
                - link "Web design Kitchener" [ref=e349]:
                  - /url: /web-design/kitchener/
              - listitem [ref=e350]:
                - link "Web design Waterloo" [ref=e351]:
                  - /url: /web-design/waterloo/
              - listitem [ref=e352]:
                - link "Web design Cambridge" [ref=e353]:
                  - /url: /web-design/cambridge/
              - listitem [ref=e354]:
                - link "Web design Guelph" [ref=e355]:
                  - /url: /web-design/guelph/
              - listitem [ref=e356]:
                - link "Web design Hamilton" [ref=e357]:
                  - /url: /web-design/hamilton/
              - listitem [ref=e358]:
                - link "All service areas" [ref=e359]:
                  - /url: /web-design/
      - generic [ref=e360]:
        - paragraph [ref=e361]: © 2026 Axiom Web. Co-founded by Aidan Magee and Riley Hinsperger. Axiom Web is the web-focused subsidiary of Axiom International.
        - list [ref=e362]:
          - listitem [ref=e363]:
            - link "Privacy Policy" [ref=e364]:
              - /url: /privacy/
          - listitem [ref=e365]:
            - link "Terms of Service" [ref=e366]:
              - /url: /terms/
  - generic [ref=e369]:
    - button "Menu" [ref=e370]:
      - img [ref=e372]
      - generic: Menu
    - button "Inspect" [ref=e376]:
      - img [ref=e378]
      - generic: Inspect
    - button "Audit" [ref=e380]:
      - generic [ref=e381]:
        - img [ref=e382]
        - img [ref=e385]
      - generic: Audit
    - button "Settings" [ref=e388]:
      - img [ref=e390]
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