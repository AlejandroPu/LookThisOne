import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

// Refreshes the Supabase auth cookies on every request that hits the proxy.
// Called from src/proxy.ts. Returns the NextResponse with updated cookies so
// the browser receives the refreshed session.
//
// Must not short-circuit on auth failure: RSC/Server Action re-verification
// is the source of truth. See the Next 16 proxy.md warning — Server Actions
// are POST requests to their host route; a restrictive matcher would silently
// skip them. Always re-check auth inside each protected Server Component /
// Server Action.
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  await supabase.auth.getUser();

  return response;
}
