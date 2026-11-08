/**
 * The ordinary, useful parts: today's delivery cut-off, whether the studio is open, the order and
 * enquiry forms (which never send anything), the phone menu and the header's tone.
 */
import { gsap, reducedMotion } from '../_kit/motion';

const $ = <T extends Element>(selector: string, scope: ParentNode = document) => scope.querySelector<T>(selector);
const $$ = <T extends Element>(selector: string, scope: ParentNode = document) => Array.from(scope.querySelectorAll<T>(selector));

/* ---------- Hamilton time ---------- */

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function hamiltonNow() {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Toronto',
    weekday: 'short',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hourCycle: 'h23',
  }).formatToParts(new Date());
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? '0';
  const day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(get('weekday'));
  return {
    day,
    minutes: (Number(get('hour')) % 24) * 60 + Number(get('minute')),
    year: Number(get('year')),
    month: Number(get('month')),
    date: Number(get('day')),
  };
}

const CUTOFF = 13 * 60;

function span(mins: number) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h && m) return `${h} h ${m} min`;
  return h ? `${h} h` : `${m} min`;
}

function clock(mins: number) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  const hour = h % 12 || 12;
  return `${hour}${m ? `:${String(m).padStart(2, '0')}` : ''} ${h < 12 ? 'a.m.' : 'p.m.'}`;
}

/** The next day flowers can go out, as a Date in local terms plus a friendly name. */
function nextDelivery(now: ReturnType<typeof hamiltonNow>) {
  let offset = 0;
  if (now.day === 0) offset = 1;
  else if (now.minutes >= CUTOFF) offset = now.day === 6 ? 2 : 1;
  const d = new Date(Date.UTC(now.year, now.month - 1, now.date + offset));
  return { date: d, offset, day: d.getUTCDay() };
}

const iso = (d: Date) => d.toISOString().slice(0, 10);

function updateCutoff() {
  const now = hamiltonNow();
  const next = nextDelivery(now);
  let short = '';
  let long = '';
  const open = now.day !== 0 && now.minutes < CUTOFF;
  if (open) {
    const left = span(CUTOFF - now.minutes);
    short = `Order in the next ${left} for delivery today.`;
    long = `Order in the next <b>${left}</b> for delivery today.`;
  } else {
    const when = next.offset === 1 ? 'tomorrow' : `on ${DAYS[next.day]}`;
    const lead = now.day === 0 ? 'We do not deliver on Sundays.' : 'Today’s cut-off has passed.';
    short = `${lead} Order now for delivery ${when}.`;
    long = `${lead} Order now for delivery <b>${when}</b>.`;
  }
  $$<HTMLElement>('[data-cutoff="short"]').forEach((el) => (el.textContent = short));
  $$<HTMLElement>('[data-cutoff="long"]').forEach((el) => (el.innerHTML = long));
  $$<HTMLElement>('.pulse').forEach((el) => el.classList.toggle('is-closed', !open));

  const date = $<HTMLInputElement>('#o-date');
  if (date) {
    const today = new Date(Date.UTC(now.year, now.month - 1, now.date));
    date.min = iso(today);
    if (!date.value) date.value = iso(next.date);
  }
}

/* ---------- open now ---------- */

const HOURS: Array<[number, number] | null> = [
  [11 * 60, 15 * 60], // Sunday
  null, // Monday: consultations by appointment
  [10 * 60, 18 * 60],
  [10 * 60, 18 * 60],
  [10 * 60, 18 * 60],
  [10 * 60, 18 * 60],
  [9 * 60, 17 * 60], // Saturday
];

function updateOpen() {
  const el = $<HTMLElement>('#open-now');
  if (!el) return;
  const now = hamiltonNow();
  const today = HOURS[now.day];
  let text = '';
  let isOpen = false;
  if (today && now.minutes >= today[0] && now.minutes < today[1]) {
    isOpen = true;
    text = `Open now, until ${clock(today[1])}`;
  } else {
    for (let i = 0; i < 7; i++) {
      const day = (now.day + i) % 7;
      const h = HOURS[day];
      if (!h) continue;
      if (i === 0 && now.minutes >= h[0]) continue;
      const when = i === 0 ? 'today' : i === 1 ? 'tomorrow' : DAYS[day];
      text = `Closed now. Opens ${when} at ${clock(h[0])}`;
      break;
    }
  }
  el.textContent = text;
  el.style.setProperty('--dot', isOpen ? '#9fd27a' : 'rgb(244 238 227 / 0.5)');
  el.hidden = false;
  const rows = $$<HTMLElement>('.hours > div');
  const row = now.day === 1 ? 0 : now.day === 6 ? 2 : now.day === 0 ? 3 : 1;
  rows.forEach((r, i) => r.classList.toggle('is-today', i === row));
}

/* ---------- the workshop that is booking now ---------- */

function updateSeason() {
  const now = hamiltonNow();
  const m = now.month;
  const season = (m === 11 && now.date >= 15) || m === 12 ? 'winter' : m <= 5 ? 'spring' : m <= 8 ? 'summer' : 'autumn';
  $$<HTMLElement>('.ws').forEach((ws) => {
    const on = ws.dataset.season === season;
    ws.classList.toggle('is-now', on);
    const badge = $<HTMLElement>('.ws-now', ws);
    if (badge) badge.hidden = !on;
  });
  // What is in the buckets this month (calendar seasons, not workshop booking windows).
  const stems = m === 12 || m <= 2 ? 'winter' : m <= 5 ? 'spring' : m <= 8 ? 'summer' : 'autumn';
  $$<HTMLElement>('.season-row').forEach((row) => {
    const on = row.dataset.stemSeason === stems;
    row.classList.toggle('is-now', on);
    const badge = $<HTMLElement>('.season-now', row);
    if (badge) badge.hidden = !on;
  });
}

/* ---------- forms that never send ---------- */

function reveal(el: HTMLElement) {
  if (!reducedMotion) gsap.fromTo(el, { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.7, ease: 'power3.out', clearProps: 'all' });
}

function orderForm() {
  const form = $<HTMLFormElement>('#order-form');
  const done = $<HTMLElement>('#order-done');
  const summary = $<HTMLElement>('#order-summary');
  const card = $<HTMLTextAreaElement>('#o-card');
  const count = $<HTMLElement>('#o-card-count');
  if (!form || !done || !summary) return;
  const updateCount = () => {
    if (card && count) {
      const left = 200 - card.value.length;
      count.textContent = `${left} character${left === 1 ? '' : 's'} left`;
    }
  };
  card?.addEventListener('input', updateCount);
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const size = form.querySelector<HTMLInputElement>('input[name="size"]:checked');
    const sizeName = size?.closest('.size')?.querySelector('b')?.textContent ?? 'Classic';
    const price = size?.closest('.size')?.querySelector('.size-price')?.textContent ?? '';
    const dateValue = String(data.get('date') ?? '');
    let when = 'the next delivery day';
    if (dateValue) {
      const d = new Date(`${dateValue}T12:00:00Z`);
      when = `${DAYS[d.getUTCDay()]}, ${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}`;
    }
    const zone = String(data.get('zone') ?? '');
    const hasCard = String(data.get('card') ?? '').trim().length > 0;
    summary.textContent = `a ${sizeName} bouquet (${price}) for ${when}, ${zone === 'Pickup' ? 'picked up at the studio' : `delivered in ${zone}`}, ${hasCard ? 'with your card message' : 'with a blank card'}`;
    form.hidden = true;
    done.hidden = false;
    reveal(done);
    done.focus({ preventScroll: true });
  });
  $('#order-again')?.addEventListener('click', () => {
    form.reset();
    updateCutoff();
    updateCount();
    done.hidden = true;
    form.hidden = false;
    form.querySelector<HTMLInputElement>('input:checked')?.focus({ preventScroll: true });
  });
}

function enquireForm() {
  const form = $<HTMLFormElement>('#enquire-form');
  const done = $<HTMLElement>('#enquire-done');
  const error = $<HTMLElement>('#e-error');
  if (!form || !done || !error) return;
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const name = $<HTMLInputElement>('#e-name')!;
    const email = $<HTMLInputElement>('#e-email')!;
    const problems: string[] = [];
    if (!name.value.trim()) problems.push('your name');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) problems.push('an email address we can reply to');
    name.setAttribute('aria-invalid', String(!name.value.trim()));
    email.setAttribute('aria-invalid', String(problems.some((p) => p.startsWith('an email'))));
    if (problems.length) {
      error.textContent = `Please add ${problems.join(' and ')}.`;
      error.hidden = false;
      (name.value.trim() ? email : name).focus();
      return;
    }
    error.hidden = true;
    form.hidden = true;
    done.hidden = false;
    reveal(done);
    done.focus({ preventScroll: true });
  });
  $('#enquire-again')?.addEventListener('click', () => {
    form.reset();
    done.hidden = true;
    form.hidden = false;
    $<HTMLInputElement>('#e-name')?.focus({ preventScroll: true });
  });
  // "Start a wedding enquiry" and friends choose the topic for you.
  $$<HTMLAnchorElement>('a[data-topic]').forEach((a) =>
    a.addEventListener('click', () => {
      const select = $<HTMLSelectElement>('#e-topic');
      if (select) select.value = a.dataset.topic ?? select.value;
      if (!done.hidden) {
        done.hidden = true;
        form.hidden = false;
      }
    }),
  );
}

/* ---------- header ---------- */

function header() {
  const top = $<HTMLElement>('.top');
  const btn = $<HTMLButtonElement>('#menu-btn');
  if (!top || !btn) return;
  btn.hidden = false;
  const setMenu = (open: boolean) => {
    top.classList.toggle('menu-open', open);
    btn.setAttribute('aria-expanded', String(open));
    btn.textContent = open ? 'Close' : 'Menu';
  };
  btn.addEventListener('click', () => setMenu(!top.classList.contains('menu-open')));
  $$('.nav a').forEach((a) => a.addEventListener('click', () => setMenu(false)));
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && top.classList.contains('menu-open')) {
      setMenu(false);
      btn.focus();
    }
  });

  const papers = $$<HTMLElement>('.paper');
  let ticking = false;
  const tone = () => {
    ticking = false;
    const y = 40;
    top.classList.toggle('is-solid', window.scrollY > innerHeight * 0.6);
    const onPaper = papers.some((p) => {
      const r = p.getBoundingClientRect();
      return r.top <= y && r.bottom > y;
    });
    top.classList.toggle('on-paper', onPaper);
  };
  window.addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(tone);
      }
    },
    { passive: true },
  );
  tone();
}

export function initSite() {
  updateCutoff();
  updateOpen();
  updateSeason();
  setInterval(() => {
    updateCutoff();
    updateOpen();
  }, 30000);
  orderForm();
  enquireForm();
  header();
}
