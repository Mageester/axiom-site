import * as React from 'react';
import { BorderBeam, type BorderBeamColorVariant, type BorderBeamSize } from 'border-beam';
import { cn } from '../../lib/utils';

type CommonProps = {
  className?: string;
  children: React.ReactNode;
  disabled?: boolean;
  ariaLabel?: string;
  size?: 'md' | 'lg';
  fullWidth?: boolean;
  colorVariant?: BorderBeamColorVariant;
  beamSize?: BorderBeamSize;
  active?: boolean;
  beamDuration?: number;
  beamStrength?: number;
  beamBrightness?: number;
  beamSaturation?: number;
};

type AsButton = CommonProps & {
  as?: 'button';
  href?: never;
  type?: 'button' | 'submit' | 'reset';
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  target?: never;
  rel?: never;
};

type AsAnchor = CommonProps & {
  as: 'a';
  href: string;
  type?: never;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
  target?: React.HTMLAttributeAnchorTarget;
  rel?: string;
};

export type BorderBeamButtonProps = AsButton | AsAnchor;

const sizeMap = {
  md: 'min-h-11 px-5 text-[12px]',
  lg: 'min-h-12 px-6 text-[13px]',
};

function useBeamEnabled(active: boolean) {
  const [enabled, setEnabled] = React.useState(false);
  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    const mqReduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setEnabled(active && !mqReduced.matches);
    update();
    mqReduced.addEventListener('change', update);
    return () => mqReduced.removeEventListener('change', update);
  }, [active]);
  return enabled;
}

export function BorderBeamButton(props: BorderBeamButtonProps) {
  const {
    className,
    children,
    disabled,
    ariaLabel,
    size = 'md',
    fullWidth,
    colorVariant = 'colorful',
    beamSize = 'md',
    active = true,
    beamDuration,
    beamStrength,
    beamBrightness = 1.9,
    beamSaturation = 1.6,
  } = props;

  const beamEnabled = useBeamEnabled(active);

  const inner = cn(
    'group/beam relative inline-flex cursor-pointer items-center justify-center gap-2 overflow-hidden whitespace-nowrap rounded-[6px] border border-white/12 bg-[#0a0a0a] font-semibold uppercase tracking-[0.16em] text-white transition-[transform,border-color] duration-200 ease-out hover:border-white/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-ring)] disabled:cursor-not-allowed disabled:opacity-55',
    sizeMap[size],
    fullWidth && 'w-full',
    className,
  );

  const child =
    props.as === 'a' ? (
      <a
        href={props.href}
        target={props.target}
        rel={props.rel ?? (props.target === '_blank' ? 'noopener noreferrer' : undefined)}
        aria-label={ariaLabel}
        onClick={props.onClick}
        className={inner}
      >
        <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
      </a>
    ) : (
      <button
        type={props.type ?? 'button'}
        aria-label={ariaLabel}
        onClick={props.onClick}
        disabled={disabled}
        className={inner}
      >
        <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
      </button>
    );

  return (
    <BorderBeam
      size={beamSize}
      colorVariant={colorVariant}
      theme="dark"
      active={beamEnabled}
      borderRadius={6}
      duration={beamDuration}
      strength={beamStrength}
      brightness={beamBrightness}
      saturation={beamSaturation}
      className={fullWidth ? 'block w-full' : 'inline-block'}
    >
      {child}
    </BorderBeam>
  );
}

export default BorderBeamButton;
