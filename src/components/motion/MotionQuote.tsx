import * as React from 'react';
import { m } from 'framer-motion';
import { cn } from '../../lib/utils';
import { staggerChildren, viewportOnce, wordRevealVariants } from './variants';

export interface MotionQuoteProps extends React.HTMLAttributes<HTMLParagraphElement> {
  phrases: [string, string, string];
}

export function MotionQuote({ phrases, className, ...props }: MotionQuoteProps) {
  return (
    <m.p
      className={cn('font-accent text-[clamp(1.2rem,2vw,1.85rem)] leading-[1.08] tracking-[-0.04em] text-[var(--text-primary)]', className)}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={staggerChildren}
      {...props}
    >
      {phrases.map((phrase, index) => (
        <m.span key={phrase} className="mr-2 inline-block" variants={wordRevealVariants}>
          <span className={cn(index === 1 && 'relative inline-block text-[var(--accent-solid)]')}>
            {phrase}
            {index === 1 ? (
              <m.span
                aria-hidden="true"
                className="absolute left-0 right-0 -bottom-1 h-px origin-left bg-[color:var(--accent-solid)]"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={viewportOnce}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
              />
            ) : null}
          </span>
        </m.span>
      ))}
    </m.p>
  );
}
