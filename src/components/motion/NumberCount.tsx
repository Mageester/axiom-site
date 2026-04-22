import * as React from 'react';
import useAnimatedReveal from '../../hooks/useAnimatedReveal';
import { numberCount } from './variants';

export interface NumberCountProps {
  end: number;
  suffix?: string;
  prefix?: string;
  className?: string;
  decimals?: number;
}

export function NumberCount({ end, suffix = '', prefix = '', className, decimals = 0 }: NumberCountProps) {
  const reveal = useAnimatedReveal();
  const [value, setValue] = React.useState(0);
  const startedRef = React.useRef(false);

  React.useEffect(() => {
    if (!reveal.shouldAnimate || startedRef.current) return;
    startedRef.current = true;

    const start = performance.now();
    let frame = 0;

    const tick = (now: number) => {
      const progress = Math.min((now - start) / (numberCount.duration * 1000), 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const nextValue = end * eased;
      setValue(decimals > 0 ? Number(nextValue.toFixed(decimals)) : Math.round(nextValue));

      if (progress < 1) {
        frame = window.requestAnimationFrame(tick);
      }
    };

    frame = window.requestAnimationFrame(tick);

    return () => {
      if (frame) {
        window.cancelAnimationFrame(frame);
      }
    };
  }, [decimals, end, reveal.shouldAnimate]);

  return (
    <span className={className} data-motion-visible={reveal.shouldAnimate ? 'true' : undefined}>
      {prefix}
      {reveal.shouldAnimate ? value : 0}
      {suffix}
    </span>
  );
}
