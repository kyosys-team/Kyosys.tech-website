/**
 * Tiny in-memory IP rate limiter for API routes.
 * Good enough for v1 scale (single-region serverless can duplicate buckets;
 * acceptable per Architecture §8 — upgrade to Redis if abuse appears).
 */
interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();

// Periodic cleanup so the map can't grow forever.
// (forEach instead of for..of: tsconfig targets pre-ES2015 without
// downlevelIteration, and forEach works everywhere.)
setInterval(() => {
  const now = Date.now();
  buckets.forEach((b, key) => {
    if (b.resetAt <= now) buckets.delete(key);
  });
}, 60_000).unref?.();

/**
 * Returns true when the request is ALLOWED, false when the caller is over the limit.
 * @param key   e.g. `contact:${ip}` — caller builds the key
 * @param limit max hits per window
 * @param windowMs window length in ms
 */
export function rateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (bucket.count >= limit) return false;
  bucket.count += 1;
  return true;
}

/** Best-effort client IP for rate-limit keys. */
export function clientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}
