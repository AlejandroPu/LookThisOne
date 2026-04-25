import type { Metadata } from 'next';
import Link from 'next/link';

import { requirePage } from '@/lib/auth/dal';

import { UsernameForm } from './UsernameForm';
import { EmailForm } from './EmailForm';
import { PasswordForm } from './PasswordForm';
import { DeleteForm } from './DeleteForm';

export const metadata: Metadata = { title: 'Account settings' };

export default async function SettingsPage() {
  const { user, page } = await requirePage();

  const hasPasswordProvider = user.identities?.some(
    (i) => i.provider === 'email',
  );

  return (
    <main className="mx-auto max-w-2xl px-6 py-12">
      <Link
        href="/dashboard"
        className="mb-6 inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
      >
        <span aria-hidden="true">←</span> Back to dashboard
      </Link>
      <h1 className="text-2xl font-semibold">Account settings</h1>
      <p className="mt-1 text-sm text-gray-500">
        Signed in as <span className="font-mono">{user.email}</span>
      </p>

      <UsernameForm currentUsername={page.username} />

      <EmailForm currentEmail={user.email ?? ''} />

      {hasPasswordProvider ? (
        <PasswordForm />
      ) : (
        <section className="mt-8 rounded border border-gray-200 p-6">
          <h2 className="text-sm font-medium text-gray-500">Password</h2>
          <p className="mt-3 text-sm text-gray-500">
            Your account uses Google sign-in — no password to change.
          </p>
        </section>
      )}

      <DeleteForm username={page.username} />
    </main>
  );
}
