import React from 'react';
import { motion, useReducedMotion, type HTMLMotionProps } from 'framer-motion';
import { MOTION_EASE_STANDARD, REVEAL_SETTINGS } from '../../lib/motion';

type RevealVariant = 'section' | 'card' | 'feature';
type RevealTag = 'div' | 'section' | 'article';

interface RevealBlockProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  as?: RevealTag;
  children: React.ReactNode;
  delay?: number;
  variant?: RevealVariant;
}

const variants: Record<RevealVariant, { hidden: { opacity: number; y: number }; visible: { opacity: number; y: number } }> = {
  section: {
    hidden: { opacity: 0, y: REVEAL_SETTINGS.section.distance },
    visible: { opacity: 1, y: 0 },
  },
  card: {
    hidden: { opacity: 0, y: REVEAL_SETTINGS.card.distance },
    visible: { opacity: 1, y: 0 },
  },
  feature: {
    hidden: { opacity: 0, y: REVEAL_SETTINGS.feature.distance },
    visible: { opacity: 1, y: 0 },
  },
};

const componentMap = {
  div: motion.div,
  section: motion.section,
  article: motion.article,
} as const;

export function RevealBlock({
  as = 'div',
  children,
  delay = 0,
  variant = 'section',
  transition,
  ...props
}: RevealBlockProps) {
  const prefersReducedMotion = useReducedMotion();
  const Component = componentMap[as];

  if (prefersReducedMotion) {
    return (
      <Component data-motion-managed="true" {...props}>
        {children}
      </Component>
    );
  }

  return (
    <Component
      data-motion-managed="true"
      initial={variants[variant].hidden}
      whileInView={variants[variant].visible}
      viewport={{ once: true, amount: 0.18, margin: '0px 0px -8% 0px' }}
      transition={{
        duration: REVEAL_SETTINGS[variant].duration,
        delay,
        ease: MOTION_EASE_STANDARD,
        ...transition,
      }}
      {...props}
    >
      {children}
    </Component>
  );
}
