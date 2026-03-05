import * as React from "react"
import { cn } from "../../lib/utils"

/*
  AXIOM CARD SYSTEM
  Three surface tiers for visual depth layering.

  Variants:
    default   -> .panel         (#121212, inset glow)
    inset     -> .panel-inset   (#0e0f11, no glow)
    elevated  -> .panel-elevated (#171717, shadow)

  Usage:
    <Card>...</Card>
    <Card variant="inset" padding="sm">...</Card>
    <Card variant="elevated" padding="lg">...</Card>
*/

type CardVariant = "default" | "inset" | "elevated"
type CardPadding = "none" | "sm" | "md" | "lg"

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant
  padding?: CardPadding
}

const variantClasses: Record<CardVariant, string> = {
  default: "panel",
  inset: "panel-inset",
  elevated: "panel-elevated",
}

const paddingClasses: Record<CardPadding, string> = {
  none: "",
  sm: "p-4 sm:p-5",
  md: "p-6 sm:p-8",
  lg: "p-8 sm:p-10 md:p-12",
}

function Card({ className, variant = "default", padding = "none", ...props }: CardProps) {
  return (
    <div
      className={cn(variantClasses[variant], paddingClasses[padding], className)}
      {...props}
    />
  )
}

/* Sub-components for structured content */

function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex flex-col gap-2", className)} {...props} />
  )
}

function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={cn("text-h3 font-grotesk font-semibold tracking-tight text-axiom-text-main", className)} {...props} />
  )
}

function CardDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("text-body-sm text-slate-300 leading-relaxed", className)} {...props} />
  )
}

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col gap-4", className)} {...props} />
  )
)
CardContent.displayName = "CardContent"

function CardFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex items-center gap-4 pt-4 border-t border-axiom-border", className)} {...props} />
  )
}

export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
}

export type { CardVariant, CardPadding, CardProps }

