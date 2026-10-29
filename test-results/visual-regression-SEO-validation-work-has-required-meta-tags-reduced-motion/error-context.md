# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: visual-regression.spec.ts >> SEO validation >> work has required meta tags
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
            - generic [ref=e32]: Work
      - generic [ref=e34]:
        - paragraph [ref=e35]: Work
        - heading "Websites we’ve designed and built" [level=1] [ref=e36]:
          - text: Websites we’ve designed and
          - emphasis [ref=e37]: built
        - paragraph [ref=e38]: A live client website, plus concept builds that show how we structure sites for different kinds of local businesses. Every concept is clearly labelled.
        - generic [ref=e39]:
          - link "Start a project" [ref=e40]:
            - /url: /start-a-project/
            - text: Start a project
            - img [ref=e41]
          - link "Our services" [ref=e43]:
            - /url: /services/
    - region "Reid’s Home & Yard" [ref=e44]:
      - article [ref=e46]:
        - figure [ref=e47]:
          - generic [ref=e53]: reidshomeandyard.getaxiom.ca
          - img "Reid’s Home & Yard website home page with the headline “A clearer walkway. An easier winter.” beside a cleared, snowy front walkway" [ref=e56]
        - generic [ref=e57]:
          - generic [ref=e58]: Client site · Live
          - paragraph [ref=e59]: Home services · Ottawa, ON
          - heading "Reid’s Home & Yard" [level=2] [ref=e60]
          - paragraph [ref=e61]: Walkway snow clearing, salting and de-icing, presented in one calm, focused page with direct contact.
          - generic [ref=e62]:
            - generic [ref=e63]:
              - term [ref=e64]: The brief
              - definition [ref=e65]: Introduce winter walkway services for Ottawa homeowners while keeping future lawn care clearly separate.
            - generic [ref=e66]:
              - term [ref=e67]: What we built
              - definition [ref=e68]: An evergreen visual identity, winter photography, plain service descriptions and direct phone and email links — no booking account needed.
          - link "Visit the live site (opens in a new tab)" [ref=e69]:
            - /url: https://reidshomeandyard.getaxiom.ca/
            - text: Visit the live site
            - generic [ref=e70]: (opens in a new tab)
            - img [ref=e71]
    - region "How we approach different industries" [ref=e74]:
      - generic [ref=e75]:
        - generic [ref=e76]:
          - paragraph [ref=e77]: Concept builds
          - heading "How we approach different industries" [level=2] [ref=e78]
          - paragraph [ref=e79]: Concept builds are working demonstration websites designed by Axiom Web. Each one starts from a common problem in its industry and shows how we would structure the site to solve it. They are not client results.
        - generic [ref=e80]:
          - article [ref=e81]:
            - img "Northline Physio concept website with the headline “Evidence-based physiotherapy for active lives” and a Book an Assessment button" [ref=e84]
            - generic [ref=e85]:
              - paragraph [ref=e86]:
                - generic [ref=e87]: Health & wellness
                - generic [ref=e88]: Concept
              - heading "Northline Physio & Rehab (concept build, opens in a new tab)" [level=3] [ref=e89]:
                - link "Northline Physio & Rehab (concept build, opens in a new tab)" [ref=e90]:
                  - /url: https://physio.getaxiom.ca
                  - text: Northline Physio & Rehab
                  - generic [ref=e91]: (concept build, opens in a new tab)
              - paragraph [ref=e92]: Treatment paths, practitioner credibility and assessment booking brought together on the first screen.
              - generic [ref=e93]:
                - generic [ref=e94]:
                  - term [ref=e95]: The brief
                  - definition [ref=e96]: Patients needed to recognise their problem, trust the clinic and book an assessment without searching.
                - generic [ref=e97]:
                  - term [ref=e98]: What we built
                  - definition [ref=e99]: Symptom-led care paths, licensed-practitioner cues and a persistent “Book an assessment” action.
              - generic [ref=e100]:
                - text: View concept
                - img [ref=e101]
          - article [ref=e104]:
            - img "Bright dental studio treatment room used as the hero image for the Aurelia Dental concept website" [ref=e107]
            - generic [ref=e108]:
              - paragraph [ref=e109]:
                - generic [ref=e110]: Dental
                - generic [ref=e111]: Concept
              - heading "Aurelia Dental Studio (concept build, opens in a new tab)" [level=3] [ref=e112]:
                - link "Aurelia Dental Studio (concept build, opens in a new tab)" [ref=e113]:
                  - /url: https://dental.getaxiom.ca
                  - text: Aurelia Dental Studio
                  - generic [ref=e114]: (concept build, opens in a new tab)
              - paragraph [ref=e115]: A warmer first impression and fewer steps to an appointment for new patients.
              - generic [ref=e116]:
                - generic [ref=e117]:
                  - term [ref=e118]: The brief
                  - definition [ref=e119]: New patients needed reassurance about the practice before they were ready to request an appointment.
                - generic [ref=e120]:
                  - term [ref=e121]: What we built
                  - definition [ref=e122]: Care style, services, team cues and booking placed close together, in a calm and bright visual system.
              - generic [ref=e123]:
                - text: View concept
                - img [ref=e124]
          - article [ref=e127]:
            - img "Roofer inspecting a residential roof, used as the hero image for the roofing concept website" [ref=e130]
            - generic [ref=e131]:
              - paragraph [ref=e132]:
                - generic [ref=e133]: Roofing
                - generic [ref=e134]: Concept
              - heading "Roofing Conversion Site (concept build, opens in a new tab)" [level=3] [ref=e135]:
                - link "Roofing Conversion Site (concept build, opens in a new tab)" [ref=e136]:
                  - /url: https://roofing.getaxiom.ca
                  - text: Roofing Conversion Site
                  - generic [ref=e137]: (concept build, opens in a new tab)
              - paragraph [ref=e138]: Urgent repair calls and planned estimates split into two clear, separate paths.
              - generic [ref=e139]:
                - generic [ref=e140]:
                  - term [ref=e141]: The brief
                  - definition [ref=e142]: Emergency repairs and planned replacements were competing for the same generic call to action.
                - generic [ref=e143]:
                  - term [ref=e144]: What we built
                  - definition [ref=e145]: A prominent emergency call button, a separate estimate request and proof of workmanship beside both.
              - generic [ref=e146]:
                - text: View concept
                - img [ref=e147]
          - article [ref=e150]:
            - img "Modern home exterior with a landscaped pool area, used as the hero image for the landscaping concept website" [ref=e153]
            - generic [ref=e154]:
              - paragraph [ref=e155]:
                - generic [ref=e156]: Landscaping
                - generic [ref=e157]: Concept
              - heading "Landscaping Studio (concept build, opens in a new tab)" [level=3] [ref=e158]:
                - link "Landscaping Studio (concept build, opens in a new tab)" [ref=e159]:
                  - /url: https://landscaping.getaxiom.ca
                  - text: Landscaping Studio
                  - generic [ref=e160]: (concept build, opens in a new tab)
              - paragraph [ref=e161]: Finished projects lead the page and the first quote request is kept short.
              - generic [ref=e162]:
                - generic [ref=e163]:
                  - term [ref=e164]: The brief
                  - definition [ref=e165]: Project quality was not visible soon enough, and the quote form asked for too much up front.
                - generic [ref=e166]:
                  - term [ref=e167]: What we built
                  - definition [ref=e168]: Project photography first, a shortened initial quote form and service areas stated plainly.
              - generic [ref=e169]:
                - text: View concept
                - img [ref=e170]
          - article [ref=e173]:
            - img "Manicured hand resting on a light wooden table beside “The Nail Studio — Minimal. Clean. Refined.” branding" [ref=e176]
            - generic [ref=e177]:
              - paragraph [ref=e178]:
                - generic [ref=e179]: Salon & beauty
                - generic [ref=e180]: Concept
              - heading "The Nail Studio (concept build, opens in a new tab)" [level=3] [ref=e181]:
                - link "The Nail Studio (concept build, opens in a new tab)" [ref=e182]:
                  - /url: https://nails.getaxiom.ca
                  - text: The Nail Studio
                  - generic [ref=e183]: (concept build, opens in a new tab)
              - paragraph [ref=e184]: Services are easy to compare and booking appears before visitors start hunting for it.
              - generic [ref=e185]:
                - generic [ref=e186]:
                  - term [ref=e187]: The brief
                  - definition [ref=e188]: Services and booking were treated as secondary details instead of the main reason people visit.
                - generic [ref=e189]:
                  - term [ref=e190]: What we built
                  - definition [ref=e191]: Service comparison, studio standards and booking moved into the first decision path.
              - generic [ref=e192]:
                - text: View concept
                - img [ref=e193]
          - article [ref=e196]:
            - img "Barber cutting a client’s hair in a warm, wood-panelled shop, used as the hero image for the Blackline Barber concept" [ref=e199]
            - generic [ref=e200]:
              - paragraph [ref=e201]:
                - generic [ref=e202]: Barbershop
                - generic [ref=e203]: Concept
              - heading "Blackline Barber Co. (concept build, opens in a new tab)" [level=3] [ref=e204]:
                - link "Blackline Barber Co. (concept build, opens in a new tab)" [ref=e205]:
                  - /url: https://barber.getaxiom.ca
                  - text: Blackline Barber Co.
                  - generic [ref=e206]: (concept build, opens in a new tab)
              - paragraph [ref=e207]: A sharper brand with the booking link visible on every screen.
              - generic [ref=e208]:
                - generic [ref=e209]:
                  - term [ref=e210]: The brief
                  - definition [ref=e211]: The brand needed to feel sharper, and the next appointment needed to be easy to book from a phone.
                - generic [ref=e212]:
                  - term [ref=e213]: What we built
                  - definition [ref=e214]: Photography as the first signal, a short service menu and a booking action that stays in reach.
              - generic [ref=e215]:
                - text: View concept
                - img [ref=e216]
          - article [ref=e219]:
            - img "Server carrying plated dishes through a warmly lit dining room, used as the hero image for the restaurant concept" [ref=e222]
            - generic [ref=e223]:
              - paragraph [ref=e224]:
                - generic [ref=e225]: Restaurant
                - generic [ref=e226]: Concept
              - heading "Restaurant Reservations (concept build, opens in a new tab)" [level=3] [ref=e227]:
                - link "Restaurant Reservations (concept build, opens in a new tab)" [ref=e228]:
                  - /url: https://restaurant.getaxiom.ca
                  - text: Restaurant Reservations
                  - generic [ref=e229]: (concept build, opens in a new tab)
              - paragraph [ref=e230]: Menu preview and reservations on the first mobile screen, where hungry visitors decide.
              - generic [ref=e231]:
                - generic [ref=e232]:
                  - term [ref=e233]: The brief
                  - definition [ref=e234]: Menu and reservation intent were split across the site, forcing guests to search.
                - generic [ref=e235]:
                  - term [ref=e236]: What we built
                  - definition [ref=e237]: A menu preview, opening hours and a reservation action together at the top of the page.
              - generic [ref=e238]:
                - text: View concept
                - img [ref=e239]
          - article [ref=e242]:
            - img "Boardroom table with a judge’s gavel, used as the hero image for the Harrow & Calloway law firm concept" [ref=e245]
            - generic [ref=e246]:
              - paragraph [ref=e247]:
                - generic [ref=e248]: Law firm
                - generic [ref=e249]: Concept
              - heading "Harrow & Calloway (concept build, opens in a new tab)" [level=3] [ref=e250]:
                - link "Harrow & Calloway (concept build, opens in a new tab)" [ref=e251]:
                  - /url: https://law.getaxiom.ca
                  - text: Harrow & Calloway
                  - generic [ref=e252]: (concept build, opens in a new tab)
              - paragraph [ref=e253]: Clearer practice areas, lighter copy and one obvious path to a consultation.
              - generic [ref=e254]:
                - generic [ref=e255]:
                  - term [ref=e256]: The brief
                  - definition [ref=e257]: Legal websites can feel dense and cautious, which makes the first contact harder than it needs to be.
                - generic [ref=e258]:
                  - term [ref=e259]: What we built
                  - definition [ref=e260]: Practice areas clarified, copy reduced to what a prospect needs, and consultation as the primary action.
              - generic [ref=e261]:
                - text: View concept
                - img [ref=e262]
    - region "Want a website like these for your business?" [ref=e265]:
      - generic [ref=e266]:
        - generic [ref=e267]:
          - generic [ref=e268]:
            - heading "Want a website like these for your business?" [level=2] [ref=e269]:
              - text: Want a website like these for your
              - emphasis [ref=e270]: business?
            - paragraph [ref=e271]: Tell us what you do and what your current site is missing. We reply within one business day with a recommended package and a clear price.
          - link "Start a project" [ref=e272]:
            - /url: /start-a-project/
            - generic [ref=e273]:
              - text: Start a
              - text: project
        - generic [ref=e274]:
          - generic [ref=e275]:
            - generic [ref=e276]: contact@axiominternational.ca
            - button "Copy" [ref=e277]
            - link "Email contact@axiominternational.ca" [ref=e278]:
              - /url: mailto:contact@axiominternational.ca
          - generic [ref=e279]:
            - link "(226) 753-1833" [ref=e280]:
              - /url: tel:+12267531833
            - generic [ref=e281]: 257 Kipling Ave, Kitchener, ON
  - contentinfo [ref=e282]:
    - generic [ref=e283]:
      - generic [ref=e284]:
        - generic [ref=e285]:
          - link "Axiom Web home" [ref=e286]:
            - /url: /
            - text: axiom
            - generic [ref=e287]: web
          - paragraph [ref=e288]: A two-person web studio in Kitchener-Waterloo. Websites for local businesses across Ontario, and quiet overflow work for agencies.
          - list [ref=e289]:
            - listitem [ref=e290]:
              - link "contact@ axiominternational.ca" [ref=e291]:
                - /url: mailto:contact@axiominternational.ca
                - text: contact@
                - text: axiominternational.ca
            - listitem [ref=e292]:
              - link "(226) 753-1833" [ref=e293]:
                - /url: tel:+12267531833
            - listitem [ref=e294]:
              - generic [ref=e295]: 257 Kipling Ave, Kitchener, ON
        - navigation "Footer" [ref=e296]:
          - generic [ref=e297]:
            - heading "Services" [level=2] [ref=e298]
            - list [ref=e299]:
              - listitem [ref=e300]:
                - link "Local Business Websites" [ref=e301]:
                  - /url: /services/local-business-websites/
              - listitem [ref=e302]:
                - link "Conversion-Focused Web Design" [ref=e303]:
                  - /url: /services/conversion-sites/
              - listitem [ref=e304]:
                - link "Website Redesigns" [ref=e305]:
                  - /url: /services/rebuilds/
              - listitem [ref=e306]:
                - link "All services" [ref=e307]:
                  - /url: /services/
              - listitem [ref=e308]:
                - link "Pricing" [ref=e309]:
                  - /url: /pricing/
          - generic [ref=e310]:
            - heading "Studio" [level=2] [ref=e311]
            - list [ref=e312]:
              - listitem [ref=e313]:
                - link "About" [ref=e314]:
                  - /url: /about/
              - listitem [ref=e315]:
                - link "Our process" [ref=e316]:
                  - /url: /approach/
              - listitem [ref=e317]:
                - link "Work" [ref=e318]:
                  - /url: /work/
              - listitem [ref=e319]:
                - link "For agencies" [ref=e320]:
                  - /url: /agencies/
              - listitem [ref=e321]:
                - link "Contact" [ref=e322]:
                  - /url: /contact/
              - listitem [ref=e323]:
                - link "Start a project" [ref=e324]:
                  - /url: /start-a-project/
          - generic [ref=e325]:
            - heading "Industries" [level=2] [ref=e326]
            - list [ref=e327]:
              - listitem [ref=e328]:
                - link "Contractors & home services" [ref=e329]:
                  - /url: /industries/home-services/
              - listitem [ref=e330]:
                - link "Clinics & health practices" [ref=e331]:
                  - /url: /industries/health-clinics/
              - listitem [ref=e332]:
                - link "Salons, spas & barbers" [ref=e333]:
                  - /url: /industries/salons-personal-care/
              - listitem [ref=e334]:
                - link "Restaurants & cafés" [ref=e335]:
                  - /url: /industries/restaurants-hospitality/
              - listitem [ref=e336]:
                - link "Law & professional services" [ref=e337]:
                  - /url: /industries/professional-services/
              - listitem [ref=e338]:
                - link "All industries" [ref=e339]:
                  - /url: /industries/
          - generic [ref=e340]:
            - heading "Service areas" [level=2] [ref=e341]
            - list [ref=e342]:
              - listitem [ref=e343]:
                - link "Web design Kitchener" [ref=e344]:
                  - /url: /web-design/kitchener/
              - listitem [ref=e345]:
                - link "Web design Waterloo" [ref=e346]:
                  - /url: /web-design/waterloo/
              - listitem [ref=e347]:
                - link "Web design Cambridge" [ref=e348]:
                  - /url: /web-design/cambridge/
              - listitem [ref=e349]:
                - link "Web design Guelph" [ref=e350]:
                  - /url: /web-design/guelph/
              - listitem [ref=e351]:
                - link "Web design Hamilton" [ref=e352]:
                  - /url: /web-design/hamilton/
              - listitem [ref=e353]:
                - link "All service areas" [ref=e354]:
                  - /url: /web-design/
      - generic [ref=e355]:
        - paragraph [ref=e356]: © 2026 Axiom Web. Co-founded by Aidan Magee and Riley Hinsperger. Axiom Web is the web-focused subsidiary of Axiom International.
        - list [ref=e357]:
          - listitem [ref=e358]:
            - link "Privacy Policy" [ref=e359]:
              - /url: /privacy/
          - listitem [ref=e360]:
            - link "Terms of Service" [ref=e361]:
              - /url: /terms/
  - generic [ref=e364]:
    - button "Menu" [ref=e365]:
      - img [ref=e367]
      - generic: Menu
    - button "Inspect" [ref=e371]:
      - img [ref=e373]
      - generic: Inspect
    - button "Audit" [ref=e375]:
      - generic [ref=e376]:
        - img [ref=e377]
        - img [ref=e380]
      - generic: Audit
    - button "Settings" [ref=e383]:
      - img [ref=e385]
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