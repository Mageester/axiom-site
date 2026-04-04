export const MOTION_EASE_STANDARD: [number, number, number, number] = [0.22, 1, 0.36, 1];

export const ROUTE_TRANSITION = {
  duration: 0.32,
  ease: MOTION_EASE_STANDARD,
} as const;

export const REVEAL_SETTINGS = {
  section: {
    distance: 14,
    duration: 0.54,
  },
  card: {
    distance: 10,
    duration: 0.46,
  },
  feature: {
    distance: 18,
    duration: 0.58,
  },
} as const;
