import { initMotion, magnetic, reducedMotion, finePointer, gsap } from '../_kit/motion';
import { BreathClock, initBreathGuide } from './breath';
import { createSilk } from './silk';
import { initTimetable, nextClassText } from './timetable';

const root = document.documentElement;
const $ = <T extends Element = HTMLElement>(selector: string, scope: ParentNode = document) => scope.querySelector<T>(selector);
const $$ = <T extends Element = HTMLElement>(selector: string, scope: ParentNode = document) => [...scope.querySelectorAll<T>(selector)];

initMotion();

const hero = $('.hero')!;
const canvas = $<HTMLCanvasElement>('[data-silk]')!;
const stageBox = $('.hero__stage')!;

// ───────── the silk ─────────
const clock = new BreathClock();
const silk = createSilk(canvas, hero, clock, () => stageBox.classList.add('is-ready'));
if (silk) root.classList.add('gl');
initBreathGuide(clock, hero);

// a soft puff from the button when the guide starts
$('[data-breathe-toggle]')?.addEventListener('click', (event) => {
  if (!silk || !clock.guided) return;
  const r = canvas.getBoundingClientRect();
  silk.puff(r.left + r.width * 0.68, r.top + r.height * 0.62, 0.6);
  void event;
});

// ───────── first screen ─────────
if (!reducedMotion) {
  const tl = gsap.timeline({ delay: 0.15 });
  tl.from('.bar > *', { autoAlpha: 0, y: -12, duration: 1, stagger: 0.08, ease: 'power3.out' }, 0.2);
  // the wrapper, not the buttons: the buttons carry their own CSS transform transition
  tl.from('.actions', { autoAlpha: 0, y: -12, duration: 1, ease: 'power3.out', clearProps: 'transform' }, 0.35);
  tl.from('.hero__kicker', { autoAlpha: 0, y: 14, duration: 1.1, ease: 'power3.out' }, 0.3);
  tl.from('.hero__intro, .hero__cta', { autoAlpha: 0, y: 18, duration: 1.2, stagger: 0.1, ease: 'power3.out' }, 1.0);
  tl.from('.hero__foot', { autoAlpha: 0, y: 14, duration: 1.2, ease: 'power3.out' }, 1.35);
}

// what's on next, in Waterloo time
{
  const el = $('[data-next]');
  const next = nextClassText();
  if (el && next) {
    el.innerHTML = '';
    const lead = document.createElement('span');
    lead.className = 'hero__nextLabel';
    lead.textContent = 'Next class';
    const link = document.createElement('a');
    link.href = '#timetable';
    link.textContent = `${next.name}, ${next.when}`;
    el.append(lead, link);
  }
}

// ───────── fixed actions: compact once you are into the page ─────────
{
  const actions = $('.actions');
  const sync = () => actions?.classList.toggle('is-compact', window.scrollY > window.innerHeight * 0.6);
  window.addEventListener('scroll', sync, { passive: true });
  sync();
}

// ───────── contact form ─────────
const form = $<HTMLFormElement>('[data-contact]')!;
const done = $('[data-contact-done]')!;
const chosen = $('[data-chosen]')!;
const chosenText = $('[data-chosen-text]')!;
const errorBox = $('[data-contact-error]')!;
let reserved = '';

function setReserved(label: string) {
  reserved = label;
  chosen.hidden = !label;
  chosenText.textContent = label;
  const topic = $<HTMLSelectElement>('#c-topic');
  if (label && topic) topic.value = 'Reserving a mat';
}

initTimetable((label) => {
  setReserved(label);
  window.setTimeout(() => $<HTMLInputElement>('#c-name')?.focus({ preventScroll: true }), 900);
});
$('[data-chosen-clear]')?.addEventListener('click', () => {
  setReserved('');
  $<HTMLSelectElement>('#c-topic')!.value = '';
});

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const name = String(data.get('name') ?? '').trim();
  const email = String(data.get('email') ?? '').trim();
  const fields: [HTMLInputElement, boolean][] = [
    [$<HTMLInputElement>('#c-name')!, name.length > 0],
    [$<HTMLInputElement>('#c-email')!, /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)],
  ];
  fields.forEach(([input, ok]) => input.setAttribute('aria-invalid', String(!ok)));
  const bad = fields.find(([, ok]) => !ok);
  if (bad) {
    errorBox.textContent = bad[0].id === 'c-name' ? 'Add your name so we know who to reply to.' : 'That email address does not look complete.';
    bad[0].focus();
    return;
  }
  errorBox.textContent = '';
  const first = name.split(/\s+/)[0];
  $('[data-done-line]')!.textContent = reserved
    ? `Thanks, ${first}. On a real site, a mat at ${reserved} would now be held for you, and a confirmation would be on its way.`
    : `Thanks, ${first}. On a real site, this would be in the studio's inbox now, and you would hear back within a day.`;
  form.hidden = true;
  done.hidden = false;
  done.focus();
  if (!reducedMotion) gsap.from(done.children, { autoAlpha: 0, y: 16, duration: 0.9, stagger: 0.08, ease: 'power3.out' });
});

$('[data-done-reset]')?.addEventListener('click', () => {
  form.reset();
  setReserved('');
  done.hidden = true;
  form.hidden = false;
  $<HTMLInputElement>('#c-name')?.focus();
});

// ───────── small details ─────────
if (!reducedMotion && finePointer) {
  $$('.btn--lift').forEach((el) => magnetic(el, 0.22));
}
