import * as React from 'react';
import { cn } from '../../lib/utils';

export interface FieldErrorProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children?: React.ReactNode;
}

export function FieldError({ children, className, ...props }: FieldErrorProps) {
  if (!children) return null;

  return (
    <p
      className={cn('font-sans text-body-sm text-danger', className)}
      data-primitive="field-error"
      role="alert"
      {...props}
    >
      {children}
    </p>
  );
}
