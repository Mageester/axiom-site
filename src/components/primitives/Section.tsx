import * as React from 'react';
import { cn } from '../../lib/utils';

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType;
  spacing?: 'base' | 'lg' | 'tight';
}

const spacingClasses = {
  tight: 'py-[calc(var(--page-section)*0.72)]',
  base: 'py-[var(--page-section)]',
  lg: 'py-[var(--page-section-lg)]',
};

export function Section({ as: Component = 'section', className, spacing = 'base', ...props }: SectionProps) {
  return (
    <Component className={cn('relative', spacingClasses[spacing], className)} data-primitive="section" {...props} />
  );
}
