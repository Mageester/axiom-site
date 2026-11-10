// Product page: pick options, watch the price, choose a quantity, add to the cart.
import { cart, MAX_LINE_QTY } from './cart';
import { money } from './money';

const form = document.querySelector<HTMLFormElement>('[data-product-form]');

if (form) {
  const { handle = '', name = '', base = '0', image = '', url = '' } = form.dataset;
  const price = form.querySelector<HTMLElement>('[data-price]')!;
  const qtyInput = form.querySelector<HTMLInputElement>('[data-qty]')!;
  const minus = form.querySelector<HTMLButtonElement>('[data-qty-minus]')!;
  const plus = form.querySelector<HTMLButtonElement>('[data-qty-plus]')!;
  const groups = Array.from(form.querySelectorAll<HTMLElement>('[data-option]'));

  const chosen = () =>
    groups.map((group) => {
      const input = group.querySelector<HTMLInputElement>('input:checked')!;
      return { name: group.dataset.option ?? '', label: input.value, delta: Number(input.dataset.delta ?? 0) };
    });

  const unit = () => Number(base) + chosen().reduce((sum, option) => sum + option.delta, 0);
  const qty = () => Math.min(MAX_LINE_QTY, Math.max(1, Math.floor(Number(qtyInput.value)) || 1));

  const refresh = () => {
    price.textContent = money(unit());
    groups.forEach((group) => {
      const label = group.querySelector<HTMLElement>('[data-selected]');
      const input = group.querySelector<HTMLInputElement>('input:checked');
      if (label && input) label.textContent = `: ${input.value}`;
    });
    const value = qty();
    qtyInput.value = String(value);
    minus.disabled = value <= 1;
    plus.disabled = value >= MAX_LINE_QTY;
  };

  form.addEventListener('change', refresh);
  minus.addEventListener('click', () => {
    qtyInput.value = String(qty() - 1);
    refresh();
  });
  plus.addEventListener('click', () => {
    qtyInput.value = String(qty() + 1);
    refresh();
  });
  qtyInput.addEventListener('blur', refresh);

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const options = chosen();
    const variant = options.map((option) => option.label).join(' / ');
    const count = qty();
    cart.add(
      {
        key: [handle, ...options.map((option) => option.label)].join('|'),
        handle,
        name,
        variant: variant || 'Standard',
        price: unit(),
        image,
        url,
      },
      count,
    );
    document.dispatchEvent(
      new CustomEvent('cart:open', {
        detail: `Added ${count} ${name}${variant ? `, ${variant}` : ''} to your cart. Subtotal ${money(cart.subtotal())}.`,
      }),
    );
  });

  // Close-up: the second thumbnail zooms into the same photograph, and following the pointer
  // pans it. Nothing here is needed to buy, so it stays out of the way of the keyboard.
  const stage = document.querySelector<HTMLElement>('[data-stage]');
  const thumbs = Array.from(document.querySelectorAll<HTMLButtonElement>('[data-view]'));
  if (stage) {
    const show = (view: string) => {
      stage.classList.toggle('is-detail', view === 'detail');
      thumbs.forEach((thumb) => thumb.setAttribute('aria-pressed', String(thumb.dataset.view === view)));
    };
    thumbs.forEach((thumb) => thumb.addEventListener('click', () => show(thumb.dataset.view ?? 'full')));
    stage.addEventListener('pointermove', (event) => {
      if (!stage.classList.contains('is-detail')) return;
      const box = stage.getBoundingClientRect();
      stage.style.setProperty('--focus', `${((event.clientX - box.left) / box.width) * 100}% ${((event.clientY - box.top) / box.height) * 100}%`);
    });
    stage.addEventListener('pointerleave', () => stage.style.removeProperty('--focus'));
  }

  refresh();
}
