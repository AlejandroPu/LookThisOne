import 'server-only';

import type { User } from '@supabase/supabase-js';
import { cache } from 'react';
import { redirect } from 'next/navigation';

import { getOwnerPage, type OwnerPage } from '@/lib/pages/owner';
import { createClient } from '@/lib/supabase/server';

// Data Access Layer for auth. Call these from pages, Server Actions and Route
// Handlers — NOT from layouts as the sole gate.
//
// Why:
//   - Next 16 layouts do not re-render on client-side navigation (Partial
//     Rendering), so a layout-only auth check goes stale as soon as the user
//     navigates between nested routes.
//   - Layouts and their child pages render in parallel on initial hit, so
//     `redirect()` in a layout does not stop the page from executing. A page
//     that trusts the layout's "guarantee" will throw at render time.
//
// Each function is wrapped in React's `cache()` so calling it from multiple
// components in the same render tree deduplicates to a single DB / Supabase
// round trip.
//
// Reference: node_modules/next/dist/docs/01-app/02-guides/authentication.md
// (sections "Creating a Data Access Layer (DAL)" and "Layouts and auth
// checks").

// Returns the current user without redirecting — safe to call on public pages.
export const peekUser = cache(async (): Promise<User | null> => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
});

export const verifySession = cache(async (): Promise<User> => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }
  return user;
});

export const requirePage = cache(
  async (): Promise<{ user: User; page: OwnerPage }> => {
    const user = await verifySession();
    const page = await getOwnerPage(user.id);
    if (!page) {
      redirect('/onboarding');
    }
    return { user, page };
  },
);

// Opposite of requirePage: used by the onboarding flow to guard against a
// user who already completed onboarding hitting the form again (which would
// otherwise create a duplicate workspace).
export const redirectIfOnboarded = cache(async (): Promise<User> => {
  const user = await verifySession();
  const existing = await getOwnerPage(user.id);
  if (existing) {
    redirect('/dashboard');
  }
  return user;
});
