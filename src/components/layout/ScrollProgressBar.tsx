import * as React from 'react';
import { m, useReducedMotion, useScroll } from 'framer-motion';

export function ScrollProgressBar() {
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();

  if (reducedMotion) {
    return <div className="pointer-events-none fixed left-0 top-0 z-[60] h-px w-full bg-[color:rgba(212,175,55,0.35)]" aria-hidden="true" />;
  }

  return (
    <div className="pointer-events-none fixed left-0 top-0 z-[60] h-px w-full" aria-hidden="true">
      <m.div
        className="h-full origin-left bg-[linear-gradient(90deg,rgba(212,175,55,0.25),rgba(212,175,55,0.95),rgba(212,175,55,0.25))]"
        style={{ scaleX: scrollYProgress }}
      />
    </div>
  );
}
