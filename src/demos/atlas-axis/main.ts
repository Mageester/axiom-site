import { gsap, ScrollTrigger, initMotion, reducedMotion, finePointer } from '../_kit/motion';
import { createSpine, regions, regionRange, BONES, type Region, type Spine } from './spine';
import { initBooking, HOURS, formatTime } from './booking';

const $ = <T extends Element>(selector: string, root: ParentNode = document) => root.querySelector<T>(selector);
const $$ = <T extends Element>(selector: string, root: ParentNode = document) => [...root.querySelectorAll<T>(selector)];
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const smooth = (v: number) => {
  const t = clamp01(v);
  return t * t * (3 - 2 * t);
};
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const root = document.documentElement;
const canvas = $<HTMLCanvasElement>('#stage')!;
const heroSection = $<HTMLElement>('.hero')!;
const hurtSection = $<HTMLElement>('.hurt')!;
const fvSection = $<HTMLElement>('.fv')!;
const finaleSection = $<HTMLElement>('.finale')!;
const heroSlot = $<HTMLElement>('[data-slot="hero"]')!;
const hurtSlot = $<HTMLElement>('[data-slot="hurt"]')!;
const visitSlot = $<HTMLElement>('[data-slot="visit"]')!;
const desktopQuery = matchMedia('(min-width: 960px)');

initMotion();
initBooking();
(window as unknown as { __lenis: unknown }).__lenis = (await import('../_kit/motion')).lenis;

/* ---------- Hours: today, and whether we are open ---------- */
function hoursNow() {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Toronto',
    weekday: 'long',
    hour: 'numeric',
    minute: 'numeric',
    hour12: false,
  }).formatToParts(new Date());
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? '';
  const weekday = get('weekday');
  const minutes = (Number(get('hour')) % 24) * 60 + Number(get('minute'));
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const day = days.indexOf(weekday);
  const label = $('#open-now');
  $$<HTMLElement>('.hours-table tr').forEach((row) => row.classList.toggle('today', row.dataset.day === weekday));
  if (!label || day < 0) return;
  const today = HOURS[day];
  if (today && minutes >= today[0] && minutes < today[1]) {
    label.textContent = `Open now, until ${formatTime(today[1])}.`;
    return;
  }
  for (let step = 0; step <= 7; step++) {
    const next = (day + step) % 7;
    const hours = HOURS[next];
    if (!hours) continue;
    if (step === 0 && minutes >= hours[1]) continue;
    const when = step === 0 ? 'today' : step === 1 ? 'tomorrow' : days[next];
    label.textContent = `Closed now. Opens ${when} at ${formatTime(hours[0])}.`;
    return;
  }
}
hoursNow();

/* ---------- The booking buttons lean toward the pointer ---------- */
import('../_kit/motion').then(({ magnetic }) => {
  $$<HTMLElement>('.btn, .bar-book').forEach((el) => magnetic(el, 0.22));
});

/* ---------- The porcelain spine ---------- */
const spinePromise = reducedMotion ? Promise.resolve(null) : createSpine(canvas);
const glWanted = !reducedMotion && !root.classList.contains('no-gl');

let heroProgress = 0;
let fvProgress = 0;
let hurtActive = false;
let selected: Region = 'lower';
const pointer = { tx: 0, ty: 0 };
const yawFor: Record<Region, number> = { neck: -0.4, upper: -0.6, lower: -0.55, pelvis: -0.45 };
const state = { hurtYaw: -0.55, hurtPitch: 0 };

window.addEventListener(
  'pointermove',
  (event) => {
    pointer.tx = (event.clientX / innerWidth) * 2 - 1;
    pointer.ty = (event.clientY / innerHeight) * 2 - 1;
  },
  { passive: true },
);

const ticks = $$<HTMLElement>('.ruler-ticks i');
const labels = $$<HTMLButtonElement>('.spine-label');
const labelAnchor: Record<Region, number> = { neck: 3, upper: 12, lower: 21, pelvis: 24 };

const rect = (el: Element) => el.getBoundingClientRect();

function configure(spine: Spine) {
  const phone = () => !desktopQuery.matches;
  spine.onBeforeFrame = () => {
    const vh = innerHeight;
    spine.pointer.x += (pointer.tx - spine.pointer.x) * 0.06;
    spine.pointer.y += (pointer.ty - spine.pointer.y) * 0.06;

    const hero = rect(heroSlot);
    const hurt = rect(hurtSlot);
    const hurtTop = rect(hurtSection).top;
    const wHurt = smooth((vh * 1.15 - hurtTop) / (vh * 0.75));
    const heroT = smooth((heroProgress - 0.1) / 0.78);
    spine.align = heroT;

    spine.zoomMul = phone() ? 0.55 : 1;
    const heroFit = lerp(phone() ? 2.3 : 1.95, phone() ? 2.4 : 2.35, heroT);
    const A = {
      cx: hero.left + hero.width * (phone() ? lerp(0.66, 0.6, heroT) : lerp(0.6, 0.52, heroT)),
      cy: hero.top + hero.height * (phone() ? 0.5 : 0.52),
      h: hero.height * heroFit,
      tilt: lerp(phone() ? -0.52 : -0.46, phone() ? -0.1 : -0.09, heroT),
      yaw: lerp(-1.05, -0.5, heroT),
      pitch: lerp(0.1, 0, heroT),
    };

    // Easing the hurt-section angle toward whichever region is chosen.
    state.hurtYaw += ((hurtActive ? yawFor[selected] : -0.55) - state.hurtYaw) * 0.05;
    const B = {
      cx: hurt.left + hurt.width * (desktopQuery.matches ? 0.4 : 0.5),
      cy: hurt.top + hurt.height / 2,
      h: hurt.height * (desktopQuery.matches ? 0.92 : 0.98),
      tilt: 0,
      yaw: state.hurtYaw,
      pitch: 0,
    };

    let L = {
      cx: lerp(A.cx, B.cx, wHurt),
      cy: lerp(A.cy, B.cy, wHurt),
      h: lerp(A.h, B.h, wHurt),
      tilt: lerp(A.tilt, B.tilt, wHurt),
      yaw: lerp(A.yaw, B.yaw, wHurt),
      pitch: lerp(A.pitch, B.pitch, wHurt),
    };

    if (desktopQuery.matches && fvSection.classList.contains('is-pinned')) {
      const visit = rect(visitSlot);
      const wVisit = smooth((vh * 0.3 - rect(fvSection).top) / (vh * 0.3));
      const C = {
        cx: visit.left + visit.width * 0.5,
        cy: visit.top + visit.height * 0.5,
        h: visit.height * 1.12,
        tilt: lerp(0.12, -0.1, fvProgress),
        yaw: lerp(-0.95, 0.75, fvProgress),
        pitch: 0.04,
      };
      L = {
        cx: lerp(L.cx, C.cx, wVisit),
        cy: lerp(L.cy, C.cy, wVisit),
        h: lerp(L.h, C.h, wVisit),
        tilt: lerp(L.tilt, C.tilt, wVisit),
        yaw: lerp(L.yaw, C.yaw, wVisit),
        pitch: lerp(L.pitch, C.pitch, wVisit),
      };
      // A band of light that travels down the spine as the minutes pass.
      const pos = fvProgress * (BONES - 1);
      for (let i = 0; i < BONES; i++) spine.glow[i] = wVisit > 0.5 ? Math.max(0, 1 - Math.abs(i - pos) / 3.2) * 0.95 : 0;
      spine.look.index += (pos - spine.look.index) * 0.12;
      spine.look.amount = smooth((wVisit - 0.55) / 0.45);
      spine.look.zoom = 2.3;
    }

    if (!(desktopQuery.matches && fvSection.classList.contains('is-pinned'))) spine.look.amount = 0;
    // Phones: the spine never leaves its own band, so words never sit on bones.
    if (phone()) {
      const ct = lerp(hero.top, hurt.top, wHurt);
      const cb = lerp(hero.bottom, hurt.bottom, wHurt);
      canvas.style.setProperty('--ct', `${Math.max(0, ct).toFixed(0)}px`);
      canvas.style.setProperty('--cb', `${Math.min(vh, cb).toFixed(0)}px`);
      canvas.style.setProperty('--fd', '40px');
      canvas.style.setProperty('--fb', '70px');
    }
    // Fade the whole scene out as its last slot leaves, so no canvas edge or shadow edge shows.
    if (shown) {
      const pinnedVisit = desktopQuery.matches && fvSection.classList.contains('is-pinned');
      const hurtFade = smooth((hurt.bottom - vh * 0.2) / (vh * 0.5));
      let opacity = hurtFade;
      if (pinnedVisit) {
        const visit = rect(visitSlot);
        const wV = smooth((vh * 0.3 - rect(fvSection).top) / (vh * 0.3));
        opacity = Math.max(hurtFade, wV) * smooth((visit.bottom - vh * 0.2) / (vh * 0.5));
      }
      canvas.style.opacity = opacity.toFixed(3);
    }
    const layout = spine.layout;
    layout.cx = L.cx;
    layout.cy = L.cy;
    layout.height = L.h;
    layout.tilt = L.tilt;
    layout.yaw = L.yaw;
    layout.pitch = L.pitch;

    // The ruler beside the hero tracks every vertebra.
    if (heroProgress < 0.999 || ticks[0]?.dataset.done !== 'true') {
      for (let i = 0; i < ticks.length; i++) {
        const v = clamp01(spine.alignment[i]);
        ticks[i].style.setProperty('--s', v.toFixed(3));
      }
    }

    // Labels pinned to the bones.
    const showLabels = hurtActive && wHurt > 0.6;
    labels.forEach((label) => {
      const region = label.dataset.region as Region;
      const isSelected = region === selected;
      const hideOthers = spine.focusAmount > 0.45 && !isSelected;
      const on = showLabels && !hideOthers;
      label.classList.toggle('is-on', on);
      label.classList.toggle('is-selected', isSelected);
      if (on || label.dataset.was === '1') {
        const p = spine.project(labelAnchor[region]);
        label.style.transform = `translate3d(${p.x.toFixed(1)}px, ${(p.y - 22).toFixed(1)}px, 0)`;
        label.dataset.was = on ? '1' : '0';
      }
    });
  };
}

/* ---------- Where does it hurt ---------- */
const tabs = $$<HTMLButtonElement>('.region');
const panels = $$<HTMLElement>('.panel');
const svgHurt = $$<SVGGElement>('.svg-hurt .v');
let spineRef: Spine | null = null;
let shown = false;

function applyRegionToSpine() {
  if (spineRef) spineRef.region = hurtActive ? selected : null;
}

function highlightSvg(region: Region | null) {
  svgHurt.forEach((g) => g.setAttribute('data-hl', String(!!region && g.dataset.region === region)));
}

function select(region: Region, { focus = false, immediate = false } = {}) {
  if (region !== selected || immediate) {
    const old = panels.find((p) => !p.hidden);
    const next = panels.find((p) => p.dataset.region === region)!;
    tabs.forEach((tab) => {
      const on = tab.dataset.region === region;
      tab.setAttribute('aria-selected', String(on));
      tab.tabIndex = on ? 0 : -1;
    });
    labels.forEach((label) => label.classList.toggle('is-selected', label.dataset.region === region));
    selected = region;
    highlightSvg(region);
    // A newer choice replaces an exit still running, so only the latest panel ever shows.
    if (old) gsap.killTweensOf(old);
    if (old === next) {
      gsap.set(next, { clearProps: 'all' });
    } else {
      const swap = () => {
        panels.forEach((panel) => (panel.hidden = panel !== next));
        if (!reducedMotion) {
          gsap.killTweensOf(next.children);
          gsap.fromTo(
            [...next.querySelectorAll('.panel-title, .panel-lede, .panel-list > div, .panel-book')],
            { autoAlpha: 0, y: 24 },
            { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.07, ease: 'expo.out', clearProps: 'transform,opacity,visibility' },
          );
        }
      };
      if (old && !reducedMotion) {
        gsap.to(old, { autoAlpha: 0, y: -12, duration: 0.18, ease: 'power2.in', onComplete: () => {
          gsap.set(old, { clearProps: 'all' });
          swap();
        } });
      } else swap();
    }
    applyRegionToSpine();
  }
  if (focus) tabs.find((t) => t.dataset.region === region)?.focus();
}

tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => select(tab.dataset.region as Region));
  tab.addEventListener('keydown', (event) => {
    const keys: Record<string, number> = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 };
    let next = -1;
    if (event.key in keys) next = (index + keys[event.key] + tabs.length) % tabs.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = tabs.length - 1;
    if (next < 0) return;
    event.preventDefault();
    select(tabs[next].dataset.region as Region, { focus: true });
  });
  tab.addEventListener('pointerenter', () => {
    if (spineRef && hurtActive && finePointer) spineRef.hover = tab.dataset.region as Region;
  });
  tab.addEventListener('pointerleave', () => {
    if (spineRef) spineRef.hover = null;
  });
});
labels.forEach((label) =>
  label.addEventListener('click', () => select(label.dataset.region as Region)),
);
highlightSvg(selected);

/* Pointing at the spine itself. */
function bindSpinePointer(spine: Spine) {
  const inUi = (target: EventTarget | null) =>
    !!(target as Element | null)?.closest?.('a, button, [role="tab"], .hurt-panels, .hurt-left, header, dialog, label, input');
  let raf = 0;
  let last: PointerEvent | null = null;
  const probe = () => {
    raf = 0;
    if (!last || !hurtActive) return;
    const region = inUi(last.target) ? null : spine.pick(last.clientX, last.clientY);
    spine.hover = region;
    document.body.style.cursor = region ? 'pointer' : '';
    tabs.forEach((tab) => tab.classList.toggle('is-hover', tab.dataset.region === region));
  };
  if (finePointer) {
    window.addEventListener(
      'pointermove',
      (event) => {
        last = event;
        if (!raf) raf = requestAnimationFrame(probe);
      },
      { passive: true },
    );
  }
  window.addEventListener('click', (event) => {
    if (!hurtActive || inUi(event.target)) return;
    const region = spine.pick(event.clientX, event.clientY);
    if (region) select(region);
  });
}

/* ---------- Scroll scenes ---------- */
const mmHero = gsap.matchMedia();
const mmFv = gsap.matchMedia();

if (glWanted && !reducedMotion) {
  mmHero.add({ desktop: '(min-width: 960px)', phone: '(max-width: 959px)' }, (ctx) => {
    const isDesktop = !!ctx.conditions?.desktop;
    heroSection.classList.add('is-pinned');
    const items = $$<HTMLElement>('.story-item');
    const copy = $<HTMLElement>('.hero-copy')!;
    const cue = $<HTMLElement>('.scroll-cue')!;
    const story = $<HTMLElement>('.story')!;
    story.setAttribute('data-check-skip', '');
    items.forEach((item) => item.setAttribute('data-check-skip', ''));
    copy.setAttribute('data-check-skip', '');

    const tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: heroSection,
        start: 'top top',
        end: isDesktop ? '+=340%' : '+=280%',
        pin: true,
        scrub: 0.6,
        anticipatePin: 1,
        onUpdate: (self) => {
          heroProgress = self.progress;
        },
      },
    });
    tl.to(cue, { autoAlpha: 0, duration: 0.04 }, 0.02)
      .to(copy, { yPercent: -14, autoAlpha: 0, duration: 0.13 }, 0.07)
      .fromTo(items[0], { autoAlpha: 0, yPercent: 16 }, { autoAlpha: 1, yPercent: 0, duration: 0.1 }, 0.17)
      .to(items[0], { autoAlpha: 0, yPercent: -16, duration: 0.08 }, 0.4)
      .fromTo(items[1], { autoAlpha: 0, yPercent: 16 }, { autoAlpha: 1, yPercent: 0, duration: 0.1 }, 0.46)
      .to(items[1], { autoAlpha: 0, yPercent: -16, duration: 0.08 }, 0.68)
      .fromTo(items[2], { autoAlpha: 0, yPercent: 16 }, { autoAlpha: 1, yPercent: 0, duration: 0.1 }, 0.74)
      .to({}, { duration: 0.16 }, 0.84);

    return () => {
      heroSection.classList.remove('is-pinned');
      heroProgress = 0;
    };
  });

  mmFv.add('(min-width: 960px)', () => {
    fvSection.classList.add('is-pinned');
    const steps = $$<HTMLElement>('.fv-step');
    const num = $<HTMLElement>('.fv-num')!;
    steps.forEach((s) => s.setAttribute('data-check-skip', ''));
    const segs = $$<HTMLElement>('.fv-progress i');
    let active = -1;
    ScrollTrigger.create({
      trigger: fvSection,
      start: 'top top',
      end: '+=380%',
      pin: true,
      scrub: true,
      onUpdate: (self) => {
        fvProgress = self.progress;
        const minutes = Math.round(self.progress * 60);
        num.textContent = String(minutes).padStart(2, '0');
        segs.forEach((seg, n) => {
          const from = Number(steps[n].dataset.from);
          const to = Number(steps[n].dataset.to);
          seg.style.setProperty('--p', clamp01((self.progress * 60 - from) / (to - from)).toFixed(3));
        });
        const idx = steps.findIndex((s) => minutes >= Number(s.dataset.from) && minutes < Number(s.dataset.to));
        const i = idx < 0 ? steps.length - 1 : idx;
        if (i !== active) {
          steps.forEach((s, n) => s.classList.toggle('is-on', n === i));
          active = i;
        }
      },
    });
    steps[0].classList.add('is-on');
    return () => {
      fvSection.classList.remove('is-pinned');
      fvProgress = 0;
    };
  });
}

ScrollTrigger.create({
  trigger: hurtSection,
  start: 'top 38%',
  end: 'bottom 40%',
  onToggle: (self) => {
    hurtActive = self.isActive;
    applyRegionToSpine();
  },
});

// The stage steps out of the way once the spine has left the screen.
ScrollTrigger.create({
  trigger: fvSection,
  start: () => (desktopQuery.matches && fvSection.classList.contains('is-pinned') ? 'bottom top' : 'top top'),
  onEnter: () => {
    if (desktopQuery.matches && fvSection.classList.contains('is-pinned')) canvas.style.display = 'none';
  },
  onLeaveBack: () => {
    canvas.style.display = '';
  },
});
ScrollTrigger.create({
  trigger: hurtSection,
  start: 'bottom top',
  onEnter: () => {
    if (!(desktopQuery.matches && fvSection.classList.contains('is-pinned'))) canvas.style.display = 'none';
  },
  onLeaveBack: () => {
    canvas.style.display = '';
  },
});

/* ---------- The blue flood ---------- */
if (!reducedMotion) {
  finaleSection.classList.add('is-armed');
  const flood = $<HTMLElement>('.finale-flood')!;
  gsap.fromTo(
    flood,
    { clipPath: 'circle(0% at 50% 0%)' },
    {
      clipPath: 'circle(165% at 50% 0%)',
      ease: 'power1.inOut',
      scrollTrigger: { trigger: finaleSection, start: 'top 88%', end: 'top 4%', scrub: true },
    },
  );
  gsap.from('.finale-inner > *', {
    autoAlpha: 0,
    y: 40,
    duration: 1.1,
    stagger: 0.09,
    scrollTrigger: { trigger: finaleSection, start: 'top 40%', once: true },
  });
}
ScrollTrigger.create({
  trigger: finaleSection,
  start: 'top 12%',
  onEnter: () => document.body.classList.add('on-blue'),
  onLeaveBack: () => document.body.classList.remove('on-blue'),
});

/* ---------- Boot the spine ---------- */
spinePromise.then((spine) => {
  if (!spine) {
    if (!reducedMotion) {
      mmHero.revert();
      mmFv.revert();
    }
    return;
  }
  spineRef = spine;
  configure(spine);
  bindSpinePointer(spine);
  applyRegionToSpine();
  canvas.classList.add('is-ready');
  window.setTimeout(() => {
    canvas.style.transition = 'none';
    shown = true;
  }, 1100);
  root.classList.add('gl');
  // Assemble from the middle outward.
  for (let i = 0; i < BONES; i++) {
    gsap.to(spine.intro, { [i]: 1, duration: 1.5, ease: 'expo.out', delay: 0.05 + Math.abs(i - 11) * 0.04 });
  }
  ScrollTrigger.refresh();
  (window as unknown as { __atlas: unknown }).__atlas = { spine, select };
});

void regions;
void regionRange;
