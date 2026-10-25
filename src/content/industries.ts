import type { IconName } from '../lib/icons';
import type { IndustrySlug } from './work';

export type Industry = {
  slug: IndustrySlug;
  icon: IconName;
  name: string;
  examples: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  intro: string;
  needs: Array<{ title: string; text: string }>;
  pages: string[];
  workIds: string[];
  packageNote: string;
  faqs: Array<{ question: string; answer: string }>;
};

// Guidance describes what buyers in each sector look for; it does not claim client history.
export const industries: Industry[] = [
  {
    slug: 'home-services',
    icon: 'wrench',
    name: 'Contractors & home services',
    examples: 'Trades, roofing, landscaping, HVAC, cleaning, snow removal',
    title: 'Websites for contractors and home service businesses.',
    metaTitle: 'Website Design for Contractors & Home Services | Axiom Web',
    metaDescription:
      'Websites for trades, roofers, landscapers and home service companies in Ontario. Clear service areas, quick quote requests and click-to-call on every screen.',
    intro:
      'Homeowners usually compare a few companies on their phone before calling one. Your site needs to show what you do, where you work and the quality of your work, then make calling or requesting a quote effortless.',
    needs: [
      {
        title: 'Service area, stated plainly',
        text: 'List the towns and neighbourhoods you actually cover, so nobody has to call just to find out.',
      },
      {
        title: 'Urgent and planned work, separated',
        text: 'An emergency repair and a spring project are different decisions. Give each its own path: a call button for urgent work and a quote form for planned work.',
      },
      {
        title: 'Proof of workmanship',
        text: 'Real project photos, licences, insurance and warranties you can verify belong next to the quote button, not on a page nobody opens.',
      },
      {
        title: 'A quote form that respects their time',
        text: 'Ask for the job type, location and timing first. Measurements and photos can follow once the conversation has started.',
      },
    ],
    pages: [
      'Home with services, service area and call and quote actions',
      'Services, with a section or page for each main service',
      'Project gallery with genuine photos of your work',
      'About, with licences, insurance and experience',
      'Contact and quote request',
    ],
    workIds: ['reids-home-and-yard', 'roofing', 'landscaping'],
    packageNote:
      'Most trades fit the Local Business Website (from CAD $1,200). Companies with several distinct services or a large project gallery usually choose the Expanded Website (from CAD $1,500).',
    faqs: [
      {
        question: 'Should a contractor have a separate page for each service?',
        answer:
          'When each service has different questions, pricing or customers, a focused page helps both visitors and search engines. When the services are closely related, one well-organised Services page is usually clearer.',
      },
      {
        question: 'Can customers send photos with a quote request?',
        answer:
          'We scope the quote form around the details you need to respond. File uploads and connections to estimating or scheduling software are reviewed as additional requirements and may be quoted as Custom.',
      },
    ],
  },
  {
    slug: 'health-clinics',
    icon: 'heart',
    name: 'Clinics & health practices',
    examples: 'Dental, physiotherapy, chiropractic, massage, wellness',
    title: 'Websites for clinics and health practices.',
    metaTitle: 'Website Design for Clinics & Health Practices | Axiom Web',
    metaDescription:
      'Websites for dental, physiotherapy, chiropractic and wellness clinics. Clear services, practitioner credentials and simple booking for new patients.',
    intro:
      'New patients want to know they have found the right practice before they book. Your site should explain your services in plain language, introduce the practitioners and make booking or contacting the clinic simple.',
    needs: [
      {
        title: 'Services in patient language',
        text: 'Describe what each treatment helps with and what to expect at a first visit, without clinical jargon.',
      },
      {
        title: 'Practitioners and credentials',
        text: 'Introduce the team with qualifications and registrations you can substantiate. People book with people.',
      },
      {
        title: 'Booking that works on a phone',
        text: 'Link straight to your existing booking platform, with the button visible on every page.',
      },
      {
        title: 'Practical details up front',
        text: 'Hours, location, parking, accessibility and direct billing answer the questions that stop people from booking.',
      },
    ],
    pages: [
      'Home with services, booking and new-patient information',
      'Services or treatments',
      'Team and practitioner profiles',
      'New patients: what to expect, billing and forms',
      'Contact, hours and location',
    ],
    workIds: ['physio-clinic', 'dental-aurelia'],
    packageNote:
      'A single-practitioner clinic often fits the Local Business Website (from CAD $1,200). Multi-practitioner clinics with several services usually need the Expanded Website (from CAD $1,500).',
    faqs: [
      {
        question: 'Can a clinic website include patient testimonials?',
        answer:
          'Many Ontario regulatory colleges restrict testimonials and certain claims in advertising. We build within the standards that apply to your profession, and you confirm the final wording before launch.',
      },
      {
        question: 'Can you connect our existing booking system?',
        answer:
          'Yes. We link to your existing online booking platform, ideally straight to the right service where the platform allows it. The booking account and its fees remain yours. Custom scheduling software is quoted separately.',
      },
    ],
  },
  {
    slug: 'salons-personal-care',
    icon: 'scissors',
    name: 'Salons, spas & barbers',
    examples: 'Hair and nail salons, spas, barbershops, aesthetics',
    title: 'Websites for salons, spas and barbershops.',
    metaTitle: 'Website Design for Salons, Spas & Barbers | Axiom Web',
    metaDescription:
      'Websites for salons, nail studios, spas and barbershops. Show your style, list services and prices clearly and keep online booking one tap away.',
    intro:
      'Clients choose a salon on style and convenience. Your site should show your work at its best, make services and prices easy to compare and keep booking one tap away.',
    needs: [
      {
        title: 'Your work, shown well',
        text: 'Strong photography of your space and your results sets expectations before anyone walks in.',
      },
      {
        title: 'Services and prices that scan easily',
        text: 'A clear menu with durations and starting prices answers the first question most clients have.',
      },
      {
        title: 'Booking always in reach',
        text: 'Connect your existing booking platform and keep the button visible on every screen.',
      },
      {
        title: 'Location and hours at a glance',
        text: 'Address, parking and opening hours should never be more than a scroll away.',
      },
    ],
    pages: [
      'Home with booking, style and location',
      'Services and prices',
      'Gallery or lookbook',
      'About the studio and team',
      'Contact, hours and directions',
    ],
    workIds: ['salon-nails', 'barber-blackline'],
    packageNote:
      'A single-location salon or barbershop often fits the Local Launch Special (from CAD $900) or the Local Business Website (from CAD $1,200).',
    faqs: [
      {
        question: 'Can you connect Booksy, Fresha or another booking app?',
        answer:
          'Yes. We connect your existing booking platform where applicable, so clients can book straight from your site. The booking account and its fees remain yours.',
      },
      {
        question: 'Do I need professional photos?',
        answer:
          'Good photos make a real difference for salons. If you do not have them yet, we can launch with the best images you have and show you where better photos would have the most impact.',
      },
    ],
  },
  {
    slug: 'restaurants-hospitality',
    icon: 'utensils',
    name: 'Restaurants & cafés',
    examples: 'Restaurants, cafés, bakeries, bars, catering',
    title: 'Websites for restaurants, cafés and hospitality.',
    metaTitle: 'Restaurant Website Design | Menus & Reservations | Axiom Web',
    metaDescription:
      'Restaurant and café websites with menus that load fast, clear hours and location, and reservations or ordering one tap away. Designed in Kitchener-Waterloo.',
    intro:
      'Guests decide where to eat in seconds, usually on a phone. Your site should show the food and atmosphere, load the menu instantly and make reserving, ordering or finding you effortless.',
    needs: [
      {
        title: 'A menu that loads instantly',
        text: 'A fast, readable web menu beats a PDF that has to download and be zoomed on a phone.',
      },
      {
        title: 'Hours and location that are always right',
        text: 'Opening hours, holiday changes, address and parking are what most visitors check first.',
      },
      {
        title: 'Reservations and ordering in one tap',
        text: 'Link your existing reservation or ordering platform from the top of every page.',
      },
      {
        title: 'Atmosphere on the first screen',
        text: 'Photography of the room and the food tells guests what kind of visit to expect.',
      },
    ],
    pages: [
      'Home with hours, location and a reservation action',
      'Menu',
      'About and story',
      'Private events or catering, if offered',
      'Contact and directions',
    ],
    workIds: ['restaurant-reservation'],
    packageNote:
      'Most restaurants fit the Local Business Website (from CAD $1,200). Online ordering systems, gift cards or e-commerce are quoted as Custom.',
    faqs: [
      {
        question: 'Will our menu be a PDF?',
        answer:
          'No. We build the menu as real web content, so it loads quickly, reads well on phones and can be found by search engines. During scoping we agree how menu changes will be handled after launch.',
      },
      {
        question: 'Can guests reserve or order online?',
        answer:
          'Yes, through your existing reservation or ordering platform, linked from every page. A custom ordering or payment system is quoted as Custom.',
      },
    ],
  },
  {
    slug: 'professional-services',
    icon: 'briefcase',
    name: 'Law & professional services',
    examples: 'Law firms, accountants, consultants, advisers',
    title: 'Websites for law firms and professional service firms.',
    metaTitle: 'Law Firm & Professional Services Websites | Axiom Web',
    metaDescription:
      'Websites for law firms, accountants and consultants. Clear practice areas, credible profiles and a simple path to a consultation, without the dense copy.',
    intro:
      'Clients choosing a lawyer, accountant or adviser are looking for competence and clarity. Your site should explain what you handle, who you help and how to start, without asking them to read a wall of text.',
    needs: [
      {
        title: 'Practice areas in plain language',
        text: 'Explain each area in terms of the client’s situation, not internal categories.',
      },
      {
        title: 'Credible people',
        text: 'Professional profiles with qualifications and experience you can substantiate.',
      },
      {
        title: 'A clear first step',
        text: 'Make the consultation process, fee approach and what to prepare easy to find.',
      },
      {
        title: 'Confidence without clutter',
        text: 'Short paragraphs, clear headings and calm design communicate competence better than dense copy.',
      },
    ],
    pages: [
      'Home with practice areas and a consultation action',
      'Practice area or service pages',
      'Team profiles',
      'About the firm',
      'Contact and consultation request',
    ],
    workIds: ['law-harrow'],
    packageNote:
      'Small firms usually fit the Local Business Website or the Expanded Website. Firms with many practice areas or client portals are scoped as Custom.',
    faqs: [
      {
        question: 'Do you follow professional marketing rules?',
        answer:
          'Yes. We build within the advertising rules that apply to your profession, and you confirm all claims and wording before launch. We do not invent results, awards or testimonials.',
      },
      {
        question: 'Should each practice area have its own page?',
        answer:
          'When practice areas serve different clients with different questions, separate pages help visitors and search engines. Closely related areas can share one page with clear sections.',
      },
    ],
  },
];

export const getIndustryBySlug = (slug: string) => industries.find((industry) => industry.slug === slug);
