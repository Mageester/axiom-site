import * as React from "react"
import { cn } from "../../lib/utils"

type ButtonVariant = "primary" | "secondary" | "ghost"
type ButtonSize = "lg" | "md" | "sm"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  asChild?: boolean
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: "btn-primary",
  secondary: "btn-secondary",
  ghost: "btn-ghost",
}

const sizeClasses: Record<ButtonSize, string> = {
  lg: "btn-lg",
  md: "btn-md",
  sm: "btn-sm",
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", asChild = false, children, ...props }, ref) => {
    const classes = cn("btn", variantClasses[variant], sizeClasses[size], className)

    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(children as React.ReactElement<{ className?: string }>, {
        className: cn(classes, (children as React.ReactElement<{ className?: string }>).props.className),
      })
    }

    return (
      <button ref={ref} className={classes} {...props}>
        {children}
      </button>
    )
  }
)

Button.displayName = "Button"

export { Button }
export type { ButtonVariant, ButtonSize, ButtonProps }
