import * as React from 'react';
import { m } from 'framer-motion';
import useAnimatedReveal from '../../hooks/useAnimatedReveal';
import { cn } from '../../lib/utils';
import { fadeUpVariants } from './variants';

export interface MotionQuoteProps extends React.HTMLAttributes<HTMLParagraphElement> {
  phrases: [string, string, string];
}

export function MotionQuote({ phrases, className, ...props }: MotionQuoteProps) {
  const reveal = useAnimatedReveal();

  return (
    <m.p
      className={cn('motion-quote font-accent text-[clamp(1.2rem,2vw,1.85rem)] leading-[1.08] tracking-normal text-[var(--text-primary)]', className)}
      data-motion-visible={reveal.shouldAnimate ? 'true' : undefined}
      initial="hidden"
      animate={reveal.shouldAnimate ? 'visible' : 'hidden'}
      variants={fadeUpVariants}
      {...props}
    >
      {phrases.map((phrase, index) => (
        <span
          key={phrase}
          className={cn('quote-phrase mr-2 inline-block', index === 1 && 'relative inline-block text-[var(--accent-solid)]')}
          style={{ '--word-delay': `${index * 0.3}s` } as React.CSSProperties}
        >
          <span>
            {phrase}
            {index === 1 ? (
              <span aria-hidden="true" className="quote-underline absolute left-0 right-0 -bottom-1 h-px origin-left bg-[color:var(--accent-solid)]" />
            ) : null}
          </span>
        </span>
      ))}
    </m.p>
  );
}
