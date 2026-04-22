export const motionEase = [0.22, 1, 0.36, 1] as const;

export const viewportOnce = {
  once: true,
  margin: '-15%',
} as const;

export const fadeUpVariants = {
  hidden: (distance = 20) => ({
    opacity: 0,
    y: distance,
  }),
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: motionEase,
    },
  },
} as const;

export const staggerChildren = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
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
      duration: 0.7,
      ease: motionEase,
      staggerChildren: 0.05,
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
      duration: 0.45,
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
      duration: 0.5,
      ease: motionEase,
    },
  },
} as const;

export const numberCount = {
  duration: 1.2,
  ease: motionEase,
} as const;
