import * as React from 'react';
import { cn } from '../../lib/utils';

type HeadingTag = 'h1' | 'h2' | 'h3';

const HeadingByTag = {
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
} as const;

export interface MotionHeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: HeadingTag;
  text: string;
  align?: 'left' | 'center';
}

export function MotionHeading({ as = 'h2', text, align = 'left', className, ...props }: MotionHeadingProps) {
  const Heading = HeadingByTag[as];
  const words = text.trim().split(/\s+/);

  return (
    <Heading
      className={cn('motion-heading', align === 'center' && 'mx-auto text-center', className)}
      data-reveal
      data-motion="heading"
      data-heading-level={as}
      suppressHydrationWarning
      aria-label={text}
      {...props}
    >
      <span aria-hidden="true" className="split-line block">
        {words.map((word, index) => (
          <span
            key={`${word}-${index}`}
            className="split-char inline-block"
            style={
              {
                marginRight: index === words.length - 1 ? 0 : '0.22em',
                '--word-delay': `${index * (as === 'h1' ? 0.045 : 0.032)}s`,
              } as React.CSSProperties
            }
          >
            {word}
          </span>
        ))}
      </span>
    </Heading>
  );
}
