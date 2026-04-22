import * as React from 'react';
import { m } from 'framer-motion';
import { cn } from '../../lib/utils';
import useAnimatedReveal from '../../hooks/useAnimatedReveal';
import { fadeUpVariants } from '../motion/variants';

type FadeInTag = 'div' | 'section' | 'article' | 'header' | 'figure' | 'li' | 'aside' | 'nav' | 'main';
type FadeDirection = 'up' | 'down' | 'left' | 'right';

export interface FadeInProps extends React.HTMLAttributes<HTMLElement> {
  as?: FadeInTag;
  delay?: number;
  distance?: number;
  direction?: FadeDirection;
}

const MotionTag = {
  div: m.div,
  section: m.section,
  article: m.article,
  header: m.header,
  figure: m.figure,
  li: m.li,
  aside: m.aside,
  nav: m.nav,
  main: m.main,
} as const;

const directionTransforms: Record<FadeDirection, { x?: number; y?: number }> = {
  up: { y: 20 },
  down: { y: -20 },
  left: { x: 40 },
  right: { x: -40 },
};

export const FadeIn: React.FC<FadeInProps> = ({
  as: Component = 'div',
  className,
  delay = 0,
  distance = 20,
  direction = 'up',
  style,
  children,
  ...props
}) => {
  const reveal = useAnimatedReveal<HTMLElement>();
  const MotionComponent = MotionTag[Component];
  const cappedDelay = Math.min(Math.max(delay, 0), 500);
  const transform = directionTransforms[direction];

  return (
    <MotionComponent
      {...props}
      className={cn('motion-surface', className)}
      data-motion-visible={reveal.shouldAnimate ? 'true' : undefined}
      initial="hidden"
      animate={reveal.shouldAnimate ? 'visible' : 'hidden'}
      variants={{
        hidden: {
          opacity: 0,
          x: transform.x ?? 0,
          y: transform.y ?? (transform.x ? 0 : distance),
        },
        visible: {
          opacity: 1,
          x: 0,
          y: 0,
          transition: {
            duration: 0.6,
            delay: cappedDelay / 1000,
            ease: [0.22, 1, 0.36, 1],
          },
        },
      }}
      style={style}
    >
      {children}
    </MotionComponent>
  );
};
