// Page-wide behaviour for every Fennmoor Home page: the header menus and the slide-out cart.
import { conceptForms, dropdown } from '../_kit/ui';
import { cart, MAX_LINE_QTY, type CartLine } from './cart';
import { FREE_SHIPPING_FROM, money } from './money';

const $ = <T extends HTMLElement>(selector: string, root: ParentNode = document) => root.querySelector<T>(selector);

// ── Header ──────────────────────────────────────────────────────────────────
const dropWrap = $<HTMLElement>('[data-drop-wrap]');
if (dropWrap) dropdown(dropWrap);

const menuButton = $<HTMLButtonElement>('[data-menu-toggle]');
const nav = $<HTMLElement>('[data-nav]');
if (menuButton && nav) {
  const setMenu = (open: boolean) => {
    menuButton.setAttribute('aria-expanded', String(open));
    nav.classList.toggle('is-open', open);
  };
  menuButton.addEventListener('click', () => setMenu(menuButton.getAttribute('aria-expanded') !== 'true'));
  nav.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true' && !dropWrap?.querySelector('[aria-expanded="true"]')) {
      setMenu(false);
      menuButton.focus();
    }
  });
  // Choosing a link inside the open panel should close it.
  nav.addEventListener('click', (event) => {
    if ((event.target as HTMLElement).closest('a')) setMenu(false);
  });
  matchMedia('(min-width: 900px)').addEventListener('change', (event) => {
    if (event.matches) setMenu(false);
  });
}

// ── Cart ────────────────────────────────────────────────────────────────────
const dialog = $<HTMLDialogElement>('[data-cart]');
if (dialog) {
  const list = $<HTMLElement>('[data-cart-lines]', dialog)!;
  const empty = $<HTMLElement>('[data-cart-empty]', dialog)!;
  const foot = $<HTMLElement>('[data-cart-foot]', dialog)!;
  const subtotal = $<HTMLElement>('[data-cart-subtotal]', dialog)!;
  const ship = $<HTMLElement>('[data-cart-ship]', dialog)!;
  const live = $<HTMLElement>('[data-cart-live]', dialog)!;
  const concept = $<HTMLElement>('[data-cart-concept]', dialog)!;
  const counts = document.querySelectorAll<HTMLElement>('[data-cart-count]');
  const labels = document.querySelectorAll<HTMLElement>('[data-cart-label]');
  const openers = document.querySelectorAll<HTMLButtonElement>('[data-cart-open]');

  const announce = (message: string) => {
    live.textContent = '';
    window.setTimeout(() => (live.textContent = message), 30);
  };

  const lineEl = (line: CartLine) => {
    const li = document.createElement('li');
    li.className = 'line';
    li.dataset.key = line.key;

    const img = document.createElement('img');
    img.src = line.image;
    img.alt = '';
    img.width = 160;
    img.height = 200;
    img.loading = 'lazy';

    const main = document.createElement('div');
    main.className = 'line-main';
    const name = document.createElement('a');
    name.href = line.url;
    name.className = 'line-name';
    name.textContent = line.name;
    const variant = document.createElement('p');
    variant.className = 'line-variant';
    variant.textContent = line.variant;

    const qty = document.createElement('div');
    qty.className = 'qty qty-sm';
    const minus = document.createElement('button');
    minus.type = 'button';
    minus.dataset.act = 'dec';
    minus.setAttribute('aria-label', `Decrease quantity of ${line.name}`);
    minus.textContent = '−';
    const value = document.createElement('span');
    value.className = 'qty-value';
    value.textContent = String(line.qty);
    value.setAttribute('aria-label', `Quantity: ${line.qty}`);
    const plus = document.createElement('button');
    plus.type = 'button';
    plus.dataset.act = 'inc';
    plus.setAttribute('aria-label', `Increase quantity of ${line.name}`);
    plus.textContent = '+';
    plus.disabled = line.qty >= MAX_LINE_QTY;
    qty.append(minus, value, plus);

    main.append(name, variant, qty);

    const end = document.createElement('div');
    end.className = 'line-end';
    const price = document.createElement('p');
    price.className = 'line-price';
    price.textContent = money(line.price * line.qty);
    const remove = document.createElement('button');
    remove.type = 'button';
    remove.className = 'line-remove';
    remove.dataset.act = 'remove';
    remove.innerHTML = 'Remove <span class="sr"></span>';
    (remove.querySelector('.sr') as HTMLElement).textContent = line.name;
    end.append(price, remove);

    li.append(img, main, end);
    return li;
  };

  const render = () => {
    const lines = cart.lines();
    const count = cart.count();
    list.replaceChildren(...lines.map(lineEl));
    empty.hidden = lines.length > 0;
    foot.hidden = lines.length === 0;
    ship.hidden = lines.length === 0;
    subtotal.textContent = money(cart.subtotal());
    concept.hidden = true;
    const left = FREE_SHIPPING_FROM - cart.subtotal();
    ship.textContent = left > 0 ? `You are ${money(left)} away from free shipping.` : 'Your order ships free.';
    counts.forEach((el) => {
      el.textContent = String(count);
      el.classList.toggle('has-items', count > 0);
    });
    labels.forEach((el) => {
      el.parentElement?.setAttribute('aria-label', `Open cart, ${count} ${count === 1 ? 'item' : 'items'}`);
    });
  };

  const open = () => {
    if (!dialog.open) dialog.showModal();
  };
  const close = () => dialog.close();

  openers.forEach((button) => button.addEventListener('click', open));
  $<HTMLElement>('[data-cart-close]', dialog)!.addEventListener('click', close);
  // A click on the backdrop lands on the dialog itself.
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) close();
  });

  list.addEventListener('click', (event) => {
    const button = (event.target as HTMLElement).closest<HTMLButtonElement>('button[data-act]');
    const li = (event.target as HTMLElement).closest<HTMLElement>('.line');
    if (!button || !li?.dataset.key) return;
    const line = cart.lines().find((item) => item.key === li.dataset.key);
    if (!line) return;
    const siblings = Array.from(list.querySelectorAll<HTMLElement>('.line'));
    const index = siblings.indexOf(li);
    const act = button.dataset.act;
    if (act === 'inc') cart.setQty(line.key, line.qty + 1);
    if (act === 'dec') cart.setQty(line.key, line.qty - 1);
    if (act === 'remove') cart.remove(line.key);
    render();
    if (act === 'remove' || (act === 'dec' && line.qty <= 1)) {
      announce(`${line.name} removed from your cart.`);
      const next = list.querySelectorAll<HTMLElement>('.line')[Math.min(index, list.children.length - 1)];
      (next?.querySelector('button') ?? $<HTMLElement>('[data-cart-close]', dialog))?.focus();
    } else {
      announce(`${line.name}, quantity ${cart.lines().find((item) => item.key === line.key)?.qty ?? 0}. Subtotal ${money(cart.subtotal())}.`);
      // Keep focus on the same control after the list is redrawn.
      const again = Array.from(list.querySelectorAll<HTMLElement>('.line'))[index]?.querySelector<HTMLElement>(`button[data-act="${act}"]`);
      (again && !(again as HTMLButtonElement).disabled ? again : null)?.focus();
    }
  });

  $<HTMLElement>('[data-cart-checkout]', dialog)!.addEventListener('click', () => {
    concept.hidden = false;
  });

  document.addEventListener('cart:change', render);
  // Other code on the page asks for the cart to open after adding something.
  document.addEventListener('cart:open', (event) => {
    open();
    const message = (event as CustomEvent<string | undefined>).detail;
    if (message) announce(message);
  });
  render();
}

conceptForms();
