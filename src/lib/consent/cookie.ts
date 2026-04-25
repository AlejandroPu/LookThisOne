// Cookie value is a plain string ('granted' | 'denied') today.
// Will become JSON when we migrate to per-category granularity.
import { cache } from 'react';
import { cookies } from 'next/headers';

export const COOKIE_NAME = 'lto_consent';
export const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365; // 12 months

export const hasConsent = cache(async (): Promise<boolean> => {
  const store = await cookies();
  return store.get(COOKIE_NAME)?.value === 'granted';
});
