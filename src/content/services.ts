import type { IconName } from '../lib/icons';

export type ServiceSlug = 'local-business-websites' | 'conversion-sites' | 'rebuilds';

export type Service = {
  slug: ServiceSlug;
  icon: IconName;
  name: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  cardSummary: string;
  intro: string;
  signs: string[];
  includes: string[];
  before: string;
  after: string;
  packageNote: string;
  pathIntent: string;
  faqs: Array<{ question: string; answer: string }>;
};

export const services: Service[] = [
  {
    slug: 'local-business-websites',
    icon: 'store',
    name: 'Local Business Websites',
    title: 'Local business websites that make you easy to choose.',
    metaTitle: 'Small Business Website Design | Axiom Web',
    metaDescription:
      'Custom websites for local businesses in Kitchener-Waterloo and across Ontario. Clear services, real proof and easy contact on every device. From CAD $1,200.',
    cardSummary:
      'A clear, credible site for an established local business, with services, service area and contact details obvious on every device.',
    intro:
      'Most new customers judge your business by its website before they call. We build local business sites that explain what you do, show why you can be trusted and make the next step obvious, on a phone as well as a desktop.',
    signs: [
      'Your reputation offline is stronger than your website suggests',
      'Customers call to ask things the site should already answer',
      'The site is hard to read or use on a phone',
      'You do not have a website yet, or it was a quick do-it-yourself build',
    ],
    includes: [
      'Home, Services and Contact page structure',
      'Service area and location details stated clearly',
      'Reviews, credentials and photos placed where buyers look',
      'Click-to-call, directions, quote and booking paths',
      'Mobile-first design and development',
      'SEO basics and first-year hosting',
    ],
    before: 'Visitors have to piece together what you do, where you work and how to reach you.',
    after: 'Services, service area, proof and contact options are clear within seconds on any device.',
    packageNote:
      'Usually fits the Local Business Website (from CAD $1,200), or the Expanded Website (from CAD $1,500) when the business has more to explain.',
    pathIntent: 'local-business',
    faqs: [
      {
        question: 'What pages does a local business website need?',
        answer:
          'Most independent businesses are well served by Home, Services and Contact, with a gallery where photos help the decision. Add About, individual service pages or a larger gallery when customers genuinely need more detail; that is what the Expanded Website is for.',
      },
      {
        question: 'Can my website show customer reviews?',
        answer:
          'Yes. We can feature genuine reviews you are able to share and link to your Google Business Profile. We never invent testimonials, ratings or results.',
      },
      {
        question: 'Will the site work properly on phones?',
        answer:
          'Yes. Every layout is designed for mobile first, then tested on phones, tablets and desktops before launch, including forms, buttons and call links.',
      },
    ],
  },
  {
    slug: 'conversion-sites',
    icon: 'target',
    name: 'Conversion-Focused Web Design',
    title: 'Conversion-focused web design for service businesses.',
    metaTitle: 'Conversion-Focused Web Design | Axiom Web',
    metaDescription:
      'Web design built around how buyers decide: a clear offer, proof beside every action and a short path to call, quote or book. For established service businesses.',
    cardSummary:
      'For established service businesses with a strong offer and a site that makes visitors work too hard before they get in touch.',
    intro:
      'A good-looking site is not enough if visitors cannot quickly see what you offer and how to start. We structure the page order, calls to action, service copy and mobile flow around how your buyers actually decide.',
    signs: [
      'People visit the site but rarely call, book or request a quote',
      'Your offer is clear in person but buried on the site',
      'Calls to action are vague or compete with each other',
      'The contact or quote form asks for too much, too soon',
    ],
    includes: [
      'Offer and service hierarchy clarified before design',
      'One primary action per page, visible on every screen',
      'Proof placed beside prices, services and forms',
      'Short, mobile-friendly quote and contact forms',
      'Copy direction in your customers’ language',
      'Launch QA and analytics-ready events',
    ],
    before: 'Visitors have to work out what you do, why it matters and how to reach you.',
    after: 'The offer, the proof and the main contact path are visible before the buyer loses interest.',
    packageNote:
      'Usually fits the Local Business Website or the Expanded Website, depending on how much the business needs to explain.',
    pathIntent: 'conversion-site',
    faqs: [
      {
        question: 'What does conversion-focused web design mean?',
        answer:
          'It means every page is planned around the action you want a visitor to take, such as calling, booking or requesting a quote, and removes whatever gets in the way. It is about clarity and structure, not tricks or pressure.',
      },
      {
        question: 'Can you guarantee more leads?',
        answer:
          'No one can honestly guarantee results. We can make your offer clearer, put proof where buyers look and shorten the path to contact. Those are the parts of the website we control, and we build them carefully.',
      },
      {
        question: 'Do I need new photos or copy?',
        answer:
          'Not necessarily. We work from your existing material and edit it for clarity. Genuine photos of your work, team or premises usually help more than stock imagery, so we will tell you where better assets would make a difference.',
      },
    ],
  },
  {
    slug: 'rebuilds',
    icon: 'refresh',
    name: 'Website Redesigns',
    title: 'Website redesigns that keep what works and fix what doesn’t.',
    metaTitle: 'Website Redesign & Rebuild Services | Axiom Web',
    metaDescription:
      'Website redesigns for businesses that have outgrown their site. We keep what works, plan redirects to protect search traffic and relaunch on a faster site.',
    cardSummary:
      'For businesses whose current site no longer matches the quality of the company, rebuilt without losing useful content or search value.',
    intro:
      'A redesign is not a cosmetic reset. We review your current site first, keep the pages and search paths that already work, remove what creates friction and relaunch on a cleaner, faster foundation.',
    signs: [
      'The site looks dated next to the quality of your work',
      'Navigation has become confusing as pages were added',
      'Pages are slow, especially on mobile',
      'Your services or brand have changed since the site was built',
    ],
    includes: [
      'Review of current pages, content and inquiry routes',
      'Simpler navigation and page structure',
      'URL inventory and redirect plan',
      'Rewritten priority pages',
      'Domain switch-over and launch support',
      'Post-launch support path',
    ],
    before: 'The current site carries old structure, unclear copy, slow pages or a brand that no longer fits.',
    after: 'Useful pages and search paths carry forward into a clearer structure, a faster site and one dependable contact route.',
    packageNote:
      'Scoped after a review, because page count, redirects, content and integrations all affect the price. Smaller rebuilds often fit a standard package; substantial migrations are quoted as Custom.',
    pathIntent: 'rebuild',
    faqs: [
      {
        question: 'Will a redesign hurt my Google rankings?',
        answer:
          'Any rebuild carries some risk, which is why we inventory your current URLs and plan redirects before launch so visitors and search engines reach the right replacement pages. No one can guarantee search positions, but careful planning protects what the site has already earned.',
      },
      {
        question: 'Can I keep my domain and email?',
        answer:
          'Yes. Your domain stays yours and we connect the new site to it. We plan the switch-over around your existing email setup so it keeps working.',
      },
      {
        question: 'Do you rebuild sites made on other platforms?',
        answer:
          'Yes. We review what your current site does, keep the content and URLs worth keeping and rebuild it as a fast, custom site. Online stores and complex integrations are scoped as Custom.',
      },
    ],
  },
];

export const getServiceBySlug = (slug: string) => services.find((service) => service.slug === slug);
