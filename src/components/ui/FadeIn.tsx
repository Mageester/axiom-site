import * as React from 'react';
import { cn } from '../../lib/utils';
import { useFadeInOnScroll } from '../../hooks/useFadeInOnScroll';

type FadeInTag = 'div' | 'section' | 'article' | 'header' | 'figure' | 'li';

export interface FadeInProps extends React.HTMLAttributes<HTMLElement> {
  as?: FadeInTag;
  delay?: number;
}

export const FadeIn: React.FC<FadeInProps> = ({
  as: Component = 'div',
  className,
  delay = 0,
  style,
  children,
  ...props
}) => {
  const { ref, isVisible } = useFadeInOnScroll<HTMLElement>();
  const cappedDelay = Math.min(Math.max(delay, 0), 400);
  const visibilityClass = isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4';

  return (
    <Component
      ref={ref as unknown as React.Ref<HTMLElement>}
      className={cn(
        visibilityClass,
        'motion-safe:transition-[opacity,transform] motion-safe:duration-700 motion-safe:ease-out motion-reduce:opacity-100 motion-reduce:translate-y-0 motion-reduce:transition-none',
        className
      )}
      style={{ transitionDelay: `${cappedDelay}ms`, ...style }}
      {...props}
    >
      {children}
    </Component>
  );
};
