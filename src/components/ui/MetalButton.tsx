import * as React from 'react';
import { MetalFx, type MetalFxPreset } from 'metal-fx';
import { cn } from '../../lib/utils';

type CommonProps = {
  className?: string;
  children: React.ReactNode;
  strength?: number;
  preset?: MetalFxPreset;
  disabled?: boolean;
  ariaLabel?: string;
  size?: 'md' | 'lg';
  fullWidth?: boolean;
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

export type MetalButtonProps = AsButton | AsAnchor;

function useEffectGate() {
  const [enabled, setEnabled] = React.useState(false);
  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    const mqReduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const mqCoarse = window.matchMedia('(pointer: coarse) and (max-width: 640px)');
    const update = () => setEnabled(!(mqReduced.matches || mqCoarse.matches));
    update();
    mqReduced.addEventListener('change', update);
    mqCoarse.addEventListener('change', update);
    return () => {
      mqReduced.removeEventListener('change', update);
      mqCoarse.removeEventListener('change', update);
    };
  }, []);
  return enabled;
}

const sizeMap = {
  md: 'min-h-11 px-5 text-[12px]',
  lg: 'min-h-12 px-6 text-[13px]',
};

export function MetalButton(props: MetalButtonProps) {
  const {
    className,
    children,
    strength = 0.35,
    preset = 'silver',
    disabled,
    ariaLabel,
    size = 'md',
    fullWidth,
  } = props;

  const effectEnabled = useEffectGate();

  const inner = cn(
    'axiom-metal-button group/metal relative inline-flex cursor-pointer items-center justify-center gap-2 overflow-hidden whitespace-nowrap font-semibold uppercase tracking-[0.16em] text-white transition-[transform,border-color] duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-ring)] disabled:cursor-not-allowed disabled:opacity-55',
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
        <span className="axiom-btn-sheen" aria-hidden />
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
        <span className="axiom-btn-sheen" aria-hidden />
        <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
      </button>
    );

  if (!effectEnabled) {
    return child;
  }

  return (
    <MetalFx
      variant="button"
      preset={preset}
      theme="dark"
      strength={strength}
      borderRadius={4}
      disableGlow
      normalizeHostStyles={false}
    >
      {child}
    </MetalFx>
  );
}

export default MetalButton;
