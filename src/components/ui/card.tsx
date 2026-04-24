import * as React from 'react';
import { cn } from '../../lib/utils';

export type CardVariant = 'default' | 'inset' | 'elevated';
export type CardPadding = 'none' | 'sm' | 'md' | 'lg';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  padding?: CardPadding;
  hoverLift?: boolean;
}

const variantClasses: Record<CardVariant, string> = {
  default: 'glass-card',
  inset: 'bg-[var(--bg-base)]',
  elevated: 'glass-card',
};

const paddingClasses: Record<CardPadding, string> = {
  none: '',
  sm: 'p-4 sm:p-5',
  md: 'p-6 sm:p-7',
  lg: 'p-8 sm:p-10',
};

export function Card({ className, variant = 'default', padding = 'md', hoverLift = false, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-[var(--radius-card)] border border-[color:var(--hairline)] shadow-[var(--shadow-card)] glass-card-hover motion-safe:hover:border-[color:var(--accent-border)]',
        variantClasses[variant],
        paddingClasses[padding],
        hoverLift && 'motion-safe:hover:bg-[var(--surface-2)]',
        className
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('flex flex-col gap-2', className)} {...props} />;
}

export function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn('text-[clamp(1.25rem,1.5vw,1.5rem)] font-medium tracking-normal text-[var(--text-primary)]', className)} {...props} />;
}

export function CardDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn('text-[14px] leading-[1.65] text-[var(--text-secondary)]', className)} {...props} />;
}

export const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn('flex flex-col gap-4', className)} {...props} />
);
CardContent.displayName = 'CardContent';

export function CardFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('flex items-center gap-4 border-t border-[color:var(--hairline)] pt-4', className)} {...props} />;
}
