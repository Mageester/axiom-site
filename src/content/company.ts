import type { IconName } from '../lib/icons';

export const NAV_LINKS = [
  { label: 'Services', href: '/services/' },
  { label: 'Work', href: '/work/' },
  { label: 'Pricing', href: '/pricing/' },
  { label: 'Process', href: '/approach/' },
  { label: 'About', href: '/about/' },
  { label: 'Contact', href: '/contact/' },
] as const;

export const founders = [
  {
    id: 'aidan-magee',
    name: 'Aidan Magee',
    initials: 'AM',
    role: 'Co-founder · Strategy & client lead',
    bio: 'Your first point of contact. Aidan runs discovery, scope and content so the site reflects how your customers actually decide, from the first call through launch.',
  },
  {
    id: 'riley-hinsperger',
    name: 'Riley Hinsperger',
    initials: 'RH',
    role: 'Co-founder · Design & development',
    bio: 'Riley designs and builds every site, handling development, performance and testing so it loads quickly and works properly on every device.',
  },
] as const;

export type Fact = { icon: IconName; title: string; text: string };

// Published commitments shown as large numerals on the home page. Keep these to facts
// stated elsewhere on the site (pricing, process and support terms).
export const keyNumbers = [
  { value: '$900', label: 'Published starting price, in CAD' },
  { value: '2–4', label: 'Weeks from approved scope to launch' },
  { value: '1', label: 'Business day to reply to every enquiry' },
  { value: '30', label: 'Days of support after launch' },
];

export const valueProps: Fact[] = [
  {
    icon: 'tag',
    title: 'Clear, published pricing',
    text: 'Packages start at CAD $900, and you get a written scope and price before any work begins.',
  },
  {
    icon: 'smartphone',
    title: 'Designed for phones first',
    text: 'Your customers decide on their phones. Every page, button and form is designed and tested there first.',
  },
  {
    icon: 'zap',
    title: 'Fast, lightweight pages',
    text: 'Lean, hand-built pages load quickly, so visitors reach your services and contact details without waiting.',
  },
  {
    icon: 'search',
    title: 'Search-ready from launch',
    text: 'Page titles, descriptions and a clean page structure are set up before the site goes live.',
  },
  {
    icon: 'server',
    title: 'Hosting included',
    text: 'The first year of basic hosting and your domain connection are included, then from CAD $120 a year.',
  },
  {
    icon: 'lifebuoy',
    title: 'Support after launch',
    text: 'Thirty days of post-launch defect support, with a direct line to the two people who built your site.',
  },
];

export const homeFaq = [
  {
    question: 'How much does a website cost?',
    answer:
      'Our packages start at CAD $900 for a one-page Local Launch Special, CAD $1,200 for a Local Business Website of up to three pages, and CAD $1,500 for an Expanded Website of up to five pages. Online stores, accounts and custom systems are quoted after a review.',
  },
  {
    question: 'How long does it take to build a website?',
    answer:
      'Standard packages usually launch in two to four weeks. The timeline depends most on how quickly content, photos and feedback are ready, which is why we agree the scope and content list before design starts.',
  },
  {
    question: 'What do I need to provide?',
    answer:
      'Your logo, photos, and the basics about your services and customers. Plain notes are fine: light editing of your text is included, and we send a simple content checklist during scoping.',
  },
  {
    question: 'Is hosting included?',
    answer:
      'Yes. Every standard package includes the first year of basic hosting and domain connection. After year one, basic hosting starts at CAD $120 per year. Your domain registration stays in your name.',
  },
  {
    question: 'Do you only work with businesses in Kitchener-Waterloo?',
    answer:
      'No. We are based in Kitchener-Waterloo and work with businesses across Waterloo Region, Guelph and Hamilton, and with clients elsewhere in Canada remotely.',
  },
  {
    question: 'What happens after I send my project details?',
    answer:
      'We review your business and current site, then reply within one business day with the package we recommend, what it includes, the price and the next step. There is no obligation to proceed.',
  },
] as const;
