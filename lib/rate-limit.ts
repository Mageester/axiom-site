const WINDOW_MS = 15 * 60 * 1000;
const MAX_REQUESTS = 5;

type Bucket = {
  count: number;
  expiresAt: number;
};

const store = new Map<string, Bucket>();

export function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const existing = store.get(ip);

  if (!existing || existing.expiresAt < now) {
    store.set(ip, { count: 1, expiresAt: now + WINDOW_MS });
    return false;
  }

  existing.count += 1;

  if (existing.count > MAX_REQUESTS) {
    return true;
  }

  return false;
}
