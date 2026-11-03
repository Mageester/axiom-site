import { gsap, reducedMotion } from '../_kit/motion';
import { HOURS, DAY_NAMES, clock, kitchenerNow } from './hours';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

type DayOption = { index: number; weekday: number; date: number; month: number; year: number; label: string; closed: boolean };

/** A steady pseudo-random number from three integers, so availability does not flicker between renders. */
function roll(a: number, b: number, c: number) {
  let x = Math.imul(a, 374761393) ^ Math.imul(b, 668265263) ^ Math.imul(c, 2147483647);
  x = Math.imul(x ^ (x >>> 13), 1274126177);
  return ((x ^ (x >>> 16)) >>> 0) / 4294967296;
}

export function initReserve(root: HTMLElement) {
  const form = root.querySelector<HTMLFormElement>('#rsv');
  if (!form) return;
  const daysEl = form.querySelector<HTMLElement>('[data-days]')!;
  const slotsEl = form.querySelector<HTMLElement>('[data-slots]')!;
  const partyEl = form.querySelector<HTMLElement>('[data-party]')!;
  const unitEl = form.querySelector<HTMLElement>('[data-party-unit]')!;
  const hintEl = form.querySelector<HTMLElement>('[data-party-hint]')!;
  const errorEl = form.querySelector<HTMLElement>('[data-error]')!;
  const stepButtons = [...form.querySelectorAll<HTMLButtonElement>('[data-step]')];
  const done = root.querySelector<HTMLElement>('[data-done]')!;
  const summaryEl = root.querySelector<HTMLElement>('[data-summary]')!;
  const againBtn = root.querySelector<HTMLButtonElement>('[data-again]')!;

  let party = 2;
  let dayIndex = 0;
  let time = '';
  let days: DayOption[] = [];

  const buildDays = () => {
    const now = kitchenerNow();
    const base = Date.UTC(now.year, now.month - 1, now.date);
    days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(base + i * 86400000);
      const weekday = d.getUTCDay();
      return {
        index: i,
        weekday,
        date: d.getUTCDate(),
        month: d.getUTCMonth(),
        year: d.getUTCFullYear(),
        label: i === 0 ? 'Today' : `${MONTHS[d.getUTCMonth()].slice(0, 3)} ${d.getUTCDate()}`,
        closed: !HOURS[weekday],
      };
    });
    // start on the first night that is still open for booking
    const first = days.findIndex((d) => !d.closed && slotsFor(d).some((s) => s.free));
    dayIndex = first >= 0 ? first : 0;
    daysEl.replaceChildren(
      ...days.map((d) => {
        const label = document.createElement('label');
        label.className = 'choice' + (d.closed ? ' is-off' : '');
        label.innerHTML = `<input type="radio" name="day" value="${d.index}" ${d.closed ? 'disabled' : ''} ${d.index === dayIndex ? 'checked' : ''} /><b>${DAY_NAMES[d.weekday].slice(0, 3)}</b><small>${d.closed ? 'Closed' : d.label}</small>`;
        return label;
      }),
    );
  };

  const slotsFor = (d: DayOption) => {
    const hours = HOURS[d.weekday];
    if (!hours) return [];
    const now = kitchenerNow();
    const last = hours.kitchen - 60;
    const out: { value: string; label: string; free: boolean }[] = [];
    for (let m = hours.open; m <= last; m += 30) {
      const past = d.index === 0 && m < now.minutes + 45;
      const peak = Math.max(0, 1 - Math.abs(m - 19.25 * 60) / 150);
      const weekend = d.weekday === 5 || d.weekday === 6 ? 0.1 : 0;
      const sizePenalty = party > 4 ? 0.1 + (party - 4) * 0.045 : 0;
      const taken = roll(d.year * 400 + d.month * 31 + d.date, m, 7) < 0.1 + peak * 0.38 + weekend + sizePenalty;
      out.push({ value: String(m), label: clock(m).replace(' pm', '').replace(' am', ''), free: !past && !taken });
    }
    return out;
  };

  const hintFor = (n: number) => {
    if (n <= 2) return 'Counter seats face the hearth.';
    if (n <= 6) return 'A table along the brick wall.';
    if (n <= 8) return 'Larger tables are limited. Early and late times are easiest.';
    return 'Parties over eight: please call (519) 555-0119.';
  };

  const renderSlots = (animate: boolean) => {
    const day = days[dayIndex];
    slotsEl.replaceChildren();
    if (party > 8) {
      slotsEl.innerHTML = '<p class="slots-empty">Call us on (519) 555-0119 and we will work something out.</p>';
      time = '';
      return;
    }
    const slots = slotsFor(day);
    if (!slots.some((s) => s.free)) {
      slotsEl.innerHTML = '<p class="slots-empty">Nothing left for this many people that night. Try another night, or call (519) 555-0119.</p>';
      time = '';
      return;
    }
    if (!slots.some((s) => s.value === time && s.free)) time = '';
    const nodes = slots.map((s) => {
      const label = document.createElement('label');
      label.className = 'choice' + (s.free ? '' : ' is-off');
      label.innerHTML = `<input type="radio" name="time" value="${s.value}" ${s.free ? '' : 'disabled'} ${s.value === time ? 'checked' : ''} /><b>${s.label}</b><small>${s.free ? clock(Number(s.value)).slice(-2) : 'Full'}</small>`;
      return label;
    });
    slotsEl.replaceChildren(...nodes);
    if (animate && !reducedMotion) {
      gsap.from(nodes, { y: 22, autoAlpha: 0, duration: 0.7, ease: 'expo.out', stagger: 0.035, clearProps: 'transform,opacity,visibility' });
    }
  };

  const renderParty = (dir: number) => {
    unitEl.textContent = party === 1 ? 'guest' : 'guests';
    hintEl.textContent = hintFor(party);
    stepButtons[0].disabled = party <= 1;
    stepButtons[1].disabled = party >= 12;
    partyEl.textContent = String(party);
    if (dir && !reducedMotion) {
      gsap.fromTo(partyEl, { yPercent: dir * 45, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.55, ease: 'expo.out', overwrite: true, clearProps: 'transform,opacity,visibility' });
    }
  };

  form.addEventListener('click', (event) => {
    const btn = (event.target as HTMLElement).closest<HTMLButtonElement>('[data-step]');
    if (!btn) return;
    const next = Math.max(1, Math.min(12, party + Number(btn.dataset.step)));
    if (next === party) return;
    const dir = next > party ? 1 : -1;
    party = next;
    renderParty(dir);
    renderSlots(true);
    errorEl.textContent = '';
  });

  form.addEventListener('change', (event) => {
    const input = event.target as HTMLInputElement;
    if (input.name === 'day') {
      dayIndex = Number(input.value);
      renderSlots(true);
    } else if (input.name === 'time') {
      time = input.value;
    }
    errorEl.textContent = '';
  });

  form.addEventListener('input', (event) => {
    const input = event.target as HTMLInputElement;
    if (input.getAttribute('aria-invalid')) input.removeAttribute('aria-invalid');
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const name = String(data.get('name') || '').trim();
    const contact = String(data.get('contact') || '').trim();
    const nameInput = form.elements.namedItem('name') as HTMLInputElement;
    const contactInput = form.elements.namedItem('contact') as HTMLInputElement;
    nameInput.removeAttribute('aria-invalid');
    contactInput.removeAttribute('aria-invalid');
    if (party > 8) {
      errorEl.textContent = 'For parties over eight, please call (519) 555-0119.';
      return;
    }
    if (!time) {
      errorEl.textContent = 'Pick a time first.';
      return;
    }
    if (!name) {
      nameInput.setAttribute('aria-invalid', 'true');
      errorEl.textContent = 'Add a name for the table.';
      nameInput.focus();
      return;
    }
    if (!contact) {
      contactInput.setAttribute('aria-invalid', 'true');
      errorEl.textContent = 'Add a phone number or email so we can confirm.';
      contactInput.focus();
      return;
    }
    errorEl.textContent = '';
    const day = days[dayIndex];
    const guests = party === 1 ? 'one guest' : `${party} guests`;
    summaryEl.textContent = `Table for ${guests}, ${DAY_NAMES[day.weekday]} ${MONTHS[day.month]} ${day.date} at ${clock(Number(time))}, under ${name}.`;
    form.hidden = true;
    done.hidden = false;
    const title = done.querySelector<HTMLElement>('.done-title')!;
    title.tabIndex = -1;
    if (!reducedMotion) {
      gsap.from(done.children, { y: 36, autoAlpha: 0, duration: 1, ease: 'expo.out', stagger: 0.09, clearProps: 'transform,opacity,visibility' });
    }
    title.focus({ preventScroll: true });
    root.scrollIntoView({ block: 'start', behavior: reducedMotion ? 'auto' : 'smooth' });
  });

  againBtn.addEventListener('click', () => {
    done.hidden = true;
    form.hidden = false;
    if (!reducedMotion) gsap.from(form.children, { y: 24, autoAlpha: 0, duration: 0.8, stagger: 0.06, ease: 'expo.out', clearProps: 'transform,opacity,visibility' });
    (form.querySelector('input[type="radio"]:checked') as HTMLElement | null)?.focus();
  });

  buildDays();
  renderParty(0);
  renderSlots(false);
}
