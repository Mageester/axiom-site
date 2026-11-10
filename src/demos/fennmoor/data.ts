// Fennmoor Home: a fictional home-goods shop. Prices are in cents, in Canadian dollars.
import photoData from './photos.json';
export { FREE_SHIPPING_FROM, money } from './money';

export const NAME = 'Fennmoor Home';
export const BASE = '/work/fennmoor';
export const EMAIL = 'hello@fennmoor.example';
export const PHONE_DISPLAY = '(519) 555-0166';
export const PHONE_HREF = 'tel:+15195550166';

export type PhotoEntry = (typeof photoData)[keyof typeof photoData];
export const photos = photoData as Record<string, PhotoEntry>;

export type CategoryHandle = 'kitchen-dining' | 'bed-bath' | 'living';
export type Category = { handle: CategoryHandle | 'all'; name: string; blurb: string; photo: string };

export const categories: Category[] = [
  {
    handle: 'kitchen-dining',
    name: 'Kitchen & Dining',
    blurb: 'Stoneware, linen and wood for the table you actually use.',
    photo: 'plates',
  },
  {
    handle: 'bed-bath',
    name: 'Bed & Bath',
    blurb: 'Washed linen, heavy cotton and a throw for the end of the sofa.',
    photo: 'duvet',
  },
  {
    handle: 'living',
    name: 'Living',
    blurb: 'Vases, baskets, candles and the small things that finish a room.',
    photo: 'vase',
  },
];

export const allCollection: Category = {
  handle: 'all',
  name: 'All products',
  blurb: 'Everything in the shop, from a single mug to a full set of bedding.',
  photo: 'hero',
};

export const collectionByHandle = (handle: string) =>
  handle === 'all' ? allCollection : categories.find((category) => category.handle === handle);

export type OptionValue = { label: string; delta?: number; swatch?: string };
export type Option = { name: string; values: OptionValue[] };
export type Product = {
  handle: string;
  name: string;
  category: CategoryHandle;
  photo: string;
  /** Price of the first value of every option, in cents. */
  base: number;
  blurb: string;
  description: string[];
  details: string[];
  care: string;
  options: Option[];
  /** What the photograph shows, when the product comes in colours. */
  shown?: string;
};

const sizes = (...entries: [string, number][]): Option => ({
  name: 'Size',
  values: entries.map(([label, delta]) => ({ label, delta })),
});
const colours = (...entries: [string, string][]): Option => ({
  name: 'Colour',
  values: entries.map(([label, swatch]) => ({ label, swatch })),
});

export const products: Product[] = [
  {
    handle: 'stoneware-mug',
    name: 'Stoneware Mug',
    category: 'kitchen-dining',
    photo: 'mug',
    base: 2800,
    blurb: 'A heavy, rounded mug with a thumb-sized handle.',
    description: [
      'Thrown from stoneware and finished with a soft satin glaze, this mug holds a proper cup of coffee and stays warm while you finish it.',
      'The glaze pools a little at the rim, so no two mugs are quite the same.',
    ],
    details: ['350 ml', 'Stoneware with a satin glaze', 'Dishwasher and microwave safe'],
    care: 'Dishwasher safe. Avoid sudden temperature changes, such as pouring boiling water into a cold mug.',
    options: [colours(['Oat', '#e4dac8'], ['Clay', '#b4714f'], ['Slate', '#5e6770'])],
    shown: 'Oat',
  },
  {
    handle: 'pinched-bowl-set',
    name: 'Pinched Bowl Set',
    category: 'kitchen-dining',
    photo: 'bowls',
    base: 4400,
    blurb: 'Small bowls with a hand-pressed rim, for nuts, dips and sauces.',
    description: [
      'Each bowl is pressed by hand around a form, which leaves a soft, uneven edge that catches the light.',
      'Sized for the things that rarely fit anywhere else: olives, butter, a spoonful of jam, the last of the salt.',
    ],
    details: ['Each bowl about 11 cm across', 'Matte white glaze', 'Sold as a set of 2 or 4'],
    care: 'Hand wash for the longest life. Dishwasher safe on a gentle cycle.',
    options: [{ name: 'Set', values: [{ label: 'Set of 2' }, { label: 'Set of 4', delta: 3800 }] }],
  },
  {
    handle: 'speckle-side-plates',
    name: 'Speckle Side Plates',
    category: 'kitchen-dining',
    photo: 'plates',
    base: 6800,
    blurb: 'Speckled stoneware plates with a rust-coloured rim.',
    description: [
      'A generous side plate, sized for toast, cake or a small supper. The speckled body and darker rim give the plain white table something to do.',
    ],
    details: ['21 cm across', 'Speckled stoneware', 'Stackable', 'Sold as a set of 4 or 6'],
    care: 'Dishwasher and oven safe up to 180 °C.',
    options: [{ name: 'Set', values: [{ label: 'Set of 4' }, { label: 'Set of 6', delta: 2800 }] }],
  },
  {
    handle: 'beech-serving-board',
    name: 'Beech Serving Board',
    category: 'kitchen-dining',
    photo: 'board',
    base: 3400,
    blurb: 'A light, close-grained board for bread, cheese and whatever is in season.',
    description: [
      'Cut from beech, sanded smooth and finished with food-safe oil. It has a shallow groove to catch juice and a hole for hanging.',
    ],
    details: ['Beech, oiled', 'Juice groove on one side', 'Three sizes'],
    care: 'Wash by hand and dry upright. Rub with a little food-safe oil when it looks pale.',
    options: [sizes(['Small, 30 cm', 0], ['Medium, 40 cm', 1800], ['Large, 50 cm', 4000])],
  },
  {
    handle: 'linen-napkins',
    name: 'Linen Napkins',
    category: 'kitchen-dining',
    photo: 'napkins',
    base: 3600,
    blurb: 'Washed linen that softens with every wash and never needs ironing.',
    description: [
      'Stonewashed before they reach you, so they are soft from the first use. Mitred corners and a narrow hem.',
    ],
    details: ['42 x 42 cm', '100% European flax linen', 'Machine washable'],
    care: 'Machine wash warm and tumble dry low. Wrinkles are part of the look.',
    options: [
      colours(['Natural', '#e3d8c3'], ['Stone', '#b9b3a6'], ['Chalk', '#f1ede4']),
      { name: 'Set', values: [{ label: 'Set of 4' }, { label: 'Set of 8', delta: 3200 }] },
    ],
    shown: 'Natural',
  },
  {
    handle: 'glass-carafe',
    name: 'Glass Carafe',
    category: 'kitchen-dining',
    photo: 'carafe',
    base: 3200,
    blurb: 'A plain, clear carafe for water, cordial or a few stems.',
    description: ['Thin-walled glass with a wide neck that is easy to fill and easy to clean. Nothing about it competes with what you put in it.'],
    details: ['Clear borosilicate glass', 'Wide neck for easy cleaning', 'Two sizes'],
    care: 'Dishwasher safe on the top rack.',
    options: [sizes(['0.75 L', 0], ['1 L', 600])],
  },
  {
    handle: 'beech-cooking-spoons',
    name: 'Beech Cooking Spoons',
    category: 'kitchen-dining',
    photo: 'spoons',
    base: 2600,
    blurb: 'Long-handled spoons that will not scratch the pan.',
    description: ['Shaped from solid beech with a deep bowl and a handle that sits comfortably in the palm. Gentle on enamel and non-stick surfaces alike.'],
    details: ['32 cm long', 'Solid beech, oiled', 'Sold as a pair or a set of 4'],
    care: 'Hand wash and dry promptly. Oil lightly every few months.',
    options: [{ name: 'Set', values: [{ label: 'Pair' }, { label: 'Set of 4', delta: 2000 }] }],
  },
  {
    handle: 'ceramic-pour-over',
    name: 'Ceramic Pour-Over',
    category: 'kitchen-dining',
    photo: 'pourover',
    base: 3800,
    blurb: 'A matte ceramic dripper for slow, good coffee.',
    description: [
      'Rests on most mugs and carafes. The ceramic holds its heat, and the ridged inside keeps the water moving evenly through the grounds.',
    ],
    details: ['Matte white ceramic', 'Takes standard cone filters', 'Two sizes'],
    care: 'Rinse after use. Dishwasher safe.',
    options: [sizes(['1 to 2 cups', 0], ['3 to 4 cups', 1000])],
  },
  {
    handle: 'linen-tea-towels',
    name: 'Linen Tea Towels',
    category: 'kitchen-dining',
    photo: 'teatowel',
    base: 3000,
    blurb: 'Absorbent linen towels, sold in pairs.',
    description: ['Linen gets more absorbent the more it is washed. These are woven loosely enough to dry quickly on the rail and have a hanging loop.'],
    details: ['50 x 70 cm', 'Pair of towels', 'Hanging loop'],
    care: 'Machine wash warm. Dry flat or tumble dry low.',
    options: [colours(['Blue stripe', '#6f86a8'], ['Natural', '#e1d6c1'])],
    shown: 'Blue stripe',
  },
  {
    handle: 'washed-linen-duvet-cover',
    name: 'Washed Linen Duvet Cover',
    category: 'bed-bath',
    photo: 'duvet',
    base: 22800,
    blurb: 'Soft from the first night, and better after a year of washing.',
    description: [
      'Washed linen has a relaxed, rumpled drape and sleeps cool in summer and warm in winter. The cover closes with buttons and has corner ties to hold your duvet in place.',
    ],
    details: ['100% flax linen', 'Button closure and corner ties', 'Machine washable'],
    care: 'Wash warm with like colours. Tumble dry low and take it out while it is still a little damp.',
    options: [sizes(['Double', 0], ['Queen', 3000], ['King', 6000]), colours(['Flax', '#c9b89c'], ['Chalk', '#efeadf'])],
    shown: 'Flax',
  },
  {
    handle: 'percale-pillowcases',
    name: 'Percale Pillowcases',
    category: 'bed-bath',
    photo: 'pillowcase',
    base: 6800,
    blurb: 'Crisp, cool cotton percale, sold as a pair.',
    description: ['A plain-weave cotton that feels crisp and cool against the skin. Envelope closure, so the pillow stays where it belongs.'],
    details: ['Pair of pillowcases', '100% cotton percale', 'Envelope closure'],
    care: 'Machine wash warm. Iron if you like them crisp.',
    options: [sizes(['Standard', 0], ['King', 1000]), colours(['Chalk', '#f1ede4'], ['Oat', '#e4dac8'])],
    shown: 'Chalk',
  },
  {
    handle: 'cotton-bath-towels',
    name: 'Cotton Bath Towels',
    category: 'bed-bath',
    photo: 'towels',
    base: 2400,
    blurb: 'Dense, absorbent towels that dry quickly on the rail.',
    description: ['Heavy combed cotton with a flat, even loop. They stay soft after a lot of washing and dry faster than a plush towel.'],
    details: ['Heavy cotton, 550 gsm', 'Three sizes', 'Hanging loop'],
    care: 'Wash warm and tumble dry low. Skip fabric softener, which coats the fibres.',
    options: [sizes(['Hand towel', 0], ['Bath towel', 1800], ['Bath sheet', 3800]), colours(['Stone', '#c4bcae'], ['Sand', '#d8c8ad'])],
    shown: 'Stone',
  },
  {
    handle: 'chunky-knit-throw',
    name: 'Chunky Knit Throw',
    category: 'bed-bath',
    photo: 'throw',
    base: 14800,
    blurb: 'A big, soft throw for the arm of the sofa or the end of the bed.',
    description: ['Knitted in a thick, loose rib from soft merino-blend yarn. Heavy enough to feel like a hug, light enough to pull over your knees.'],
    details: ['130 x 170 cm', 'Merino-blend yarn', 'Dry clean or hand wash'],
    care: 'Hand wash cool and dry flat. Do not wring.',
    options: [colours(['Sage', '#a9b39a'], ['Oat', '#e5dbc9'])],
    shown: 'Sage',
  },
  {
    handle: 'cold-process-soap',
    name: 'Cold-Process Soap',
    category: 'bed-bath',
    photo: 'soap',
    base: 900,
    blurb: 'Simple bars scented with essential oils and left to cure for six weeks.',
    description: ['Made with olive and coconut oils, cured slowly and cut into generous bars. Each scent is built from essential oils, with nothing synthetic.'],
    details: ['About 110 g per bar', 'Olive and coconut oil base', 'Choose from three scents'],
    care: 'Keep it on a draining dish so it lasts longer.',
    options: [
      { name: 'Pack', values: [{ label: 'Single bar' }, { label: 'Set of 3', delta: 1500 }, { label: 'Set of 5', delta: 3000 }] },
      { name: 'Scent', values: [{ label: 'Oat & honey' }, { label: 'Cedar' }, { label: 'Clay & charcoal' }] },
    ],
  },
  {
    handle: 'amber-jar-candle',
    name: 'Amber Jar Candle',
    category: 'living',
    photo: 'candle',
    base: 2400,
    blurb: 'A soy candle in a reusable amber glass jar.',
    description: ['Poured by hand in small batches with a cotton wick. The amber jar is made to be washed out and reused for pens, cotton pads or a few stems.'],
    details: ['Soy wax with a cotton wick', 'Burns for about 40 hours (small)', 'Reusable glass jar'],
    care: 'Trim the wick to 5 mm before each burn and never leave a candle unattended.',
    options: [sizes(['Small, 180 g', 0], ['Large, 380 g', 1800]), { name: 'Scent', values: [{ label: 'Cedar & fig' }, { label: 'Fresh linen' }, { label: 'Orange peel' }] }],
  },
  {
    handle: 'fluted-ceramic-vase',
    name: 'Fluted Ceramic Vase',
    category: 'living',
    photo: 'vase',
    base: 4600,
    blurb: 'A matte white vase with a shell-like fluted base.',
    description: ['Holds a single stem or a loose bunch of grasses. The fluting catches the light through the day. Dried stems are not included.'],
    details: ['Matte white ceramic', 'Waterproof glazed inside', 'Two sizes'],
    care: 'Rinse with warm water. Hand wash only.',
    options: [sizes(['Small, 18 cm', 0], ['Large, 28 cm', 2200])],
  },
  {
    handle: 'seagrass-basket-with-lid',
    name: 'Seagrass Basket with Lid',
    category: 'living',
    photo: 'basket',
    base: 4800,
    blurb: 'A tight-woven basket with a lid, for blankets, toys and everything else.',
    description: ['Woven by hand from seagrass over a sturdy frame, with a lid that sits neatly in place. It looks as good on the floor by the sofa as it does on a shelf.'],
    details: ['Natural seagrass', 'Sturdy frame', 'Three sizes'],
    care: 'Wipe with a damp cloth. Keep out of direct sunlight.',
    options: [sizes(['Small, 28 cm', 0], ['Medium, 36 cm', 2000], ['Large, 46 cm', 4400])],
  },
  {
    handle: 'glazed-clay-planter',
    name: 'Glazed Clay Planter',
    category: 'living',
    photo: 'planter',
    base: 2800,
    blurb: 'A warm, glazed pot with a drainage hole and a saucer.',
    description: ['A glazed outside and a clear drainage hole, with a matching saucer so the sill stays dry. Plant not included.'],
    details: ['Glazed clay', 'Drainage hole and saucer', 'Two sizes'],
    care: 'Wipe with a damp cloth. Bring indoors before the first frost.',
    options: [sizes(['Small, 12 cm', 0], ['Large, 20 cm', 1600])],
  },
  {
    handle: 'boucle-cushion',
    name: 'Bouclé Cushion',
    category: 'living',
    photo: 'cushion',
    base: 6400,
    blurb: 'A soft, round cushion with a looped, textured weave.',
    description: ['A round cushion in a looped bouclé weave, filled with a soft recycled-fibre insert. Zip cover that comes off for washing.'],
    details: ['40 cm across', 'Removable cover with zip', 'Recycled-fibre insert included'],
    care: 'Spot clean, or wash the cover on a gentle cycle and air dry.',
    options: [colours(['Cream', '#ece5d6'], ['Oat', '#ddd0b9'])],
    shown: 'Cream',
  },
  {
    handle: 'oak-serving-tray',
    name: 'Oak Serving Tray',
    category: 'living',
    photo: 'tray',
    base: 4200,
    blurb: 'A shallow oak tray with a gentle lip, for breakfast or a few candles.',
    description: ['Solid oak with a hand-rubbed oil finish. Sized to carry a pot of tea and two cups, or to corral the things that collect on a console table.'],
    details: ['Solid oak, oiled', 'Low lip on all sides', 'Two sizes'],
    care: 'Wipe with a damp cloth and oil occasionally. Do not soak.',
    options: [sizes(['Small, 30 cm', 0], ['Large, 42 cm', 2000])],
  },
];

export const productByHandle = (handle: string) => products.find((product) => product.handle === handle)!;
export const productsIn = (handle: string) => (handle === 'all' ? products : products.filter((product) => product.category === handle));

/** The price of the cheapest variant. */
export const fromPrice = (product: Product) => product.base;
export const hasRange = (product: Product) =>
  product.options.some((option) => option.values.some((value) => (value.delta ?? 0) !== 0));

export const featured = [
  'stoneware-mug',
  'washed-linen-duvet-cover',
  'beech-serving-board',
  'amber-jar-candle',
  'chunky-knit-throw',
  'fluted-ceramic-vase',
  'linen-napkins',
  'seagrass-basket-with-lid',
];
