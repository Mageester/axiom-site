import React from 'react';
import { motion, useReducedMotion, type HTMLMotionProps } from 'framer-motion';

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
    hidden: { opacity: 0, y: 22 },
    visible: { opacity: 1, y: 0 },
  },
  card: {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0 },
  },
  feature: {
    hidden: { opacity: 0, y: 26 },
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
      <Component {...props}>
        {children}
      </Component>
    );
  }

  return (
    <Component
      initial={variants[variant].hidden}
      whileInView={variants[variant].visible}
      viewport={{ once: true, amount: 0.16, margin: '0px 0px -10% 0px' }}
      transition={{
        duration: variant === 'card' ? 0.5 : 0.62,
        delay,
        ease: [0.22, 1, 0.36, 1],
        ...transition,
      }}
      {...props}
    >
      {children}
    </Component>
  );
}
