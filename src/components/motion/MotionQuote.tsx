import * as React from 'react';
import { cn } from '../../lib/utils';

export interface MotionQuoteProps extends React.HTMLAttributes<HTMLParagraphElement> {
  phrases: [string, string, string];
}

export function MotionQuote({ phrases, className, ...props }: MotionQuoteProps) {
  return (
    <p
      className={cn('motion-quote font-accent text-[clamp(1.2rem,2vw,1.85rem)] leading-[1.2] tracking-[-0.02em] text-[var(--text-primary)] sm:leading-[1.08] sm:tracking-[-0.04em]', className)}
      data-reveal
      suppressHydrationWarning
      {...props}
    >
      {phrases.map((phrase, index) => (
        <span
          key={phrase}
          className={cn('quote-phrase mr-2 inline-block', index === 1 && 'relative inline-block text-[var(--accent-solid)]')}
          style={{ '--word-delay': `${index * 0.14}s` } as React.CSSProperties}
        >
          <span>
            {phrase}
            {index === 1 ? (
              <span aria-hidden="true" className="quote-underline absolute left-0 right-0 -bottom-1 h-px origin-left bg-[color:var(--accent-solid)]" />
            ) : null}
          </span>
        </span>
      ))}
    </p>
  );
}
