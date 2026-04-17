import * as React from 'react';
import { cn } from '../../lib/utils';

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType;
  innerClassName?: string;
  reveal?: boolean;
  stagger?: boolean;
}

export const Section: React.FC<SectionProps> = ({
  as: Component = 'section',
  className,
  innerClassName,
  children,
  reveal = true,
  stagger = false,
  ...props
}) => {
  const content = stagger
    ? React.Children.map(children, (child, index) =>
        React.isValidElement(child) ? (
          <div
            data-reveal
            data-reveal-item
            data-reveal-state="hidden"
            style={{ '--reveal-delay': `${index * 80}ms` } as React.CSSProperties}
          >
            {child}
          </div>
        ) : (
          child
        )
      )
    : children;

  return (
    <Component
      className={cn('page-section', className)}
      data-reveal={reveal ? 'true' : undefined}
      data-reveal-state={reveal ? 'hidden' : 'visible'}
      data-reveal-group={stagger ? 'true' : undefined}
      {...props}
    >
      <div className={cn('axiom-container', innerClassName)}>{content}</div>
    </Component>
  );
};
