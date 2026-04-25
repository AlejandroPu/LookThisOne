// Cookie value is a plain string ('granted' | 'denied') today.
// Will become JSON when we migrate to per-category granularity.
import { cache } from 'react';
import { cookies } from 'next/headers';

// Re-exported so callers only need to import from this module.
export { COOKIE_NAME, COOKIE_MAX_AGE_SECONDS } from './constants';
import { COOKIE_NAME } from './constants';

export const hasConsent = cache(async (): Promise<boolean> => {
  const store = await cookies();
  return store.get(COOKIE_NAME)?.value === 'granted';
});
