export const motionEase = [0.33, 1, 0.68, 1] as const;
export const cinematicEase = [0.16, 1, 0.3, 1] as const;

export const viewportOnce = {
  once: true,
  margin: '-15%',
} as const;

export const fadeUpVariants = {
  hidden: (distance = 10) => ({
    opacity: 0,
    y: distance,
  }),
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.76,
      ease: cinematicEase,
    },
  },
} as const;

export const staggerChildren = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
} as const;

export const lineRevealVariants = {
  hidden: {
    clipPath: 'inset(0 100% 0 0)',
  },
  visible: {
    clipPath: 'inset(0 0 0 0)',
    transition: {
      duration: 0.88,
      ease: cinematicEase,
      staggerChildren: 0.055,
    },
  },
} as const;

export const wordRevealVariants = {
  hidden: {
    opacity: 0,
    y: '0.35em',
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: cinematicEase,
    },
  },
} as const;

export const underlineDrawVariants = {
  hidden: {
    scaleX: 0,
  },
  visible: {
    scaleX: 1,
    transition: {
      duration: 0.68,
      ease: cinematicEase,
    },
  },
} as const;

export const numberCount = {
  duration: 1.25,
  ease: cinematicEase,
} as const;
