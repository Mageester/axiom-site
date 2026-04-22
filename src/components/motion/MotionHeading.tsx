import * as React from 'react';
import { m } from 'framer-motion';
import useAnimatedReveal from '../../hooks/useAnimatedReveal';
import { cn } from '../../lib/utils';
import { lineRevealVariants, wordRevealVariants } from './variants';

type HeadingTag = 'h1' | 'h2' | 'h3';

const HeadingByTag = {
  h1: m.h1,
  h2: m.h2,
  h3: m.h3,
} as const;

export interface MotionHeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: HeadingTag;
  text: string;
  align?: 'left' | 'center';
}

export function MotionHeading({ as = 'h2', text, align = 'left', className, ...props }: MotionHeadingProps) {
  const reveal = useAnimatedReveal();
  const Heading = HeadingByTag[as];
  const words = text.trim().split(/\s+/);

  return (
    <Heading
      className={cn('motion-heading', align === 'center' && 'mx-auto text-center', className)}
      data-motion-visible={reveal.shouldAnimate ? 'true' : undefined}
      initial="hidden"
      animate={reveal.shouldAnimate ? 'visible' : 'hidden'}
      variants={lineRevealVariants}
      aria-label={text}
      {...props}
    >
      <span aria-hidden="true" className="split-line block">
        {words.map((word, index) => (
          <m.span
            key={`${word}-${index}`}
            className="split-char inline-block"
            variants={wordRevealVariants}
            style={{ marginRight: index === words.length - 1 ? 0 : '0.22em' }}
          >
            {word}
          </m.span>
        ))}
      </span>
    </Heading>
  );
}
