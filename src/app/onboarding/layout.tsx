import { redirect } from 'next/navigation';
import type { ReactNode } from 'react';

import { getOwnerPage } from '@/lib/pages/owner';
import { createClient } from '@/lib/supabase/server';

// Auth-gated. Also bounces already-onboarded users straight to the dashboard
// so this page is only reachable the one time it is useful.
export default async function OnboardingLayout({
  children,
}: {
  children: ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const existing = await getOwnerPage(user.id);
  if (existing) {
    redirect('/dashboard');
  }

  return <>{children}</>;
}
