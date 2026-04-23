// Username rules for public profile URLs (`/[username]`).
//
// Format: 3–20 chars, lowercase letters, digits, underscore or hyphen.
// Must start with a letter or digit (so `-foo` / `_foo` are rejected).
//
// Reserved list blocks usernames that would collide with existing or likely
// future static routes. Next's router resolves static segments before the
// catch-all `/[username]`, so a user who grabbed `login` would end up with an
// unreachable profile. Keep this list in sync as new top-level routes land.

const USERNAME_PATTERN = /^[a-z0-9][a-z0-9_-]{2,19}$/;

const RESERVED_USERNAMES = new Set<string>([
  'admin',
  'api',
  'app',
  'assets',
  'auth',
  'billing',
  'blog',
  'contact',
  'dashboard',
  'docs',
  'edit',
  'help',
  'home',
  'login',
  'logout',
  'mail',
  'new',
  'onboarding',
  'privacy',
  'profile',
  'public',
  'root',
  'settings',
  'signin',
  'signout',
  'signup',
  'static',
  'support',
  'terms',
  'www',
  // Note: '_next' is already blocked by the regex (must start with [a-z0-9]),
  // but kept here as an explicit signal of intent.
  '_next',
]);

export type UsernameValidationError = 'empty' | 'format' | 'reserved';

export function validateUsername(
  raw: string,
): { ok: true; value: string } | { ok: false; error: UsernameValidationError } {
  const value = raw.trim().toLowerCase();

  if (!value) return { ok: false, error: 'empty' };
  if (!USERNAME_PATTERN.test(value)) return { ok: false, error: 'format' };
  if (RESERVED_USERNAMES.has(value)) return { ok: false, error: 'reserved' };

  return { ok: true, value };
}

export const USERNAME_ERROR_MESSAGES: Record<UsernameValidationError, string> =
  {
    empty: 'Please choose a username.',
    format:
      'Use 3–20 characters: lowercase letters, digits, underscore or hyphen. Must start with a letter or digit.',
    reserved: 'That username is reserved. Please pick another.',
  };
