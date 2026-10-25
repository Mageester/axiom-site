// Vector redraw of the Axiom mark (three rising blades forming an "A").
// Shared by the site logo, favicons and generated social cards.
export const MARK_VIEWBOX = '0 0 145 189';
export const MARK_PATHS = ['M39.5 86 14 108 0 189 33 168Z', 'M52.5 30 84 0 85 141 44 165Z', 'M94.5 3 105 12 144 148 94.5 90Z'] as const;

export const BRAND_COLORS = {
  ink: '#0b1324',
  brand: '#2453d6',
  night: '#0a1122',
  paper: '#ffffff',
} as const;

export const markSvg = (fill: string, attrs = '') =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${MARK_VIEWBOX}" ${attrs}><g fill="${fill}">${MARK_PATHS.map(d => `<path d="${d}"/>`).join('')}</g></svg>`;
