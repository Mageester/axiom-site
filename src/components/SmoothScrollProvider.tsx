import { PropsWithChildren, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function SmoothScrollProvider({ children }: PropsWithChildren) {
  const { pathname } = useLocation();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [pathname]);

  return <>{children}</>;
}
