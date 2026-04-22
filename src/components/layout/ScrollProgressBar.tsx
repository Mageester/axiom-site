import * as React from 'react';
import { m, useScroll } from 'framer-motion';

export function ScrollProgressBar() {
  const [reducedMotion, setReducedMotion] = React.useState(false);
  const { scrollYProgress } = useScroll();

  React.useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);
  }, []);

  return (
    <div className="pointer-events-none fixed left-0 top-0 z-[60] h-px w-full" aria-hidden="true">
      <m.div
        className="h-full origin-left bg-[linear-gradient(90deg,rgba(212,175,55,0.25),rgba(212,175,55,0.95),rgba(212,175,55,0.25))]"
        style={{ scaleX: reducedMotion ? 1 : scrollYProgress }}
      />
    </div>
  );
}
