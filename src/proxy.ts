import type { NextRequest } from 'next/server';

import { updateSession } from '@/lib/supabase/session';

export async function proxy(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: [
    // Run on every request except static assets, image optimization output,
    // and top-level metadata files. Keep API routes covered so Route Handlers
    // that depend on the session (e.g. /auth/callback) get refreshed cookies.
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
