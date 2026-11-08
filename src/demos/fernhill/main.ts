import { initMotion, reducedMotion, finePointer } from '../_kit/motion';
import { createLawn } from './lawn';

const $ = <T extends Element>(selector: string, scope: ParentNode = document) => scope.querySelector<T>(selector)!;
const $$ = <T extends Element>(selector: string, scope: ParentNode = document) => Array.from(scope.querySelectorAll<T>(selector));
const clamp = (v: number, a = 0, b = 1) => Math.min(Math.max(v, a), b);
const smooth = (a: number, b: number, x: number) => {
  const t = clamp((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};

initMotion();

/* ---------- the lawn ---------- */

const story = $<HTMLElement>('#story');
const stage = $<HTMLElement>('.stage');
const canvas = $<HTMLCanvasElement>('#lawn');
const coarse = matchMedia('(pointer: coarse)').matches;
const lawn = createLawn(canvas, { low: coarse || innerWidth < 760, still: reducedMotion });

if (lawn) {
  requestAnimationFrame(() => requestAnimationFrame(() => stage.classList.add('is-live')));
}

// Someone has just walked across the lawn: the first thing you see is their trail.
const tall = innerWidth / Math.max(innerHeight, 1) < 0.9;
const path: Array<[number, number]> = tall
  ? [
      [-0.05, -1.15],
      [0.12, -2.0],
      [0.06, -3.2],
      [0.38, -4.8],
      [0.85, -7.4],
    ]
  : [
      [0.15, -1.45],
      [0.38, -2.6],
      [0.95, -4.2],
      [1.85, -6.6],
      [3.1, -10.6],
    ];
if (lawn) {
  if (reducedMotion) lawn.pressPath(path);
  else window.setTimeout(() => lawn.walkPath(path, 2.6), 650);
}

let storyVisible = true;
new IntersectionObserver(([entry]) => (storyVisible = entry.isIntersecting)).observe(story);

const isControl = (target: EventTarget | null) => !!(target as Element | null)?.closest?.('a, button, input, textarea, label, summary, select');
const hints = $$<HTMLElement>('.hint');
let walked = 0;
const noteWalk = () => {
  walked += 1;
  if (walked === 40) hints.forEach((h) => h.classList.add('is-done'));
};

if (lawn) {
  window.addEventListener(
    'pointermove',
    (event) => {
      if (event.pointerType === 'touch' || !storyVisible) return;
      lawn.step(event.clientX, event.clientY);
      lawn.state.tx = (event.clientX / innerWidth - 0.5) * 2;
      lawn.state.ty = (event.clientY / innerHeight - 0.5) * 2;
      noteWalk();
    },
    { passive: true },
  );
  document.addEventListener('pointerleave', () => lawn.lift());

  const touch = (event: TouchEvent) => {
    if (isControl(event.target)) return;
    const t = event.touches[0];
    if (!t) return;
    lawn.step(t.clientX, t.clientY);
    hints.forEach((h) => h.classList.add('is-done'));
  };
  story.addEventListener('touchstart', touch, { passive: true });
  story.addEventListener('touchmove', touch, { passive: true });
  story.addEventListener('touchend', () => lawn.lift(), { passive: true });
}

/* ---------- header ---------- */

const header = $<HTMLElement>('.top');
// The frosted winter card is light, so the header turns to ink while it passes underneath.
const toned = $$<HTMLElement>('.chapter--winter .card, .paper > section, .contact, .concept-footer');
const darkSections = new Set($$<HTMLElement>('.year, .quote, .contact, .concept-footer'));
function headerTone() {
  const line = header.offsetHeight * 0.6;
  let tone: 'story' | 'paper' | 'dark' = 'story';
  for (const el of toned) {
    const r = el.getBoundingClientRect();
    if (r.top <= line && r.bottom > line) {
      tone = darkSections.has(el) ? 'dark' : 'paper';
      break;
    }
  }
  header.classList.toggle('on-paper', tone === 'paper');
  header.classList.toggle('on-dark', tone === 'dark');
}

/* ---------- scrolling through the year ---------- */

const chapters = $$<HTMLElement>('.chapter');
const words = $$<HTMLElement>('.stage-word');
const seasonLinks = $$<HTMLAnchorElement>('[data-season-link]');
const seasonNav = $<HTMLElement>('.seasons');
const shade = $<HTMLElement>('.stage-shade');
let anchors: number[] = [];

function measure() {
  anchors = [
    0,
    ...chapters.map((el) => {
      const top = el.getBoundingClientRect().top + window.scrollY;
      return top + el.offsetHeight / 2 - innerHeight / 2;
    }),
  ];
}

/** -1 on the first screen, then 0 summer, 1 autumn, 2 winter, 3 spring, holding while each card is read. */
function chapterAt(y: number) {
  if (y <= anchors[0]) return -1;
  for (let k = 0; k < anchors.length - 1; k++) {
    if (y < anchors[k + 1]) {
      const t = (y - anchors[k]) / Math.max(anchors[k + 1] - anchors[k], 1);
      return k - 1 + smooth(0.2, 0.8, t);
    }
  }
  return anchors.length - 2;
}

let activeSeason = -2;
function onScroll() {
  const c = chapterAt(window.scrollY);
  if (lawn) {
    lawn.state.target = Math.max(c, 0);
    if (reducedMotion) lawn.stage.loop.invalidate();
  }
  // The heavy shade only helps the first screen's text; the cards carry their own backing.
  shade.style.opacity = (1 - 0.5 * clamp(c + 1)).toFixed(3);
  words.forEach((w, i) => {
    const o = clamp(1 - Math.abs(c - i) * 2.6);
    w.style.opacity = o.toFixed(3);
    w.style.transform = reducedMotion ? '' : `translate3d(0, ${((i - c) * 28).toFixed(1)}px, 0)`;
  });
  const active = c > -0.5 ? Math.round(c) : -1;
  if (active !== activeSeason) {
    activeSeason = active;
    seasonLinks.forEach((a, i) => (i === active ? a.setAttribute('aria-current', 'true') : a.removeAttribute('aria-current')));
  }
  // Step the season links aside before the story ends, so they never sit on the paper.
  seasonNav.classList.toggle('is-away', story.getBoundingClientRect().bottom < innerHeight * 1.12);
  headerTone();
}

let ticking = false;
const requestUpdate = () => {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    ticking = false;
    onScroll();
  });
};
window.addEventListener('scroll', requestUpdate, { passive: true });
window.addEventListener('resize', () => {
  measure();
  requestUpdate();
});
measure();
onScroll();
document.fonts?.ready.then(() => {
  measure();
  onScroll();
});

{
  const btn = $<HTMLButtonElement>('#menu-btn');
  const setMenu = (open: boolean) => {
    header.classList.toggle('menu-open', open);
    btn.setAttribute('aria-expanded', String(open));
    btn.textContent = open ? 'Close' : 'Menu';
  };
  btn.addEventListener('click', () => setMenu(!header.classList.contains('menu-open')));
  $$('.nav a').forEach((a) => a.addEventListener('click', () => setMenu(false)));
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && header.classList.contains('menu-open')) {
      setMenu(false);
      btn.focus();
    }
  });
}

/* ---------- the year: pick a month ---------- */

{
  const months = $<HTMLElement>('#months');
  const list = $<HTMLElement>('#month-tabs');
  const tabs = $$<HTMLButtonElement>('.month-tab', list);
  const panels = $$<HTMLElement>('.month', months);
  const mark = $<HTMLElement>('.gantt-mark');
  const heads = $$<HTMLElement>('.gantt-months span');
  const now = new Date().getMonth();

  list.hidden = false;
  list.setAttribute('role', 'tablist');
  months.classList.add('is-tabs');
  $('.year').classList.add('is-live');
  tabs.forEach((tab, i) => {
    tab.setAttribute('role', 'tab');
    panels[i].setAttribute('role', 'tabpanel');
    panels[i].setAttribute('aria-labelledby', tab.id);
    panels[i].tabIndex = 0;
    if (i === now) {
      const tag = tab.querySelector<HTMLElement>('.month-now');
      if (tag) tag.hidden = false;
      tab.setAttribute('aria-label', `${panels[i].querySelector('.month-name')?.textContent}, this month`);
    }
  });

  const select = (i: number, focus = false) => {
    tabs.forEach((tab, n) => {
      tab.setAttribute('aria-selected', String(n === i));
      tab.tabIndex = n === i ? 0 : -1;
      panels[n].hidden = n !== i;
    });
    heads.forEach((h, n) => h.classList.toggle('on', n === i));
    mark.style.setProperty('--m', String(i));
    if (focus) tabs[i].focus();
  };
  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => select(i));
    tab.addEventListener('keydown', (e) => {
      const keys: Record<string, number> = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: tabs.length - 1 };
      if (!(e.key in keys)) return;
      e.preventDefault();
      select((keys[e.key] + tabs.length) % tabs.length, true);
    });
  });
  select(now);
}

/* ---------- the quote ---------- */

{
  const form = $<HTMLFormElement>('#quote-form');
  const done = $<HTMLElement>('#qf-done');
  const summary = $<HTMLElement>('#qf-summary');
  const error = $<HTMLElement>('#qf-error');
  const contact = $<HTMLInputElement>('#qf-contact');
  const contactLabel = $<HTMLElement>('#qf-contact-label');
  const nameInput = $<HTMLInputElement>('#qf-name');

  const setReach = () => {
    const how = (form.elements.namedItem('reach') as RadioNodeList).value;
    const byEmail = how === 'email';
    contact.type = byEmail ? 'email' : 'tel';
    contact.autocomplete = byEmail ? 'email' : 'tel';
    contact.inputMode = byEmail ? 'email' : 'tel';
    contactLabel.textContent = byEmail ? 'Email address' : 'Phone number';
  };
  form.addEventListener('change', (e) => {
    if ((e.target as HTMLInputElement).name === 'reach') setReach();
    (e.target as Element).closest('.is-invalid')?.classList.remove('is-invalid');
  });
  form.addEventListener('input', (e) => (e.target as Element).closest('.is-invalid')?.classList.remove('is-invalid'));

  // "Price weekly lawn care" and the like: tick that service on the way to the form.
  $$<HTMLAnchorElement>('[data-service]').forEach((a) =>
    a.addEventListener('click', () => {
      const box = form.querySelector<HTMLInputElement>(`input[name="services"][value="${a.dataset.service}"]`);
      if (box) box.checked = true;
    }),
  );

  const join = (items: string[]) =>
    items.length < 2 ? items.join('') : `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`;

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const property = String(data.get('property') ?? '');
    const size = String(data.get('size') ?? '');
    const picked = $$<HTMLInputElement>('input[name="services"]:checked', form).map((i) => i.dataset.label ?? i.value);
    const problems: Array<[Element, string]> = [];
    if (!property) problems.push([form.querySelector('input[name="property"]')!.closest('.qf-set')!, 'Pick the kind of property.']);
    if (!picked.length) problems.push([form.querySelector('input[name="services"]')!.closest('.qf-set')!, 'Pick at least one service.']);
    if (!nameInput.value.trim()) problems.push([nameInput.closest('.qf-field')!, 'Add your name.']);
    const value = contact.value.trim();
    const okContact = contact.type === 'email' ? /.+@.+\..+/.test(value) : value.replace(/\D/g, '').length >= 10;
    if (!okContact) problems.push([contact.closest('.qf-field')!, contact.type === 'email' ? 'Add an email address we can write to.' : 'Add a phone number with its area code.']);

    $$('.is-invalid', form).forEach((el) => el.classList.remove('is-invalid'));
    if (problems.length) {
      problems.forEach(([el]) => el.classList.add('is-invalid'));
      error.textContent = problems.map(([, m]) => m).join(' ');
      problems[0][0].querySelector<HTMLElement>('input, textarea')?.focus();
      return;
    }
    error.textContent = '';
    const sizeText = size && size !== 'Not sure' ? `, ${size.toLowerCase()} yard` : '';
    summary.textContent = `${join(picked.map((p) => p.toLowerCase()))} for a ${property.toLowerCase()}${sizeText}`;
    form.hidden = true;
    done.hidden = false;
    done.focus({ preventScroll: true });
    done.scrollIntoView({ block: 'center', behavior: reducedMotion ? 'auto' : 'smooth' });
  });

  $('#qf-again').addEventListener('click', () => {
    form.reset();
    setReach();
    error.textContent = '';
    done.hidden = true;
    form.hidden = false;
    form.querySelector<HTMLInputElement>('input')?.focus();
  });
}

void finePointer;
