import { redirect } from 'next/navigation';
import type { ReactNode } from 'react';

import { getOwnerPage } from '@/lib/pages/owner';
import { createClient } from '@/lib/supabase/server';

// Gate the entire /dashboard subtree. The proxy refreshes the session cookie
// on every request, but the authorization decision lives here — any nested
// route or Server Action must still re-verify auth on its own (Next 16 proxy
// matchers do not cover Server Functions reliably).
//
// Also enforces the onboarding step: an authenticated user without a page is
// bounced to /onboarding so the dashboard can assume a page exists.
export default async function DashboardLayout({
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

  const page = await getOwnerPage(user.id);
  if (!page) {
    redirect('/onboarding');
  }

  return <>{children}</>;
}
