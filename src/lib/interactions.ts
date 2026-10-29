/**
 * Site-wide pointer interactions: the custom cursor, magnetic buttons, the
 * floating work preview and copy-to-clipboard buttons. Fine pointers only,
 * never with reduced motion; touch devices and keyboards are untouched.
 * Focus outlines are never hidden; text inputs keep the native cursor.
 */

const FINE = '(hover: hover) and (pointer: fine)';
const REDUCE = '(prefers-reduced-motion: reduce)';

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

function initCopyButtons() {
  document.querySelectorAll<HTMLButtonElement>('[data-copy]').forEach((button) => {
    const target = document.getElementById(button.dataset.copy || '');
    if (!target) return;
    const idle = button.textContent || 'Copy';
    const select = () => {
      const range = document.createRange();
      range.selectNodeContents(target);
      const selection = getSelection();
      selection?.removeAllRanges();
      selection?.addRange(range);
    };
    button.addEventListener('click', () => {
      const text = target.textContent?.trim() || '';
      const done = () => {
        button.textContent = 'Copied';
        setTimeout(() => {
          button.textContent = idle;
        }, 1600);
      };
      try {
        navigator.clipboard.writeText(text).then(done, select);
      } catch {
        select();
      }
    });
  });
}

function initPointerEffects() {
  const fine = matchMedia(FINE).matches;
  const reduce = matchMedia(REDUCE).matches;
  if (!fine || reduce) return;

  const root = document.documentElement;
  const dot = document.querySelector<HTMLElement>('[data-cursor-dot]');
  const label = dot?.querySelector<HTMLElement>('.cursor-label');
  const preview = document.querySelector<HTMLElement>('[data-preview-box]');
  if (!dot || !label || !preview) return;

  root.classList.add('has-cursor');

  let x = innerWidth / 2;
  let y = innerHeight / 2;
  let cx = x;
  let cy = y;
  let px = x;
  let py = y;
  let vx = 0;
  let shown = false;
  let raf = 0;

  const isNative = (el: Element | null) => Boolean(el?.closest('input, textarea, select, [contenteditable]'));

  addEventListener(
    'pointermove',
    (event) => {
      x = event.clientX;
      y = event.clientY;
      dot.classList.toggle('is-hidden', isNative(event.target as Element));
      if (!raf) raf = requestAnimationFrame(loop);
    },
    { passive: true },
  );
  document.addEventListener('pointerleave', () => dot.classList.add('is-hidden'));
  document.addEventListener('pointerenter', () => dot.classList.remove('is-hidden'));

  // Grow over anything clickable; become a labelled bubble over work items.
  document.addEventListener('pointerover', (event) => {
    const target = event.target as Element;
    const view = target.closest<HTMLElement>('[data-cursor]');
    if (view) {
      dot.classList.add('is-big');
      dot.classList.remove('is-link');
      label.textContent = view.dataset.cursor || 'View';
      showPreview(view);
      return;
    }
    dot.classList.toggle('is-link', Boolean(target.closest('a, button, summary, label, [role="button"]')));
  });
  document.addEventListener('pointerout', (event) => {
    const target = event.target as Element;
    const view = target.closest<HTMLElement>('[data-cursor]');
    const next = event.relatedTarget as Element | null;
    if (view && !(next && view.contains(next))) {
      dot.classList.remove('is-big');
      hidePreview();
    }
    if (!next || !next.closest('a, button, summary, label, [role="button"]')) dot.classList.remove('is-link');
  });

  const images = new Map<string, HTMLImageElement>();
  function showPreview(el: HTMLElement) {
    const src = el.dataset.preview;
    if (!src) return;
    let img = images.get(src);
    if (!img) {
      img = new Image();
      img.src = src;
      img.alt = '';
      img.decoding = 'async';
      preview.append(img);
      images.set(src, img);
    }
    images.forEach((image) => image.classList.toggle('is-on', image === img));
    preview.classList.add('is-shown');
    shown = true;
  }
  function hidePreview() {
    preview.classList.remove('is-shown');
    shown = false;
  }

  function loop() {
    cx = lerp(cx, x, 0.22);
    cy = lerp(cy, y, 0.22);
    dot.style.transform = `translate(${cx}px, ${cy}px)`;
    const nx = lerp(px, x, 0.1);
    const ny = lerp(py, y, 0.1);
    vx = vx * 0.85 + (nx - px) * 0.15;
    px = nx;
    py = ny;
    const rot = Math.max(-12, Math.min(12, vx * 0.6));
    const scale = shown ? 1 : 0.6;
    preview.style.transform = `translate(${px}px, ${py}px) translate(-50%, -50%) rotate(${rot}deg) scale(${scale})`;
    const settled = Math.abs(cx - x) < 0.1 && Math.abs(cy - y) < 0.1 && Math.abs(px - x) < 0.1 && Math.abs(vx) < 0.01;
    raf = settled ? 0 : requestAnimationFrame(loop);
  }
  raf = requestAnimationFrame(loop);

  // Magnetic buttons drift toward the pointer and remember where it entered,
  // so the colour fill spreads from that point.
  document.querySelectorAll<HTMLElement>('[data-magnetic]').forEach((el) => {
    const text = el.querySelector<HTMLElement>('.btn-text');
    const strength = Number(el.dataset.magnetic) || 0.28;
    el.addEventListener('pointerenter', (event) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty('--fx', `${event.clientX - r.left}px`);
      el.style.setProperty('--fy', `${event.clientY - r.top}px`);
    });
    el.addEventListener('pointermove', (event) => {
      const r = el.getBoundingClientRect();
      const dx = event.clientX - (r.left + r.width / 2);
      const dy = event.clientY - (r.top + r.height / 2);
      el.style.transform = `translate(${dx * strength}px, ${dy * strength}px)`;
      if (text) text.style.transform = `translate(${dx * strength * 0.5}px, ${dy * strength * 0.5}px)`;
    });
    el.addEventListener('pointerleave', () => {
      el.style.transform = '';
      if (text) text.style.transform = '';
    });
  });

  // Plain pills still get the entry-point fill.
  document.querySelectorAll<HTMLElement>('.btn:not([data-magnetic])').forEach((el) => {
    el.addEventListener('pointerenter', (event) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty('--fx', `${event.clientX - r.left}px`);
      el.style.setProperty('--fy', `${event.clientY - r.top}px`);
    });
  });
}

export function initInteractions() {
  const start = () => {
    initCopyButtons();
    initPointerEffects();
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
}
