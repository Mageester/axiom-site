export const motionEase = [0.33, 1, 0.68, 1] as const;

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
      duration: 0.4,
      ease: motionEase,
    },
  },
} as const;

export const staggerChildren = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.055,
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
      duration: 0.48,
      ease: motionEase,
      staggerChildren: 0.035,
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
      duration: 0.36,
      ease: motionEase,
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
      duration: 0.38,
      ease: motionEase,
    },
  },
} as const;

export const numberCount = {
  duration: 0.9,
  ease: motionEase,
} as const;
