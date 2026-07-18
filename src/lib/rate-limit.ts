/**
 * Small, dependency-free fixed-window limiter for the decode endpoint.
 * It bounds abuse per application instance; the reverse proxy should still
 * enforce a broader limit when the app is scaled across multiple containers.
 */
const WINDOW_MS = 60_000;
const MAX_REQUESTS = 30;

/**
 * Hard ceiling on tracked keys.
 *
 * Sweeping expired buckets is not enough on its own: the case worth defending
 * against is a flood of distinct keys inside a single window, and in that case
 * nothing has expired yet, so a sweep frees nothing and the map grows without
 * bound. Once this ceiling is reached the oldest windows are evicted even
 * though they are still live. Evicting a live bucket forgives that key's
 * remaining count, which is the right trade: a limiter that runs the instance
 * out of memory fails far worse than one that occasionally forgets a caller.
 */
export const MAX_TRACKED_KEYS = 10_000;

// Insertion order is window-start order, because a bucket is only ever inserted
// when it is created. That makes the Map its own LRU-by-age queue.
const buckets = new Map<string, { count: number; resetAt: number }>();

export interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetAt: number;
}

/**
 * How many keys are currently tracked. Exposed so the ceiling can be asserted
 * directly — the failure it guards against is unbounded growth, which is not
 * observable from `checkRateLimit`'s return value.
 */
export function trackedKeyCount(): number {
  return buckets.size;
}

export function checkRateLimit(key: string, now = Date.now()): RateLimitResult {
  let bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    // Re-insert so a renewed window moves to the back of the eviction queue.
    buckets.delete(key);
    bucket = { count: 0, resetAt: now + WINDOW_MS };
    buckets.set(key, bucket);
  }

  bucket.count += 1;

  if (buckets.size > MAX_TRACKED_KEYS) {
    // Cheap pass first: drop anything already expired.
    for (const [candidate, value] of buckets) {
      if (value.resetAt <= now) buckets.delete(candidate);
    }
    // Still over? Then every remaining window is live and the sweep above
    // freed nothing. Evict oldest-first until back under the ceiling, never
    // touching the key that was just recorded.
    if (buckets.size > MAX_TRACKED_KEYS) {
      for (const candidate of buckets.keys()) {
        if (buckets.size <= MAX_TRACKED_KEYS) break;
        if (candidate !== key) buckets.delete(candidate);
      }
    }
  }

  return {
    allowed: bucket.count <= MAX_REQUESTS,
    limit: MAX_REQUESTS,
    remaining: Math.max(0, MAX_REQUESTS - bucket.count),
    resetAt: bucket.resetAt,
  };
}
