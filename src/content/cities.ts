export type CitySlug = 'kitchener' | 'waterloo' | 'cambridge' | 'guelph' | 'hamilton';
export type City = {
  slug: CitySlug;
  name: string;
  region: string;
  intro: string;
  description: string;
  localContext: string;
  neighborhoods: string[];
  focus: string;
  /** City-specific context, written from what is true about the place, not client history. */
  local: { title: string; paragraphs: string[] };
  planning: Array<{ title: string; text: string }>;
  questions: Array<{ q: string; a: string }>;
};

// Planning guidance describes the buyer's project, not unverified client history.
export const cities: City[] = [
  {
    slug: 'kitchener', name: 'Kitchener', region: 'Waterloo Region, Ontario',
    description: 'Web design in Kitchener from a founder-led local studio. Websites for Kitchener businesses from CAD $900, with published prices and launch in 2–4 weeks.',
    intro: 'For Kitchener businesses whose work deserves a clearer introduction. We design websites that explain the service, show credible evidence and make the next step straightforward.',
    localContext: 'Axiom Web is based in Kitchener-Waterloo. Aidan Magee and Riley Hinsperger lead the project from the first scope discussion through launch.',
    neighborhoods: ['Downtown Kitchener', 'Belmont Village', 'Doon', 'Stanley Park', 'Forest Heights'],
    focus: 'Help the right local customer make contact.',
    local: {
      title: "A Kitchener studio, working with Kitchener businesses",
      paragraphs: [
        "Axiom Web is based in Kitchener, so a first conversation can be a phone call or, where it suits both sides, a meeting in person. You deal with the two founders from the first call to launch, not an account manager.",
        "Kitchener customers rarely search the way a business owner expects. Someone in Doon or Huron looks for a service near them, on a phone, and compares two or three results before calling. Someone heading downtown or to Belmont Village wants an address, hours and parking before they leave. A good Kitchener site decides which of those visitors matters most and serves them first.",
        "The region keeps growing, and new residents have no habits yet: no favourite dentist, mechanic or salon. They find one by searching. That makes a clear, fast site with honest service details one of the most practical investments a Kitchener business can make, whether you work from a storefront on King Street or from a truck that covers the whole city.",
      ],
    },
    planning: [
      { title: 'Separate a visit from a service call.', text: 'A customer visiting a Belmont Village shop needs an address, hours and arrival details. Someone booking a contractor in Doon needs service coverage and a useful quote form. Choose the primary journey before choosing the page count.' },
      { title: 'Give each substantial service a clear purpose.', text: 'If customers ask different questions about your services, answer them on focused pages. Explain the work, exclusions and next step. A short service list is enough when the offer is simple; extra pages should earn their place.' },
      { title: 'Keep existing search paths intact.', text: 'For a replacement site, bring the current URL list and any pages that generate inquiries. We review what to retain, what to combine and where redirects are needed before the new structure is agreed.' },
    ],
    questions: [
      { q: 'Should a Kitchener business have separate pages for every neighbourhood?', a: 'Only when each page answers a distinct customer need with real information. A clear service-area section is usually more useful than repeating the same page for Doon, Stanley Park and Forest Heights.' },
      { q: 'What should I prepare for the first discussion?', a: 'Bring your current site, main services, genuine project photos or credentials, and the action you want visitors to take. Note whether customers visit your premises or you travel to them.' },
    ],
  },
  {
    slug: 'waterloo', name: 'Waterloo', region: 'Waterloo Region, Ontario',
    description: 'Web design in Waterloo for practices, studios and service firms. Websites from CAD $900 with published prices, built by a Kitchener-Waterloo studio.',
    intro: 'For Waterloo practices, studios and service firms with an offer that needs to be understood before someone books. Clear service detail, a considered first impression and a direct inquiry path.',
    localContext: 'Our studio is based in Kitchener-Waterloo. You work directly with Aidan and Riley; the scope defines the pages, booking links and launch responsibilities.',
    neighborhoods: ['Uptown Waterloo', 'University District', 'Lakeshore', 'Lincoln Heights', 'Beechwood'],
    focus: 'Make the first appointment easier to choose.',
    local: {
      title: "Websites for a city of students, professionals and practices",
      paragraphs: [
        "Waterloo has two very different audiences living side by side. Around the University of Waterloo and Wilfrid Laurier, a large share of customers changes every term and finds everything on a phone. In Uptown, Beechwood and Lakeshore, established households and professionals compare practices, studios and services carefully before they book.",
        "That shapes the site. A studio, gym or tutor near campus benefits from clear term-friendly pricing, a timetable that reads well on a phone and booking that works in a couple of taps. A clinic, firm or practice in Uptown benefits from plain explanations of each service, real credentials and a calm path to a first appointment.",
        "We are a Kitchener-Waterloo studio, so Waterloo is home ground. Projects start with a conversation about who you serve and what they need to know, and the written scope confirms the pages, booking links and launch plan before any design begins.",
      ],
    },
    planning: [
      { title: 'Answer the new-client questions first.', text: 'An Uptown practice or studio can reduce uncertainty by explaining appointment types, who each service suits and what to expect at the first visit. Put relevant qualifications and policies beside that decision, using information you can substantiate.' },
      { title: 'Connect the booking system you already use.', text: 'If you have an existing booking platform, make the handoff obvious on mobile. Link directly to the relevant service where the platform allows it. Custom scheduling, payments or customer accounts require a separately defined scope.' },
      { title: 'Make the location unambiguous.', text: 'For a Waterloo premises, publish the correct address, entrance and accessibility details you can verify. If you also serve Kitchener, describe that coverage without presenting a second office that does not exist.' },
    ],
    questions: [
      { q: 'Can the site use our existing appointment platform?', a: 'Existing booking-platform links can be connected where applicable. Your account and platform fees remain yours. Custom booking software is quoted separately after the requirements are reviewed.' },
      { q: 'How should a practice serving both Waterloo and Kitchener describe its location?', a: 'Use the real practice address consistently and explain the wider area you serve. Add a separate location page only for a real location with its own useful details.' },
    ],
  },
  {
    slug: 'cambridge', name: 'Cambridge', region: 'Waterloo Region, Ontario',
    description: 'Web design in Cambridge, Ontario for businesses in Galt, Preston and Hespeler. Websites from CAD $900, published prices and launch in 2–4 weeks.',
    intro: 'For Cambridge businesses that need customers to understand both the work and where it is available. Clear services, honest coverage and quote requests with the details needed to respond.',
    localContext: 'We serve Cambridge from our Kitchener-Waterloo base. The project begins with your services, customer questions and existing site, with scope confirmed before design.',
    neighborhoods: ['Galt', 'Preston', 'Hespeler', 'Blair', 'West Galt'],
    focus: 'Connect coverage to the work you actually offer.',
    local: {
      title: "Three town centres, one Cambridge website",
      paragraphs: [
        "Cambridge was formed from Galt, Preston and Hespeler, and many customers still search by those names. A homeowner in Hespeler may type the neighbourhood rather than the city. A good Cambridge site states coverage the way people actually say it, in one clear section, rather than cloning a page for every area.",
        "With Highway 401 running through the city, plenty of Cambridge businesses serve customers well beyond it: contractors working across Waterloo Region, suppliers delivering into the west GTA, trades that travel to Guelph and Brantford. If that describes you, the site should make the boundary obvious, so a quote request arrives from someone you can actually serve.",
        "Many Cambridge companies also serve both homeowners and commercial clients. Those buyers ask different questions and need different proof, so we plan the structure around them first and only add pages where the answers genuinely differ.",
      ],
    },
    planning: [
      { title: 'Explain Galt, Preston and Hespeler coverage.', text: 'A service business may travel throughout Cambridge while a shop serves customers at one address. Make that distinction explicit. List genuine coverage and any travel limitations in one useful section instead of cloning location pages.' },
      { title: 'Ask for details that make a quote possible.', text: 'For a trade or project service, an inquiry may need the job type, location and desired timing. Keep the first form short. Request technical documents or sensitive information through an appropriate follow-up channel when needed.' },
      { title: 'Organise commercial and residential work.', text: 'If you serve both, show which services apply to each buyer. Separate pages can be useful when scope, decision makers or required evidence differ. They are unnecessary when the same explanation answers both audiences.' },
    ],
    questions: [
      { q: 'Do we need separate websites for Galt, Preston and Hespeler?', a: 'A single well-structured site is usually sufficient. State the areas you actually serve, and use separate pages only where the services or location details genuinely differ.' },
      { q: 'Can a Cambridge trade business request quotes through the site?', a: 'Yes. We can scope an inquiry form around the information you need to start a conversation. Automated estimating, file handling or connections to other systems are reviewed as additional requirements.' },
    ],
  },
  {
    slug: 'guelph', name: 'Guelph', region: 'Guelph, Ontario',
    description: 'Web design in Guelph for local businesses, from a nearby Kitchener-Waterloo studio. Websites from CAD $900 with published prices and launch in 2–4 weeks.',
    intro: 'For Guelph businesses whose reputation travels by recommendation. Give referred visitors a clear account of your services, relevant work and what happens after they make contact.',
    localContext: 'Axiom Web serves Guelph from Kitchener-Waterloo. We establish the content, page count and review process before work begins, with direct access to both founders.',
    neighborhoods: ['Downtown Guelph', 'South End', 'West End', 'Old University', 'Exhibition Park'],
    focus: 'Give a referral enough detail to become an inquiry.',
    local: {
      title: "Built for a city that runs on recommendations",
      paragraphs: [
        "Guelph has a strong independent business culture. Downtown shops, studios and restaurants, trades that work the South End and the West End, and services for the farms and acreages around Puslinch and Guelph/Eramosa all lean heavily on word of mouth. The website's job is to back up the recommendation.",
        "When someone hears your name from a neighbour, they look you up to confirm it: what you do, whether you work where they live, and how to reach you. A clear first screen, real photos of your work and an honest service area answer all three in seconds. Anything vague sends them back to search, where a competitor is waiting.",
        "The University of Guelph adds a second rhythm: students and staff who arrive each September and look for nearly everything online. If they matter to your business, the site should speak to them directly, with simple pricing and contact that works on a phone.",
      ],
    },
    planning: [
      { title: 'Show work with context and permission.', text: 'A project gallery should explain what the customer needed and what your business supplied. Use photographs you own or have permission to publish. Keep concept work, supplier images and completed customer work clearly distinguished.' },
      { title: 'Describe city and surrounding-area service accurately.', text: 'If your business covers Guelph and nearby communities, state where you can take work and any limits. A downtown address and a broad travel area answer different questions; the site should make both easy to understand.' },
      { title: 'Plan for the content you can maintain.', text: 'A concise services page and a small, current gallery often serve buyers better than an empty news section. Decide who will provide photographs, approve wording and request updates before expanding the scope.' },
    ],
    questions: [
      { q: 'Can we start without a large portfolio?', a: 'Yes. Use accurate service descriptions, real qualifications and photographs you have permission to share. Do not fill gaps with invented reviews or results. Add completed work as usable evidence becomes available.' },
      { q: 'Should a Guelph business include surrounding towns on its site?', a: 'Include them when they are genuinely within your service area. Explain coverage and any booking limits in plain language. A list of places alone does not justify a separate page for each town.' },
    ],
  },
  {
    slug: 'hamilton', name: 'Hamilton', region: 'Hamilton, Ontario',
    description: 'Web design in Hamilton for local businesses on the Mountain, downtown and in Ancaster, Dundas and Stoney Creek. Websites from CAD $900, launch in 2–4 weeks.',
    intro: 'For Hamilton businesses with several services or a site that has become difficult to navigate. We clarify the offer, organise the pages and make contact straightforward on a phone.',
    localContext: 'We work with Hamilton businesses from our Kitchener-Waterloo studio, about an hour away. Reviews and approvals happen by phone, email and a private preview link.',
    neighborhoods: ['Downtown Hamilton', 'Westdale', 'The Mountain', 'Stoney Creek', 'Ancaster'],
    focus: 'Give a broad service area a clear website structure.',
    local: {
      title: "One city, a dozen places people search by name",
      paragraphs: [
        "Hamilton customers search by the place they know: Ancaster, Dundas, Stoney Creek, Waterdown, the Mountain, Westdale. A business that serves the whole city should say so in those words, plainly and in one place, so a homeowner on Upper James or a tenant on Locke Street can tell in seconds that you cover them.",
        "The lower city and the Mountain often behave like different markets. Downtown, James Street North, Locke Street and Ottawa Street are full of independent shops, studios and restaurants, where people want hours, an address and a reason to visit. Trades and home services on the Mountain and in the outer communities win on clear services, real photos and a quote request that takes a minute.",
        "We work with Hamilton businesses from Kitchener-Waterloo, about an hour away. Calls, content reviews and approvals happen by phone, email and a private preview link of your site, so you see every stage before anything goes public.",
      ],
    },
    planning: [
      { title: 'Distinguish service areas from actual premises.', text: 'A business serving the Mountain, Stoney Creek and Ancaster may operate from a single base. Explain that coverage honestly. Separate location pages make sense for real branches with their own contact details, services and arrival information.' },
      { title: 'Keep a rebuild accountable to the current site.', text: 'Before replacing an established website, inventory its useful pages, inquiry routes and integrations. Agree which URLs stay, which need redirects and who controls the domain. Substantial migrations are scoped separately from standard packages.' },
      { title: 'Make remote reviews decisive.', text: 'Bring together the person approving the copy and the person handling customer inquiries. Consolidate feedback into the agreed revision rounds. The launch decision should cover content, contact paths and responsibilities after handoff.' },
    ],
    questions: [
      { q: 'Is Axiom Web based in Hamilton?', a: 'No. Axiom Web is a two-founder studio based in Kitchener-Waterloo serving Hamilton businesses. Discussions, content review and staging approval can be handled remotely.' },
      { q: 'Can a rebuild keep our existing domain and useful pages?', a: 'We review the domain, content and URL structure before setting the scope. Where a URL changes, a redirect plan helps users and search engines find its replacement. Search positions cannot be guaranteed.' },
    ],
  },
];

export const getCityBySlug = (slug: string) => cities.find(c => c.slug === slug);
