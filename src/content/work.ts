import { responsiveImages, workPreview, type ResponsiveSource } from '../lib/responsiveImages';

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

// Client sites are live and published for a paying client. Concept builds are fictional
// businesses built by Axiom to show what a site can do; they are labelled as such everywhere.
// Concepts live on this site at /work/<id>/; see src/demos/README.md.
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
    id: 'kelvin',
    title: 'Kelvin Home Comfort',
    kind: 'concept',
    industry: 'home-services',
    industryLabel: 'Heating & cooling',
    summary: 'A home seen through a thermal camera, warming room by room as you watch.',
    brief: 'Someone with no heat at 2am and someone planning a replacement need very different things from the same site.',
    built: 'A live thermal view of a 3D home, an emergency line that stays in reach and a separate three-step quote.',
    href: '/work/kelvin/',
    image: workPreview('kelvin'),
    alt: 'Kelvin Home Comfort concept website showing a house in thermal-camera colours',
    screenshot: true,
  },
  {
    id: 'atlas-axis',
    title: 'Atlas & Axis Physio',
    kind: 'concept',
    industry: 'health-clinics',
    industryLabel: 'Physiotherapy',
    summary: 'A porcelain spine that straightens as you scroll, and plain answers for wherever it hurts.',
    brief: 'New patients arrive in pain, unsure whether a clinic can help or what a first visit involves.',
    built: 'An interactive 3D spine, plain-language answers for each problem area and a clear walk-through of the first appointment.',
    href: '/work/atlas-axis/',
    image: workPreview('atlas-axis'),
    alt: 'Atlas & Axis Physiotherapy concept website showing a sculptural 3D spine on a bright background',
    screenshot: true,
  },
  {
    id: 'vernis',
    title: 'Vernis Nail Atelier',
    kind: 'concept',
    industry: 'salons-personal-care',
    industryLabel: 'Nail studio',
    summary: 'Wet lacquer fills the screen, and choosing a shade repaints the whole site.',
    brief: 'Clients choose a nail studio with their eyes, and most salon sites look interchangeable.',
    built: 'A real-time liquid lacquer surface, a shade picker that recolours the page, and services and booking that stay easy to scan.',
    href: '/work/vernis/',
    image: workPreview('vernis'),
    alt: 'Vernis Nail Atelier concept website with a glossy surface of liquid lacquer filling the screen',
    screenshot: true,
  },
  {
    id: 'cinder-salt',
    title: 'Cinder & Salt',
    kind: 'concept',
    industry: 'restaurants-hospitality',
    industryLabel: 'Restaurant',
    summary: 'Live fire burns through the restaurant’s name, then you fly through the ampersand and into the room.',
    brief: 'Guests decide in seconds on a phone, then go hunting for the menu, the hours and a way to book.',
    built: 'A real-time fire, a fast web menu, a live open-now status and a reservation flow that takes a few taps.',
    href: '/work/cinder-salt/',
    image: workPreview('cinder-salt'),
    alt: 'Cinder & Salt concept website with flames visible through enormous letters on a black screen',
    screenshot: true,
  },
  {
    id: 'aldous-wren',
    title: 'Aldous Wren LLP',
    kind: 'concept',
    industry: 'professional-services',
    industryLabel: 'Law firm',
    summary: 'Real ink moving in water, and a list of life situations in place of legal categories.',
    brief: 'People come to a law firm stressed, and most firm websites answer them with dense categories.',
    built: 'A real-time ink simulation, plain-language situations with what to expect and bring, and a calm path to a first conversation.',
    href: '/work/aldous-wren/',
    image: workPreview('aldous-wren'),
    alt: 'Aldous Wren LLP concept website with black ink curling through water on warm paper',
    screenshot: true,
  },
];

export const getProject = (id: string) => projects.find((project) => project.id === id);
export const projectsForIndustry = (industry: IndustrySlug) => projects.filter((project) => project.industry === industry);
