import * as React from 'react';
import { MetalFx, type MetalFxPreset } from 'metal-fx';
import { cn } from '../../lib/utils';

export interface MetalChipProps {
  children: React.ReactNode;
  className?: string;
  preset?: MetalFxPreset;
  strength?: number;
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

export function MetalChip({ children, className, preset = 'silver', strength = 0.5 }: MetalChipProps) {
  const reduce = useReducedAndCoarse();

  return (
    <MetalFx
      variant="button"
      preset={preset}
      theme="dark"
      strength={reduce ? 0 : strength}
      paused={reduce}
      disableGlow
      borderRadius={999}
    >
      <span
        className={cn(
          'inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-white/12 bg-[#0a0c10] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-white/85',
          className,
        )}
      >
        {children}
      </span>
    </MetalFx>
  );
}

export default MetalChip;
