import { responsiveImages, type ResponsiveSource } from '../lib/responsiveImages';

export type IndustrySlug = 'home-services' | 'health-clinics' | 'salons-personal-care' | 'restaurants-hospitality' | 'professional-services';

export type Project = {
  id: string;
  title: string;
  kind: 'client' | 'concept';
  industry: IndustrySlug;
  industryLabel: string;
  location?: string;
  summary: string;
  brief: string;
  built: string;
  href: string;
  image: ResponsiveSource;
  alt: string;
  position?: string;
  /** True when the image is a screenshot of the website itself. */
  screenshot?: boolean;
};

// Client sites are live and published for a paying client. Concept builds are
// demonstrations made by Axiom to show structure; they are labelled as such everywhere.
export const projects: Project[] = [
  {
    id: 'reids-home-and-yard',
    title: 'Reid’s Home & Yard',
    kind: 'client',
    industry: 'home-services',
    industryLabel: 'Home services',
    location: 'Ottawa, ON',
    summary: 'Walkway snow clearing, salting and de-icing, presented in one calm, focused page with direct contact.',
    brief: 'Introduce winter walkway services for Ottawa homeowners while keeping future lawn care clearly separate.',
    built: 'An evergreen visual identity, winter photography, plain service descriptions and direct phone and email links — no booking account needed.',
    href: 'https://reidshomeandyard.getaxiom.ca/',
    image: responsiveImages.workReids,
    alt: 'Reid’s Home & Yard website home page with the headline “A clearer walkway. An easier winter.” beside a cleared, snowy front walkway',
    position: 'center top',
    screenshot: true,
  },
  {
    id: 'physio-clinic',
    title: 'Northline Physio & Rehab',
    kind: 'concept',
    industry: 'health-clinics',
    industryLabel: 'Health & wellness',
    summary: 'Treatment paths, practitioner credibility and assessment booking brought together on the first screen.',
    brief: 'Patients needed to recognise their problem, trust the clinic and book an assessment without searching.',
    built: 'Symptom-led care paths, licensed-practitioner cues and a persistent “Book an assessment” action.',
    href: 'https://physio.getaxiom.ca',
    image: responsiveImages.workPhysio,
    alt: 'Northline Physio concept website with the headline “Evidence-based physiotherapy for active lives” and a Book an Assessment button',
    position: 'center top',
    screenshot: true,
  },
  {
    id: 'dental-aurelia',
    title: 'Aurelia Dental Studio',
    kind: 'concept',
    industry: 'health-clinics',
    industryLabel: 'Dental',
    summary: 'A warmer first impression and fewer steps to an appointment for new patients.',
    brief: 'New patients needed reassurance about the practice before they were ready to request an appointment.',
    built: 'Care style, services, team cues and booking placed close together, in a calm and bright visual system.',
    href: 'https://dental.getaxiom.ca',
    image: responsiveImages.workDental,
    alt: 'Bright dental studio treatment room used as the hero image for the Aurelia Dental concept website',
    position: 'center 40%',
  },
  {
    id: 'roofing',
    title: 'Roofing Conversion Site',
    kind: 'concept',
    industry: 'home-services',
    industryLabel: 'Roofing',
    summary: 'Urgent repair calls and planned estimates split into two clear, separate paths.',
    brief: 'Emergency repairs and planned replacements were competing for the same generic call to action.',
    built: 'A prominent emergency call button, a separate estimate request and proof of workmanship beside both.',
    href: 'https://roofing.getaxiom.ca',
    image: responsiveImages.workRoofing,
    alt: 'Roofer inspecting a residential roof, used as the hero image for the roofing concept website',
    position: 'center 36%',
  },
  {
    id: 'landscaping',
    title: 'Landscaping Studio',
    kind: 'concept',
    industry: 'home-services',
    industryLabel: 'Landscaping',
    summary: 'Finished projects lead the page and the first quote request is kept short.',
    brief: 'Project quality was not visible soon enough, and the quote form asked for too much up front.',
    built: 'Project photography first, a shortened initial quote form and service areas stated plainly.',
    href: 'https://landscaping.getaxiom.ca',
    image: responsiveImages.workLandscaping,
    alt: 'Modern home exterior with a landscaped pool area, used as the hero image for the landscaping concept website',
    position: 'center 52%',
  },
  {
    id: 'salon-nails',
    title: 'The Nail Studio',
    kind: 'concept',
    industry: 'salons-personal-care',
    industryLabel: 'Salon & beauty',
    summary: 'Services are easy to compare and booking appears before visitors start hunting for it.',
    brief: 'Services and booking were treated as secondary details instead of the main reason people visit.',
    built: 'Service comparison, studio standards and booking moved into the first decision path.',
    href: 'https://nails.getaxiom.ca',
    image: responsiveImages.workSalon,
    alt: 'Manicured hand resting on a light wooden table beside “The Nail Studio — Minimal. Clean. Refined.” branding',
    position: 'center 40%',
  },
  {
    id: 'barber-blackline',
    title: 'Blackline Barber Co.',
    kind: 'concept',
    industry: 'salons-personal-care',
    industryLabel: 'Barbershop',
    summary: 'A sharper brand with the booking link visible on every screen.',
    brief: 'The brand needed to feel sharper, and the next appointment needed to be easy to book from a phone.',
    built: 'Photography as the first signal, a short service menu and a booking action that stays in reach.',
    href: 'https://barber.getaxiom.ca',
    image: responsiveImages.workBarber,
    alt: 'Barber cutting a client’s hair in a warm, wood-panelled shop, used as the hero image for the Blackline Barber concept',
    position: 'center 40%',
  },
  {
    id: 'restaurant-reservation',
    title: 'Restaurant Reservations',
    kind: 'concept',
    industry: 'restaurants-hospitality',
    industryLabel: 'Restaurant',
    summary: 'Menu preview and reservations on the first mobile screen, where hungry visitors decide.',
    brief: 'Menu and reservation intent were split across the site, forcing guests to search.',
    built: 'A menu preview, opening hours and a reservation action together at the top of the page.',
    href: 'https://restaurant.getaxiom.ca',
    image: responsiveImages.workRestaurant,
    alt: 'Server carrying plated dishes through a warmly lit dining room, used as the hero image for the restaurant concept',
    position: 'center 24%',
  },
  {
    id: 'law-harrow',
    title: 'Harrow & Calloway',
    kind: 'concept',
    industry: 'professional-services',
    industryLabel: 'Law firm',
    summary: 'Clearer practice areas, lighter copy and one obvious path to a consultation.',
    brief: 'Legal websites can feel dense and cautious, which makes the first contact harder than it needs to be.',
    built: 'Practice areas clarified, copy reduced to what a prospect needs, and consultation as the primary action.',
    href: 'https://law.getaxiom.ca',
    image: responsiveImages.workLaw,
    alt: 'Boardroom table with a judge’s gavel, used as the hero image for the Harrow & Calloway law firm concept',
    position: 'center 40%',
  },
];

export const getProject = (id: string) => projects.find((project) => project.id === id);
export const projectsForIndustry = (industry: IndustrySlug) => projects.filter((project) => project.industry === industry);
