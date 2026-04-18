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
  default: 'bg-[var(--surface-1)]',
  inset: 'bg-[var(--bg-base)]',
  elevated: 'bg-[var(--surface-2)]',
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
        'rounded-[var(--radius-card)] border border-white/10 shadow-[var(--shadow-card)] motion-safe:transition-[transform,background-color,border-color,box-shadow] motion-safe:duration-300 motion-safe:ease-out motion-safe:hover:scale-[1.02] motion-safe:hover:border-white/20 motion-safe:hover:shadow-[var(--shadow-card-hover)]',
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
  return <h3 className={cn('text-[22px] font-semibold tracking-[-0.01em] text-[var(--text-primary)]', className)} {...props} />;
}

export function CardDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn('text-[13px] leading-[1.55] text-[var(--text-secondary)]', className)} {...props} />;
}

export const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn('flex flex-col gap-4', className)} {...props} />
);
CardContent.displayName = 'CardContent';

export function CardFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('flex items-center gap-4 border-t border-[color:var(--hairline)] pt-4', className)} {...props} />;
}
