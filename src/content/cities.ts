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
  planning: Array<{ title: string; text: string }>;
  questions: Array<{ q: string; a: string }>;
};

// Planning guidance describes the buyer's project, not unverified client history.
export const cities: City[] = [
  {
    slug: 'kitchener', name: 'Kitchener', region: 'Waterloo Region, Ontario',
    description: 'Web design in Kitchener by Axiom Web. Plan clear service pages, useful local details and a direct quote or booking path. Work with the two founders.',
    intro: 'For Kitchener businesses whose work deserves a clearer introduction. We design websites that explain the service, show credible evidence and make the next step straightforward.',
    localContext: 'Axiom Web is based in Kitchener-Waterloo. Aidan Magee and Riley Hinsperger lead the project from the first scope discussion through launch.',
    neighborhoods: ['Downtown Kitchener', 'Belmont Village', 'Doon', 'Stanley Park', 'Forest Heights'],
    focus: 'Help the right local customer make contact.',
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
    description: 'Web design for Waterloo practices, studios and service firms. Explain your offer, simplify appointment inquiries and plan a website with Axiom Web.',
    intro: 'For Waterloo practices, studios and service firms with an offer that needs to be understood before someone books. Clear service detail, a considered first impression and a direct inquiry path.',
    localContext: 'Our studio is based in Kitchener-Waterloo. You work directly with Aidan and Riley; the scope defines the pages, booking links and launch responsibilities.',
    neighborhoods: ['Uptown Waterloo', 'University District', 'Lakeshore', 'Lincoln Heights', 'Beechwood'],
    focus: 'Make the first appointment easier to choose.',
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
    description: 'Web design for Cambridge businesses serving Galt, Preston and Hespeler. Clarify coverage, organise services and improve quote requests with Axiom Web.',
    intro: 'For Cambridge businesses that need customers to understand both the work and where it is available. Clear services, honest coverage and quote requests with the details needed to respond.',
    localContext: 'We serve Cambridge from our Kitchener-Waterloo base. The project begins with your services, customer questions and existing site, with scope confirmed before design.',
    neighborhoods: ['Galt', 'Preston', 'Hespeler', 'Blair', 'West Galt'],
    focus: 'Connect coverage to the work you actually offer.',
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
    description: 'Web design for Guelph businesses. Turn referrals into informed inquiries with clear services, genuine project evidence and a focused site from Axiom Web.',
    intro: 'For Guelph businesses whose reputation travels by recommendation. Give referred visitors a clear account of your services, relevant work and what happens after they make contact.',
    localContext: 'Axiom Web serves Guelph from Kitchener-Waterloo. We establish the content, page count and review process before work begins, with direct access to both founders.',
    neighborhoods: ['Downtown Guelph', 'South End', 'West End', 'Old University', 'Exhibition Park'],
    focus: 'Give a referral enough detail to become an inquiry.',
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
    description: 'Web design for Hamilton service businesses. Plan clear coverage, focused service pages and a careful rebuild with Axiom Web in Kitchener-Waterloo.',
    intro: 'For Hamilton businesses with several services or a site that has become difficult to navigate. We clarify the offer, organise the pages and make contact straightforward on a phone.',
    localContext: 'We serve Hamilton from Kitchener-Waterloo; we do not present a Hamilton office. Project discussions and reviews can take place remotely, with responsibilities set in the scope.',
    neighborhoods: ['Downtown Hamilton', 'Westdale', 'The Mountain', 'Stoney Creek', 'Ancaster'],
    focus: 'Give a broad service area a clear website structure.',
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
