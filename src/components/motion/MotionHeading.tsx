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

  // Parse markdown-style asterisks: e.g. "A sharper *digital front door* for businesses."
  const tokens: { text: string; isSerif: boolean }[] = [];
  const regex = /\*(.+?)\*/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      tokens.push({
        text: text.slice(lastIndex, match.index),
        isSerif: false,
      });
    }
    tokens.push({
      text: match[1],
      isSerif: true,
    });
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < text.length) {
    tokens.push({
      text: text.slice(lastIndex),
      isSerif: false,
    });
  }

  const words: { word: string; isSerif: boolean }[] = [];
  tokens.forEach((token) => {
    const splitWords = token.text.split(/\s+/).filter(Boolean);
    splitWords.forEach((sw) => {
      words.push({
        word: sw,
        isSerif: token.isSerif,
      });
    });
  });

  return (
    <Heading
      className={cn('motion-heading', align === 'center' && 'mx-auto text-center', className)}
      data-reveal
      data-motion="editorialMaskReveal"
      data-heading-level={as}
      suppressHydrationWarning
      aria-label={text.replace(/\*/g, '')}
      {...props}
    >
      <span aria-hidden="true" className="split-line block">
        {words.map((item, index) => (
          <React.Fragment key={`${item.word}-${index}`}>
            <span
              className={cn(
                'split-char inline-block',
                item.isSerif && 'font-editorial italic font-light tracking-normal text-[var(--accent-solid)]'
              )}
              style={
                {
                  '--word-delay': `${index * (as === 'h1' ? 0.062 : 0.044)}s`,
                } as React.CSSProperties
              }
            >
              {item.word}
            </span>
            {index === words.length - 1 ? null : ' '}
          </React.Fragment>
        ))}
      </span>
    </Heading>
  );
}
