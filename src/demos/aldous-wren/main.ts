import { gsap, ScrollTrigger, SplitText, initMotion, lenis, reducedMotion, finePointer, magnetic } from '../_kit/motion';
import { Flip } from 'gsap/Flip';
import { startInk, type Ink, type InkControls, type AvoidRect } from './ink';

gsap.registerPlugin(Flip);

const root = document.documentElement;
const params = new URLSearchParams(location.search);
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

// ---- the water ---------------------------------------------------------------------------------
const ctl: InkControls = { flood: 0, strength: 1 };
let ink: Ink | null = null;
const canvas = document.getElementById('ink') as HTMLCanvasElement | null;

if (reducedMotion || params.get('ink') === 'css' || !canvas) {
  root.classList.add('static-ink');
} else {
  ink = startInk(canvas, ctl);
  if (ink) root.classList.add('ink-live');
}

initMotion();

const collectAvoid = () => {
  if (!ink || !canvas) return;
  const sy = window.scrollY;
  const rects: AvoidRect[] = [];
  document.querySelectorAll<HTMLElement>('[data-avoid]').forEach((el) => {
    const r = el.getBoundingClientRect();
    if (!r.width || !r.height) return;
    rects.push({ x: r.left, y: r.top + sy, w: r.width, h: r.height, kind: el.dataset.avoid === 'big' ? 'big' : 'small' });
  });
  const bar = document.querySelector<HTMLElement>('.bar');
  if (bar) rects.push({ x: 0, y: 0, w: innerWidth, h: bar.offsetHeight * 0.9, kind: 'fixed' });
  ink.setAvoid(rects.filter((r) => r.y < innerHeight * 1.3), innerWidth, canvas.clientHeight || innerHeight);
};
if (ink) {
  collectAvoid();
  document.fonts?.ready.then(collectAvoid);
  setTimeout(collectAvoid, 1800);
  let rt = 0;
  window.addEventListener('resize', () => {
    clearTimeout(rt);
    rt = window.setTimeout(collectAvoid, 200);
  });
  ScrollTrigger.addEventListener('refresh', collectAvoid);
}

// ---- header and the hero's small parts ----------------------------------------------------------
if (!reducedMotion) {
  gsap.from('.bar', { opacity: 0, duration: 1.2, delay: 0.3, ease: 'power2.out' });
}
// The header steps out of the way while reading down the page and returns the moment you scroll up.
if (!reducedMotion) {
  const bar = document.querySelector<HTMLElement>('.bar');
  if (bar) {
    let hidden = false;
    const setHidden = (value: boolean) => {
      if (value === hidden) return;
      hidden = value;
      gsap.to(bar, { yPercent: value ? -120 : 0, duration: 0.7, ease: 'expo.out', overwrite: 'auto' });
    };
    ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => {
        const y = self.scroll();
        const solid = y > 260;
        bar.classList.toggle('bar--solid', solid);
        bar.classList.toggle('bar--dark', ctl.flood > 0.5);
        if (!solid) setHidden(false);
        else if (self.direction === 1) setHidden(true);
        else if (self.direction === -1) setHidden(false);
      },
    });
    bar.addEventListener('focusin', () => setHidden(false));
  }
}
document.querySelectorAll<HTMLElement>('[data-magnetic]').forEach((el) => magnetic(el, 0.22));

// ---- scroll: ink strength, the tides, the words ------------------------------------------------
if (!reducedMotion) {
  ScrollTrigger.create({
    trigger: '#hero',
    start: 'top top',
    end: 'bottom 30%',
    onUpdate: (self) => {
      const p = self.progress;
      ctl.strength = 1 - 0.76 * (p * p * (3 - 2 * p));
    },
  });

  ScrollTrigger.create({
    trigger: '#hero',
    start: 'bottom 40%',
    end: 'max',
    onToggle: (self) => root.classList.toggle('fab-on', self.isActive),
  });

  if (ink) {
    const ease = gsap.parseEase('power2.inOut');
    const tides: Record<string, ScrollTrigger> = {};
    const update = () => {
      const rise = tides.rise?.progress ?? 0;
      const drain = tides.drain?.progress ?? 0;
      ctl.flood = drain > 0 ? 1 - ease(clamp01((drain - 0.08) / 0.72)) : ease(clamp01((rise - 0.08) / 0.72));
    };
    document.querySelectorAll<HTMLElement>('[data-tide]').forEach((sec) => {
      const kind = sec.dataset.tide!;
      tides[kind] = ScrollTrigger.create({
        trigger: sec,
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: update,
        onRefresh: update,
      });
      // The big words rise into view as the scene approaches.
      const title = sec.querySelector<HTMLElement>('.tide__t');
      const sub = sec.querySelector<HTMLElement>('.tide__s');
      if (title) {
        SplitText.create(title, {
          type: 'lines',
          mask: 'lines',
          linesClass: 'reveal-part',
          autoSplit: true,
          onSplit(self: { lines: Element[] }) {
            return gsap.from(self.lines, {
              yPercent: 112,
              ease: 'none',
              stagger: 0.25,
              scrollTrigger: { trigger: sec, start: 'top 75%', end: 'top 10%', scrub: true },
            });
          },
        });
      }
      if (sub) {
        gsap.from(sub, {
          opacity: 0,
          y: 30,
          ease: 'none',
          scrollTrigger: { trigger: sec, start: 'top 30%', end: 'top -15%', scrub: true },
        });
      }
    });
    update();
  }

  const words = document.querySelector<HTMLElement>('[data-words]');
  if (words) {
    const split = SplitText.create(words, { type: 'words', wordsClass: 'wd' });
    gsap.fromTo(
      split.words,
      { opacity: 0.14 },
      {
        opacity: 1,
        ease: 'none',
        stagger: 0.12,
        scrollTrigger: { trigger: words, start: 'top 80%', end: 'bottom 48%', scrub: true },
      },
    );
  }

  const lineFill = document.querySelector<HTMLElement>('.steps__line span');
  if (lineFill) {
    gsap.fromTo(
      lineFill,
      { scaleY: 0 },
      { scaleY: 1, ease: 'none', scrollTrigger: { trigger: '.steps-wrap', start: 'top 65%', end: 'bottom 70%', scrub: true } },
    );
  }
  document.querySelectorAll<HTMLElement>('.step').forEach((step) => {
    const dot = step.querySelector('.step__dot');
    const parts = step.querySelectorAll('.step__n, .step__b');
    gsap.from(dot, { scale: 0, duration: 0.7, ease: 'back.out(2.4)', scrollTrigger: { trigger: step, start: 'top 72%', once: true } });
    gsap.from(parts, { autoAlpha: 0, y: 34, stagger: 0.1, duration: 1.1, scrollTrigger: { trigger: step, start: 'top 80%', once: true } });
  });
}

// ---- situations --------------------------------------------------------------------------------
const list = document.querySelector<HTMLElement>('[data-sits]');
if (list) {
  const items = [...list.querySelectorAll<HTMLElement>('.sit')];
  const btnOf = (li: HTMLElement) => li.querySelector<HTMLButtonElement>('.sit__btn')!;
  const panelOf = (li: HTMLElement) => li.querySelector<HTMLElement>('.sit__panel')!;
  let busy = false;

  const bringIntoView = (li: HTMLElement) => {
    const r = li.getBoundingClientRect();
    if (r.top > 90 && r.bottom < innerHeight - 24) return;
    const y = r.top + window.scrollY - 92;
    if (lenis) lenis.scrollTo(y, { duration: 1.2 });
    else window.scrollTo({ top: y, behavior: reducedMotion ? 'auto' : 'smooth' });
  };

  const apply = (target: HTMLElement, open: boolean) => {
    items.forEach((li) => {
      const on = li === target && open;
      li.classList.toggle('is-open', on);
      btnOf(li).setAttribute('aria-expanded', String(on));
      panelOf(li).hidden = !on;
    });
  };

  const toggle = async (target: HTMLElement) => {
    if (busy) return;
    const wasOpen = target.classList.contains('is-open');
    const open = !wasOpen;
    if (reducedMotion) {
      apply(target, open);
      if (open) bringIntoView(target);
      return;
    }
    busy = true;
    const current = items.find((li) => li.classList.contains('is-open'));
    if (current) {
      await gsap.to(panelOf(current), { autoAlpha: 0, duration: 0.2, ease: 'power1.out' });
    }
    const oldHeight = list.offsetHeight;
    const state = Flip.getState(items);
    apply(target, open);
    const newHeight = list.offsetHeight;
    if (current) gsap.set(panelOf(current), { clearProps: 'opacity,visibility' });
    if (open) {
      bringIntoView(target);
      const blocks = panelOf(target).querySelectorAll('.sit__blk, .sit__go');
      gsap.fromTo(blocks, { autoAlpha: 0, y: 28 }, { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.08, delay: 0.32, ease: 'power3.out' });
    }
    // Flip lifts the rows out of the flow and glides each one to its new place and size, while the
    // list's own height eases in step so everything below it moves with it.
    gsap.set(list, { height: oldHeight });
    gsap.to(list, { height: newHeight, duration: 0.95, ease: 'expo.inOut', onComplete: () => gsap.set(list, { clearProps: 'height' }) });
    Flip.from(state, {
      duration: 0.95,
      ease: 'expo.inOut',
      scale: false,
      absolute: true,
      onComplete: () => {
        busy = false;
        ScrollTrigger.refresh();
      },
      onInterrupt: () => {
        busy = false;
      },
    });
  };

  items.forEach((li, i) => {
    const btn = btnOf(li);
    btn.addEventListener('click', (e) => {
      toggle(li);
      if (ink && !reducedMotion && e.detail > 0) ink.drop(e.clientX, e.clientY, { dye: 1.2, radius: 0.03, speed: 110 });
    });
    btn.addEventListener('keydown', (e) => {
      const key = e.key;
      const go = (n: number) => {
        e.preventDefault();
        btnOf(items[(n + items.length) % items.length]).focus();
      };
      if (key === 'ArrowDown') go(i + 1);
      else if (key === 'ArrowUp') go(i - 1);
      else if (key === 'Home') go(0);
      else if (key === 'End') go(items.length - 1);
    });
    li.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && li.classList.contains('is-open')) {
        toggle(li);
        btn.focus();
      }
    });
    if (ink && finePointer && !reducedMotion) {
      btn.addEventListener('pointerenter', (e) => {
        ink!.drop(e.clientX, e.clientY, { dye: 0.8, radius: 0.017, speed: 80 });
      });
    }
  });

  // "Talk to us about this" carries the situation into the form.
  document.querySelectorAll<HTMLAnchorElement>('[data-pick]').forEach((a) => {
    a.addEventListener('click', () => {
      const select = document.getElementById('f-sit') as HTMLSelectElement | null;
      if (select) select.value = a.dataset.pick ?? '';
      window.setTimeout(() => document.getElementById('f-name')?.focus({ preventScroll: true }), 1400);
    });
  });
}

// ---- the form: nothing is ever sent --------------------------------------------------------------
const form = document.getElementById('consult-form') as HTMLFormElement | null;
const done = document.getElementById('consult-done');
if (form && done) {
  const error = document.getElementById('form-error')!;
  const fields = ['f-sit', 'f-name', 'f-contact'].map((id) => document.getElementById(id) as HTMLInputElement | HTMLSelectElement);
  fields.forEach((f) =>
    f.addEventListener('input', () => {
      f.removeAttribute('aria-invalid');
      error.textContent = '';
    }),
  );
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const bad = fields.filter((f) => !f.value.trim());
    fields.forEach((f) => (bad.includes(f) ? f.setAttribute('aria-invalid', 'true') : f.removeAttribute('aria-invalid')));
    if (bad.length) {
      error.textContent = bad[0].id === 'f-sit' ? 'Choose the closest situation first.' : 'We need a name and a phone number or email.';
      bad[0].focus();
      return;
    }
    const sit = (fields[0] as HTMLSelectElement).selectedOptions[0]?.textContent ?? '';
    const name = (fields[1].value || '').trim();
    const contact = (fields[2].value || '').trim();
    const line = document.getElementById('done-line')!;
    line.textContent = `If this were a real firm, someone would call ${name} on ${contact} the same business day about “${sit}”. It is a concept, so nothing left this page.`;
    form.hidden = true;
    done.hidden = false;
    if (!reducedMotion) {
      gsap.from(done.children, { autoAlpha: 0, y: 24, stagger: 0.09, duration: 0.9 });
    }
    done.focus({ preventScroll: true });
    ScrollTrigger.refresh();
  });
  document.getElementById('done-reset')?.addEventListener('click', () => {
    form.reset();
    done.hidden = true;
    form.hidden = false;
    (document.getElementById('f-sit') as HTMLElement).focus();
    ScrollTrigger.refresh();
  });
}

ScrollTrigger.refresh();
