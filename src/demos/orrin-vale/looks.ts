/** The four metals and four stones on offer in the viewer, and how each one behaves. */
export type MetalKey = 'yellow' | 'white' | 'rose' | 'platinum';
export type StoneKey = 'diamond' | 'sapphire' | 'emerald' | 'morganite';

export type Metal = {
  key: MetalKey;
  name: string;
  spec: string;
  /** Reflectance at normal incidence, linear RGB. */
  f0: [number, number, number];
  rough: number;
};

export type Stone = {
  key: StoneKey;
  name: string;
  /** Refractive index for red, green and blue light. The spread is what makes fire. */
  ior: [number, number, number];
  /** How quickly each colour is absorbed per unit of path inside the stone. */
  absorb: [number, number, number];
  glow: number;
  hardness: string;
  note: string;
};

export const METALS: Metal[] = [
  { key: 'yellow', name: 'Yellow gold', spec: '18k yellow gold', f0: [1.0, 0.72, 0.3], rough: 0.012 },
  { key: 'white', name: 'White gold', spec: '18k white gold', f0: [0.84, 0.84, 0.82], rough: 0.01 },
  { key: 'rose', name: 'Rose gold', spec: '18k rose gold', f0: [0.98, 0.6, 0.47], rough: 0.012 },
  { key: 'platinum', name: 'Platinum', spec: 'platinum', f0: [0.68, 0.66, 0.63], rough: 0.03 },
];

export const STONES: Stone[] = [
  {
    key: 'diamond',
    name: 'Diamond',
    ior: [2.398, 2.424, 2.465],
    absorb: [0.004, 0.006, 0.012],
    glow: 0,
    hardness: '10',
    note: 'The hardest stone there is, and the most fire. Natural or lab-grown: we show you both side by side.',
  },
  {
    key: 'sapphire',
    name: 'Sapphire',
    ior: [1.757, 1.766, 1.784],
    absorb: [2.2, 1.15, 0.1],
    glow: 1,
    hardness: '9',
    note: 'Hard enough for every day. Blue is the classic, and sapphires also come in pink, yellow and teal.',
  },
  {
    key: 'emerald',
    name: 'Emerald',
    ior: [1.572, 1.578, 1.59],
    absorb: [1.45, 0.11, 0.8],
    glow: 1,
    hardness: '7.5 to 8',
    note: 'Softer, and most have natural inclusions. We set it in a protective setting and suggest taking it off for heavy work.',
  },
  {
    key: 'morganite',
    name: 'Morganite',
    ior: [1.578, 1.584, 1.596],
    absorb: [0.02, 0.36, 0.25],
    glow: 1.6,
    hardness: '7.5 to 8',
    note: 'A soft peach-pink beryl. Kind to a budget, and happiest with a gentle clean every few months.',
  },
];

export const metalByKey = (key: string) => METALS.find((m) => m.key === key) ?? METALS[0];
export const stoneByKey = (key: string) => STONES.find((s) => s.key === key) ?? STONES[0];

export const describe = (metal: Metal, stone: Stone) =>
  `Six-claw solitaire: a round brilliant ${stone.name.toLowerCase()} in ${metal.spec}.`;
