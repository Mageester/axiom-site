import { initMotion, gsap, ScrollTrigger, reducedMotion, finePointer } from '../_kit/motion';
import { startBeads } from './beads';
import { startCorrection, type Progress } from './correction';
import { allPackages, money, sizes, type Size } from './data';

const root = document.documentElement;
const $ = <T extends Element>(selector: string, scope: ParentNode = document) => scope.querySelector<T>(selector)!;
const $$ = <T extends Element>(selector: string, scope: ParentNode = document) => Array.from(scope.querySelectorAll<T>(selector));
const clamp = (v: number, a = 0, b = 1) => Math.min(Math.max(v, a), b);

initMotion();

const phone = matchMedia('(pointer: coarse)').matches || innerWidth < 760;

/* ---------- header ---------- */

const header = $<HTMLElement>('.top');
const onScroll = () => header.classList.toggle('is-solid', window.scrollY > 40);
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

{
  const btn = $<HTMLButtonElement>('#menu-btn');
  const setMenu = (open: boolean) => {
    header.classList.toggle('menu-open', open);
    btn.setAttribute('aria-expanded', String(open));
    btn.textContent = open ? 'Close' : 'Menu';
  };
  btn.addEventListener('click', () => setMenu(!header.classList.contains('menu-open')));
  $$('.nav a').forEach((a) => a.addEventListener('click', () => setMenu(false)));
  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && header.classList.contains('menu-open')) {
      setMenu(false);
      btn.focus();
    }
  });
  document.addEventListener('pointerdown', (event) => {
    if (header.classList.contains('menu-open') && !header.contains(event.target as Node)) setMenu(false);
  });
}

/* ---------- the hero panel ---------- */

const stage = $<HTMLElement>('.stage');
const heroCanvas = $<HTMLCanvasElement>('#paint');
const hero = $<HTMLElement>('.hero');
const beads = startBeads(heroCanvas, { phone, still: reducedMotion });

if (!beads) {
  root.classList.remove('ml-live');
  stage.classList.add('no-gl');
} else {
  stage.classList.add('is-live');
  const light = beads.light;
  // Where the lights want to be, from the pointer or the phone's tilt.
  const aim = { x: 0.62, y: 0.42, has: false };
  const tilt = { x: 0, y: -1, has: false };
  let heroOut = 0;

  if (finePointer) {
    window.addEventListener(
      'pointermove',
      (event) => {
        aim.x = event.clientX / innerWidth;
        aim.y = event.clientY / innerHeight;
        aim.has = true;
      },
      { passive: true },
    );
  }

  const onOrient = (event: DeviceOrientationEvent) => {
    if (event.gamma == null || event.beta == null) return;
    const g = (event.gamma * Math.PI) / 180;
    const b = (event.beta * Math.PI) / 180;
    let gx = Math.sin(g);
    let gy = -Math.sin(b);
    const angle = ((screen.orientation?.angle ?? 0) * Math.PI) / 180;
    if (angle) {
      const c = Math.cos(-angle);
      const s = Math.sin(-angle);
      [gx, gy] = [gx * c - gy * s, gx * s + gy * c];
    }
    tilt.x = gx;
    tilt.y = gy;
    tilt.has = true;
  };
  if (!finePointer && 'DeviceOrientationEvent' in window) {
    window.addEventListener('deviceorientation', onOrient, { passive: true });
  }

  ScrollTrigger.create({
    trigger: hero,
    start: 'top top',
    end: 'bottom top',
    onUpdate: (self) => (heroOut = self.progress),
  });

  if (!reducedMotion) {
    gsap.ticker.add((time: number) => {
      // An idle drift, as if someone were walking the lights slowly along the car.
      const drift = Math.sin(time * 0.23) * 0.5 + Math.sin(time * 0.11 + 1.3) * 0.5;
      let tx: number;
      let ty: number;
      if (aim.has) {
        tx = (aim.x - 0.5) * 0.62 + drift * 0.03;
        ty = (aim.y - 0.5) * 0.22;
      } else if (tilt.has) {
        tx = clamp(tilt.x, -1, 1) * 0.4;
        ty = 0;
      } else {
        tx = 0.08 + drift * 0.22;
        ty = Math.sin(time * 0.17) * 0.05;
      }
      ty += heroOut * 0.35;
      light.yaw += (tx - light.yaw) * 0.045;
      light.pitch += (ty - light.pitch) * 0.045;
      if (tilt.has) {
        const len = Math.hypot(tilt.x, tilt.y);
        const k = len > 1 ? 1 / len : 1;
        beads.gravity.x += (tilt.x * k - beads.gravity.x) * 0.1;
        beads.gravity.y += (tilt.y * k - beads.gravity.y) * 0.1;
      }
    });

    // The studio lights come on, one after another.
    light.strip = 0;
    light.low = 0;
    light.box = 0;
    light.top = 0;
    beads.fade.v = 0;
    const lights = gsap.timeline({ delay: 0.15 });
    lights.to(beads.fade, { v: 1, duration: 1.2, ease: 'power2.out' }, 0);
    lights.to(light, { keyframes: { strip: [0, 0.9, 0.2, 1] }, duration: 0.5, ease: 'none' }, 0.35);
    lights.to(light, { keyframes: { box: [0, 0.7, 0.15, 1] }, duration: 0.55, ease: 'none' }, 0.85);
    lights.to(light, { top: 1, duration: 0.9, ease: 'power2.out' }, 1.2);
    lights.to(light, { low: 1, duration: 0.6, ease: 'power2.out' }, 1.45);
  }

  // A tap or click on the paint mists it.
  let askedTilt = false;
  hero.addEventListener('pointerdown', (event) => {
    if ((event.target as Element).closest('a,button')) return;
    if (reducedMotion) return;
    beads.spray(event.clientX, event.clientY);
    // iOS asks before sharing the tilt; only ask once someone has touched the paint.
    const Orientation = window.DeviceOrientationEvent as unknown as { requestPermission?: () => Promise<string> };
    if (!finePointer && !askedTilt && typeof Orientation?.requestPermission === 'function') {
      askedTilt = true;
      Orientation.requestPermission()
        .then((state) => {
          if (state === 'granted') window.addEventListener('deviceorientation', onOrient, { passive: true });
        })
        .catch(() => {});
    }
  });
}

/* ---------- the first second ---------- */

if (!reducedMotion) {
  const intro = gsap.timeline({ defaults: { ease: 'expo.out' } });
  intro.fromTo('.h1-line > span', { yPercent: 108 }, { yPercent: 0, duration: 1.4, stagger: 0.12 }, 0.55);
  intro.fromTo('.eyebrow', { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 1 }, 0.45);
  intro.fromTo('.lede', { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 1.1 }, 0.95);
  intro.fromTo('.hero-cta', { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: 1.1 }, 1.1);
  intro.fromTo('.hero-spec', { opacity: 0 }, { opacity: 1, duration: 1.2 }, 1.5);
  intro.fromTo(header, { opacity: 0 }, { opacity: 1, duration: 1, clearProps: 'opacity' }, 0.6);
  intro.fromTo('.fab', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1, clearProps: 'opacity,transform' }, 1.4);

  // The words fall back as the panel scrolls away.
  gsap.to('.hero-copy, .hero-spec', {
    y: -70,
    opacity: 0.25,
    ease: 'none',
    scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom 35%', scrub: true },
  });
}

/* ---------- the correction panel ---------- */

{
  const panel = $<HTMLElement>('#panel');
  const canvas = $<HTMLCanvasElement>('#correction-canvas');
  const pad = $<HTMLElement>('#pad');
  const hint = $<HTMLElement>('#panel-hint');
  const nEl = $('#corr-n');
  const bar = $<HTMLElement>('#corr-bar');
  const swirlEl = $('#corr-swirl');
  const finishEl = $('#corr-finish');
  const noteEl = $('#corr-note');
  const deepEl = $<HTMLElement>('#deep-note');
  const live = $('#corr-live');
  const autoBtn = $<HTMLButtonElement>('#corr-auto');
  const resetBtn = $<HTMLButtonElement>('#corr-reset');

  const swirlWord = (v: number) => (v > 0.66 ? 'Heavy' : v > 0.3 ? 'Light' : v > 0.05 ? 'Almost gone' : 'Gone');
  const finishWord = (v: number) => (v > 0.66 ? 'Hazy' : v > 0.3 ? 'Clearer' : v > 0.06 ? 'Nearly there' : 'Mirror');
  let lastStep = 0;
  // Set while the page itself polishes (the reduced-motion still), so nothing is announced.
  let silent = false;
  let pending: Progress | null = null;

  const render = (p: Progress) => {
    const pct = Math.round(clamp(p.corrected) * 100);
    nEl.textContent = String(pct);
    bar.style.transform = `scaleX(${clamp(p.corrected).toFixed(3)})`;
    swirlEl.textContent = swirlWord(p.swirls);
    finishEl.textContent = finishWord(p.haze);
    noteEl.textContent =
      p.swirls > 0.5
        ? 'The first pass cuts the scratches out. The second brings the clarity back.'
        : p.haze > 0.3
          ? 'The swirls are going. Keep working it and the haze clears to a mirror.'
          : 'That is what a two-step correction does: cut, then refine.';
    const step = pct >= 100 ? 4 : pct >= 75 ? 3 : pct >= 50 ? 2 : pct >= 25 ? 1 : 0;
    if (step !== lastStep) {
      if (step > lastStep && !silent) live.textContent = `${pct}% corrected. Swirl marks ${swirlEl.textContent!.toLowerCase()}, finish ${finishEl.textContent!.toLowerCase()}.`;
      lastStep = step;
    }
    deepEl.hidden = pct < 80;
    silent = false;
  };
  const queueRender = (p: Progress) => {
    if (!pending) requestAnimationFrame(() => pending && (render(pending), (pending = null)));
    pending = p;
  };

  const corr = startCorrection(canvas, { phone, still: reducedMotion, onProgress: queueRender });

  if (!corr) {
    // No GPU: the buttons switch the drawn stand-in between before and after.
    const fallback = $<HTMLElement>('.panel-fallback');
    panel.classList.add('no-gl');
    hint.hidden = true;
    autoBtn.addEventListener('click', () => {
      fallback.classList.add('is-after');
      render({ corrected: 1, swirls: 0, haze: 0 });
    });
    resetBtn.addEventListener('click', () => {
      fallback.classList.remove('is-after');
      render({ corrected: 0, swirls: 1, haze: 1 });
    });
  } else {
    panel.classList.add('is-live');
    if (finePointer) panel.classList.add('fine');
    let touched = false;
    let down = false;
    let last: { x: number; y: number } | null = null;
    let auto: gsap.core.Tween | null = null;
    const lightAim = { x: 0.45, y: 0.42 };
    const padPos = { x: -999, y: -999 };

    const setPad = (x: number, y: number) => {
      padPos.x = x;
      padPos.y = y;
      pad.style.translate = `${x}px ${y}px`;
    };
    const sizePad = () => pad.style.setProperty('--d', `${corr.radius() * 2}px`);
    sizePad();
    new ResizeObserver(sizePad).observe(panel);

    const local = (event: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      return { x: event.clientX - r.left, y: event.clientY - r.top, w: r.width, h: r.height };
    };

    const stroke = (from: { x: number; y: number }, to: { x: number; y: number }, amount = 0.055) => {
      const d = Math.hypot(to.x - from.x, to.y - from.y);
      const n = Math.max(1, Math.ceil(d / 6));
      for (let i = 1; i <= n; i++) {
        const t = i / n;
        corr.rub(from.x + (to.x - from.x) * t, from.y + (to.y - from.y) * t, amount);
      }
    };

    const firstTouch = () => {
      if (touched) return;
      touched = true;
      hint.classList.add('is-gone');
      corr.split.on = false;
    };

    const stopAuto = () => {
      if (!auto) return;
      auto.kill();
      auto = null;
      autoBtn.disabled = false;
      pad.classList.remove('is-on', 'is-down');
    };

    panel.addEventListener('pointerdown', (event) => {
      if (event.button !== 0 && event.pointerType === 'mouse') return;
      stopAuto();
      firstTouch();
      down = true;
      panel.setPointerCapture(event.pointerId);
      const p = local(event);
      last = p;
      setPad(p.x, p.y);
      pad.classList.add('is-on', 'is-down');
      lightAim.x = p.x / p.w;
      lightAim.y = p.y / p.h;
      corr.rub(p.x, p.y, 0.04);
    });
    panel.addEventListener('pointermove', (event) => {
      const p = local(event);
      if (event.pointerType === 'mouse') {
        setPad(p.x, p.y);
        pad.classList.add('is-on');
      }
      if (down) {
        setPad(p.x, p.y);
        if (last) stroke(last, p);
        last = p;
      }
      if (down || event.pointerType === 'mouse') {
        lightAim.x = p.x / p.w;
        lightAim.y = p.y / p.h;
      }
    });
    const up = () => {
      down = false;
      last = null;
      pad.classList.remove('is-down');
      if (!finePointer) pad.classList.remove('is-on');
    };
    panel.addEventListener('pointerup', up);
    panel.addEventListener('pointercancel', up);
    panel.addEventListener('pointerleave', () => {
      if (!down && !auto) pad.classList.remove('is-on');
    });

    // The inspection light follows the pad, or walks slowly across the panel on its own.
    gsap.ticker.add((time: number) => {
      const idle = !down && !auto && !(finePointer && pad.classList.contains('is-on'));
      const walk = reducedMotion ? 0 : 1;
      const tx = idle ? 0.48 + Math.sin(time * 0.31) * 0.2 * walk : lightAim.x;
      const ty = idle ? 0.44 + Math.sin(time * 0.23 + 1) * 0.12 * walk : lightAim.y;
      const k = reducedMotion ? 1 : 0.08;
      const nx = corr.light.x + (clamp(tx, 0.05, 0.95) - corr.light.x) * k;
      const ny = corr.light.y + (clamp(ty, 0.08, 0.92) - corr.light.y) * k;
      const moved = Math.abs(nx - corr.light.x) + Math.abs(ny - corr.light.y) > 1e-4;
      corr.light.x = nx;
      corr.light.y = ny;
      if (reducedMotion && moved) corr.loop.invalidate();
    });

    // A machine polisher's path: overlapping passes across, then down.
    const runAuto = (rows: number, amount: number, duration: number, onDone?: () => void) => {
      const { w, h } = corr.size();
      const r = corr.radius();
      const pts: { x: number; y: number }[] = [];
      const ys = Array.from({ length: rows }, (_, i) => r * 0.7 + ((h - r * 1.4) * i) / Math.max(rows - 1, 1));
      ys.forEach((y, i) => {
        const a = { x: r * 0.6, y };
        const b = { x: w - r * 0.6, y };
        if (i % 2) pts.push(b, a);
        else pts.push(a, b);
      });
      const lengths = pts.slice(1).map((p, i) => Math.hypot(p.x - pts[i].x, p.y - pts[i].y));
      const total = lengths.reduce((s, v) => s + v, 0);
      const state = { d: 0 };
      let prev = pts[0];
      pad.classList.add('is-on', 'is-down');
      autoBtn.disabled = true;
      auto = gsap.to(state, {
        d: total,
        duration,
        ease: 'none',
        onUpdate: () => {
          let d = state.d;
          let i = 0;
          while (i < lengths.length - 1 && d > lengths[i]) {
            d -= lengths[i];
            i++;
          }
          const t = Math.min(d / lengths[i], 1);
          const p = { x: pts[i].x + (pts[i + 1].x - pts[i].x) * t, y: pts[i].y + (pts[i + 1].y - pts[i].y) * t };
          stroke(prev, p, amount);
          prev = p;
          setPad(p.x, p.y);
          lightAim.x = p.x / w;
          lightAim.y = p.y / h;
        },
        onComplete: () => {
          auto = null;
          autoBtn.disabled = false;
          pad.classList.remove('is-down');
          if (!finePointer) pad.classList.remove('is-on');
          onDone?.();
        },
      });
    };

    autoBtn.addEventListener('click', () => {
      firstTouch();
      if (reducedMotion) {
        corr.fill();
        return;
      }
      const rows = Math.max(4, Math.round(corr.size().h / (corr.radius() * 1.05)));
      runAuto(rows, 0.09, rows * 0.9);
    });
    resetBtn.addEventListener('click', () => {
      stopAuto();
      firstTouch();
      corr.reset();
      lastStep = 0;
      live.textContent = 'Panel reset. Swirl marks heavy, finish hazy.';
    });

    if (reducedMotion) {
      // A still before and after: the right half already corrected.
      corr.split.on = true;
      corr.split.at = 0.5;
      requestAnimationFrame(() => {
        const { w, h } = corr.size();
        const r = corr.radius();
        silent = true;
        for (let y = r * 0.4; y < h + r; y += r * 0.5) {
          for (let x = w * 0.5 + r * 0.7; x < w + r; x += r * 0.5) corr.rub(x, y, 1);
        }
        corr.light.x = 0.5;
      });
    } else {
      // The first time it comes into view, show one pass, then hand it over.
      const io = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting || touched) return;
          io.disconnect();
          gsap.delayedCall(0.6, () => {
            if (touched || auto) return;
            const { w, h } = corr.size();
            const r = corr.radius();
            const y = h * 0.5;
            const pts = [
              { x: r * 0.7, y },
              { x: w * 0.62, y: y - r * 0.2 },
            ];
            const state = { t: 0 };
            let prev = pts[0];
            pad.classList.add('is-on', 'is-down');
            auto = gsap.to(state, {
              t: 1,
              duration: 1.6,
              ease: 'power1.inOut',
              onUpdate: () => {
                const p = { x: pts[0].x + (pts[1].x - pts[0].x) * state.t, y: pts[0].y + (pts[1].y - pts[0].y) * state.t + Math.sin(state.t * 12) * r * 0.25 };
                stroke(prev, p, 0.12);
                prev = p;
                setPad(p.x, p.y);
                lightAim.x = p.x / w;
                lightAim.y = p.y / h;
              },
              onComplete: () => {
                auto = null;
                pad.classList.remove('is-down', 'is-on');
              },
            });
          });
        },
        { threshold: 0.55 },
      );
      io.observe(panel);
    }
  }
}

/* ---------- sizes and prices ---------- */

const sizeName = (id: Size) => sizes.find((s) => s.id === id)!;
let currentSize: Size = 'sedan';
const sizeNote = $('#size-note');
const amounts = $$<HTMLElement>('.pk-amt');
const formSizes = $$<HTMLInputElement>('input[name="vsize"]');
const pageSizes = $$<HTMLInputElement>('input[name="size"]');
const pkgSelect = $<HTMLSelectElement>('#f-package');
const priceLine = $('#f-price');

const updatePrice = () => {
  const pkg = allPackages.find((p) => p.id === pkgSelect.value);
  priceLine.textContent = pkg ? `${pkg.name}, ${sizeName(currentSize).plural}: from ${money(pkg.price[currentSize])} before HST.` : '';
};

const setSize = (id: Size, from: 'page' | 'form' | 'init') => {
  const changed = id !== currentSize;
  currentSize = id;
  amounts.forEach((el) => {
    const show = el.dataset.size === id;
    el.hidden = !show;
    if (show && changed && from === 'page' && !reducedMotion) {
      gsap.fromTo(el, { yPercent: 60, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.6, ease: 'expo.out' });
    }
  });
  pageSizes.forEach((input) => (input.checked = input.value === id));
  formSizes.forEach((input) => (input.checked = input.value === id));
  if (from !== 'init') sizeNote.textContent = `Prices for ${sizeName(id).plural}, before HST.`;
  updatePrice();
};
pageSizes.forEach((input) => input.addEventListener('change', () => input.checked && setSize(input.value as Size, 'page')));
formSizes.forEach((input) => input.addEventListener('change', () => input.checked && setSize(input.value as Size, 'form')));
setSize((pageSizes.find((i) => i.checked)?.value as Size) ?? 'sedan', 'init');

/* ---------- booking ---------- */

{
  const form = $<HTMLFormElement>('#book-form');
  const done = $<HTMLElement>('#book-done');
  const summary = $('#book-summary');
  const d1 = $<HTMLInputElement>('#f-date1');
  const d2 = $<HTMLInputElement>('#f-date2');

  const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  d1.min = iso(tomorrow);
  d2.min = iso(tomorrow);
  d1.addEventListener('change', () => {
    if (d1.value) d2.min = d1.value;
  });
  pkgSelect.addEventListener('change', updatePrice);

  $$<HTMLAnchorElement>('[data-pkg]').forEach((a) =>
    a.addEventListener('click', () => {
      pkgSelect.value = a.dataset.pkg!;
      updatePrice();
      window.setTimeout(() => $<HTMLInputElement>('#f-name').focus({ preventScroll: true }), 900);
    }),
  );

  const nice = (value: string) => {
    if (!value) return '';
    const [y, m, d] = value.split('-').map(Number);
    return new Date(y, m - 1, d).toLocaleDateString('en-CA', { weekday: 'long', month: 'long', day: 'numeric' });
  };

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const pkg = allPackages.find((p) => p.id === data.get('package'));
    const parts = [
      String(data.get('vehicle') ?? '').trim(),
      sizeName(currentSize).label.toLowerCase(),
      pkg ? pkg.name.toLowerCase() : 'advice on a package',
      [nice(String(data.get('date1') ?? '')), nice(String(data.get('date2') ?? ''))].filter(Boolean).join(' or '),
    ].filter(Boolean);
    summary.textContent = parts.join(', ');
    form.hidden = true;
    done.hidden = false;
    if (!reducedMotion) gsap.fromTo(done, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, ease: 'expo.out' });
    done.focus({ preventScroll: true });
  });

  $('#book-again').addEventListener('click', () => {
    form.reset();
    setSize(currentSize, 'form');
    done.hidden = true;
    form.hidden = false;
    $<HTMLInputElement>('#f-name').focus();
  });
}
