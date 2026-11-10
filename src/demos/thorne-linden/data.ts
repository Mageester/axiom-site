// Thorne & Linden Interiors: a fictional interior design studio. Everything here is made up for
// the concept, and the photographs are licensed stock (credited in the footer).
import photoData from './photos.json';

export const NAME = 'Thorne & Linden Interiors';
export const SHORT = 'Thorne & Linden';
export const BASE = '/work/thorne-linden';
export const EMAIL = 'studio@thornelinden.example';
export const PHONE_DISPLAY = '(226) 555-0142';
export const PHONE_HREF = 'tel:+12265550142';
export const ADDRESS = ['Unit 4, 118 Example Street', 'Guelph, Ontario'];

export type PhotoEntry = (typeof photoData)[keyof typeof photoData];
export const photos = photoData as Record<string, PhotoEntry>;

export type Shot = {
  photo: string;
  /** A short caption under the picture. */
  caption?: string;
  /** Full width in the project page, instead of sharing a row. */
  wide?: boolean;
};

export type Project = {
  slug: string;
  title: string;
  type: 'Kitchen' | 'Bathroom' | 'Bedroom' | 'Living room' | 'Joinery' | 'Whole home';
  place: string;
  year: string;
  cover: string;
  /** One sentence for the grid. */
  line: string;
  scope: string[];
  brief: string[];
  outcome: string[];
  shots: Shot[];
};

export const projects: Project[] = [
  {
    slug: 'sage-bathroom',
    title: 'The Sage Bathroom',
    type: 'Bathroom',
    place: 'Cambridge, Ontario',
    year: '2025',
    cover: 'ba1',
    line: 'Sage tile, a stone basin and a single oak console.',
    scope: ['Layout and fixture selection', 'Tile, stone and timber specification', 'Lighting and mirror plan', 'Styling'],
    brief: [
      'A narrow family bathroom with no natural character: white tile, a builder-grade vanity and a mirror that did nothing for the light.',
      'The brief was calm and low-maintenance, and nothing that would look dated in ten years.',
    ],
    outcome: [
      'We chose a soft sage tile, ran a stone basin on an oak console in place of the vanity, and kept every surface matte so the room reads as one quiet colour.',
      'Wall-mounted taps free up the shelf, and a round mirror and two woven baskets finish it without adding clutter.',
    ],
    shots: [
      { photo: 'ba1', wide: true, caption: 'The console and basin against sage tile.' },
      { photo: 'ba2', caption: 'Straight on: mirror, console and storage baskets.' },
      { photo: 'ba3', caption: 'A rough stone basin under a wall tap.' },
      { photo: 'ba4', caption: 'Taps, basin and a few things to hold.' },
      { photo: 'ba5', caption: 'Ceramics on the oak shelf.' },
    ],
  },
  {
    slug: 'oak-and-brass-kitchen',
    title: 'The Oak and Brass Kitchen',
    type: 'Kitchen',
    place: 'Kitchener, Ontario',
    year: '2025',
    cover: 'k1',
    line: 'Oak cabinets, a stone island and brass that will age well.',
    scope: ['Layout and cabinetry design', 'Stone, timber and metal finishes', 'Pendant and under-cabinet lighting', 'Hardware and tap selection'],
    brief: [
      'An open-plan kitchen that had to work as the family dining room too, with windows on two sides and plenty of daylight to use.',
      'The clients wanted warmth, and nothing that looked like a showroom.',
    ],
    outcome: [
      'Oak cabinets set the tone. A waterfall island in pale stone anchors the room and brass pendants hold the line of the table.',
      'Black cabinet handles and a single brass tap keep the metals deliberate rather than decorative.',
    ],
    shots: [
      { photo: 'k1', wide: true, caption: 'The island, the oak run and the pendants.' },
      { photo: 'k2', caption: 'Looking through to the dining area.' },
      { photo: 'k3', caption: 'A brass tap on a stone worktop.' },
    ],
  },
  {
    slug: 'walnut-bedroom',
    title: 'The Walnut Bedroom',
    type: 'Bedroom',
    place: 'Waterloo, Ontario',
    year: '2024',
    cover: 'br1',
    line: 'A bedroom built around a walnut headboard and one copper lamp.',
    scope: ['Colour and materials', 'Headboard and bedside design', 'Lighting', 'Linen and window dressing'],
    brief: [
      'A tired spare room that had to become the main bedroom, in a house where nothing else matched.',
      'Quiet, soft and uncluttered, with one thing worth looking at.',
    ],
    outcome: [
      'A walnut headboard is the only strong note. Everything else is white, grey-white or marble, with a copper lamp for warmth after dark.',
      'Sheer curtains keep the morning light soft and make the room feel bigger than it is.',
    ],
    shots: [
      { photo: 'br1', wide: true, caption: 'Walnut, white linen and a round nightstand.' },
      { photo: 'br2', caption: 'Morning light through the curtain.' },
      { photo: 'br3', caption: 'The copper lamp and a small vase.' },
      { photo: 'br4', caption: 'A close view of the nightstand.' },
    ],
  },
  {
    slug: 'light-living-room',
    title: 'The Light Living Room',
    type: 'Living room',
    place: 'Guelph, Ontario',
    year: '2024',
    cover: 'fl1',
    line: 'Pale walls, linen blinds and furniture you can really sit on.',
    scope: ['Furniture plan', 'Window treatments', 'Rug, lighting and storage', 'Paint and colour'],
    brief: [
      'A bright but plain living room in a century home, with tall windows that needed dressing and a layout that left the sofa floating.',
    ],
    outcome: [
      'We anchored the room with a long sofa and a single armchair under the windows, dressed each window with a linen roman blind and brought in a patterned rug for warmth underfoot.',
      'A tall painted cabinet takes everything that used to sit on the floor.',
    ],
    shots: [
      { photo: 'fl1', wide: true, caption: 'A beige sofa under a linen blind.' },
      { photo: 'fl2', caption: 'The rug and the painted cabinet.' },
      { photo: 'fl3', caption: 'Sofa and armchair beneath the tall window.' },
      { photo: 'fl4', caption: 'The bay: three blinds and a velvet settee.' },
    ],
  },
  {
    slug: 'long-table-house',
    title: 'The Long Table House',
    type: 'Whole home',
    place: 'Elora, Ontario',
    year: '2024',
    cover: 'di1',
    line: 'Plaster walls, a long walnut table and woven light.',
    scope: ['Whole-home colour and materials', 'Furniture and lighting', 'Dining and living areas', 'Styling'],
    brief: [
      'A holiday house that the family now uses all year, with high ceilings and white plaster walls that needed furniture of the right weight.',
    ],
    outcome: [
      'A long walnut table under rattan pendants became the heart of the house. The living area stays low and timber-framed so the ceiling can do its work.',
      'In the kitchen, woven chairs and a floating shelf keep the plaster counter feeling light.',
    ],
    shots: [
      { photo: 'di1', caption: 'The dining table under rattan pendants.' },
      { photo: 'di2', caption: 'A low timber sofa below the high ceiling.' },
      { photo: 'di3', caption: 'The kitchen counter with woven chairs.' },
    ],
  },
  {
    slug: 'built-ins-for-a-working-home',
    title: 'Built-ins for a Working Home',
    type: 'Joinery',
    place: 'Hespeler, Ontario',
    year: '2023',
    cover: 'bi1',
    line: 'Oak shelves and a desk that disappear into the wall.',
    scope: ['Joinery design and drawings', 'Material and finish selection', 'Lighting', 'Styling'],
    brief: [
      'Two people working from home in a house with no study. We needed to find them a desk without losing a room.',
    ],
    outcome: [
      'A run of oak shelves with a built-in desk now sits in an alcove and closes visually with the wall. A lamp, a framed print and a grey stool are the only things on show.',
      'In the hall, a plaster niche holds clay vases beside a large leaf.',
    ],
    shots: [
      { photo: 'bi1', caption: 'The built-in with its desk and lamp.' },
      { photo: 'bi2', caption: 'Floating shelves and a grey stool.' },
      { photo: 'bi3', caption: 'A plaster niche in the hall.' },
      { photo: 'bi4', caption: 'Clay vases beside a large leaf.' },
    ],
  },
];

export const projectBySlug = (slug: string) => projects.find((project) => project.slug === slug)!;

export type Service = {
  id: string;
  name: string;
  from: string;
  blurb: string;
  includes: string[];
  fit: string;
};

export const services: Service[] = [
  {
    id: 'room-design',
    name: 'Room design',
    from: 'From $2,800 per room',
    blurb: 'A complete plan for one room: layout, colour, materials, furniture and lighting.',
    includes: [
      'Site visit and measured survey',
      'Layout options and a final plan',
      'Materials board and colour scheme',
      'A shopping list with suppliers and prices',
    ],
    fit: 'For a kitchen, a bathroom, a bedroom or a living room.',
  },
  {
    id: 'whole-home',
    name: 'Whole-home design',
    from: 'From $9,500',
    blurb: 'One consistent plan for the entire house, so each room belongs to the next.',
    includes: [
      'Everything in Room design, for every room',
      'A single palette and material language',
      'Phased plan so the work can happen over time',
      'Tradespeople and supplier coordination',
    ],
    fit: 'For a new home, a renovation or a house that has never quite come together.',
  },
  {
    id: 'joinery',
    name: 'Custom joinery design',
    from: 'From $1,800 per piece',
    blurb: 'Drawings for built-in shelving, desks, wardrobes and storage that a joiner can make.',
    includes: [
      'Measured drawings and a materials schedule',
      'Hardware and finish selection',
      'Introductions to local makers',
      'Site check at installation',
    ],
    fit: 'For an alcove, a hallway or a wall that is working too hard.',
  },
  {
    id: 'styling',
    name: 'Styling day',
    from: 'From $650',
    blurb: 'A day in your home with what you already own, plus a short shopping list for what is missing.',
    includes: [
      'A half-day in your home, rearranging what you have',
      'A written list of what to add, keep and let go',
      'Optional sourcing of one or two key pieces',
    ],
    fit: 'For a room that is nearly there.',
  },
];

export const process = [
  { title: 'Talk', text: 'A free thirty-minute call to hear what you want and tell you honestly whether we are the right fit.' },
  { title: 'Plan', text: 'We visit, measure, then present a plan with real products, prices and a timeline.' },
  { title: 'Build', text: 'We work with your contractor or ours, order everything and visit the site as it goes in.' },
  { title: 'Finish', text: 'We style the room, walk you through care and check in once a month after it is done.' },
];

export const faqs = [
  {
    q: 'Do you work outside Guelph?',
    a: 'Yes, anywhere in Waterloo Region, Wellington County and Halton. Further out, we can work from measured plans and photographs.',
  },
  {
    q: 'How long does a room take?',
    a: 'Design takes about four weeks. A kitchen or a bathroom build then takes eight to fourteen weeks, depending on lead times.',
  },
  {
    q: 'Do you manage the build?',
    a: 'We design and coordinate, and visit the site. A contractor you trust, or one we recommend, carries out the work.',
  },
];

export const projectTypes = ['Kitchen', 'Bathroom', 'Bedroom', 'Living room', 'Joinery', 'Whole home', 'Not sure yet'];
export const budgets = ['Under $5,000', '$5,000 to $15,000', '$15,000 to $50,000', 'Over $50,000', 'Not sure yet'];
