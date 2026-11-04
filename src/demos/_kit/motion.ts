/**
 * The motion kit every demo shares: GSAP, ScrollTrigger, SplitText and Lenis, set up
 * once. The marketing site never loads this file, and Vite keeps these libraries in
 * one hashed chunk, so they download once across all the demos.
 *
 * Reveals are declared in HTML with `data-reveal`, so with reduced motion or without
 * JavaScript the content is simply there:
 *
 *   data-reveal="lines"    masked lines rise (headlines, paragraphs)
 *   data-reveal="chars"    masked characters rise (short display words)
 *   data-reveal="up"       fades up
 *   data-reveal="fade"     fades in
 *   data-reveal="clip"     wipes open from the bottom
 *   data-reveal="stagger"  the element's children fade up in turn
 *
 *   data-reveal-now          plays on load, for the first screen
 *   data-reveal-delay="0.4"  seconds to wait
 */
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger, SplitText);
gsap.defaults({ ease: 'power3.out', duration: 1.1 });

export { gsap, ScrollTrigger, SplitText };

export const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
export const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;

export let lenis: Lenis | null = null;

function reveal(el: HTMLElement) {
  const type = el.dataset.reveal;
  const delay = Number(el.dataset.revealDelay) || 0;
  const now = 'revealNow' in el.dataset;
  const trigger = now ? undefined : { trigger: el, start: 'top 88%', once: true };
  const show = () => {
    el.style.visibility = 'visible';
  };

  if (type === 'lines' || type === 'chars') {
    const part = type === 'lines' ? 'lines' : 'chars';
    SplitText.create(el, {
      type: type === 'lines' ? 'lines' : 'words,chars',
      mask: part,
      // kit.css gives these masks room so descenders are not clipped.
      linesClass: 'reveal-part',
      charsClass: 'reveal-part',
      autoSplit: type === 'lines',
      onSplit(self: { lines: Element[]; chars: Element[] }) {
        show();
        return gsap.from(type === 'lines' ? self.lines : self.chars, {
          yPercent: 112,
          duration: type === 'lines' ? 1.25 : 1.05,
          ease: 'expo.out',
          stagger: type === 'lines' ? 0.09 : 0.022,
          delay,
          scrollTrigger: trigger,
        });
      },
    });
    return;
  }

  show();
  if (type === 'stagger') {
    gsap.from(el.children, { autoAlpha: 0, y: 28, stagger: 0.08, delay, scrollTrigger: trigger });
  } else if (type === 'clip') {
    gsap.from(el, { clipPath: 'inset(100% 0% 0% 0%)', duration: 1.5, ease: 'expo.inOut', delay, scrollTrigger: trigger });
  } else if (type === 'fade') {
    gsap.from(el, { autoAlpha: 0, delay, scrollTrigger: trigger });
  } else {
    gsap.from(el, { autoAlpha: 0, y: 28, delay, scrollTrigger: trigger });
  }
}

/** Call once from a demo's main.ts, before setting up its own animations. */
export function initMotion({ smooth = true }: { smooth?: boolean } = {}) {
  const root = document.documentElement;
  if (reducedMotion) {
    root.classList.remove('motion');
    return;
  }
  if (smooth) {
    lenis = new Lenis({ lerp: 0.12, anchors: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time: number) => lenis?.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  }
  document.querySelectorAll<HTMLElement>('[data-reveal]').forEach(reveal);
  document.fonts?.ready.then(() => {
    root.classList.remove('motion');
    ScrollTrigger.refresh();
  });
}

/** Drifts an element toward the pointer while it is hovered. */
export function magnetic(el: HTMLElement, strength = 0.3) {
  if (reducedMotion || !finePointer) return;
  const x = gsap.quickTo(el, 'x', { duration: 0.7, ease: 'elastic.out(1, 0.5)' });
  const y = gsap.quickTo(el, 'y', { duration: 0.7, ease: 'elastic.out(1, 0.5)' });
  el.addEventListener('pointermove', (event) => {
    const r = el.getBoundingClientRect();
    x((event.clientX - (r.left + r.width / 2)) * strength);
    y((event.clientY - (r.top + r.height / 2)) * strength);
  });
  el.addEventListener('pointerleave', () => {
    x(0);
    y(0);
  });
}
