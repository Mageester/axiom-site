import * as React from 'react';
import { cn } from '../../lib/utils';

type FadeInTag = 'div' | 'section' | 'article' | 'header' | 'figure' | 'li' | 'aside' | 'nav' | 'main';
type FadeDirection = 'up' | 'down' | 'left' | 'right';
type MotionRole = 'cinematic' | 'editorial' | 'depth' | 'system' | 'timeline' | 'cta' | 'legal';

export interface FadeInProps extends React.HTMLAttributes<HTMLElement> {
  as?: FadeInTag;
  delay?: number;
  distance?: number;
  direction?: FadeDirection;
  motion?: MotionRole;
}

const directionTransforms: Record<FadeDirection, { x?: number; y?: number }> = {
  up: { y: 12 },
  down: { y: -12 },
  left: { x: 24 },
  right: { x: -24 },
};

export const FadeIn: React.FC<FadeInProps> = ({
  as: Component = 'div',
  className,
  delay = 0,
  distance = 12,
  direction = 'up',
  motion = 'editorial',
  style,
  children,
  ...props
}) => {
  const cappedDelay = Math.min(Math.max(delay, 0), 500);
  const transform = directionTransforms[direction];
  const revealStyle = {
    '--reveal-delay': `${cappedDelay}ms`,
    '--reveal-x': `${transform.x ?? 0}px`,
    '--reveal-y': `${transform.y ?? (transform.x ? 0 : distance)}px`,
    ...style,
  } as React.CSSProperties;

  return React.createElement(
    Component,
    {
      ...props,
      className: cn('motion-surface', className),
      'data-reveal': true,
      'data-motion': motion,
      suppressHydrationWarning: true,
      style: revealStyle,
    },
    <>
      {children}
    </>
  );
};
