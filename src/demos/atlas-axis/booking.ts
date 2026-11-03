/**
 * The booking flow: area, then day, then time. It never sends anything, and ends by
 * saying so.
 */
import { gsap, lenis, reducedMotion } from '../_kit/motion';

// Opening hours as minutes from midnight, by weekday (0 is Sunday). null means closed.
export const HOURS: ([number, number] | null)[] = [
  null,
  [8 * 60, 19 * 60],
  [8 * 60, 19 * 60],
  [8 * 60, 18 * 60],
  [8 * 60, 19 * 60],
  [8 * 60, 16 * 60],
  [9 * 60, 13 * 60],
];

export const formatTime = (minutes: number) => {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  const hour = h % 12 === 0 ? 12 : h % 12;
  return `${hour}${m ? `:${String(m).padStart(2, '0')}` : ':00'} ${h < 12 ? 'am' : 'pm'}`;
};

type Pane = 'area' | 'day' | 'time' | 'done';
const order: Pane[] = ['area', 'day', 'time', 'done'];

export function initBooking() {
  const dialog = document.getElementById('book-dialog') as HTMLDialogElement | null;
  if (!dialog || typeof dialog.showModal !== 'function') return;

  const panes = Object.fromEntries(
    order.map((name) => [name, dialog.querySelector<HTMLElement>(`[data-pane="${name}"]`)!]),
  ) as Record<Pane, HTMLElement>;
  const stepLabel = dialog.querySelector<HTMLElement>('#book-step')!;
  const back = dialog.querySelector<HTMLButtonElement>('[data-back]')!;
  const dayBox = dialog.querySelector<HTMLElement>('#day-choices')!;
  const timeBox = dialog.querySelector<HTMLElement>('#time-choices')!;
  const summary = dialog.querySelector<HTMLElement>('#done-summary')!;
  const state: { area?: string; areaLabel?: string; day?: Date; time?: number } = {};
  let index = 0;
  let timer = 0;

  const fmtDay = new Intl.DateTimeFormat('en-CA', { weekday: 'long', month: 'long', day: 'numeric' });
  const fmtShort = new Intl.DateTimeFormat('en-CA', { weekday: 'short' });
  const fmtDate = new Intl.DateTimeFormat('en-CA', { month: 'short', day: 'numeric' });

  const buildDays = () => {
    dayBox.textContent = '';
    const day = new Date();
    day.setHours(12, 0, 0, 0);
    let added = 0;
    while (added < 6) {
      day.setDate(day.getDate() + 1);
      if (!HOURS[day.getDay()]) continue;
      const value = new Date(day);
      const label = document.createElement('label');
      label.className = 'choice';
      const input = document.createElement('input');
      input.type = 'radio';
      input.name = 'day';
      input.value = value.toISOString();
      const span = document.createElement('span');
      span.innerHTML = `${fmtShort.format(value)}<small>${fmtDate.format(value)}</small>`;
      label.append(input, span);
      dayBox.append(label);
      added += 1;
    }
  };

  const buildTimes = (date: Date) => {
    timeBox.textContent = '';
    const hours = HOURS[date.getDay()];
    if (!hours) return;
    for (let t = hours[0]; t + 60 <= hours[1]; t += 75) {
      const label = document.createElement('label');
      label.className = 'choice';
      const input = document.createElement('input');
      input.type = 'radio';
      input.name = 'time';
      input.value = String(t);
      const span = document.createElement('span');
      span.textContent = formatTime(t);
      label.append(input, span);
      timeBox.append(label);
    }
  };

  const show = (next: number, focus = true) => {
    const from = panes[order[index]];
    const to = panes[order[next]];
    const forward = next >= index;
    index = next;
    from.hidden = true;
    to.hidden = false;
    stepLabel.textContent = next < 3 ? `Step ${next + 1} of 3` : 'Done';
    back.hidden = next === 0 || next === 3;
    if (!reducedMotion) {
      gsap.killTweensOf(to);
      gsap.fromTo(to, { autoAlpha: 0, x: forward ? 36 : -36 }, { autoAlpha: 1, x: 0, duration: 0.7, ease: 'expo.out', clearProps: 'all' });
      const items = to.querySelectorAll('.choice, .done-kicker, .done-title, .done-summary, .done-text, .done-actions');
      gsap.fromTo(items, { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.04, ease: 'expo.out', clearProps: 'all', delay: 0.05 });
    }
    if (focus) {
      requestAnimationFrame(() => {
        const target = (to.querySelector('input:checked') ?? to.querySelector('input') ?? to) as HTMLElement;
        target.focus({ preventScroll: true });
      });
    }
  };

  const reset = () => {
    window.clearTimeout(timer);
    for (const key of Object.keys(state)) delete (state as Record<string, unknown>)[key];
    dialog.querySelectorAll<HTMLInputElement>('input').forEach((input) => (input.checked = false));
    buildDays();
    order.forEach((name) => (panes[name].hidden = name !== 'area'));
    index = 0;
    stepLabel.textContent = 'Step 1 of 3';
    back.hidden = true;
  };

  const open = (area?: string) => {
    reset();
    dialog.showModal();
    lenis?.stop();
    if (reducedMotion) dialog.style.removeProperty('transform');
    else gsap.fromTo(dialog, { y: 40, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.8, ease: 'expo.out', clearProps: 'all' });
    if (area) {
      const input = dialog.querySelector<HTMLInputElement>(`input[name="area"][value="${area}"]`);
      if (input) {
        input.checked = true;
        state.area = area;
        state.areaLabel = input.dataset.label;
        show(1);
        return;
      }
    }
    requestAnimationFrame(() => dialog.querySelector<HTMLInputElement>('input[name="area"]')?.focus({ preventScroll: true }));
  };

  const advance = (to: number) => {
    window.clearTimeout(timer);
    timer = window.setTimeout(() => show(to), reducedMotion ? 0 : 260);
  };

  dialog.addEventListener('change', (event) => {
    const input = event.target as HTMLInputElement;
    if (input.name === 'area') {
      state.area = input.value;
      state.areaLabel = input.dataset.label;
      advance(1);
    } else if (input.name === 'day') {
      state.day = new Date(input.value);
      buildTimes(state.day);
      advance(2);
    } else if (input.name === 'time') {
      state.time = Number(input.value);
      const when = state.day ? fmtDay.format(state.day) : '';
      summary.textContent = `${state.areaLabel}, ${when}, ${formatTime(state.time)}`;
      advance(3);
    }
  });

  // Going Back keeps the earlier choice, and picking it again fires no change event,
  // so with no Continue button the visitor would be stuck. A new choice is not in state
  // yet when its click fires, so this only catches the repeated one.
  const advanceIfUnchanged = (input: HTMLInputElement) => {
    if (input.name === 'area' && state.area === input.value) advance(1);
    else if (input.name === 'day' && state.day?.toISOString() === input.value) advance(2);
    else if (input.name === 'time' && state.time === Number(input.value)) advance(3);
  };
  dialog.addEventListener('keydown', (event) => {
    const input = event.target as HTMLInputElement;
    if (event.key === 'Enter' && input.type === 'radio') {
      event.preventDefault();
      advanceIfUnchanged(input);
    }
  });

  back.addEventListener('click', () => show(Math.max(0, index - 1)));
  dialog.addEventListener('click', (event) => {
    const target = event.target as HTMLElement;
    if (target instanceof HTMLInputElement && target.type === 'radio') advanceIfUnchanged(target);
    if (target === dialog || target.closest('[data-close]')) dialog.close();
    if (target.closest('[data-restart]')) {
      reset();
      show(0);
      panes.area.hidden = false;
    }
  });
  dialog.addEventListener('close', () => lenis?.start());
  dialog.addEventListener('cancel', () => lenis?.start());

  document.addEventListener('click', (event) => {
    const trigger = (event.target as Element).closest<HTMLElement>('[data-book]');
    if (!trigger) return;
    event.preventDefault();
    open(trigger.dataset.area);
  });
}
