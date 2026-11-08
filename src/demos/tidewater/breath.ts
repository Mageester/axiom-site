/**
 * The breath: one clock that both the silk and the guided breathing read, so the cloth
 * and the words never drift apart. Four counts in, six out. Left alone, the silk breathes
 * on this rhythm quietly; "Breathe with us" deepens it and talks you through six breaths.
 */
import { reducedMotion } from '../_kit/motion';

export const IN = 4;
export const OUT = 6;
export const CYCLE = IN + OUT;
export const BREATHS = 6;

const ease = (x: number) => 0.5 - 0.5 * Math.cos(Math.PI * Math.min(1, Math.max(0, x)));

export type BreathSample = {
  /** 0 empty, 1 full */
  b: number;
  phase: 'in' | 'out';
  /** seconds left in this phase */
  left: number;
  /** completed breaths since the guide started */
  count: number;
  /** how deeply the silk follows: quiet when idle, full when guided */
  depth: number;
};

export class BreathClock {
  guided = false;
  private origin = performance.now();

  sample(now = performance.now()): BreathSample {
    const t = Math.max(0, (now - this.origin) / 1000);
    const count = Math.floor(t / CYCLE);
    const c = t - count * CYCLE;
    const inhale = c < IN;
    return {
      b: inhale ? ease(c / IN) : 1 - ease((c - IN) / OUT),
      phase: inhale ? 'in' : 'out',
      left: inhale ? IN - c : CYCLE - c,
      count,
      depth: this.guided ? 1 : 0.42,
    };
  }

  start(now = performance.now()) {
    this.guided = true;
    this.origin = now;
  }

  stop() {
    // keep the same rhythm going, just quieter
    this.guided = false;
  }
}

const words = ['', 'one', 'two', 'three', 'four', 'five', 'six'];

export function initBreathGuide(clock: BreathClock, hero: HTMLElement) {
  const box = hero.querySelector<HTMLElement>('[data-breathe]');
  if (!box) return;
  // the guide needs a script, so it only appears once there is one
  box.hidden = false;
  const button = box.querySelector<HTMLButtonElement>('[data-breathe-toggle]')!;
  const label = box.querySelector<HTMLElement>('[data-breathe-label]')!;
  const hint = box.querySelector<HTMLElement>('[data-breathe-hint]')!;
  const cue = box.querySelector<HTMLElement>('[data-breathe-cue]')!;
  const cueWord = cue.querySelector<HTMLElement>('[data-cue-word]')!;
  const cueCount = cue.querySelector<HTMLElement>('[data-cue-count]')!;
  const cueStep = cue.querySelector<HTMLElement>('[data-cue-step]')!;
  const live = box.querySelector<HTMLElement>('[data-breathe-live]')!;
  const ring = box.querySelector<SVGCircleElement>('[data-breathe-ring]')!;

  let raf = 0;
  let timer = 0;
  let lastPhase = '';
  let lastCount = -1;
  let lastSecond = -1;

  const say = (text: string) => {
    // clear first so a repeated phrase is still announced
    live.textContent = '';
    window.setTimeout(() => (live.textContent = text), 60);
  };

  const render = () => {
    const s = clock.sample();
    if (s.count >= BREATHS) {
      finish();
      return;
    }
    const fill = reducedMotion ? (s.phase === 'in' ? 1 - Math.ceil(s.left) / IN + 1 / IN : Math.ceil(s.left) / OUT - 1 / OUT) : s.b;
    ring.style.strokeDashoffset = String(100 - Math.max(0, Math.min(1, fill)) * 100);
    const second = Math.ceil(s.left - 0.001);
    if (s.phase !== lastPhase || s.count !== lastCount) {
      lastPhase = s.phase;
      lastCount = s.count;
      cueWord.textContent = s.phase === 'in' ? 'Breathe in' : 'Breathe out';
      cueStep.textContent = `Breath ${s.count + 1} of ${BREATHS}`;
      cue.dataset.phase = s.phase;
      say(s.phase === 'in' ? `Breath ${words[s.count + 1]}. In, for four.` : 'Out, for six.');
    }
    if (second !== lastSecond) {
      lastSecond = second;
      cueCount.textContent = String(second);
    }
  };

  const tick = () => {
    raf = 0;
    if (!clock.guided) return;
    render();
    if (clock.guided) raf = requestAnimationFrame(tick);
  };

  const begin = () => {
    clock.start();
    lastPhase = '';
    lastCount = -1;
    lastSecond = -1;
    button.setAttribute('aria-pressed', 'true');
    label.textContent = 'Stop';
    hint.hidden = true;
    cue.hidden = false;
    hero.classList.add('is-breathing');
    if (reducedMotion) {
      render();
      timer = window.setInterval(render, 250);
    } else {
      raf = requestAnimationFrame(tick);
    }
  };

  const end = (message: string, announce: string) => {
    clock.stop();
    cancelAnimationFrame(raf);
    window.clearInterval(timer);
    raf = 0;
    button.setAttribute('aria-pressed', 'false');
    label.textContent = 'Breathe with us';
    cue.hidden = true;
    hint.hidden = false;
    hint.textContent = message;
    hero.classList.remove('is-breathing');
    ring.style.strokeDashoffset = '100';
    say(announce);
  };

  const finish = () => end('That was one minute. A class is sixty.', 'Finished. That was one minute of slow breathing.');
  const stop = () => end('Six breaths, about a minute. Four counts in, six out.', 'Stopped.');

  button.addEventListener('click', () => (clock.guided ? stop() : begin()));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && clock.guided) stop();
  });
  // nobody needs counting while they read the timetable
  new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting && clock.guided) stop();
  }).observe(hero);
}
