import * as React from 'react';
import { MetalFx, type MetalFxPreset } from 'metal-fx';
import { cn } from '../../lib/utils';

export interface MetalIconButtonProps {
  children: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  ariaLabel: string;
  className?: string;
  preset?: MetalFxPreset;
  strength?: number;
  disabled?: boolean;
  size?: number;
}

function useReducedAndCoarse() {
  const [should, setShould] = React.useState(false);
  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    const mqReduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const mqCoarse = window.matchMedia('(pointer: coarse) and (max-width: 640px)');
    const update = () => setShould(mqReduced.matches || mqCoarse.matches);
    update();
    mqReduced.addEventListener('change', update);
    mqCoarse.addEventListener('change', update);
    return () => {
      mqReduced.removeEventListener('change', update);
      mqCoarse.removeEventListener('change', update);
    };
  }, []);
  return should;
}

export function MetalIconButton({
  children,
  onClick,
  ariaLabel,
  className,
  preset = 'silver',
  strength = 0.55,
  disabled,
  size = 44,
}: MetalIconButtonProps) {
  const reduce = useReducedAndCoarse();

  return (
    <MetalFx
      variant="circle"
      preset={preset}
      theme="dark"
      strength={reduce ? 0 : strength}
      paused={reduce}
      disableGlow
    >
      <button
        type="button"
        onClick={onClick}
        aria-label={ariaLabel}
        disabled={disabled}
        className={cn(
          'flex items-center justify-center rounded-full bg-[#0a0c10] border border-white/12 text-white/85 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-ring)]',
          disabled && 'pointer-events-none opacity-50',
          className,
        )}
        style={{ width: size, height: size, borderRadius: '9999px' }}
      >
        {children}
      </button>
    </MetalFx>
  );
}

export default MetalIconButton;
