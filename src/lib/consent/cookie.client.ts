import { COOKIE_NAME, COOKIE_MAX_AGE_SECONDS } from './constants';

export function setConsent(value: 'granted' | 'denied'): void {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  document.cookie = `${COOKIE_NAME}=${value}; Path=/; Max-Age=${COOKIE_MAX_AGE_SECONDS}; SameSite=Lax${secure}`;
}

export function readConsent(): 'granted' | 'denied' | null {
  const match = document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${COOKIE_NAME}=`));
  if (!match) return null;
  const value = match.split('=')[1];
  if (value === 'granted' || value === 'denied') return value;
  return null;
}
