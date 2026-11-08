/** Mirrorline Detailing: the fictional studio's packages and prices (CAD, before HST). */

export type Size = 'sedan' | 'suv' | 'truck';

export const sizes: { id: Size; label: string; short: string; plural: string }[] = [
  { id: 'sedan', label: 'Coupe or sedan', short: 'Coupe / sedan', plural: 'coupes and sedans' },
  { id: 'suv', label: 'SUV or crossover', short: 'SUV', plural: 'SUVs and crossovers' },
  { id: 'truck', label: 'Truck or van', short: 'Truck / van', plural: 'trucks and vans' },
];

export type Package = {
  id: string;
  name: string;
  line: string;
  time: string;
  price: Record<Size, number>;
  includes: string[];
};

export type Group = { id: string; title: string; note: string; packages: Package[] };

export const groups: Group[] = [
  {
    id: 'keep',
    title: 'Keep it clean',
    note: 'For cars in good shape that should stay that way.',
    packages: [
      {
        id: 'wash',
        name: 'Maintenance wash',
        line: 'A careful hand wash that keeps a clean car clean.',
        time: 'About 2 hours',
        price: { sedan: 95, suv: 115, truck: 135 },
        includes: [
          'Foam pre-soak and two-bucket hand wash',
          'Wheels, tires and wheel wells',
          'Dried with filtered air and soft towels',
          'Glass inside and out, quick vacuum',
          'Spray sealant top-up',
        ],
      },
      {
        id: 'interior',
        name: 'Interior reset',
        line: 'Seats, carpets and every seam, back to clean.',
        time: '4 to 5 hours',
        price: { sedan: 229, suv: 269, truck: 309 },
        includes: [
          'Full vacuum, under the seats and the trunk',
          'Carpets and cloth seats shampooed and extracted',
          'Leather cleaned and conditioned',
          'Vents, cupholders and door pockets steamed',
          'Screens, glass and trim wiped streak-free',
        ],
      },
    ],
  },
  {
    id: 'correct',
    title: 'Bring it back',
    note: 'For swirls, haze and paint that has lost its depth.',
    packages: [
      {
        id: 'one-step',
        name: 'One-step correction',
        line: 'One machine polish for light swirls and a dull finish.',
        time: 'One full day',
        price: { sedan: 549, suv: 649, truck: 749 },
        includes: [
          'Wash, iron decontamination and clay',
          'Paint depth measured on every panel',
          'Single-stage machine polish',
          'Paint sealant to finish',
          'Walkaround under the studio lights',
        ],
      },
      {
        id: 'two-step',
        name: 'Two-step correction',
        line: 'Compound, then polish, for heavier swirls and haze.',
        time: 'Two days',
        price: { sedan: 949, suv: 1099, truck: 1249 },
        includes: [
          'Everything in the one-step',
          'Cutting stage for deeper marring',
          'Finishing stage for clarity and gloss',
          'Checked under three kinds of light',
          'Paint sealant to finish',
        ],
      },
    ],
  },
  {
    id: 'protect',
    title: 'Protect it',
    note: 'For keeping the finish, through every season.',
    packages: [
      {
        id: 'ceramic',
        name: 'Ceramic coating',
        line: 'Correction, then a hard, slick coating that sheds water.',
        time: 'Two days, one night indoors',
        price: { sedan: 1295, suv: 1495, truck: 1695 },
        includes: [
          'One-step correction included',
          'Panel wipe to strip polishing oils',
          'Coating on paint, wheel faces and glass',
          'Cured indoors overnight',
          'Coating check at one year',
        ],
      },
      {
        id: 'winter',
        name: 'Winter salt protection',
        line: 'Ready for brine, slush and road salt.',
        time: 'About 3 hours',
        price: { sedan: 199, suv: 229, truck: 259 },
        includes: [
          'Undercarriage and wheel-well rinse',
          'Paint sealant before the first snowfall',
          'Wheel faces sealed against salt and brake dust',
          'Door jambs and sills cleaned and protected',
          'Rubber floor liners fitted, if you have them',
        ],
      },
    ],
  },
];

export const allPackages = groups.flatMap((g) => g.packages);

export const money = (n: number) => `$${n.toLocaleString('en-CA')}`;
