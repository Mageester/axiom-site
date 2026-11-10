/**
 * Small, dependency-free helpers shared by the everyday builds: a disclosure dropdown that
 * works with mouse, touch and keyboard, and a storage wrapper that survives private windows.
 */

export const storage = {
  get(key: string): string | null {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  set(key: string, value: string) {
    try {
      localStorage.setItem(key, value);
    } catch {
      /* private window or blocked storage: the page still works without it */
    }
  },
};

/**
 * A button that shows and hides a panel. Click or Enter toggles, Escape closes and returns
 * focus to the button, focus moving elsewhere closes it, and on a mouse it also opens on hover.
 */
export function dropdown(wrap: HTMLElement, options: { hover?: boolean } = {}) {
  const button = wrap.querySelector<HTMLButtonElement>('[data-drop-toggle]');
  const panel = wrap.querySelector<HTMLElement>('[data-drop]');
  if (!button || !panel) return;
  let closeTimer = 0;

  const set = (open: boolean) => {
    window.clearTimeout(closeTimer);
    button.setAttribute('aria-expanded', String(open));
    panel.hidden = !open;
  };
  const isOpen = () => button.getAttribute('aria-expanded') === 'true';

  button.addEventListener('click', () => set(!isOpen()));
  button.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      set(true);
      panel.querySelector<HTMLElement>('a')?.focus();
    }
  });
  wrap.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && isOpen()) {
      set(false);
      button.focus();
    }
  });
  wrap.addEventListener('focusout', (event) => {
    const next = event.relatedTarget as Node | null;
    if (next && !wrap.contains(next)) set(false);
  });
  document.addEventListener('pointerdown', (event) => {
    if (isOpen() && !wrap.contains(event.target as Node)) set(false);
  });

  if (options.hover !== false && matchMedia('(hover: hover) and (pointer: fine)').matches) {
    wrap.addEventListener('pointerenter', () => {
      if (matchMedia('(min-width: 900px)').matches) set(true);
    });
    wrap.addEventListener('pointerleave', () => {
      closeTimer = window.setTimeout(() => set(false), 160);
    });
  }
  return { open: () => set(true), close: () => set(false) };
}

/**
 * Forms in a concept never send anything. On submit, check the fields as usual, then show
 * the form's own `[data-concept-msg]` panel, which says so plainly, and move focus to it.
 */
export function conceptForms(root: ParentNode = document) {
  root.querySelectorAll<HTMLFormElement>('form[data-concept-form]').forEach((form) => {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      const message = form.querySelector<HTMLElement>('[data-concept-msg]');
      if (!message) return;
      message.hidden = false;
      message.focus();
      form.reset();
    });
  });
}
