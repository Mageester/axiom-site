/** Opening hours and the "open now" status, worked out in the restaurant's own time zone. */
export type Day = { open: number; kitchen: number; close: number } | null;

const h = (hours: number, minutes = 0) => hours * 60 + minutes;

// Index is the day of the week, 0 for Sunday. Times are minutes after midnight.
export const HOURS: Day[] = [
  { open: h(16, 30), kitchen: h(20, 30), close: h(21, 30) }, // Sunday
  null, // Monday
  { open: h(17), kitchen: h(22), close: h(23) },
  { open: h(17), kitchen: h(22), close: h(23) },
  { open: h(17), kitchen: h(22), close: h(23) },
  { open: h(17), kitchen: h(23), close: h(24) },
  { open: h(17), kitchen: h(23), close: h(24) },
];

export const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const zone = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'America/Toronto',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
  weekday: 'short',
});

export type Now = { year: number; month: number; date: number; day: number; minutes: number };

/** The visitor's clock, read as Kitchener time. */
export function kitchenerNow(at = new Date()): Now {
  const parts = Object.fromEntries(zone.formatToParts(at).map((p) => [p.type, p.value]));
  const day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(String(parts.weekday));
  return {
    year: Number(parts.year),
    month: Number(parts.month),
    date: Number(parts.day),
    day,
    minutes: Number(parts.hour) * 60 + Number(parts.minute),
  };
}

export function clock(minutes: number) {
  const m = minutes % (24 * 60);
  const hour = Math.floor(m / 60);
  const min = m % 60;
  if (minutes === 24 * 60) return 'midnight';
  const suffix = hour >= 12 ? 'pm' : 'am';
  const twelve = hour % 12 === 0 ? 12 : hour % 12;
  return min ? `${twelve}:${String(min).padStart(2, '0')} ${suffix}` : `${twelve} ${suffix}`;
}

export type Status = { state: 'open' | 'kitchen-closed' | 'closed'; text: string };

export function statusAt(now: Now): Status {
  const today = HOURS[now.day];
  if (today && now.minutes >= today.open && now.minutes < today.kitchen) {
    return { state: 'open', text: `Open now. Kitchen closes at ${clock(today.kitchen)}` };
  }
  if (today && now.minutes >= today.kitchen && now.minutes < today.close) {
    return { state: 'kitchen-closed', text: `Bar open until ${clock(today.close)}. The kitchen has closed` };
  }
  if (today && now.minutes < today.open) {
    return { state: 'closed', text: `Closed now. Opens tonight at ${clock(today.open)}` };
  }
  for (let i = 1; i <= 7; i++) {
    const next = HOURS[(now.day + i) % 7];
    if (next) {
      const name = i === 1 ? 'tomorrow' : DAY_NAMES[(now.day + i) % 7];
      return { state: 'closed', text: `Closed now. Opens ${name} at ${clock(next.open)}` };
    }
  }
  return { state: 'closed', text: 'Closed' };
}
