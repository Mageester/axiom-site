import { initMotion, gsap, ScrollTrigger, reducedMotion, finePointer } from '../_kit/motion';
import { createThermalScene } from './scene';
import { FRONT_MAX, KIND, STOPS, T_HI, T_LO, ironbowCss, scaleGradient, surfaceTemp } from './thermal';

const root = document.documentElement;
const $ = <T extends Element>(selector: string, scope: ParentNode = document) => scope.querySelector<T>(selector)!;
const $$ = <T extends Element>(selector: string, scope: ParentNode = document) => Array.from(scope.querySelectorAll<T>(selector));
const clamp = (v: number, a = 0, b = 1) => Math.min(Math.max(v, a), b);
const smooth = (a: number, b: number, x: number) => {
  const t = clamp((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};
const fmt = (t: number, digits = 1) => t.toFixed(digits).replace('-', '−');

initMotion();

/* ---------- the camera view ---------- */

const stageEl = $<HTMLElement>('.stage');
const canvas = $<HTMLCanvasElement>('#thermal');
const low = matchMedia('(pointer: coarse)').matches || innerWidth < 760;
const scene = createThermalScene(canvas, { low, still: reducedMotion });

if (!scene) {
  root.classList.remove('k-live');
} else {
  stageEl.classList.add('is-live');
}
const live = !!scene && root.classList.contains('k-live');

// Scale bar and its ticks.
$('.scale-bar').setAttribute('style', `background:${scaleGradient('to top')}`);
const ticksEl = $('#scale-ticks');
[36, 20, 0, -20].forEach((t) => {
  const span = document.createElement('span');
  span.textContent = fmt(t, 0);
  span.style.top = `${(1 - (t - T_LO) / (T_HI - T_LO)) * 100}%`;
  ticksEl.append(span);
});

// The same scale, drawn across the bridge to the paper.
const bridgeTicks = $('#bridge-ticks');
[
  [-9, 32],
  [-1, 39],
  [6, 46],
  [12, 53],
  [17, 60],
  [22, 68],
  [28, 77],
  [34, 87],
].forEach(([t, pct]) => {
  const span = document.createElement('span');
  span.textContent = `${fmt(t, 0)} °C`;
  span.style.top = `${pct}%`;
  if (t >= 22) span.className = 'ink';
  bridgeTicks.append(span);
});

// Clock.
const clock = $('#hud-clock');
const started = performance.now();
setInterval(() => {
  const s = Math.floor((performance.now() - started) / 1000);
  clock.textContent = [Math.floor(s / 3600), Math.floor(s / 60) % 60, s % 60].map((n) => String(n).padStart(2, '0')).join(':');
}, 1000);

/* ---------- heat on, heat off ---------- */

const sim = { front: 0 };
const story = { front: 0, season: 0, blend: 0 };
const ui = { p: 0 };
const toggle = $<HTMLElement>('#toggle');
const buttons = $$<HTMLButtonElement>('button', toggle);
const status = $('#heat-status');
let userTouched = false;

function paintToggle() {
  const t = clamp(sim.front / FRONT_MAX);
  toggle.style.setProperty('--t', t.toFixed(3));
  toggle.classList.toggle('is-hot', t > 0.52);
}

function setHeat(on: boolean, { auto = false } = {}) {
  if (!auto) userTouched = true;
  buttons.forEach((b) => {
    const selected = (b.dataset.state === 'on') === on;
    b.setAttribute('aria-checked', String(selected));
    b.tabIndex = selected ? 0 : -1;
  });
  status.textContent = on
    ? 'Heat on. The house warms from the furnace outward, up through the ducts, room by room.'
    : 'No heat. The house is cold, and the thermal camera shows it in indigo.';

  if (reducedMotion || !scene) {
    ui.p = on ? 1 : 0;
    sim.front = on ? FRONT_MAX : 0;
    toggle.style.setProperty('--p', String(ui.p));
    paintToggle();
    scene?.stage.loop.invalidate();
    return;
  }
  gsap.to(ui, { p: on ? 1 : 0, duration: 0.75, ease: 'expo.out', onUpdate: () => toggle.style.setProperty('--p', ui.p.toFixed(3)) });
  gsap.to(sim, {
    front: on ? FRONT_MAX : 0,
    duration: on ? 6.4 : 3.4,
    ease: on ? 'power1.inOut' : 'power2.inOut',
    overwrite: true,
    onUpdate: paintToggle,
  });
}

buttons.forEach((b, i) => {
  b.addEventListener('click', () => setHeat(b.dataset.state === 'on'));
  b.addEventListener('keydown', (event) => {
    if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) return;
    event.preventDefault();
    const other = buttons[1 - i];
    setHeat(other.dataset.state === 'on');
    other.focus();
  });
});

if (reducedMotion) {
  if (scene) {
    scene.state.build = 1;
  }
  setHeat(true, { auto: true });
} else {
  gsap.delayedCall(1.7, () => {
    if (!userTouched) setHeat(true, { auto: true });
  });
}

/* ---------- reading the picture ---------- */

const reticle = $<HTMLElement>('#reticle');
const rTemp = $('#reticle-temp');
const rKind = $('#reticle-kind');
const marker = $<HTMLElement>('#scale-marker');
const hudInside = $('#hud-inside');
const hudBox = $('.hud-inside');
const liveEls = {
  flue: $$('[data-live="flue"]'),
  supply: $$('[data-live="supply"]'),
  travel: $$('[data-live="travel"]'),
  attic: $$('[data-live="attic"]'),
};

const copyEls = $$('.h1-line > span, .lede, .scene-title, .scene-body, .scene-kicker, .scene-data, .tag-text');
const pointer = { x: -999, y: -999, inside: false, tapUntil: 0, interactive: false, copy: false };
let storyVisible = true;
let progress = 0;
let lastHud = 0;
let lastProbe = 0;

if (scene) {
  const rx = gsap.quickTo(reticle, 'x', { duration: 0.3, ease: 'power3.out' });
  const ry = gsap.quickTo(reticle, 'y', { duration: 0.3, ease: 'power3.out' });
  const px = gsap.quickTo(scene.state, 'px', { duration: 1.4, ease: 'power3.out' });
  const py = gsap.quickTo(scene.state, 'py', { duration: 1.4, ease: 'power3.out' });
  const isInteractive = (el: EventTarget | null) => !!(el as Element | null)?.closest?.('a,button,input,label,[role="radio"]');

  if (finePointer) {
    root.classList.add('k-reticle');
    window.addEventListener(
      'pointermove',
      (event) => {
        if (event.pointerType === 'touch') return;
        pointer.x = event.clientX;
        pointer.y = event.clientY;
        pointer.inside = true;
        pointer.interactive = isInteractive(event.target);
        pointer.copy = !!(event.target as Element | null)?.closest?.('.h1-line > span, .lede, .scene-title, .scene-body, .scene-kicker, .scene-data, .tag-text');
        rx(event.clientX);
        ry(event.clientY);
        px((event.clientX / innerWidth - 0.5) * 2);
        py((event.clientY / innerHeight - 0.5) * 2);
      },
      { passive: true },
    );
    document.addEventListener('pointerleave', () => (pointer.inside = false));
  }
  $('.pin').addEventListener('pointerdown', (event) => {
    const e = event as PointerEvent;
    if (e.pointerType === 'mouse' || isInteractive(e.target)) return;
    pointer.x = e.clientX;
    pointer.y = e.clientY;
    pointer.tapUntil = performance.now() + 5000;
    gsap.set(reticle, { x: e.clientX, y: e.clientY });
  });

  ScrollTrigger.create({
    trigger: '#story',
    start: 'top bottom',
    end: 'bottom top',
    onToggle: (self) => (storyVisible = self.isActive),
  });

  const furnace = { x: 3.1, y: -2.0, z: -1.6 };

  scene.onTick.current = (time) => {
    const s = scene.state;
    const eff = sim.front * (1 - story.blend) + story.front * story.blend;
    s.front = eff;
    s.season = story.season;

    if (time - lastHud > 0.1) {
      lastHud = time;
      hudBox.classList.toggle('at-right', s.cam.ox < 0.05);
      hudInside.textContent = fmt(scene.insideTemp());
      const act0 = smooth(0, 2.4, eff) * (1 - s.season);
      liveEls.flue.forEach((el) => (el.textContent = String(Math.round(-4 + 86 * act0))));
      liveEls.supply.forEach((el) => (el.textContent = String(Math.round(-4 + 56 * act0))));
      liveEls.travel.forEach((el) => (el.textContent = eff.toFixed(1)));
      liveEls.attic.forEach(
        (el) => (el.textContent = String(Math.round(surfaceTemp(0, 7, -1, KIND.ROOF, { front: eff, season: s.season })))),
      );
    }

    // The reticle: follows a mouse, or parks on the furnace for touch screens until tapped.
    const now = performance.now();
    const tapped = now < pointer.tapUntil;
    const coarse = !finePointer;
    let show = false;
    let x = pointer.x;
    let y = pointer.y;
    let parked = false;
    if (storyVisible) {
      if (finePointer && pointer.inside && !pointer.interactive) show = true;
      if (tapped) show = true;
      if (coarse && !tapped && progress < 0.04 && s.build > 0.9) {
        const p = scene.project(furnace.x, furnace.y, furnace.z);
        x = p.x - (innerWidth < 600 ? 50 : 0);
        y = Math.min(p.y, innerHeight * 0.31);
        gsap.set(reticle, { x, y });
        show = true;
        parked = true;
      }
    }
    reticle.classList.toggle('is-on', show);
    reticle.classList.toggle('flip', x > innerWidth - 190);
    reticle.classList.toggle('over-copy', (pointer.copy && !tapped) || parked);
    if (show && time - lastProbe > 0.07) {
      lastProbe = time;
      if (finePointer && !tapped) {
        const flip = reticle.classList.contains('flip');
        const lx0 = flip ? x - 150 : x;
        const lx1 = flip ? x : x + 150;
        pointer.copy = copyEls.some((el) => {
          if (Number(getComputedStyle(el.closest('.scene') ?? el).opacity) < 0.2) return false;
          const r = el.getBoundingClientRect();
          return r.width > 0 && r.right > lx0 && r.left < lx1 && r.bottom > y - 30 && r.top < y + 40;
        });
      }
      const r = scene.probe(x, y);
      rTemp.textContent = `${fmt(r.temp)} °C`;
      rKind.textContent = r.kind;
      reticle.style.setProperty('--swatch', ironbowCss(r.temp));
      marker.style.top = `${(1 - clamp((r.temp - T_LO) / (T_HI - T_LO))) * 100}%`;
      marker.style.opacity = '1';
    } else if (!show) {
      marker.style.opacity = '0';
    }

    // Callouts for the maintenance scene follow their points in the house.
    if (progress > 0.8) {
      tags.forEach((t) => {
        const p = scene.project(t.a[0], t.a[1], t.a[2]);
        const need = t.el.offsetWidth + 8;
        const want = p.x + need > innerWidth ? 'l' : p.x - need < 0 ? 'r' : t.side;
        if (want !== t.cur) {
          t.cur = want;
          t.el.dataset.side = want;
        }
        t.el.style.transform = `translate3d(${p.x.toFixed(1)}px, ${p.y.toFixed(1)}px, 0)`;
      });
    }
  };
}

const tags = $$<HTMLElement>('.tag').map((el) => ({
  el,
  side: el.dataset.side ?? 'r',
  cur: el.dataset.side ?? 'r',
  a: (el.dataset.anchor ?? '0,0,0').split(',').map(Number) as [number, number, number],
}));

/* ---------- the first 1.5 seconds ---------- */

const header = $('.top');
if (!reducedMotion) {
  const intro = gsap.timeline({ defaults: { ease: 'expo.out' } });
  intro.fromTo('.h1-line > span', { yPercent: 112 }, { yPercent: 0, duration: 1.3, stagger: 0.11 }, 0.25);
  intro.fromTo('.h1-eyebrow', { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 1 }, 0.2);
  intro.fromTo('.lede', { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 1 }, 0.75);
  intro.fromTo('.controls', { opacity: 0, y: 28 }, { opacity: 1, y: 0, duration: 1.1 }, 0.9);
  intro.fromTo('.plan-link', { opacity: 0 }, { opacity: 1, duration: 1 }, 1.2);
  intro.fromTo(header, { opacity: 0 }, { opacity: 1, duration: 1, clearProps: 'opacity' }, 0.5);
  intro.fromTo('.hud-corner', { opacity: 0, scale: 1.7 }, { opacity: 1, scale: 1, duration: 1.4, stagger: 0.08 }, 0.1);
  intro.fromTo('.hud-text, .hud-inside, .scale', { opacity: 0 }, { opacity: 1, duration: 1.2, stagger: 0.1 }, 0.6);
  intro.fromTo('.fab', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 1, clearProps: 'transform,opacity' }, 1.3);
  if (scene) {
    gsap.fromTo(scene.state, { build: 0 }, { build: 1, duration: 1.45, ease: 'power2.inOut' });
  }
}

/* ---------- the scroll story ---------- */

type Cam = { az: number; el: number; dist: number; tx: number; ty: number; tz: number; ox: number; oy: number };
const cam = (az: number, el: number, dist: number, tx: number, ty: number, tz: number, ox: number, oy: number): Cam => ({ az, el, dist, tx, ty, tz, ox, oy });

const KEYS = {
  wide: {
    hero: cam(-30, 19, 40, 0.2, 2.0, -0.5, 0.26, 0.04),
    furnace: cam(-20, 9, 21, 2.9, -1.5, -1.5, 0.3, 0),
    ducts: cam(-44, 17, 38, 0.0, 1.6, -1.5, -0.32, 0),
    ductsB: cam(-38, 20, 37, -0.8, 1.7, -1.5, -0.32, 0),
    summer: cam(-52, 13, 39, -2.0, 1.4, -1.0, -0.32, 0),
    summerB: cam(-60, 11, 37, -2.8, 1.2, -1.0, -0.32, 0),
    care: cam(-30, 22, 46, -0.5, 2.2, 0, 0.1, 0.04),
    careB: cam(-22, 20, 45, -0.5, 2.2, 0, 0.1, 0.04),
  },
  portrait: {
    hero: cam(-32, 14, 33, 0.5, 1.2, 0, 0, 0.3),
    furnace: cam(-14, 6, 15, 3.1, -1.6, -2, 0, 0.2),
    ducts: cam(-46, 18, 27, -0.4, 1.4, -2.4, 0, 0.2),
    ductsB: cam(-40, 21, 25, -1.4, 1.6, -2.4, 0, 0.2),
    summer: cam(-58, 12, 28, -3.0, 1.4, -0.5, 0, 0.2),
    summerB: cam(-66, 10, 24, -4.2, 1.2, -0.5, 0, 0.2),
    care: cam(-30, 22, 36, -0.5, 1.0, 0, 0, 0.2),
    careB: cam(-22, 20, 35, -0.5, 1.0, 0, 0, 0.2),
  },
};

if (scene && live) {
  const mm = gsap.matchMedia();
  let first = true;
  mm.add({ portrait: '(max-aspect-ratio: 9/10)', wide: '(min-aspect-ratio: 9/10)' }, (context) => {
    const k = (context.conditions as { portrait: boolean }).portrait ? KEYS.portrait : KEYS.wide;
    const c = scene.state.cam;
    Object.assign(c, k.hero);

    if (first && window.scrollY < 40) {
      gsap.fromTo(
        c,
        { az: k.hero.az - 24, el: k.hero.el + 7, dist: k.hero.dist + 9 },
        { az: k.hero.az, el: k.hero.el, dist: k.hero.dist, duration: 2.8, ease: 'expo.out', overwrite: 'auto' },
      );
    }
    first = false;

    const tl = gsap.timeline({
      defaults: { ease: 'none', immediateRender: false },
      scrollTrigger: {
        trigger: '#story',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.7,
        onUpdate: (self) => (progress = self.progress),
      },
    });
    const move = (a: Cam, b: Cam, at: number, dur: number, ease = 'power2.inOut') => tl.fromTo(c, { ...a }, { ...b, duration: dur, ease }, at);
    const panel = (sel: string, inAt: number, outAt?: number) => {
      tl.fromTo(sel, { autoAlpha: 0, y: 46 }, { autoAlpha: 1, y: 0, duration: 0.4, ease: 'power2.out' }, inAt);
      if (outAt !== undefined) tl.to(sel, { autoAlpha: 0, y: -46, duration: 0.3, ease: 'power2.in' }, outAt);
    };

    // The camera moves while the words are out, and the words arrive once it has settled.
    move(k.hero, k.furnace, 0.5, 0.65);
    move(k.furnace, k.ducts, 2.0, 0.65);
    move(k.ducts, k.ductsB, 2.65, 0.95, 'none');
    move(k.ductsB, k.summer, 3.6, 0.65);
    move(k.summer, k.summerB, 4.25, 0.95, 'none');
    move(k.summerB, k.care, 5.2, 0.65);
    move(k.care, k.careB, 5.85, 1.15, 'none');

    // The story's own heat: it takes over from the toggle as we leave the first screen.
    tl.fromTo(story, { blend: 0 }, { blend: 1, duration: 0.3, ease: 'power1.inOut' }, 0.5);
    tl.fromTo(story, { front: 0 }, { front: 3.8, duration: 0.9 }, 0.7);
    tl.fromTo(story, { front: 3.8 }, { front: FRONT_MAX, duration: 1.1 }, 2.25);
    tl.fromTo(story, { front: FRONT_MAX }, { front: 0, duration: 0.4 }, 3.65);
    tl.fromTo(story, { season: 0 }, { season: 1, duration: 0.45 }, 3.7);
    tl.fromTo(story, { front: 0 }, { front: FRONT_MAX, duration: 0.9 }, 4.15);
    tl.fromTo(story, { season: 1 }, { season: 0, duration: 0.4 }, 5.4);

    // The words.
    tl.to('.scene-hero', { autoAlpha: 0, y: -50, duration: 0.3, ease: 'power1.in' }, 0.3);
    panel('.scene-furnace', 1.15, 1.8);
    panel('.scene-ducts', 2.7, 3.35);
    panel('.scene-summer', 4.3, 4.95);
    panel('.scene-care', 5.9);
    tl.fromTo('.tag', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.25, stagger: 0.09 }, 6.2);
    tl.set({}, {}, 7);

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  });
}

/* ---------- the phone menu ---------- */

{
  const btn = $<HTMLButtonElement>('#menu-btn');
  const setMenu = (open: boolean) => {
    header.classList.toggle('menu-open', open);
    btn.setAttribute('aria-expanded', String(open));
    btn.textContent = open ? 'Close' : 'Menu';
  };
  btn.addEventListener('click', () => setMenu(!header.classList.contains('menu-open')));
  $$('.nav a').forEach((a) => a.addEventListener('click', () => setMenu(false)));
  window.addEventListener('keydown', (e) => e.key === 'Escape' && setMenu(false));
}

/* ---------- header tone and the page below the picture ---------- */

if (!reducedMotion) {
  ScrollTrigger.create({
    trigger: '.bridge',
    start: 'top 92%',
    endTrigger: '.now',
    end: 'top 64px',
    onToggle: (self) => header.classList.toggle('is-hidden', self.isActive),
  });
}
$$<HTMLElement>('.paper > section').forEach((section) => {
  const lightTone = !section.matches('.now, .area');
  ScrollTrigger.create({
    trigger: section,
    start: 'top 64px',
    end: 'bottom 64px',
    onToggle: (self) => {
      if (self.isActive) {
        header.classList.toggle('on-paper', lightTone);
        header.classList.add('has-bg');
      }
    },
  });
});
ScrollTrigger.create({
  trigger: '#story',
  start: 'top top',
  end: 'bottom 70%',
  onToggle: (self) => {
    if (self.isActive) header.classList.remove('on-paper', 'has-bg');
  },
});

/* ---------- the quote flow ---------- */

{
  const panel = $<HTMLElement>('#quote-panel');
  const start = $<HTMLButtonElement>('#quote-start');
  const form = $<HTMLFormElement>('#quote-form');
  const sets = $$<HTMLFieldSetElement>('.q-fs', form);
  const next = $<HTMLButtonElement>('#q-next');
  const back = $<HTMLButtonElement>('#q-back');
  const nEl = $('#q-n');
  const bars = $$<HTMLElement>('.q-progress i', form);
  const done = $<HTMLElement>('#q-done');
  const summary = $('#q-summary');
  let step = 0;

  const chosen = (i: number) => sets[i].querySelector<HTMLInputElement>('input:checked')?.value ?? '';

  function render(i: number, direction: 1 | -1) {
    const from = sets[step];
    const to = sets[i];
    const swap = () => {
      sets.forEach((s, n) => (s.hidden = n !== i));
      step = i;
      nEl.textContent = String(i + 1);
      bars.forEach((b, n) => b.classList.toggle('on', n <= i));
      back.hidden = i === 0;
      next.textContent = i === sets.length - 1 ? 'See my quote request' : 'Continue';
      next.disabled = !chosen(i);
      if (!reducedMotion) {
        gsap.fromTo(to, { opacity: 0, x: 36 * direction }, { opacity: 1, x: 0, duration: 0.6, ease: 'expo.out' });
        gsap.fromTo($$('.q-opt', to), { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.05, ease: 'power3.out', delay: 0.05 });
      }
      to.querySelector<HTMLInputElement>('input:checked, input')?.focus({ preventScroll: true });
    };
    if (reducedMotion || from === to) swap();
    else gsap.to(from, { opacity: 0, x: -30 * direction, duration: 0.22, ease: 'power2.in', onComplete: swap });
  }

  function open() {
    panel.classList.add('is-open');
    start.setAttribute('aria-expanded', 'true');
    form.hidden = false;
    if (!reducedMotion) gsap.fromTo(form, { opacity: 0 }, { opacity: 1, duration: 0.7, delay: 0.3 });
    window.setTimeout(() => sets[0].querySelector<HTMLInputElement>('input')?.focus({ preventScroll: true }), 350);
  }

  start.addEventListener('click', open);
  form.addEventListener('change', () => (next.disabled = !chosen(step)));
  back.addEventListener('click', () => step > 0 && render(step - 1, -1));
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!chosen(step)) return;
    if (step < sets.length - 1) {
      render(step + 1, 1);
      return;
    }
    summary.textContent = sets.map((_, i) => chosen(i)).join(' · ');
    form.hidden = true;
    done.hidden = false;
    if (!reducedMotion) gsap.fromTo(done, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.8 });
    done.focus({ preventScroll: true });
  });
  $('#q-again').addEventListener('click', () => {
    form.reset();
    done.hidden = true;
    form.hidden = false;
    step = 0;
    sets.forEach((s, n) => (s.hidden = n !== 0));
    nEl.textContent = '1';
    bars.forEach((b, n) => b.classList.toggle('on', n === 0));
    back.hidden = true;
    next.textContent = 'Continue';
    next.disabled = true;
    sets[0].querySelector<HTMLInputElement>('input')?.focus({ preventScroll: true });
  });

  const openFromHash = () => {
    if (location.hash === '#quote') open();
  };
  openFromHash();
  window.addEventListener('hashchange', openFromHash);
  document.querySelectorAll('a[href="#quote"]').forEach((a) => a.addEventListener('click', () => window.setTimeout(open, 600)));
}

/* ---------- the service area ---------- */

{
  const towns = $$<SVGGElement>('.map-town');
  $$<HTMLButtonElement>('.area-town').forEach((button) => {
    const id = button.dataset.town;
    const group = towns.find((t) => t.dataset.town === id);
    const on = () => {
      button.classList.add('on');
      group?.classList.add('on');
    };
    const off = () => {
      button.classList.remove('on');
      group?.classList.remove('on');
    };
    button.addEventListener('pointerenter', on);
    button.addEventListener('pointerleave', off);
    button.addEventListener('focus', on);
    button.addEventListener('blur', off);
  });
}

void STOPS;
