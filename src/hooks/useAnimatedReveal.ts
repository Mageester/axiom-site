import { useEffect, useState } from 'react';

type AnimatedRevealResult = {
  shouldAnimate: boolean;
};

const useAnimatedReveal = (): AnimatedRevealResult => {
  const [shouldAnimate, setShouldAnimate] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setShouldAnimate(true);
    });

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, []);

  return { shouldAnimate };
};

export default useAnimatedReveal;
