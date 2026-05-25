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

function useReducedAndCoarse() {
  const [shouldDisable, setShouldDisable] = React.useState(false);
  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    const mqReduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const mqCoarse = window.matchMedia('(pointer: coarse) and (max-width: 640px)');
    const update = () => setShouldDisable(mqReduced.matches || mqCoarse.matches);
    update();
    mqReduced.addEventListener('change', update);
    mqCoarse.addEventListener('change', update);
    return () => {
      mqReduced.removeEventListener('change', update);
      mqCoarse.removeEventListener('change', update);
    };
  }, []);
  return shouldDisable;
}

export function MetalButton(props: MetalButtonProps) {
  const {
    className,
    children,
    strength = 0.62,
    preset = 'silver',
    disabled = false,
    ariaLabel,
  } = props;

  const reduce = useReducedAndCoarse();

  const baseClass = cn(
    'metal-cta-host relative inline-flex min-h-11 items-center justify-center gap-2 overflow-hidden whitespace-nowrap px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-white transition-colors duration-200',
    'bg-[#0a0c10] border border-white/12',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-ring)]',
    'hover:text-white',
    disabled && 'pointer-events-none opacity-50',
    className,
  );

  const inner =
    props.as === 'a' ? (
      <a
        href={props.href}
        target={props.target}
        rel={props.rel ?? (props.target === '_blank' ? 'noopener noreferrer' : undefined)}
        aria-label={ariaLabel}
        onClick={props.onClick}
        className={baseClass}
        style={{ borderRadius: 4 }}
      >
        {children}
      </a>
    ) : (
      <button
        type={props.type ?? 'button'}
        aria-label={ariaLabel}
        onClick={props.onClick}
        disabled={disabled}
        className={baseClass}
        style={{ borderRadius: 4 }}
      >
        {children}
      </button>
    );

  return (
    <MetalFx
      variant="button"
      preset={preset}
      theme="dark"
      strength={reduce ? 0 : strength}
      paused={reduce}
      borderRadius={4}
      disableGlow
    >
      {inner}
    </MetalFx>
  );
}

export default MetalButton;
