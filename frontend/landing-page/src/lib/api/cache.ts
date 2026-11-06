/**
 * Cache lifetime for a request that FAILED (backend down, wrong URL, ...).
 *
 * Re-check after 5 seconds, serving the old value meanwhile, so a backend that
 * was down at first is picked up again almost immediately instead of being
 * remembered as "no data" for minutes. `expire` must stay at 5 minutes or
 * more: a shorter one makes Next.js treat the page as dynamic and the build fails.
 *
 * Successful requests use `cacheLife("minutes")`.
 */
export const failedLife = { stale: 30, revalidate: 5, expire: 300 };
