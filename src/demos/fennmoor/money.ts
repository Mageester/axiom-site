// Prices are in cents, in Canadian dollars. Kept apart from the catalogue so the
// header script does not pull the whole product list into every page.
export const FREE_SHIPPING_FROM = 10000;

export const money = (cents: number) =>
  new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD', minimumFractionDigits: cents % 100 === 0 ? 0 : 2 }).format(cents / 100);
