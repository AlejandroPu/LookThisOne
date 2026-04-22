import { redirect } from 'next/navigation';
import type { ReactNode } from 'react';

import { createClient } from '@/lib/supabase/server';

// Gate the entire /dashboard subtree. The proxy refreshes the session cookie
// on every request, but the authorization decision lives here — any nested
// route or Server Action must still re-verify auth on its own (Next 16 proxy
// matchers do not cover Server Functions reliably).
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

  return <>{children}</>;
}
