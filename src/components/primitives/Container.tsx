import * as React from 'react';
import { cn } from '../../lib/utils';

export interface ContainerProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType;
  width?: 'default' | 'measure' | 'narrow';
}

const widthClasses = {
  default: 'max-w-container',
  measure: 'max-w-measure',
  narrow: 'max-w-narrow',
};

export function Container({ as: Component = 'div', className, width = 'default', ...props }: ContainerProps) {
  return (
    <Component
      className={cn('mx-auto w-full px-[var(--page-gutter)]', widthClasses[width], className)}
      data-primitive="container"
      {...props}
    />
  );
}
