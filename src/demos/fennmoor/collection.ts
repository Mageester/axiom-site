// Collection page: filter by category and price, sort, and keep the choice in the address
// so a filtered view can be shared. Everything is in the page already; this only shows,
// hides and reorders the product cards.
const form = document.querySelector<HTMLFormElement>('[data-filters]');
const grid = document.querySelector<HTMLElement>('[data-grid]');

if (form && grid) {
  const cards = Array.from(grid.querySelectorAll<HTMLElement>('.card'));
  const total = cards.length;
  const chips = Array.from(form.querySelectorAll<HTMLInputElement>('input[name="category"]'));
  const priceSelect = form.querySelector<HTMLSelectElement>('select[name="price"]')!;
  const sortSelect = form.querySelector<HTMLSelectElement>('select[name="sort"]')!;
  const count = document.querySelector<HTMLElement>('[data-count]')!;
  const empty = document.querySelector<HTMLElement>('[data-empty]')!;
  const clear = Array.from(document.querySelectorAll<HTMLButtonElement>('[data-clear]'));

  const sorters: Record<string, (a: HTMLElement, b: HTMLElement) => number> = {
    featured: (a, b) => Number(a.dataset.order) - Number(b.dataset.order),
    'price-asc': (a, b) => Number(a.dataset.price) - Number(b.dataset.price) || Number(a.dataset.order) - Number(b.dataset.order),
    'price-desc': (a, b) => Number(b.dataset.price) - Number(a.dataset.price) || Number(a.dataset.order) - Number(b.dataset.order),
    name: (a, b) => (a.dataset.name ?? '').localeCompare(b.dataset.name ?? ''),
  };

  const inRange = (cents: number, range: string) => {
    if (range === 'any') return true;
    const [low, high] = range.split('-');
    return cents >= Number(low || 0) && (!high || cents < Number(high));
  };

  const apply = () => {
    const picked = chips.filter((chip) => chip.checked).map((chip) => chip.value);
    const range = priceSelect.value;
    const sort = sorters[sortSelect.value] ? sortSelect.value : 'featured';

    let shown = 0;
    for (const card of cards) {
      const match =
        (picked.length === 0 || picked.includes(card.dataset.category ?? '')) && inRange(Number(card.dataset.price), range);
      card.hidden = !match;
      if (match) shown += 1;
    }
    // Reorder the real elements, so keyboard and screen reader order matches what is on screen.
    grid.append(...[...cards].sort(sorters[sort]));

    const filtered = picked.length > 0 || range !== 'any';
    const noun = shown === 1 ? 'product' : 'products';
    const text = filtered ? `Showing ${shown} of ${total} ${noun}` : `${total} ${noun}`;
    count.textContent = text;
    empty.hidden = shown > 0;
    grid.hidden = shown === 0;
    clear.forEach((button) => (button.hidden = !filtered && sort === 'featured'));

    const params = new URLSearchParams();
    if (picked.length) params.set('category', picked.join(','));
    if (range !== 'any') params.set('price', range);
    if (sort !== 'featured') params.set('sort', sort);
    const query = params.toString();
    history.replaceState(null, '', query ? `?${query}` : location.pathname);
  };

  // Start from the address, if it has a view in it.
  const start = new URLSearchParams(location.search);
  const startCategories = (start.get('category') ?? '').split(',');
  chips.forEach((chip) => (chip.checked = startCategories.includes(chip.value)));
  const startPrice = start.get('price');
  if (startPrice && Array.from(priceSelect.options).some((option) => option.value === startPrice)) priceSelect.value = startPrice;
  const startSort = start.get('sort');
  if (startSort && sorters[startSort]) sortSelect.value = startSort;

  form.addEventListener('change', apply);
  form.addEventListener('submit', (event) => event.preventDefault());
  clear.forEach((button) =>
    button.addEventListener('click', () => {
      chips.forEach((chip) => (chip.checked = false));
      priceSelect.value = 'any';
      sortSelect.value = 'featured';
      apply();
      (chips[0] ?? priceSelect).focus();
    }),
  );
  apply();
}
