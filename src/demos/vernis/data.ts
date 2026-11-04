/**
 * Everything Vernis knows about itself: shades, services, hours. The page markup is built
 * from this at build time and the scripts read the same lists, so they cannot disagree.
 *
 * Every shade carries two tested colour pairs. The first (bg, ink, accent) is the page at
 * rest. The second (bg2, ink2, accent2) is what the whole page turns into as you scroll into
 * the lighter or darker half of the story. Ink on bg is at least 7:1 in every shade; the
 * accent and the muted ink are at least 4.5:1 on their own background.
 */
export type Shade = {
  id: string;
  name: string;
  /** One line shown with the name in the hero and on its swatch. */
  note: string;
  bg: string;
  ink: string;
  accent: string;
  bg2: string;
  ink2: string;
  accent2: string;
  /** The lacquer itself: the pooled depth, the body colour, and the light that comes through thin edges. */
  deep: string;
  mid: string;
  glow: string;
};

export const shades: Shade[] = [
  {
    id: 'cassis',
    name: 'Cassis',
    note: 'Blackcurrant. Reads black indoors, wine in daylight.',
    bg: '#190712',
    ink: '#f7ebf1',
    accent: '#e6a8e8',
    bg2: '#efe3ea',
    ink2: '#2a0b1e',
    accent2: '#9b1f66',
    deep: '#0a0208',
    mid: '#4f1040',
    glow: '#b5287f',
  },
  {
    id: 'oxblood',
    name: 'Oxblood',
    note: 'A red that has stopped trying to be cheerful.',
    bg: '#1c0807',
    ink: '#f8ece4',
    accent: '#ff8d6e',
    bg2: '#f0e4da',
    ink2: '#2c0b0a',
    accent2: '#a8281d',
    deep: '#110302',
    mid: '#6e0f13',
    glow: '#d8351e',
  },
  {
    id: 'bare',
    name: 'Bare',
    note: 'Your own nail, only better. Milky, warm, a little beige.',
    bg: '#e8dccf',
    ink: '#2a1f19',
    accent: '#8f4426',
    bg2: '#1e1713',
    ink2: '#f0e4d6',
    accent2: '#e8aa86',
    deep: '#a98468',
    mid: '#d6b79e',
    glow: '#f8e8d8',
  },
  {
    id: 'ink',
    name: 'Ink',
    note: 'Navy so dark it behaves like black until it moves.',
    bg: '#070b18',
    ink: '#e6ebfa',
    accent: '#8fb0ff',
    bg2: '#e1e6f3',
    ink2: '#0a1030',
    accent2: '#2441c4',
    deep: '#010309',
    mid: '#0f2160',
    glow: '#3d68ea',
  },
  {
    id: 'pistachio',
    name: 'Pistachio',
    note: 'Soft green with a little sunlight in it.',
    bg: '#d5e6b5',
    ink: '#15230d',
    accent: '#38641c',
    bg2: '#15240e',
    ink2: '#e2f1c4',
    accent2: '#b5da7a',
    deep: '#7ba548',
    mid: '#aed16c',
    glow: '#f1fbd2',
  },
  {
    id: 'cobalt',
    name: 'Cobalt',
    note: 'Electric, saturated blue. Looks wet from across the room.',
    bg: '#1432c8',
    ink: '#f3f6ff',
    accent: '#a6e9ff',
    bg2: '#e9edfb',
    ink2: '#0b1a6e',
    accent2: '#1432c8',
    deep: '#06155e',
    mid: '#1c46e6',
    glow: '#7aa6ff',
  },
  {
    id: 'clementine',
    name: 'Clementine',
    note: 'Orange with real juice in it. Best on short nails.',
    bg: '#ff7a1a',
    ink: '#1f0b02',
    accent: '#4a1700',
    bg2: '#2a1206',
    ink2: '#ffe9d6',
    accent2: '#ff9a4d',
    deep: '#c24300',
    mid: '#ff7d1c',
    glow: '#ffd08a',
  },
];

export type Service = {
  id: string;
  name: string;
  /** Minutes, used to sort and to work out which start times fit before closing. */
  minutes: number;
  /** Whole dollars, CAD, before tax. */
  price: number;
  /** True when the price is a starting price. */
  from?: boolean;
  summary: string;
  includes: string[];
  goodFor: string;
};

export const services: Service[] = [
  {
    id: 'lacquer',
    name: 'Lacquer manicure',
    minutes: 45,
    price: 48,
    summary: 'Classic polish, done slowly and dry before you leave.',
    includes: ['Shaping and cuticle care', 'Two coats of colour and a top coat', 'Quick-dry finish, so you can find your keys'],
    goodFor: 'Changing colour often. Lasts about a week.',
  },
  {
    id: 'gel',
    name: 'Gel manicure',
    minutes: 60,
    price: 62,
    summary: 'Thin cured coats with a hard, mirror shine.',
    includes: ['Shaping and cuticle care', 'Gel colour cured in thin coats', 'Gel top coat, fully dry the second you leave'],
    goodFor: 'Two to three weeks of shine without a chip.',
  },
  {
    id: 'structured',
    name: 'Structured gel',
    minutes: 90,
    price: 85,
    summary: 'A thin layer of builder gel for strength and a clean apex.',
    includes: ['Prep and a careful apex built by hand', 'Builder gel in a sheer or full colour', 'Gel top coat'],
    goodFor: 'Soft, peeling or growing-out nails.',
  },
  {
    id: 'sculpted',
    name: 'Sculpted extensions',
    minutes: 150,
    price: 130,
    from: true,
    summary: 'Length and shape built on a form, nail by nail.',
    includes: ['Consultation on shape and length', 'Gel sculpted on forms, not tips', 'Colour and top coat of your choice'],
    goodFor: 'A specific shape: almond, coffin, square, or very short and very round.',
  },
  {
    id: 'pedicure',
    name: 'Pedicure',
    minutes: 60,
    price: 75,
    summary: 'A proper soak, a proper file, lacquer on top.',
    includes: ['Soak, nail shaping and cuticle care', 'Callus smoothing and a short massage', 'Lacquer in any shade on the shelf'],
    goodFor: 'Sandal season, or anyone on their feet all day.',
  },
  {
    id: 'gelpedi',
    name: 'Gel pedicure',
    minutes: 75,
    price: 90,
    summary: 'The pedicure above, finished in gel.',
    includes: ['Everything in the pedicure', 'Gel colour and gel top coat', 'Holds its shine for about four weeks'],
    goodFor: 'A holiday, a wedding, or a busy month.',
  },
  {
    id: 'art',
    name: 'Nail art',
    minutes: 30,
    price: 6,
    from: true,
    summary: 'Priced per nail, added to any manicure.',
    includes: ['Fine lines and hand-painted detail', 'Chrome, glazed and cat-eye finishes', 'We sketch it with you before we start'],
    goodFor: 'One accent nail or ten. Bring a picture if you have one.',
  },
  {
    id: 'removal',
    name: 'Removal and reset',
    minutes: 30,
    price: 25,
    summary: 'Gentle soak-off of gel or extensions, with a bare-nail reset.',
    includes: ['Soak-off, never peeled or scraped', 'Shaping and a nourishing oil', 'Can be followed straight away by a new set'],
    goodFor: 'Taking a break, or coming in from another studio.',
  },
];

/** Opening hours by weekday, 0 = Sunday. Hours are in 24-hour time. */
export const hours: Record<number, [number, number] | null> = {
  0: null,
  1: null,
  2: [10, 19],
  3: [10, 19],
  4: [10, 20],
  5: [10, 19],
  6: [9, 17],
};

export const hoursRows = [
  { days: 'Monday', open: 'Closed' },
  { days: 'Tuesday to Wednesday', open: '10 am to 7 pm' },
  { days: 'Thursday', open: '10 am to 8 pm' },
  { days: 'Friday', open: '10 am to 7 pm' },
  { days: 'Saturday', open: '9 am to 5 pm' },
  { days: 'Sunday', open: 'Closed' },
];

export const PHONE_DISPLAY = '(519) 555-0163';
export const PHONE_HREF = 'tel:+15195550163';
export const ADDRESS_LINES = ['114 Erb Street West', 'Unit 2, Waterloo, Ontario'];
