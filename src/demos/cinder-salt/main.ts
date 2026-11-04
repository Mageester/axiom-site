import { gsap, ScrollTrigger, initMotion, reducedMotion, finePointer, magnetic } from '../_kit/motion';
import { startFire, fx } from './fx';
import { nameWide, nameTall } from './name-paths';
import { initReserve } from './reserve';
import { kitchenerNow, statusAt } from './hours';

const root = document.documentElement;
const $ = <T extends Element>(selector: string, parent: ParentNode = document) => parent.querySelector<T>(selector)!;
const $$ = <T extends Element>(selector: string, parent: ParentNode = document) => [...parent.querySelectorAll<T>(selector)];
const clamp = (v: number, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const smooth = (t: number) => t * t * (3 - 2 * t);

/* ------------------------------------------------------------------ open now */

function updateStatus() {
  const status = statusAt(kitchenerNow());
  for (const el of $$('[data-status]')) {
    el.setAttribute('data-state', status.state);
    const text = el.querySelector('[data-status-text]');
    if (text) text.textContent = status.text;
  }
  const today = kitchenerNow().day;
  for (const row of $$('.hours tr')) {
    const days = (row.getAttribute('data-days') || '').split(',').map(Number);
    row.toggleAttribute('data-today', days.includes(today));
  }
}
updateStatus();
setInterval(updateStatus, 30000);

/* ------------------------------------------------------------------ booking */

initReserve($('#reserve'));

/* ------------------------------------------------------------------ motion kit */

initMotion({ smooth: true });
ScrollTrigger.config({ ignoreMobileResize: true });

const bar = $('.bar');
const dock = $('.dock');

// header colours follow the section underneath
for (const section of $$<HTMLElement>('[data-theme]:not(.bar):not(.dock)')) {
  ScrollTrigger.create({
    trigger: section,
    start: 'top 46px',
    end: 'bottom 46px',
    onToggle: (self) => {
      if (self.isActive) bar.setAttribute('data-theme', section.dataset.theme || 'dark');
    },
  });
}

ScrollTrigger.create({
  trigger: '#reserve',
  start: 'top 85%',
  end: 'bottom top',
  onToggle: (self) => dock.classList.toggle('is-hidden', self.isActive),
});

if (finePointer) $$<HTMLElement>('[data-magnetic]').forEach((el) => magnetic(el, 0.28));

if (reducedMotion) {
  root.classList.remove('cs-js');
  // nothing else moves: no fire, no pinning, no clip transitions
} else {
  const canvas = $<HTMLCanvasElement>('#fire');
  const gl = startFire(canvas);
  if (!gl) root.classList.remove('cs-js');
  fx.level = 0;

  /* The page animates these three; `intro` scales them up while the fire catches. */
  const base = { level: 1.25, gain: 1, ember: 1 };
  const intro = { k: gl ? 0 : 1 };
  const sync = () => {
    const k = intro.k;
    fx.level = base.level * (0.05 + 0.95 * k);
    fx.gain = base.gain * (0.35 + 0.65 * k);
    fx.ember = base.ember * (0.6 + 0.4 * k);
  };
  const preset = (level: number, gain: number, ember: number, duration = 1.4) => {
    gsap.killTweensOf(base);
    gsap.to(base, { level, gain, ember, duration, ease: 'power2.inOut', onUpdate: sync });
  };
  const setBase = (level: number, gain: number, ember: number) => {
    gsap.killTweensOf(base);
    base.level = level;
    base.gain = gain;
    base.ember = ember;
    sync();
  };
  sync();

  // the fire flares when you scroll quickly
  let lastY = window.scrollY;
  gsap.ticker.add(() => {
    const dy = Math.abs(window.scrollY - lastY);
    lastY = window.scrollY;
    fx.stoke += (Math.min(1, dy / 70) * 0.8 - fx.stoke) * 0.12;
  });

  /* ---------------------------------------------------------------- the hero fly-through */

  if (gl) {
    root.classList.add('cs-pin');

    const hero = $('.hero');
    const frame = $('.veil-frame');
    const statement = $('.hero-statement');
    const sLines = $$<HTMLElement>('.s-line > span', statement);
    const sSmall = $<HTMLElement>('.statement-small', statement);
    const heroLine = $<HTMLElement>('.hero-line');
    const heroMeta = $<HTMLElement>('.hero-meta');
    const heroUi = $<HTMLElement>('.hero-ui');
    const tallQuery = matchMedia('(max-aspect-ratio: 19/20)');

    const geo = { k: 1, ox: 0, oy: 0, w: 1, h: 1, S: 20, tx: 0, ty: 0, svg: $<SVGSVGElement>('.mask-wide'), g: $<SVGGElement>('.mask-wide .mask-g') };
    let progress = 0;

    const measure = () => {
      const tall = tallQuery.matches;
      const layout = tall ? nameTall : nameWide;
      const svg = $<SVGSVGElement>(tall ? '.mask-tall' : '.mask-wide');
      const rect = svg.getBoundingClientRect();
      const fr = frame.getBoundingClientRect();
      geo.svg = svg;
      geo.g = svg.querySelector('.mask-g') as SVGGElement;
      geo.k = rect.width / layout.w;
      geo.ox = rect.left - fr.left;
      geo.oy = rect.top - fr.top;
      geo.w = frame.clientWidth;
      geo.h = frame.clientHeight;
      geo.tx = layout.target.x;
      geo.ty = layout.target.y;
      geo.S = (0.98 * Math.hypot(geo.w / 2, geo.h / 2)) / (layout.target.r * geo.k);
    };

    const place = (zoom: number, shift: number, scale = 1) => {
      const { k, ox, oy, w, h, S, tx, ty, g } = geo;
      const s = Math.exp(Math.log(S) * zoom) * scale;
      const cx = lerp(ox + k * tx, w / 2, shift);
      const cy = lerp(oy + k * ty, h / 2, shift);
      const e = (cx - ox) / k - s * tx;
      const f = (cy - oy) / k - s * ty;
      g.setAttribute('transform', `matrix(${s} 0 0 ${s} ${e} ${f})`);
    };

    let introScale = 1.06;
    const apply = (p: number) => {
      progress = p;
      const z = clamp(p / 0.58);
      const ze = z < 0.5 ? 2 * z * z : 1 - Math.pow(-2 * z + 2, 2) / 2;
      const shift = 1 - Math.pow(1 - ze, 2.2);
      place(ze, shift, introScale);
      // once the letter fills the screen there is nothing left to draw
      geo.svg.style.visibility = z >= 0.995 ? 'hidden' : '';

      fx.hero = 1 - smooth(clamp((p - 0.06) / 0.26));
      const out = 1 - clamp(p / 0.07);
      heroLine.style.opacity = String(out);
      heroMeta.style.opacity = String(out);
      heroUi.style.visibility = out <= 0 ? 'hidden' : '';

      // the fire holds at a roar through the fly-through, then settles to a glow behind the words
      const calm = smooth(clamp((p - 0.5) / 0.28));
      const rest = smooth(clamp((p - 0.78) / 0.22));
      setBase(lerp(lerp(1.25, 0.52, calm), 0.3, rest), lerp(lerp(1, 0.55, calm), 0.34, rest), lerp(1, 0.7, rest));

      const a = smooth(clamp((p - 0.68) / 0.1));
      const b = smooth(clamp((p - 0.74) / 0.1));
      sLines[0].style.transform = `translateY(${(1 - a) * 135}%)`;
      sLines[1].style.transform = `translateY(${(1 - b) * 135}%)`;
      const c = smooth(clamp((p - 0.82) / 0.1));
      sSmall.style.opacity = String(c);
      sSmall.style.transform = `translateY(${(1 - c) * 24}px)`;

      bar.classList.toggle('show-mark', p > 0.88);
      bar.classList.toggle('quiet', p > 0.1 && p < 0.66);
    };

    ScrollTrigger.addEventListener('refreshInit', measure);
    ScrollTrigger.addEventListener('refresh', () => apply(progress));
    tallQuery.addEventListener('change', () => ScrollTrigger.refresh());
    measure();

    ScrollTrigger.create({
      trigger: hero,
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      onUpdate: (self) => apply(self.progress),
    });
    apply(0);

    // first screen: the fire catches and the letters light from the bottom up
    const allCovers = $('.cover');
    const tl = gsap.timeline({
      delay: 0.15,
      defaults: { overwrite: false },
      onComplete: () => root.classList.remove('cs-js'),
    });
    tl.to(intro, { k: 1, duration: 2.2, ease: 'power2.out', onUpdate: sync }, 0)
      .to({ v: 1.06 }, { v: 1, duration: 2.4, ease: 'expo.out', onUpdate() { introScale = (this.targets()[0] as { v: number }).v; apply(progress); } }, 0)
      .to(
        allCovers,
        { scaleY: 0, transformOrigin: '50% 0%', duration: 1.0, ease: 'expo.inOut', stagger: { each: 0.065, from: 'start' } },
        0.2,
      );
  } else {
    base.level = 0;
  }

  /* ---------------------------------------------------------------- the fire story */

  const story = $('.story');
  const steps = $$<HTMLElement>('.step');
  const storyOn = !!gl && matchMedia('(min-width: 900px)').matches;
  const levels = [
    [0.24, 0.5, 0.8],
    [0.4, 0.62, 0.95],
    [0.6, 0.78, 1.1],
  ];

  if (storyOn) {
    root.classList.add('cs-story');
    const place = (p: number) => {
      const t = p * 3;
      steps.forEach((step, i) => {
        const enter = i === 0 ? 1 : smooth(clamp((t - i + 0.22) / 0.3));
        const exit = i === steps.length - 1 ? 0 : smooth(clamp((t - i - 0.78) / 0.3));
        const vis = enter * (1 - exit);
        step.style.opacity = String(vis);
        step.style.visibility = vis < 0.01 ? 'hidden' : 'visible';
        step.style.transform = `translateY(${(1 - enter) * 56 - exit * 56}px)`;
      });
      const c = clamp(t - 0.5, 0, 2);
      const i = Math.min(1, Math.floor(c));
      const f = smooth(c - i);
      setBaseSafe(
        lerp(levels[i][0], levels[i + 1][0], f),
        lerp(levels[i][1], levels[i + 1][1], f),
        lerp(levels[i][2], levels[i + 1][2], f),
      );
    };
    const setBaseSafe = (level: number, gain: number, ember: number) => {
      gsap.killTweensOf(base);
      base.level = level;
      base.gain = gain;
      base.ember = ember;
      sync();
    };
    ScrollTrigger.create({
      trigger: story,
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      onUpdate: (self) => place(self.progress),
      onRefresh: (self) => place(self.progress),
    });
    place(0);
    // while the story is off screen every step stays readable (find in page, assistive tech)
    ScrollTrigger.create({
      trigger: story,
      start: 'top bottom',
      end: 'bottom top',
      onToggle: (self) => story.classList.toggle('is-offscreen', !self.isActive),
    });
    story.classList.add('is-offscreen');
  } else {
    ScrollTrigger.create({
      trigger: story,
      start: 'top 80%',
      end: 'bottom 20%',
      onToggle: (self) => {
        if (self.isActive) preset(0.42, 0.55, 0.9, 1.2);
      },
    });
  }

  /* ---------------------------------------------------------------- calmer fire behind the dark sections */

  for (const selector of ['.private', '.visit', '.reserve', '.foot']) {
    ScrollTrigger.create({
      trigger: selector,
      start: 'top 70%',
      end: 'bottom 30%',
      onToggle: (self) => {
        if (self.isActive) preset(0.2, 0.3, 0.6, 1.4);
      },
    });
  }

  // the canvas stops working while paper or ember covers the whole screen
  for (const selector of ['.menu', '.reserve']) {
    ScrollTrigger.create({
      trigger: selector,
      start: 'top top',
      end: 'bottom bottom',
      onToggle: (self) => {
        fx.off = self.isActive ? 1 : 0;
      },
    });
  }

  /* ---------------------------------------------------------------- sheets: paper and ember rise over the dark */

  for (const sheet of $$<HTMLElement>('.sheet')) {
    const R = 52;
    const update = () => {
      const vh = window.innerHeight;
      const rect = sheet.getBoundingClientRect();
      const enter = clamp((vh - rect.top) / (vh * 0.85));
      const leave = clamp((vh - rect.bottom) / (vh * 0.85));
      const side = Math.max(1 - enter, leave) * Math.min(window.innerWidth * 0.045, 56);
      sheet.style.setProperty('--sx', `${side.toFixed(1)}px`);
      sheet.style.setProperty('--rt', `${(R * (1 - enter)).toFixed(1)}px`);
      sheet.style.setProperty('--rb', `${(R * leave).toFixed(1)}px`);
    };
    ScrollTrigger.create({ trigger: sheet, start: 'top bottom', end: 'bottom top', onUpdate: update, onRefresh: update });
    update();
  }

  /* ---------------------------------------------------------------- menu extras */

  document.fonts?.ready.then(() => ScrollTrigger.refresh());
}
