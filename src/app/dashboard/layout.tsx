import type { ReactNode } from 'react';

// Structural only. Auth and onboarding gating live in the page (via the DAL),
// because Next 16 layouts do not re-render on client-side navigation and
// render in parallel with their pages on initial load — neither property is
// compatible with using them as an auth gate.
// See src/lib/auth/dal.ts for details.
export default function DashboardLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
