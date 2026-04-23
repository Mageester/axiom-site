import * as React from 'react';
import { cn } from '../../lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: 'default' | 'accent' | 'danger' | 'success' | 'warning';
}

const toneClasses = {
  default: 'border-hairline bg-surface-soft text-text-secondary',
  accent: 'border-brass bg-[rgb(var(--color-brass-rgb)/0.12)] text-brass',
  danger: 'border-danger bg-[rgb(var(--color-danger-rgb)/0.12)] text-danger',
  success: 'border-success bg-[rgb(var(--color-success-rgb)/0.12)] text-success',
  warning: 'border-warning bg-[rgb(var(--color-warning-rgb)/0.12)] text-warning',
};

export function Badge({ className, tone = 'default', ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-sm border px-3 py-1 font-sans text-caption uppercase tracking-[0.16em]',
        toneClasses[tone],
        className
      )}
      data-primitive="badge"
      {...props}
    />
  );
}
