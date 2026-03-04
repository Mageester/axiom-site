import * as React from "react"
import { cn } from "../../lib/utils"

type ButtonVariant = "primary" | "secondary" | "ghost"
type ButtonSize = "lg" | "md" | "sm"
type MagneticStyle = React.CSSProperties & {
  ["--mx"]?: string
  ["--my"]?: string
  ["--ms"]?: string
}
type AsChildProps = {
  className?: string
  style?: React.CSSProperties
  onMouseMove?: React.MouseEventHandler<HTMLElement>
  onMouseLeave?: React.MouseEventHandler<HTMLElement>
}

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
  ({ className, variant = "primary", size = "md", asChild = false, children, onMouseMove, onMouseLeave, ...props }, ref) => {
    const [isMagneticActive, setIsMagneticActive] = React.useState(false)
    const [magneticStyle, setMagneticStyle] = React.useState<MagneticStyle>({
      ["--mx"]: "0px",
      ["--my"]: "0px",
      ["--ms"]: "1",
    })
    const isMagnetic = variant === "primary"

    const handleMagneticMove = (event: React.MouseEvent<HTMLElement>) => {
      onMouseMove?.(event as React.MouseEvent<HTMLButtonElement>)
      if (!isMagnetic) return

      const target = event.currentTarget as HTMLElement
      const rect = target.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const dx = event.clientX - cx
      const dy = event.clientY - cy
      const radius = 20
      const distance = Math.hypot(dx, dy)

      if (distance > radius) {
        setIsMagneticActive(false)
        setMagneticStyle({
          ["--mx"]: "0px",
          ["--my"]: "0px",
          ["--ms"]: "1",
        })
        return
      }

      const force = (radius - distance) / radius
      setIsMagneticActive(true)
      setMagneticStyle({
        ["--mx"]: `${(dx * force).toFixed(2)}px`,
        ["--my"]: `${(dy * force).toFixed(2)}px`,
        ["--ms"]: "1.05",
      })
    }

    const handleMagneticLeave = (event: React.MouseEvent<HTMLElement>) => {
      onMouseLeave?.(event as React.MouseEvent<HTMLButtonElement>)
      if (!isMagnetic) return
      setIsMagneticActive(false)
      setMagneticStyle({
        ["--mx"]: "0px",
        ["--my"]: "0px",
        ["--ms"]: "1",
      })
    }

    const classes = cn(
      "btn",
      variantClasses[variant],
      sizeClasses[size],
      isMagnetic && "magnetic-btn",
      isMagnetic && isMagneticActive && "is-magnetic-active",
      className
    )

    if (asChild && React.isValidElement(children)) {
      const child = children as React.ReactElement<AsChildProps>
      return React.cloneElement(child, {
        className: cn(classes, child.props.className),
        onMouseMove: handleMagneticMove,
        onMouseLeave: handleMagneticLeave,
        style: {
          ...child.props.style,
          ...magneticStyle,
        },
      })
    }

    return (
      <button
        ref={ref}
        className={classes}
        onMouseMove={handleMagneticMove}
        onMouseLeave={handleMagneticLeave}
        style={isMagnetic ? magneticStyle : undefined}
        {...props}
      >
        {children}
      </button>
    )
  }
)

Button.displayName = "Button"

export { Button }
export type { ButtonVariant, ButtonSize, ButtonProps }
