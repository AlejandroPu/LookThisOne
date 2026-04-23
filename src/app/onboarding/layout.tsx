import type { ReactNode } from 'react';

// Structural only. Auth and "already onboarded" gating live in the page.
// See src/lib/auth/dal.ts for the rationale.
export default function OnboardingLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <>{children}</>;
}
