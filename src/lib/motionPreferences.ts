export const shouldDisableHeavyMotion = () => {
  if (typeof window === 'undefined') return false;

  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
    || window.matchMedia('(hover: none), (pointer: coarse)').matches;
};
