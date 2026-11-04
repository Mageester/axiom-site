import { gsap, ScrollTrigger, SplitText, initMotion, magnetic, lenis, reducedMotion, finePointer } from '../_kit/motion';
import { Flip } from 'gsap/Flip';
import { shades, hours, PHONE_DISPLAY } from './data';
import { initCanvas, onShade, pourTo, request, setCalm, setInstant, setRecede, world } from './palette';
import { initBooking } from './booking';

gsap.registerPlugin(Flip);
if (import.meta.env.DEV) (window as unknown as { __gsap: typeof gsap }).__gsap = gsap;

const root = document.documentElement;
const $ = <T extends Element = HTMLElement>(selector: string, scope: ParentNode = document) => scope.querySelector<T>(selector);
const $$ = <T extends Element = HTMLElement>(selector: string, scope: ParentNode = document) => [...scope.querySelectorAll<T>(selector)];
const pad = (n: number) => String(n).padStart(2, '0');
const isPhone = () => window.innerWidth < 760;

initMotion();
if (!reducedMotion) {
  root.classList.add('scrolly');
  // hold the first-screen pieces back until the timeline plays them
  gsap.set('.rv', { autoAlpha: 0 });
}

// ───────────────────────── shade state ─────────────────────────
let storedId: string | null = null;
try {
  storedId = sessionStorage.getItem('vernis-shade');
} catch {
  storedId = null;
}
const want = { shade: Math.max(0, shades.findIndex((s) => s.id === storedId)), tone: 0 };
setInstant(want.shade, 0);

const heroWrap = $('.hero-wrap')!;
const stack = $('.name-stack')!;
const title = $('.hero__title')!;
const lead = $('.hero__lead')!;
const noteText = $('[data-shade-note]')!;
const noteNo = $('[data-shade-no]')!;
const srName = $('[data-shade-text]')!;
const heroRadios = $$<HTMLInputElement>('input[name="shade-hero"]');
const dock = $('[data-dock]')!;
const dockOrb = $('[data-dock-orb]')!;
const dockToggle = $<HTMLButtonElement>('.dock__toggle')!;
const dockList = $('#dock-list')!;

// ───────────────────────── the giant shade name ─────────────────────────
function buildLayer(text: string) {
  const layer = document.createElement('span');
  layer.className = 'name-layer';
  layer.setAttribute('aria-hidden', 'true');
  for (const ch of text) {
    const cell = document.createElement('span');
    cell.className = 'nc';
    const glyph = document.createElement('span');
    glyph.textContent = ch;
    cell.append(glyph);
    layer.append(cell);
  }
  return layer;
}

function fitLayer(layer: HTMLElement) {
  layer.style.fontSize = '100px';
  const natural = layer.getBoundingClientRect().width || 100;
  const maxWidth = (stack.parentElement as HTMLElement).clientWidth;
  const bySize = (maxWidth / natural) * 100 * 0.985;
  const room = title.clientHeight - lead.offsetHeight - 6;
  const byHeight = room / 0.8;
  const size = Math.max(60, Math.min(bySize, byHeight, isPhone() ? 520 : 700));
  layer.style.fontSize = `${size.toFixed(1)}px`;
  // sizes do not scale perfectly linearly, so correct once against the real width
  const real = layer.getBoundingClientRect().width;
  if (real > maxWidth * 0.99) layer.style.fontSize = `${(size * (maxWidth * 0.985) / real).toFixed(1)}px`;
}

function unionRect(...els: (Element | null)[]) {
  const rects = els.filter(Boolean).map((el) => el!.getBoundingClientRect());
  if (!rects.length) return null;
  const left = Math.min(...rects.map((r) => r.left));
  const top = Math.min(...rects.map((r) => r.top));
  const right = Math.max(...rects.map((r) => r.right));
  const bottom = Math.max(...rects.map((r) => r.bottom));
  return new DOMRect(left, top, right - left, bottom - top);
}
/** The box behind the giant shade name, hugging the letters. */
function nameRect() {
  const r = stack.getBoundingClientRect();
  if (r.width === 0) return null;
  const pad = r.height * 0.06;
  return new DOMRect(r.left, r.top - pad, r.width, r.height + pad * 2);
}
const rectOf = (el: Element | null) => {
  if (!el) return null;
  const r = el.getBoundingClientRect();
  return r.width > 0 && r.height > 0 ? r : null;
};
/** Where text sits on the lacquer. The shader keeps reflections out of these boxes. */
function measureCalm() {
  setCalm(
    [rectOf($('.bar__mark')), rectOf($('.bar__nav')), rectOf(lead), rectOf($('.hero__intro')), rectOf($('.hero__note')), rectOf($('.picker'))],
    nameRect(),
  );
}

let activeLayer: HTMLElement = $('.name-layer', stack)!;
function setNameInstant(text: string) {
  const layer = buildLayer(text);
  stack.textContent = '';
  stack.append(layer);
  fitLayer(layer);
  activeLayer = layer;
  srName.textContent = text;
}

function swapName(text: string) {
  srName.textContent = text;
  const outgoing = $$('.name-layer', stack);
  const layer = buildLayer(text);
  stack.append(layer);
  fitLayer(layer);
  activeLayer = layer;
  if (reducedMotion) {
    outgoing.forEach((o) => o.remove());
    return;
  }
  outgoing.forEach((o) => {
    gsap.killTweensOf(o.querySelectorAll('.nc > span'));
    gsap.to(o.querySelectorAll('.nc > span'), {
      yPercent: -125,
      duration: 0.55,
      ease: 'power3.in',
      stagger: 0.025,
      onComplete: () => o.remove(),
    });
  });
  gsap.fromTo(layer.querySelectorAll('.nc > span'), { yPercent: 125 }, { yPercent: 0, duration: 1.25, ease: 'expo.out', stagger: 0.05, delay: 0.3 });
  requestAnimationFrame(measureCalm);
}

function swapNote(index: number) {
  const s = shades[index];
  if (reducedMotion) {
    noteText.textContent = s.note;
    noteNo.textContent = `No. ${pad(index + 1)} / ${pad(shades.length)}`;
    return;
  }
  gsap.timeline()
    .to([noteText, noteNo], { autoAlpha: 0, y: -8, duration: 0.3, ease: 'power2.in' })
    .add(() => {
      noteText.textContent = s.note;
      noteNo.textContent = `No. ${pad(index + 1)} / ${pad(shades.length)}`;
    })
    .fromTo([noteText, noteNo], { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.06, ease: 'power3.out' });
}

// ───────────────────────── picking a shade ─────────────────────────
const cards = $$('[data-shade-card]');
function syncPickers(index: number) {
  const id = shades[index].id;
  heroRadios.forEach((r) => (r.checked = r.value === id));
  $$('.dock__item').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.shade === id)));
  cards.forEach((c) => c.setAttribute('data-active', String(c.dataset.shadeCard === id)));
  const orb = dockOrb as HTMLElement;
  orb.style.setProperty('--d', shades[index].deep);
  orb.style.setProperty('--m', shades[index].mid);
  orb.style.setProperty('--g', shades[index].glow);
  dockToggle.setAttribute('aria-label', `Choose a shade, currently ${shades[index].name}`);
}

function choose(id: string, source?: Element | null) {
  const index = shades.findIndex((s) => s.id === id);
  if (index < 0 || index === want.shade) return;
  want.shade = index;
  syncPickers(index);
  try {
    sessionStorage.setItem('vernis-shade', id);
  } catch {
    /* private mode: the choice just will not be remembered */
  }
  let origin: [number, number] | null = null;
  if (source) {
    const r = source.getBoundingClientRect();
    origin = [(r.left + r.width / 2) / window.innerWidth, 1 - (r.top + r.height / 2) / window.innerHeight];
  }
  request(index, want.tone, origin);
}

onShade((index) => {
  swapName(shades[index].name);
  swapNote(index);
});

heroRadios.forEach((radio) => {
  radio.addEventListener('change', () => {
    if (radio.checked) choose(radio.value, radio.closest('label'));
  });
});
document.addEventListener('click', (event) => {
  const target = (event.target as Element).closest<HTMLElement>('[data-shade]');
  if (!target) return;
  choose(target.dataset.shade!, target);
  if (target.closest('.dock')) window.setTimeout(() => setDock(false), 650);
});

// the dock
let dockOpen = false;
function setDock(open: boolean) {
  if (open === dockOpen) return;
  dockOpen = open;
  dockToggle.setAttribute('aria-expanded', String(open));
  if (open) {
    (dockList as HTMLElement).hidden = false;
    if (!reducedMotion) gsap.fromTo(dockList.children, { x: 24, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.55, ease: 'expo.out', stagger: { each: 0.04, from: 'end' } });
  } else if (!reducedMotion) {
    gsap.to(dockList.children, { x: 24, autoAlpha: 0, duration: 0.25, ease: 'power2.in', stagger: { each: 0.02, from: 'start' }, onComplete: () => ((dockList as HTMLElement).hidden = true) });
  } else {
    (dockList as HTMLElement).hidden = true;
  }
}
dockToggle.addEventListener('click', () => setDock(!dockOpen));
document.addEventListener('pointerdown', (event) => {
  if (dockOpen && !(event.target as Element).closest('.dock')) setDock(false);
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && dockOpen) {
    setDock(false);
    dockToggle.focus();
  }
});

// ───────────────────────── booking ─────────────────────────
const booking = initBooking();
document.addEventListener('click', (event) => {
  const el = event.target as Element;
  const service = el.closest<HTMLElement>('[data-book-service]');
  if (service) {
    event.preventDefault();
    booking.open(service.dataset.bookService, service);
    return;
  }
  const trigger = el.closest<HTMLElement>('[data-book]');
  if (trigger) {
    event.preventDefault();
    booking.open(undefined, trigger);
  }
});

// ───────────────────────── first screen ─────────────────────────
const shader = initCanvas(isPhone() ? 1.6 : 1.4);
setNameInstant(shades[want.shade].name);
syncPickers(want.shade);
noteText.textContent = shades[want.shade].note;
noteNo.textContent = `No. ${pad(want.shade + 1)} / ${pad(shades.length)}`;
if (!shader) root.classList.remove('gl');

const ready = Promise.race([document.fonts?.load('italic 500 100px "Cormorant Garamond"').catch(() => null), new Promise((r) => setTimeout(r, 1200))]);
ready.then(() => {
  setNameInstant(shades[want.shade].name);
  measureCalm();
  stack.style.visibility = 'visible';
  if (!reducedMotion) {
    const chars = activeLayer.querySelectorAll('.nc > span');
    const tl = gsap.timeline();
    tl.fromTo(chars, { yPercent: 125 }, { yPercent: 0, duration: 1.35, ease: 'expo.out', stagger: 0.06 }, 0.2);
    tl.fromTo('.hero__intro', { autoAlpha: 0, y: 28 }, { autoAlpha: 1, y: 0, duration: 1, ease: 'power3.out' }, 0.6);
    tl.fromTo('.hero__foot', { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.9, ease: 'power3.out' }, 0.85);
    tl.fromTo('.orb-label', { scale: 0.2, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.8, ease: 'back.out(2.2)', stagger: 0.06 }, 0.95);
    tl.fromTo('.actions > *, .bar', { autoAlpha: 0, y: -14 }, { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.08, ease: 'power3.out' }, 0.5);
    if (shader) {
      const pour = { v: 0 };
      gsap.to(pour, { v: 1, duration: 1.9, ease: 'power1.inOut', onUpdate: () => pourTo(pour.v), onComplete: () => pourTo(1) });
    }
  } else {
    pourTo(1);
  }
});
if (reducedMotion) pourTo(1);

let resizeTimer = 0;
window.addEventListener('resize', () => {
  window.clearTimeout(resizeTimer);
  resizeTimer = window.setTimeout(() => {
    fitLayer(activeLayer);
    measureCalm();
  }, 150);
});

// The title drifts a little against the pointer, so the type feels set into the lacquer.
if (!reducedMotion && finePointer) {
  const leadX = gsap.quickTo(lead, 'x', { duration: 1.4, ease: 'power3.out' });
  const leadY = gsap.quickTo(lead, 'y', { duration: 1.4, ease: 'power3.out' });
  const nameX = gsap.quickTo(stack, 'x', { duration: 1.6, ease: 'power3.out' });
  const nameY = gsap.quickTo(stack, 'y', { duration: 1.6, ease: 'power3.out' });
  window.addEventListener(
    'pointermove',
    (event) => {
      const dx = event.clientX / window.innerWidth - 0.5;
      const dy = event.clientY / window.innerHeight - 0.5;
      leadX(dx * -18);
      leadY(dy * -10);
      nameX(dx * 26);
      nameY(dy * 14);
    },
    { passive: true },
  );
}

// ───────────────────────── scroll story ─────────────────────────
// the call and Book buttons: icon-only once you are into the page, with a solid collar once the lacquer has gone
{
  const actions = document.querySelector<HTMLElement>('.actions');
  const sync = () => {
    const y = window.scrollY;
    actions?.classList.toggle('is-compact', y > window.innerHeight * 0.95);
    actions?.classList.toggle('is-collared', y > window.innerHeight * 0.95);
  };
  window.addEventListener('scroll', sync, { passive: true });
  sync();
}

if (!reducedMotion) {
  // the lacquer is wiped off the page like a brush stroke
  ScrollTrigger.create({
    trigger: heroWrap,
    start: 'top top',
    end: () => `+=${Math.round(window.innerHeight * 1.0)}`,
    scrub: true,
    onUpdate: (self) => setRecede(self.progress),
    onRefresh: (self) => setRecede(self.progress),
  });
  gsap.to('.hero__title', {
    yPercent: -7,
    ease: 'none',
    scrollTrigger: { trigger: heroWrap, start: 'top top', end: () => `+=${Math.round(window.innerHeight * 1.0)}`, scrub: true },
  });

  // the whole page turns over between sections
  const started = performance.now();
  $$('[data-tone]').forEach((section) => {
    const tone = section.dataset.tone === 'b' ? 1 : 0;
    ScrollTrigger.create({
      trigger: section,
      start: 'top 58%',
      end: section.id === 'close' ? 'max' : 'bottom 58%',
      onToggle: (self) => {
        if (!self.isActive) return;
        want.tone = tone;
        const instant = performance.now() - started < 900;
        request(want.shade, tone, self.direction >= 0 ? [0.5, -0.25] : [0.5, 1.25], instant);
      },
    });
  });

  // the shade dock arrives once the hero has gone
  ScrollTrigger.create({
    trigger: '#studio',
    start: 'top 80%',
    onEnter: () => dock.classList.add('is-on'),
    onLeaveBack: () => {
      dock.classList.remove('is-on');
      setDock(false);
    },
  });

  // a sheen of light crosses the headline
  gsap.fromTo('.studio__h', { '--sheen': 0 }, { '--sheen': 100, ease: 'none', scrollTrigger: { trigger: '.studio__h', start: 'top 85%', end: 'bottom 25%', scrub: 0.4 } });

  const statement = $('[data-statement]');
  if (statement) {
    SplitText.create(statement, {
      type: 'words',
      onSplit(self: { words: Element[] }) {
        return gsap.fromTo(
          self.words,
          { opacity: 0.2 },
          { opacity: 1, ease: 'none', stagger: 0.12, scrollTrigger: { trigger: statement, start: 'top 82%', end: 'bottom 52%', scrub: 0.5 } },
        );
      },
    });
  }

  // how we work
  const stepNo = $('[data-how-no]');
  $$('[data-step]').forEach((el, i) => {
    ScrollTrigger.create({
      trigger: el,
      start: 'top 62%',
      end: 'bottom 62%',
      onToggle: (self) => {
        el.classList.toggle('is-on', self.isActive);
        if (self.isActive && stepNo) {
          gsap.fromTo(stepNo, { yPercent: 40, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.6, ease: 'power3.out' });
          stepNo.textContent = pad(i + 1);
        }
      },
    });
  });
} else {
  dock.classList.add('is-on');
}

// ───────────────────────── shade library ─────────────────────────
const library = $('.library')!;
const track = $('.library__track')!;
if (!reducedMotion) {
  const mm = gsap.matchMedia();
  mm.add('(min-width: 900px) and (hover: hover) and (pointer: fine)', () => {
    library.classList.add('is-pinned');
    const distance = () => Math.max(0, track.scrollWidth - window.innerWidth);
    const size = () => {
      library.style.height = `${window.innerHeight + distance()}px`;
    };
    size();
    ScrollTrigger.addEventListener('refreshInit', size);
    const tween = gsap.to(track, {
      x: () => -distance(),
      ease: 'none',
      scrollTrigger: { trigger: library, start: 'top top', end: 'bottom bottom', scrub: 0.8, invalidateOnRefresh: true },
    });
    return () => {
      ScrollTrigger.removeEventListener('refreshInit', size);
      tween.scrollTrigger?.kill();
      tween.kill();
      library.classList.remove('is-pinned');
      library.style.height = '';
      gsap.set(track, { clearProps: 'transform' });
    };
  });
}
// a glint that follows the pointer across each swatch
if (finePointer) {
  $$<HTMLElement>('.swatch__shape').forEach((shape) => {
    shape.addEventListener('pointermove', (event) => {
      const r = shape.getBoundingClientRect();
      shape.style.setProperty('--mx', `${(((event.clientX - r.left) / r.width) * 100).toFixed(1)}%`);
      shape.style.setProperty('--my', `${(((event.clientY - r.top) / r.height) * 100).toFixed(1)}%`);
    });
  });
}

// ───────────────────────── menu: expand and sort with Flip ─────────────────────────
const list = $('[data-menu]')!;
const rows = $$('.svc', list);
const original = [...rows];

function toggleRow(row: HTMLElement) {
  const willOpen = !row.classList.contains('is-open');
  const state = reducedMotion ? null : Flip.getState(rows);
  rows.forEach((r) => {
    const open = r === row && willOpen;
    r.classList.toggle('is-open', open);
    $('.svc__head', r)!.setAttribute('aria-expanded', String(open));
    ($('.svc__body', r) as HTMLElement).hidden = !open;
  });
  if (state) {
    Flip.from(state, { duration: 0.85, ease: 'expo.inOut', scale: false, absolute: false, overwrite: true });
    if (willOpen) {
      const body = $('.svc__body', row)!;
      gsap.fromTo($$('.svc__label, .svc__list li, .svc__good, .btn', body), { y: 18, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.8, stagger: 0.05, delay: 0.22, ease: 'power3.out' });
    }
  }
}
rows.forEach((row) => $('.svc__head', row)!.addEventListener('click', () => toggleRow(row)));

$$<HTMLButtonElement>('[data-sort]').forEach((chip) => {
  chip.addEventListener('click', () => {
    if (chip.getAttribute('aria-pressed') === 'true') return;
    $$<HTMLButtonElement>('[data-sort]').forEach((c) => c.setAttribute('aria-pressed', String(c === chip)));
    const mode = chip.dataset.sort;
    const state = reducedMotion ? null : Flip.getState(rows);
    const order =
      mode === 'time'
        ? [...rows].sort((a, b) => Number(a.dataset.minutes) - Number(b.dataset.minutes) || original.indexOf(a) - original.indexOf(b))
        : mode === 'price'
          ? [...rows].sort((a, b) => Number(a.dataset.price) - Number(b.dataset.price) || original.indexOf(a) - original.indexOf(b))
          : original;
    order.forEach((r) => list.append(r));
    if (state) Flip.from(state, { duration: 1, ease: 'expo.inOut', scale: false, stagger: 0.04, overwrite: true });
  });
});

// ───────────────────────── visit: open or closed, in Waterloo time ─────────────────────────
function hourText(h: number) {
  const suffix = h >= 12 ? 'pm' : 'am';
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12} ${suffix}`;
}
function updateStatus() {
  const el = $('[data-open-status]');
  if (!el) return;
  const names = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Toronto', weekday: 'short', hour: 'numeric', minute: 'numeric', hourCycle: 'h23' }).formatToParts(new Date());
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? '';
  const dow = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(get('weekday'));
  const minutes = Number(get('hour')) * 60 + Number(get('minute'));
  const today = hours[dow];
  let text = '';
  if (today && minutes >= today[0] * 60 && minutes < today[1] * 60) {
    text = `Open now, until ${hourText(today[1])}.`;
  } else if (today && minutes < today[0] * 60) {
    text = `Closed right now. Opens today at ${hourText(today[0])}.`;
  } else {
    for (let i = 1; i <= 7; i++) {
      const d = (dow + i) % 7;
      const h = hours[d];
      if (h) {
        text = `Closed right now. Opens ${i === 1 ? 'tomorrow' : names[d]} at ${hourText(h[0])}.`;
        break;
      }
    }
  }
  el.textContent = text;
  const rowIndex = [5, 0, 1, 1, 2, 3, 4][dow];
  $$('.hours__row')[rowIndex]?.setAttribute('aria-current', 'date');
}
updateStatus();

// ───────────────────────── small details ─────────────────────────
if (!reducedMotion && finePointer) {
  $$('.btn--lg, .hero__cta .btn, .actions__book').forEach((el) => magnetic(el, 0.25));
}
void PHONE_DISPLAY;
void lenis;
void world;
void setRecede;
document.fonts?.ready.then(() => ScrollTrigger.refresh());
