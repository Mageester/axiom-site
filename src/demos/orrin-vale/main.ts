import { gsap, initMotion, magnetic, reducedMotion, finePointer } from '../_kit/motion';
import { createRing, type RingView, type Sparkle } from './ring';
import { FRAMING, FRAMING_NARROW, START_YAW } from './scene';
import { describe, metalByKey, stoneByKey, type MetalKey, type StoneKey } from './looks';

const $ = <T extends Element = HTMLElement>(selector: string, scope: ParentNode = document) => scope.querySelector<T>(selector)!;
const $$ = <T extends Element = HTMLElement>(selector: string, scope: ParentNode = document) => [...scope.querySelectorAll<T>(selector)];

initMotion();

/* ---------- The bar turns solid once the page moves ---------- */
const bar = $('.bar');
const onScroll = () => bar.classList.toggle('is-solid', window.scrollY > 24);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

$$('.btn, .bar-book').forEach((el) => magnetic(el, 0.18));

/* ---------- The ring ---------- */
const viewer = $('.viewer');
const stage = $('[data-stage]');
const canvas = $<HTMLCanvasElement>('#ring');
const turn = $('[data-turn]');
const hint = $('.turn-hint');
const announce = $('[data-announce]');
const narrow = matchMedia('(max-width: 899px)');
const checked = (name: string) => $<HTMLInputElement>(`input[name="${name}"]:checked`, viewer).value;

let ring: RingView | null = null;
if (!reducedMotion) {
  ring = createRing(canvas, {
    metal: checked('metal') as MetalKey,
    stone: checked('stone') as StoneKey,
    framing: narrow.matches ? FRAMING_NARROW : FRAMING,
    phone: matchMedia('(pointer: coarse)').matches || window.innerWidth < 700,
  });
}

if (ring) {
  const view = ring;
  requestAnimationFrame(() => requestAnimationFrame(() => stage.classList.add('is-live')));
  turn.hidden = false;
  hint.hidden = false;
  narrow.addEventListener('change', () => {
    view.framing = { ...(narrow.matches ? FRAMING_NARROW : FRAMING) };
    view.loop.invalidate();
  });
  if (import.meta.env.DEV) (window as unknown as { __ring: RingView }).__ring = view;

  // Glints where a facet throws a light straight back at you.
  const glints = $$('.glints i');
  view.onSparkles = (list: Sparkle[]) => {
    glints.forEach((el, i) => {
      const s = list[i];
      if (!s || s.strength < 0.02) {
        el.style.opacity = '0';
        return;
      }
      const size = 0.45 + s.strength * 0.9;
      el.style.opacity = Math.min(1, s.strength * 1.4).toFixed(3);
      el.style.transform = `translate3d(${s.x.toFixed(1)}px, ${s.y.toFixed(1)}px, 0) scale(${size.toFixed(3)}) rotate(${(i * 11).toFixed(0)}deg)`;
    });
  };

  // Drag or swipe to turn. Vertical swipes on a phone still scroll the page.
  let dragging = false;
  let pointer = -1;
  let lastX = 0;
  let lastY = 0;
  let lastT = 0;
  let velocity = 0;
  const perPixel = () => (Math.PI * 1.6) / Math.max(360, stage.clientWidth);
  const done = () => hint.classList.add('is-done');
  turn.addEventListener('pointerdown', (event) => {
    if (event.button !== 0) return;
    dragging = true;
    pointer = event.pointerId;
    lastX = event.clientX;
    lastY = event.clientY;
    lastT = performance.now();
    velocity = 0;
    view.hold();
    turn.setPointerCapture(event.pointerId);
    done();
  });
  turn.addEventListener('pointermove', (event) => {
    if (!dragging || event.pointerId !== pointer) return;
    const now = performance.now();
    const k = perPixel();
    const dx = (event.clientX - lastX) * k;
    const dy = event.pointerType === 'mouse' ? (event.clientY - lastY) * k * 0.4 : 0;
    view.nudge(dx, dy);
    const dt = Math.max(8, now - lastT) / 1000;
    velocity += (dx / dt - velocity) * 0.4;
    lastX = event.clientX;
    lastY = event.clientY;
    lastT = now;
  });
  const release = (event: PointerEvent) => {
    if (!dragging || event.pointerId !== pointer) return;
    dragging = false;
    view.release(performance.now() - lastT < 90 ? velocity : 0);
    syncSlider();
  };
  turn.addEventListener('pointerup', release);
  turn.addEventListener('pointercancel', release);

  // The same ring, by keyboard.
  const syncSlider = () => {
    const deg = Math.round(((((view.angle() - START_YAW) * 180) / Math.PI) % 360 + 360) % 360);
    turn.setAttribute('aria-valuenow', String(deg));
    turn.setAttribute('aria-valuetext', deg === 0 ? 'Facing you' : `Turned ${deg} degrees`);
  };
  turn.addEventListener('keydown', (event) => {
    const steps: Record<string, number> = { ArrowRight: 15, ArrowUp: 15, ArrowLeft: -15, ArrowDown: -15, PageUp: 45, PageDown: -45 };
    if (event.key in steps) {
      event.preventDefault();
      view.setAngle(view.angle() + (steps[event.key] * Math.PI) / 180);
    } else if (event.key === 'Home') {
      event.preventDefault();
      view.setAngle(START_YAW);
    } else return;
    done();
    syncSlider();
  });

  // Scrolling past turns it a little, as if you walked around it.
  let lastScroll = window.scrollY;
  window.addEventListener(
    'scroll',
    () => {
      const delta = window.scrollY - lastScroll;
      lastScroll = window.scrollY;
      if (window.scrollY < window.innerHeight * 1.2) view.nudge(delta * 0.0025);
    },
    { passive: true },
  );
}

/* Choosing a metal or stone changes the ring in place. */
viewer.addEventListener('change', (event) => {
  const input = event.target as HTMLInputElement;
  if (input.name === 'metal') ring?.setMetal(input.value as MetalKey);
  if (input.name === 'stone') ring?.setStone(input.value as StoneKey);
  announce.textContent = describe(metalByKey(checked('metal')), stoneByKey(checked('stone')));
});

/* ---------- Ring sizing ---------- */
const sizer = $('[data-sizer]');
const sizeInput = $<HTMLInputElement>('#sizer-mm');
const sizeBig = $('[data-size]', sizer);
const sizeSub = $('[data-size-sub]', sizer);
const sizeLabel = $('.size-label', sizer);
const sizeRing = $('[data-sizer-ring]', sizer);
const measureLabel = $('[data-measure-label]', sizer);
const measureHint = $('[data-measure-hint]', sizer);
const rows = $$<HTMLTableRowElement>('.size-table tbody tr');
const steppers = $$<HTMLButtonElement>('.mm-step', sizer);
const measureMode = () => $<HTMLInputElement>('input[name="measure"]:checked', sizer).value;

const fraction = (size: number) => {
  const q = Math.round(size * 4) / 4;
  const whole = Math.floor(q);
  const part = ['', '¼', '½', '¾'][Math.round((q - whole) * 4)];
  return `${whole}${part}`;
};

function updateSize() {
  const value = Number.parseFloat(sizeInput.value.replace(',', '.'));
  const diameter = measureMode() === 'ring' ? value : value / Math.PI;
  const size = (diameter - 11.63) / 0.8128;
  rows.forEach((row) => row.classList.remove('is-match'));
  if (!Number.isFinite(size) || size < 1 || size > 16) {
    sizeLabel.textContent = 'Check that number';
    sizeBig.textContent = '–';
    sizeSub.textContent = 'It looks outside the usual range of ring sizes. Measure again in millimetres.';
    return;
  }
  sizeLabel.textContent = 'About a size';
  sizeBig.textContent = fraction(size);
  sizeSub.textContent = `Canadian and US sizing. Inside diameter ${diameter.toFixed(1)} mm.`;
  sizeRing.setAttribute('r', String(Math.max(36, Math.min(88, 20 + diameter * 3.1)).toFixed(1)));
  const nearest = Math.round(size * 2) / 2;
  rows.forEach((row) => {
    const label = row.querySelector('th')?.textContent?.replace('½', '.5') ?? '';
    if (Number.parseFloat(label) === nearest) row.classList.add('is-match');
  });
}

sizer.addEventListener('input', updateSize);
sizer.addEventListener('change', (event) => {
  const input = event.target as HTMLInputElement;
  if (input.name !== 'measure') return;
  const value = Number.parseFloat(sizeInput.value) || 0;
  if (input.value === 'finger') {
    measureLabel.textContent = 'Around your finger, in millimetres';
    measureHint.textContent = 'Wrap a strip of paper around the base of your finger, mark where it meets, then measure the strip flat.';
    sizeInput.value = (value * Math.PI).toFixed(1);
  } else {
    measureLabel.textContent = 'Inside diameter, in millimetres';
    measureHint.textContent = 'Lay a ruler across the inside of the ring, edge to edge, at its widest.';
    sizeInput.value = (value / Math.PI).toFixed(1);
  }
  updateSize();
});
$('[data-sizer-form]').addEventListener('submit', (event) => event.preventDefault());
steppers.forEach((button) => {
  button.hidden = false;
  button.addEventListener('click', () => {
    const step = (measureMode() === 'ring' ? 0.1 : 0.5) * Number(button.dataset.step);
    const value = Number.parseFloat(sizeInput.value) || 0;
    sizeInput.value = Math.max(0, value + step).toFixed(1);
    updateSize();
  });
});
updateSize();

/* ---------- Appointment request: never sent ---------- */
const request = $<HTMLFormElement>('[data-request]');
const sent = $('[data-sent]');
const budget = $('[data-budget]', request);
const error = $('[data-form-error]', request);
const syncBudget = () => {
  const what = $<HTMLInputElement>('input[name="for"]:checked', request).value;
  budget.hidden = !(what === 'New ring' || what === 'Heirloom remake');
};
request.addEventListener('change', syncBudget);
syncBudget();

request.addEventListener('submit', (event) => {
  event.preventDefault();
  const data = new FormData(request);
  const name = String(data.get('name') ?? '').trim();
  const contact = String(data.get('contact') ?? '').trim();
  const nameInput = $<HTMLInputElement>('input[name="name"]', request);
  const contactInput = $<HTMLInputElement>('input[name="contact"]', request);
  nameInput.setAttribute('aria-invalid', String(!name));
  contactInput.setAttribute('aria-invalid', String(!contact));
  if (!name || !contact) {
    error.hidden = false;
    (name ? contactInput : nameInput).focus();
    return;
  }
  error.hidden = true;
  const what = String(data.get('for'));
  const times = data.getAll('when').map(String);
  const parts = [what];
  if (!budget.hidden) parts.push(`budget ${String(data.get('budget')).toLowerCase()}`);
  parts.push(times.length ? `${times.join(' or ')}` : 'any time that suits');
  $('[data-sent-summary]', sent).textContent = `${parts.join(', ')}. For ${name.split(' ')[0]}.`;
  request.hidden = true;
  sent.hidden = false;
  if (!reducedMotion) gsap.from(sent.children, { autoAlpha: 0, y: 18, stagger: 0.07, duration: 0.8, ease: 'expo.out' });
  sent.focus();
});
$('[data-sent-reset]', sent).addEventListener('click', () => {
  request.reset();
  syncBudget();
  sent.hidden = true;
  request.hidden = false;
  $<HTMLInputElement>('input[name="for"]', request).focus();
});

/* ---------- Timeline bars grow into place ---------- */
if (!reducedMotion) {
  $$('.gantt-row').forEach((row) => {
    const bars = $$('.gantt-bar, .gantt-extra', row);
    gsap.from(bars, {
      scaleX: 0,
      duration: 1.3,
      ease: 'expo.out',
      stagger: 0.15,
      scrollTrigger: { trigger: row, start: 'top 85%', once: true },
    });
  });
}

void finePointer;

/* ---------- The bench drawing draws itself ---------- */
if (!reducedMotion) {
  const lines = $$<SVGGeometryElement>('.plot polygon, .plot path');
  lines.forEach((el) => {
    el.setAttribute('pathLength', '1');
    el.style.strokeDasharray = '1';
    el.style.strokeDashoffset = '1';
  });
  gsap.to(lines, {
    strokeDashoffset: 0,
    duration: 1.4,
    ease: 'power2.inOut',
    stagger: { each: 0.012, from: 'start' },
    scrollTrigger: { trigger: '.plot', start: 'top 80%', once: true },
  });
}
