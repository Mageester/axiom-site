/**
 * The booking flow: service, day, time, then a name and number. It runs in a native
 * <dialog> so focus is trapped and Escape works for free. Nothing is ever sent anywhere.
 */
import { gsap, lenis, reducedMotion } from '../_kit/motion';
import { services, hours, type Service } from './data';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const WEEKDAYS_LONG = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONTHS_LONG = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const money = (n: number) => `$${n}`;
const length = (m: number) => {
  if (m < 60) return `${m} min`;
  const h = Math.floor(m / 60);
  const r = m % 60;
  return r ? `${h} h ${r}` : `${h} h`;
};
const clock = (minutes: number) => {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  const suffix = h >= 12 ? 'pm' : 'am';
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${String(m).padStart(2, '0')} ${suffix}`;
};
const hash = (text: string) => {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) / 4294967295;
};

type Panes = 'service' | 'day' | 'time' | 'confirm' | 'done';
const ORDER: Panes[] = ['service', 'day', 'time', 'confirm'];

export function initBooking() {
  const dialog = document.querySelector<HTMLDialogElement>('#book');
  if (!dialog || typeof dialog.showModal !== 'function') return { open: () => {} };

  const stepLabel = dialog.querySelector<HTMLElement>('[data-book-step]')!;
  const progress = dialog.querySelector<HTMLElement>('[data-book-progress]')!;
  const back = dialog.querySelector<HTMLButtonElement>('[data-book-back]')!;
  const panes = Object.fromEntries([...dialog.querySelectorAll<HTMLElement>('[data-pane]')].map((p) => [p.dataset.pane!, p])) as Record<Panes, HTMLElement>;
  const daysEl = dialog.querySelector<HTMLElement>('[data-days]')!;
  const timesEl = dialog.querySelector<HTMLElement>('[data-times]')!;
  const form = dialog.querySelector<HTMLFormElement>('[data-book-form]')!;
  const errorEl = dialog.querySelector<HTMLElement>('[data-book-error]')!;

  const choice: { service: Service | null; date: Date | null; minutes: number | null } = { service: null, date: null, minutes: null };
  let current: Panes = 'service';
  let origin = { x: window.innerWidth - 60, y: 40 };

  const summaryService = () => (choice.service ? `${choice.service.name}. ${length(choice.service.minutes)}, ${choice.service.from ? 'from ' : ''}${money(choice.service.price)}.` : '');
  const dayText = (d: Date) => `${WEEKDAYS_LONG[d.getDay()]}, ${MONTHS_LONG[d.getMonth()]} ${d.getDate()}`;

  function show(next: Panes, animate = true) {
    current = next;
    for (const key of Object.keys(panes) as Panes[]) panes[key].hidden = key !== next;
    const idx = ORDER.indexOf(next);
    if (next === 'done') {
      stepLabel.textContent = 'All done';
      progress.style.transform = 'scaleX(1)';
      back.hidden = true;
    } else {
      const labels = ['Step 1 of 3', 'Step 2 of 3', 'Step 3 of 3', 'Last step'];
      stepLabel.textContent = labels[idx];
      progress.style.transform = `scaleX(${(idx + 1) / 4})`;
      back.hidden = idx === 0;
    }
    const heading = panes[next].querySelector<HTMLElement>('.pane__h');
    if (heading) {
      heading.tabIndex = -1;
      heading.focus({ preventScroll: true });
    }
    panes[next].parentElement!.scrollTop = 0;
    if (animate && !reducedMotion) {
      gsap.fromTo(panes[next].children, { y: 26, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.8, stagger: 0.07, ease: 'expo.out', overwrite: true });
      const items = panes[next].querySelectorAll('.pick li, .day, .time');
      if (items.length) gsap.fromTo(items, { y: 14, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.6, stagger: { each: 0.025, from: 'start' }, delay: 0.15, ease: 'power3.out', overwrite: 'auto' });
    }
  }

  function buildDays() {
    daysEl.textContent = '';
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    for (let i = 0; i < 14; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      const window_ = hours[d.getDay()];
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'day';
      button.disabled = !window_;
      button.innerHTML = `<span class="day__w">${i === 0 ? 'Today' : WEEKDAYS[d.getDay()]}</span><span class="day__n">${d.getDate()}</span><span class="day__m">${window_ ? MONTHS[d.getMonth()] : 'Closed'}</span>`;
      button.setAttribute('aria-label', `${dayText(d)}${window_ ? '' : ', closed'}`);
      button.addEventListener('click', () => {
        choice.date = d;
        choice.minutes = null;
        buildTimes();
        show('time');
      });
      daysEl.append(button);
    }
  }

  function buildTimes() {
    timesEl.textContent = '';
    const d = choice.date!;
    const window_ = hours[d.getDay()]!;
    const duration = choice.service!.minutes;
    const open = window_[0] * 60;
    const close = window_[1] * 60;
    const now = new Date();
    const isToday = d.toDateString() === now.toDateString();
    const nowMinutes = now.getHours() * 60 + now.getMinutes() + 60;
    panes.time.querySelector('[data-book-summary-day]')!.textContent = `${dayText(d)}. ${choice.service!.name} takes ${length(duration)}.`;
    let count = 0;
    for (let m = open; m + duration <= close; m += 30) {
      if (isToday && m < nowMinutes) continue;
      const taken = hash(`${d.toDateString()}-${m}-${choice.service!.id}`) < 0.3;
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'time';
      button.textContent = clock(m);
      button.disabled = taken;
      if (taken) button.setAttribute('aria-label', `${clock(m)}, taken`);
      button.addEventListener('click', () => {
        choice.minutes = m;
        panes.confirm.querySelector('[data-book-summary]')!.textContent = `${choice.service!.name}, ${dayText(d)} at ${clock(m)}.`;
        errorEl.textContent = '';
        show('confirm');
      });
      timesEl.append(button);
      count += 1;
    }
    if (!count) {
      const p = document.createElement('p');
      p.className = 'times__none';
      p.textContent = 'No start times left on this day. Pick another day, or call us.';
      timesEl.append(p);
    }
  }

  function reset() {
    choice.service = null;
    choice.date = null;
    choice.minutes = null;
    form.reset();
    errorEl.textContent = '';
  }

  // choosing a service
  dialog.querySelectorAll<HTMLButtonElement>('[data-pick-service]').forEach((button) => {
    button.addEventListener('click', () => {
      choice.service = services.find((s) => s.id === button.dataset.pickService) ?? null;
      choice.date = null;
      panes.day.querySelector('[data-book-summary-service]')!.textContent = summaryService();
      buildDays();
      show('day');
    });
  });

  back.addEventListener('click', () => {
    const idx = ORDER.indexOf(current);
    if (idx > 0) show(ORDER[idx - 1]);
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const name = String(data.get('name') ?? '').trim();
    const phone = String(data.get('phone') ?? '').trim();
    if (!name) {
      errorEl.textContent = 'Add your name so we know who to expect.';
      form.querySelector<HTMLInputElement>('input[name="name"]')!.focus();
      return;
    }
    if (phone.replace(/\D/g, '').length < 7) {
      errorEl.textContent = 'Add a phone number we could text.';
      form.querySelector<HTMLInputElement>('input[name="phone"]')!.focus();
      return;
    }
    errorEl.textContent = '';
    dialog.querySelector('[data-book-done]')!.textContent = `${name}, this is the request you made: ${choice.service!.name}, ${dayText(choice.date!)} at ${clock(choice.minutes!)}.`;
    show('done');
  });

  dialog.querySelector('[data-book-again]')?.addEventListener('click', () => {
    reset();
    show('service');
  });

  // opening and closing
  let opener: HTMLElement | null = null;
  function open(serviceId?: string, from?: HTMLElement | null) {
    if (dialog!.open) return;
    opener = from ?? (document.activeElement as HTMLElement | null);
    if (from) {
      const r = from.getBoundingClientRect();
      origin = { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    } else {
      origin = { x: window.innerWidth - 60, y: 40 };
    }
    reset();
    lenis?.stop();
    dialog!.showModal();
    if (serviceId) {
      choice.service = services.find((s) => s.id === serviceId) ?? null;
      if (choice.service) {
        panes.day.querySelector('[data-book-summary-service]')!.textContent = summaryService();
        buildDays();
        show('day', false);
      }
    } else {
      show('service', false);
    }
    if (!reducedMotion) {
      const reach = Math.hypot(window.innerWidth, window.innerHeight) + 100;
      gsap.fromTo(
        dialog,
        { clipPath: `circle(0px at ${origin.x}px ${origin.y}px)` },
        { clipPath: `circle(${reach}px at ${origin.x}px ${origin.y}px)`, duration: 0.95, ease: 'power3.inOut', clearProps: 'clipPath' },
      );
      gsap.fromTo(
        dialog!.querySelectorAll('.book__bar, .book__progress, .pane:not([hidden]) > *'),
        { y: 30, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.9, stagger: 0.06, delay: 0.3, ease: 'expo.out' },
      );
    }
  }

  let closing = false;
  function close() {
    if (closing || !dialog!.open) return;
    const done = () => {
      closing = false;
      dialog!.close();
      lenis?.start();
      gsap.set(dialog, { clearProps: 'clipPath' });
      opener?.focus({ preventScroll: true });
    };
    if (reducedMotion) {
      done();
      return;
    }
    closing = true;
    gsap.to(dialog, {
      clipPath: `circle(0px at ${origin.x}px ${origin.y}px)`,
      duration: 0.7,
      ease: 'power3.inOut',
      onComplete: done,
    });
  }

  dialog.addEventListener('cancel', (event) => {
    event.preventDefault();
    close();
  });
  dialog.querySelectorAll('[data-book-close]').forEach((b) => b.addEventListener('click', close));
  // a click on the backdrop (outside the sheet) closes it too
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) close();
  });

  return { open };
}
