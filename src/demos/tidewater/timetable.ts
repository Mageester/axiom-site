/**
 * The timetable is plain HTML grouped by day, so it reads fine without JavaScript. With it,
 * two small filters (day and level) hide what does not apply. On a phone it opens on today.
 */
import { classById, days, timetable, timeLabel, type DayId } from './data';

const dayIds = days.map((d) => d.id);

/** Monday-first index of today, and minutes since midnight, in Waterloo. */
export function waterlooNow() {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Toronto',
    weekday: 'short',
    hour: 'numeric',
    minute: 'numeric',
    hourCycle: 'h23',
  }).formatToParts(new Date());
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? '';
  const sundayFirst = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(get('weekday').slice(0, 3));
  const day = (Math.max(0, sundayFirst) + 6) % 7;
  return { day, minutes: Number(get('hour')) * 60 + Number(get('minute')) };
}

export function nextClassText() {
  const now = waterlooNow();
  const toMin = (s: string) => {
    const [h, m] = s.split(':').map(Number);
    return h * 60 + m;
  };
  for (let offset = 0; offset < 8; offset++) {
    const d = (now.day + offset) % 7;
    const slots = timetable
      .filter((s) => s.day === dayIds[d])
      .filter((s) => offset > 0 || toMin(s.start) > now.minutes + 5)
      .sort((a, b) => toMin(a.start) - toMin(b.start));
    if (slots.length) {
      const s = slots[0];
      const when = offset === 0 ? 'today' : offset === 1 ? 'tomorrow' : days[d].name;
      return { name: classById[s.cls].name, when: `${when} at ${timeLabel(s.start)}` };
    }
  }
  return null;
}

export function initTimetable(onReserve: (label: string) => void) {
  const section = document.querySelector<HTMLElement>('#timetable');
  if (!section) return;
  const form = section.querySelector<HTMLFormElement>('[data-tt-filters]')!;
  const grid = section.querySelector<HTMLElement>('[data-tt-grid]')!;
  const status = section.querySelector<HTMLElement>('[data-tt-status]')!;
  const daySections = [...grid.querySelectorAll<HTMLElement>('[data-day]')];

  form.hidden = false;

  const phone = matchMedia('(max-width: 759px)').matches;
  if (phone) {
    const today = dayIds[waterlooNow().day];
    const radio = form.querySelector<HTMLInputElement>(`input[name="day"][value="${today}"]`);
    if (radio) radio.checked = true;
  }

  const fits = (slotLevel: string, want: string) => want === 'any' || slotLevel === 'all' || slotLevel === want;

  const apply = (announce: boolean) => {
    const day = (form.querySelector<HTMLInputElement>('input[name="day"]:checked')?.value ?? 'all') as DayId | 'all';
    const level = form.querySelector<HTMLInputElement>('input[name="level"]:checked')?.value ?? 'any';
    let shown = 0;
    for (const sec of daySections) {
      const onDay = day === 'all' || sec.dataset.day === day;
      sec.hidden = !onDay;
      let count = 0;
      sec.querySelectorAll<HTMLElement>('[data-level]').forEach((slot) => {
        const ok = fits(slot.dataset.level!, level);
        slot.hidden = !ok;
        if (ok) count += 1;
      });
      const none = sec.querySelector<HTMLElement>('[data-none]');
      if (none) none.hidden = count > 0;
      if (onDay) shown += count;
    }
    grid.classList.toggle('is-single', day !== 'all');
    const where = day === 'all' ? 'this week' : `on ${days.find((d) => d.id === day)?.name}`;
    const levelText = level === 'new' ? ' that suit someone new' : level === 'some' ? ' for people with some practice' : '';
    const text = shown === 0 ? `No classes ${where}${levelText}.` : `${shown} ${shown === 1 ? 'class' : 'classes'} ${where}${levelText}.`;
    if (announce || status.textContent !== text) status.textContent = text;
  };

  form.addEventListener('change', () => apply(true));
  form.addEventListener('submit', (event) => event.preventDefault());
  apply(false);

  section.addEventListener('click', (event) => {
    const link = (event.target as Element).closest<HTMLAnchorElement>('[data-reserve]');
    if (link) onReserve(link.dataset.reserve!);
  });

}
