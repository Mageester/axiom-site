import React from 'react';
import useReveal from '../../hooks/useReveal';

type RevealVariant = 'section' | 'card' | 'feature';
type RevealTag = 'div' | 'section' | 'article';

interface RevealBlockProps extends React.HTMLAttributes<HTMLElement> {
  as?: RevealTag;
  children: React.ReactNode;
  delay?: number;
  variant?: RevealVariant;
}

export function RevealBlock({
  as = 'div',
  children,
  delay = 0,
  variant = 'section',
  className,
  style,
  ...props
}: RevealBlockProps) {
  const reveal = useReveal<HTMLElement>();
  const Component = as;
  const revealStyle = delay > 0
    ? ({
        ...style,
        ['--reveal-delay' as any]: `${delay}s`,
      } as React.CSSProperties)
    : style;

  return (
    <Component
      ref={reveal.ref}
      data-motion-managed="true"
      data-reveal-variant={variant}
      className={['reveal-on-scroll', reveal.isVisible ? 'is-visible' : '', className].filter(Boolean).join(' ')}
      style={revealStyle}
      {...props}
    >
      {children}
    </Component>
  );
}
