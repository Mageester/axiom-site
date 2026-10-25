import { createStartProjectHref } from '../lib/cta';

export type PackageKey = 'local-launch' | 'local-business' | 'expanded' | 'custom';

export type Package = {
  key: PackageKey;
  name: string;
  price: string;
  priceValue?: number;
  priceNote: string;
  scope: string;
  summary: string;
  features: string[];
  cta: string;
  href: string;
  badge?: string;
  featured?: boolean;
};

export const packages: Package[] = [
  {
    key: 'local-launch',
    name: 'Local Launch Special',
    price: 'CAD $900',
    priceValue: 900,
    priceNote: 'Starting at',
    scope: 'One page, up to six sections',
    summary: 'An introductory package for very small local businesses that need a straightforward, professional presence.',
    features: [
      'Single page with up to six sections',
      'Call, email and directions links',
      'Existing booking link connected',
      'First year of basic hosting included',
    ],
    cta: 'Start with Launch',
    href: createStartProjectHref('local-launch'),
    badge: 'Introductory',
  },
  {
    key: 'local-business',
    name: 'Local Business Website',
    price: 'CAD $1,200',
    priceValue: 1200,
    priceNote: 'Starting at',
    scope: 'Up to three pages',
    summary: 'Our recommended package for an independent local business: a focused Home, Services and Contact structure.',
    features: [
      'Home, Services and Contact pages',
      'Gallery where it strengthens the decision',
      'Quote, call, directions and booking paths',
      'First year of basic hosting included',
    ],
    cta: 'Choose Local Business',
    href: createStartProjectHref('local-business'),
    badge: 'Recommended',
    featured: true,
  },
  {
    key: 'expanded',
    name: 'Expanded Website',
    price: 'CAD $1,500',
    priceValue: 1500,
    priceNote: 'Starting at',
    scope: 'Up to five pages',
    summary: 'For businesses with more to explain and show, while keeping the build straightforward.',
    features: [
      'About, Services, Gallery, Contact and more',
      'Room for a broader service story',
      'Quote, call, directions and booking paths',
      'First year of basic hosting included',
    ],
    cta: 'Choose Expanded',
    href: createStartProjectHref('expanded'),
  },
  {
    key: 'custom',
    name: 'Custom',
    price: 'Quoted',
    priceNote: 'Scoped to the project',
    scope: 'Defined in a written scope',
    summary: 'For requirements beyond a standard website: online stores, accounts, custom systems or larger migrations.',
    features: [
      'E-commerce and online payments',
      'Databases and customer accounts',
      'Custom booking systems or software',
      'Substantial migrations and redirect plans',
    ],
    cta: 'Request a quote',
    href: createStartProjectHref('custom'),
  },
];

export const standardIncludes = [
  'Custom responsive design and development',
  'Mobile optimization',
  'First year of basic hosting',
  'Domain connection',
  'SEO basics: page titles and metadata',
  'Existing booking-platform integration when applicable',
  'Light editing of client-supplied text',
  'Your logo and images placed and optimized',
  'Launch testing across devices',
  'Two consolidated revision rounds',
  'Thirty days of post-launch defect support',
] as const;

export type ComparisonRow = { label: string; values: Record<PackageKey, string> };

export const comparisonRows: ComparisonRow[] = [
  {
    label: 'Starting price',
    values: { 'local-launch': 'CAD $900', 'local-business': 'CAD $1,200', expanded: 'CAD $1,500', custom: 'Quoted' },
  },
  {
    label: 'Pages',
    values: {
      'local-launch': '1 page, up to 6 sections',
      'local-business': 'Up to 3 pages',
      expanded: 'Up to 5 pages',
      custom: 'Defined in scope',
    },
  },
  {
    label: 'Best fit',
    values: {
      'local-launch': 'Very small local business',
      'local-business': 'Independent local business',
      expanded: 'More content, still straightforward',
      custom: 'Complex or unusual requirements',
    },
  },
  {
    label: 'Typical structure',
    values: {
      'local-launch': 'One focused page',
      'local-business': 'Home, Services, Contact',
      expanded: 'About, Services, Gallery, Contact',
      custom: 'Custom pages and flows',
    },
  },
  {
    label: 'Booking',
    values: {
      'local-launch': 'Existing platform link',
      'local-business': 'Existing platform link',
      expanded: 'Existing platform link',
      custom: 'Custom systems quoted',
    },
  },
  {
    label: 'Hosting after year one',
    values: {
      'local-launch': 'From CAD $120/year',
      'local-business': 'From CAD $120/year',
      expanded: 'From CAD $120/year',
      custom: 'Defined in scope',
    },
  },
  {
    label: 'Revisions & support',
    values: {
      'local-launch': '2 rounds + 30 days',
      'local-business': '2 rounds + 30 days',
      expanded: '2 rounds + 30 days',
      custom: 'Defined in scope',
    },
  },
];

export const paymentTerms = [
  {
    title: '50% to begin',
    text: 'Due once the written scope is approved and the agreement is signed.',
  },
  {
    title: '50% before launch',
    text: 'Due after you approve the finished staging site, before it goes public.',
  },
  {
    title: 'Hosting after year one',
    text: 'Basic hosting from CAD $120 per year. Domain renewal stays in your name at the registrar’s price.',
  },
] as const;

export const pricingFaq = [
  {
    question: 'What is the Local Launch Special?',
    answer:
      'It is an introductory package from CAD $900 for very small local businesses that need a straightforward professional presence: one page with up to six sections. Existing third-party booking links can be connected.',
  },
  {
    question: 'What is the Local Business Website?',
    answer:
      'It is the recommended package from CAD $1,200 for a normal independent local business. It includes up to three pages, typically Home, Services, and Contact, with a gallery and clear inquiry paths where appropriate.',
  },
  {
    question: 'What is the Expanded Website?',
    answer:
      'It is from CAD $1,500 for businesses that need more content but still have a straightforward website requirement. The scope is up to five pages and can include About, Gallery, Services, and Contact.',
  },
  {
    question: 'Does the price include booking software?',
    answer:
      'An existing booking platform can be connected when applicable. Booksy and other booking platforms remain the client account and expense. Custom booking systems or software are quoted as Custom.',
  },
  {
    question: 'When is Custom needed?',
    answer:
      'Custom is required for e-commerce, databases, custom booking systems or software, customer accounts, substantial migrations, or unusual and technically complex requirements.',
  },
  {
    question: 'How are payments handled?',
    answer:
      'Fifty percent is due after the scope is approved and the agreement is signed. The remaining fifty percent is due after approval of the finished staging site and before public launch.',
  },
  {
    question: 'What happens after the first year?',
    answer:
      'Basic hosting starts at CAD $120 per year after year one, unless a documented handoff is provided where appropriate. Domain registration renewal is client-owned and billed by the registrar at its actual price.',
  },
] as const;
