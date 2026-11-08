import { responsiveImages, workPreview, type ResponsiveSource } from '../lib/responsiveImages';

export type IndustrySlug =
  | 'home-services'
  | 'health-clinics'
  | 'salons-personal-care'
  | 'restaurants-hospitality'
  | 'professional-services'
  | 'fitness-wellness'
  | 'automotive'
  | 'shops-makers'
  | 'events-weddings';

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
  {
    id: 'fernhill',
    title: 'Fernhill Landscape Co.',
    kind: 'concept',
    industry: 'home-services',
    industryLabel: 'Landscaping',
    summary: 'A living lawn that bends where you walk and turns through all four seasons as you scroll.',
    brief: 'Homeowners want one crew for the whole year, but most landscapers only explain one season of work at a time.',
    built: 'A real-time lawn that leaves a trail behind your cursor or finger and changes with the seasons, a month-by-month calendar of the work, a service-area map and a short quote form.',
    href: '/work/fernhill/',
    image: workPreview('fernhill'),
    alt: 'Fernhill Landscape Co. concept website with the headline “Four seasons. One crew.” over a sunlit lawn with a path walked through the grass',
    screenshot: true,
  },
  {
    id: 'mirrorline',
    title: 'Mirrorline Detailing',
    kind: 'concept',
    industry: 'automotive',
    industryLabel: 'Auto detailing',
    summary: 'Water beads and rolls off midnight blue paint, and rubbing out the swirl marks polishes it back to a mirror.',
    brief: "Detailing buyers can't tell careful work from a quick wash on a website, and few understand what paint correction actually fixes or why a coating costs what it does.",
    built: 'A live water simulation on metallic paint under studio lights, a hands-on paint-correction panel with a before-and-after readout, prices that change with vehicle size and a short booking request.',
    href: '/work/mirrorline/',
    image: workPreview('mirrorline'),
    alt: 'Mirrorline Detailing concept website showing water beading on midnight blue metallic paint under studio lights',
    screenshot: true,
  },
  {
    id: 'orrin-vale',
    title: 'Orrin & Vale',
    kind: 'concept',
    industry: 'shops-makers',
    industryLabel: 'Goldsmith',
    summary: 'A diamond that throws real fire as you turn it, set in whichever metal and stone you choose.',
    brief: "Most people buying a custom ring have never spoken to a goldsmith, and jewellers' sites show finished pieces with no word on how the work happens, how long it takes or what to bring.",
    built: 'A real-time ray-traced ring you can turn, with live choice of metal and stone, an honest week-by-week timeline for a custom ring, repair turnarounds, a ring sizer and a short appointment request.',
    href: '/work/orrin-vale/',
    image: workPreview('orrin-vale'),
    alt: 'Orrin & Vale concept website with a brilliant-cut diamond in a yellow gold six-claw setting, glinting against a dark studio background',
    screenshot: true,
  },
  {
    id: 'tidewater',
    title: 'Tidewater Yoga',
    kind: 'concept',
    industry: 'fitness-wellness',
    industryLabel: 'Yoga studio',
    summary: 'A small yoga studio in Uptown Waterloo, where a silk sheet hangs in soft light and breathes with you.',
    brief: 'People thinking about a first yoga class are nervous. They want to know which class suits them, how hard it is, what to bring, what it costs and when they can come, without having to phone and ask.',
    built: 'A silk sheet that moves in real time and can lead a one-minute guided breath, five classes in plain words with how hard each one is, a timetable you can filter by day and level, first-class advice, clear prices and a short form to save a mat.',
    href: '/work/tidewater/',
    image: workPreview('tidewater'),
    alt: "Tidewater Yoga concept website: a cream silk sheet hanging in soft light on a dark green page, beside the headline 'Breathe in. Let the week go.'",
    screenshot: true,
  },
  {
    id: 'marigold-moss',
    title: 'Marigold & Moss',
    kind: 'concept',
    industry: 'events-weddings',
    industryLabel: 'Florist',
    summary: "A florist's site where the flowers open petal by petal as you scroll, and every stem you pick grows into a 3D bouquet.",
    brief: "Most florist sites are a grid of stock bouquets and a checkout. Buyers can't see what the shop actually makes, can't tell whether they're still in time for same-day delivery, and can't get a rough wedding price without calling.",
    built: 'A still life drawn entirely in code that blooms as you scroll, a bouquet builder that suggests a size and price, a live same-day cut-off, delivery zones, wedding and event pricing, subscriptions and studio hours that show whether it is open now.',
    href: '/work/marigold-moss/',
    image: workPreview('marigold-moss'),
    alt: 'Marigold & Moss concept website: a loose bunch of peach and blush garden roses, a white anemone, cosmos and orange marigolds on deep green, beside the headline “Arranged the way they grow.”',
    screenshot: true,
  },
];

export const getProject = (id: string) => projects.find((project) => project.id === id);
export const projectsForIndustry = (industry: IndustrySlug) => projects.filter((project) => project.industry === industry);
