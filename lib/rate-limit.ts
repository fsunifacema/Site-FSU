import "server-only";

type Window = { count: number; resetAt: number };

const MAX_TRACKED_KEYS = 10_000;

export function createRateLimiter({ limit, windowMs }: { limit: number; windowMs: number }) {
  const windows = new Map<string, Window>();

  const prune = (now: number) => {
    for (const [key, window] of windows) {
      if (window.resetAt <= now) windows.delete(key);
    }
    while (windows.size >= MAX_TRACKED_KEYS) {
      const oldest = windows.keys().next().value;
      if (oldest === undefined) break;
      windows.delete(oldest);
    }
  };

  return function consume(key: string, now = Date.now()) {
    const current = windows.get(key);
    if (!current || current.resetAt <= now) {
      if (windows.size >= MAX_TRACKED_KEYS) prune(now);
      windows.set(key, { count: 1, resetAt: now + windowMs });
      return { allowed: true, retryAfterSeconds: 0 };
    }
    if (current.count >= limit) {
      return { allowed: false, retryAfterSeconds: Math.ceil((current.resetAt - now) / 1000) };
    }
    current.count += 1;
    return { allowed: true, retryAfterSeconds: 0 };
  };
}
