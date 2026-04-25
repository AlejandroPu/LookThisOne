import 'server-only';

import { createClient } from '@supabase/supabase-js';

// Admin client uses the service-role key. Never import this in client
// components or expose it to the browser. Use only for privileged server-side
// operations (e.g. deleting an auth.users row on account deletion).
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );
}
