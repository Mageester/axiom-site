// The cart: a list of lines kept in localStorage, so it survives moving between pages.
import { storage } from '../_kit/ui';

export type CartLine = {
  /** handle plus the chosen options, so two sizes of one product are two lines */
  key: string;
  handle: string;
  name: string;
  variant: string;
  /** cents */
  price: number;
  qty: number;
  image: string;
  url: string;
};

const KEY = 'fennmoor-cart-v1';
const MAX_QTY = 20;

const valid = (line: unknown): line is CartLine => {
  const l = line as Partial<CartLine>;
  return (
    !!l &&
    typeof l.key === 'string' &&
    typeof l.handle === 'string' &&
    typeof l.name === 'string' &&
    typeof l.variant === 'string' &&
    Number.isFinite(l.price) &&
    Number.isInteger(l.qty) &&
    (l.qty as number) > 0 &&
    typeof l.image === 'string' &&
    typeof l.url === 'string'
  );
};

let lines: CartLine[] = [];
try {
  const stored = JSON.parse(storage.get(KEY) ?? '[]');
  if (Array.isArray(stored)) lines = stored.filter(valid);
} catch {
  lines = [];
}

const save = () => {
  storage.set(KEY, JSON.stringify(lines));
  document.dispatchEvent(new CustomEvent('cart:change'));
};

export const cart = {
  lines: () => lines,
  count: () => lines.reduce((sum, line) => sum + line.qty, 0),
  subtotal: () => lines.reduce((sum, line) => sum + line.price * line.qty, 0),
  add(line: Omit<CartLine, 'qty'>, qty: number) {
    const existing = lines.find((item) => item.key === line.key);
    if (existing) existing.qty = Math.min(MAX_QTY, existing.qty + qty);
    else lines.push({ ...line, qty: Math.min(MAX_QTY, qty) });
    save();
  },
  setQty(key: string, qty: number) {
    const line = lines.find((item) => item.key === key);
    if (!line) return;
    if (qty <= 0) lines = lines.filter((item) => item.key !== key);
    else line.qty = Math.min(MAX_QTY, qty);
    save();
  },
  remove(key: string) {
    lines = lines.filter((item) => item.key !== key);
    save();
  },
};

// Another tab changed the cart.
window.addEventListener('storage', (event) => {
  if (event.key !== KEY) return;
  try {
    const stored = JSON.parse(event.newValue ?? '[]');
    lines = Array.isArray(stored) ? stored.filter(valid) : [];
  } catch {
    lines = [];
  }
  document.dispatchEvent(new CustomEvent('cart:change'));
});

export const MAX_LINE_QTY = MAX_QTY;
