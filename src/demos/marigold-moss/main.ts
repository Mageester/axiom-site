import { initMotion, gsap, ScrollTrigger, reducedMotion, finePointer } from '../_kit/motion';
import { createHero } from './hero';
import { createBuilder, type Builder, type StemKind } from './builder';
import { initSite } from './site';

const root = document.documentElement;
const $ = <T extends Element>(selector: string) => document.querySelector<T>(selector)!;
const $$ = <T extends Element>(selector: string) => Array.from(document.querySelectorAll<T>(selector));
const low = matchMedia('(pointer: coarse)').matches || innerWidth < 760;

initMotion();
initSite();

/* ---------- the still life ---------- */

const bloomStage = $<HTMLElement>('.bloom-stage');
const hero = createHero($<HTMLCanvasElement>('#bloom-canvas'), { low, still: reducedMotion });

if (!hero) {
  root.classList.remove('mm-live');
} else {
  // Let the first frame land before the canvas fades in over the painted stand-in.
  requestAnimationFrame(() => requestAnimationFrame(() => bloomStage.classList.add('is-live')));
  ScrollTrigger.create({
    trigger: '#bloom',
    start: 'top top',
    end: 'bottom bottom',
    onUpdate: (self) => hero.setProgress(self.progress),
  });
  if (!reducedMotion) {
    gsap.to(hero.intro, { value: 1, duration: 3.6, ease: 'power1.inOut', delay: 0.15 });
    if (finePointer) {
      window.addEventListener(
        'pointermove',
        (e) => {
          hero.parallax.x = (e.clientX / innerWidth - 0.5) * 2;
          hero.parallax.y = (e.clientY / innerHeight - 0.5) * 2;
        },
        { passive: true },
      );
    }
  }
}

// The words arrive with the flowers.
if (!reducedMotion) {
  const intro = gsap.timeline({ defaults: { ease: 'expo.out' } });
  intro.fromTo('.h1-line > span', { yPercent: 110 }, { yPercent: 0, duration: 1.4, stagger: 0.12 }, 0.35);
  intro.fromTo('.hero-eyebrow', { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 1 }, 0.25);
  intro.fromTo('.lede', { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 1.1 }, 0.85);
  intro.fromTo('.hero-actions, .cutoff-line', { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 1.1, stagger: 0.1 }, 1.0);
  intro.fromTo('.top', { autoAlpha: 0 }, { autoAlpha: 1, duration: 1.2, clearProps: 'opacity,visibility' }, 0.5);

  // The two story panels drift in over the flowers.
  $$<HTMLElement>('.panel-card').forEach((card) => {
    gsap.fromTo(
      card.children,
      { autoAlpha: 0, y: 36 },
      { autoAlpha: 1, y: 0, duration: 1.1, stagger: 0.08, ease: 'power3.out', scrollTrigger: { trigger: card, start: 'top 82%', once: true } },
    );
  });
}

/* ---------- the bouquet builder ---------- */

const NAMES: Record<StemKind, [string, string]> = {
  rose: ['garden rose', 'garden roses'],
  ranunculus: ['ranunculus', 'ranunculus'],
  marigold: ['marigold', 'marigolds'],
  cosmos: ['cosmos', 'cosmos'],
  anemone: ['anemone', 'anemones'],
  eucalyptus: ['stem of eucalyptus', 'stems of eucalyptus'],
  jasmine: ['trail of jasmine', 'trails of jasmine'],
};
const ORDER: StemKind[] = ['rose', 'ranunculus', 'marigold', 'anemone', 'cosmos', 'eucalyptus', 'jasmine'];
const WORDS = ['no', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen'];
const MAX = 16;
const SIZES = [
  { max: 4, id: 'petite', name: 'Petite', price: 55 },
  { max: 8, id: 'classic', name: 'Classic', price: 85 },
  { max: 12, id: 'generous', name: 'Generous', price: 125 },
  { max: MAX, id: 'showpiece', name: 'Showpiece', price: 185 },
];

const stemsEl = $<HTMLElement>('#stems');
const tally = $<HTMLElement>('#tally');
const tallyText = $<HTMLElement>('#tally-text');
const tallySize = $<HTMLElement>('#tally-size');
const countEl = $<HTMLElement>('#build-count');
const orderBtn = $<HTMLAnchorElement>('#build-order');
const undoBtn = $<HTMLButtonElement>('#build-undo');
const clearBtn = $<HTMLButtonElement>('#build-clear');
const buttons = $$<HTMLButtonElement>('.stem-btn');
const picked: StemKind[] = [];
let builder: Builder | null = null;
let seeded = false;
let touched = false; // once someone picks a stem, the starter bunch stops arriving

stemsEl.hidden = false;
tally.hidden = false;
$<HTMLElement>('#build-nojs').hidden = true;

function describe() {
  if (!picked.length) return '';
  const counts = ORDER.map((k) => [k, picked.filter((p) => p === k).length] as const).filter(([, n]) => n > 0);
  const parts = counts.map(([k, n]) => {
    if (n === 1 && (k === 'jasmine' || k === 'eucalyptus')) return `a ${NAMES[k][0]}`;
    return `${WORDS[n]} ${NAMES[k][n === 1 ? 0 : 1]}`;
  });
  return parts.length > 1 ? `${parts.slice(0, -1).join(', ')} and ${parts[parts.length - 1]}` : parts[0];
}

function sizeFor(n: number) {
  return SIZES.find((s) => n <= s.max) ?? SIZES[SIZES.length - 1];
}

function render() {
  const n = picked.length;
  const list = describe();
  if (!n) {
    tallyText.textContent = 'Nothing yet. A garden rose is a good place to start.';
    tallySize.textContent = '';
  } else {
    const size = sizeFor(n);
    tallyText.textContent = n >= MAX ? `A full armful: ${list}. Undo a stem or clear to change it.` : `Your bouquet: ${list}.`;
    tallySize.textContent = `Closest size: ${size.name}, $${size.price}.`;
  }
  countEl.textContent = n ? `${n} stem${n === 1 ? '' : 's'}` : '';
  buttons.forEach((b) => (b.disabled = n >= MAX));
  undoBtn.disabled = !n;
  clearBtn.disabled = !n;
  orderBtn.setAttribute('aria-disabled', String(!n));
}

function add(kind: StemKind) {
  if (picked.length >= MAX) return;
  picked.push(kind);
  builder?.add(kind);
  render();
}

buttons.forEach((b) =>
  b.addEventListener('click', () => {
    touched = true;
    add(b.dataset.stem as StemKind);
  }),
);
undoBtn.addEventListener('click', () => {
  touched = true;
  picked.pop();
  builder?.undo();
  render();
  if (!picked.length) buttons[0].focus();
});
clearBtn.addEventListener('click', () => {
  touched = true;
  picked.length = 0;
  builder?.clear();
  render();
  buttons[0].focus();
});
orderBtn.addEventListener('click', (event) => {
  if (!picked.length) {
    event.preventDefault();
    return;
  }
  const notes = $<HTMLTextAreaElement>('#o-notes');
  notes.value = `Like the bouquet I built: ${describe()}.`;
  const size = sizeFor(picked.length);
  const radio = document.querySelector<HTMLInputElement>(`input[name="size"][value="${size.id}"]`);
  if (radio) radio.checked = true;
});

render();

const buildStage = $<HTMLElement>('.build-stage');
const buildCanvas = $<HTMLCanvasElement>('#build-canvas');

function startBuilder() {
  builder = createBuilder(buildCanvas, { low, still: reducedMotion });
  if (!builder) return;
  buildStage.classList.add('is-live');
  // Anything chosen before the scene was ready grows in now.
  picked.forEach((k) => builder!.add(k));

  // Drag sideways to turn the bowl. Vertical drags still scroll the page.
  let lastX: number | null = null;
  buildCanvas.style.touchAction = 'pan-y';
  buildCanvas.addEventListener('pointerdown', (e) => {
    lastX = e.clientX;
    buildCanvas.setPointerCapture(e.pointerId);
  });
  buildCanvas.addEventListener('pointermove', (e) => {
    if (lastX === null) return;
    builder?.turn(e.clientX - lastX);
    lastX = e.clientX;
  });
  const end = () => (lastX = null);
  buildCanvas.addEventListener('pointerup', end);
  buildCanvas.addEventListener('pointercancel', end);
}

// Build the scene when the section comes near, and start visitors off with a few stems.
new IntersectionObserver(
  (entries, observer) => {
    if (!entries.some((e) => e.isIntersecting)) return;
    observer.disconnect();
    startBuilder();
  },
  { rootMargin: '100% 0px' },
).observe(buildStage);

new IntersectionObserver(
  (entries, observer) => {
    if (!entries.some((e) => e.isIntersecting) || seeded) return;
    observer.disconnect();
    seeded = true;
    if (picked.length) return;
    const starter: StemKind[] = ['eucalyptus', 'rose', 'eucalyptus', 'ranunculus', 'cosmos', 'rose', 'jasmine'];
    starter.forEach((k, i) => (reducedMotion ? add(k) : gsap.delayedCall(0.3 + i * 0.38, () => !touched && add(k))));
  },
  { threshold: 0.35 },
).observe(buildStage);
