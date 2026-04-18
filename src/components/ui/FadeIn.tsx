import * as React from 'react';
import { cn } from '../../lib/utils';
import { useFadeInOnScroll } from '../../hooks/useFadeInOnScroll';

type FadeInTag = 'div' | 'section' | 'article' | 'header' | 'figure' | 'li';

export interface FadeInProps extends React.HTMLAttributes<HTMLElement> {
  as?: FadeInTag;
  delay?: number;
  distance?: number;
}

export const FadeIn: React.FC<FadeInProps> = ({
  as: Component = 'div',
  className,
  delay = 0,
  distance = 20,
  style,
  children,
  ...props
}) => {
  const { ref, isVisible } = useFadeInOnScroll<HTMLElement>();
  const cappedDelay = Math.min(Math.max(delay, 0), 400);
  const visibilityClass = isVisible
    ? 'opacity-100 translate-y-0'
    : 'opacity-0 motion-safe:[transform:translateY(var(--fade-distance,20px))]';

  return (
    <Component
      ref={ref as unknown as React.Ref<HTMLElement>}
      className={cn(
        visibilityClass,
        'motion-safe:transition-[opacity,transform] motion-safe:duration-[600ms] motion-safe:ease-out motion-safe:will-change-[opacity,transform] motion-safe:transform-gpu motion-reduce:opacity-100 motion-reduce:translate-y-0 motion-reduce:transition-none',
        className
      )}
      style={
        {
          transitionDelay: `${cappedDelay}ms`,
          ['--fade-distance' as string]: `${distance}px`,
          ...style,
        } as React.CSSProperties
      }
      {...props}
    >
      {children}
    </Component>
  );
};
