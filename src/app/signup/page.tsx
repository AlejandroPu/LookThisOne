import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

import { signInWithGoogle } from '@/app/login/actions';

import { signUpWithPassword } from './actions';

export const metadata = {
  title: 'Create an account',
};

type SearchParams = Promise<{ error?: string; state?: string }>;

export default async function SignupPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { error, state } = await searchParams;
  const checkEmail = state === 'check_email';
  const t = await getTranslations('Signup');

  return (
    <main className="mx-auto flex min-h-dvh max-w-sm flex-col justify-center gap-6 px-6 py-12">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">{t('title')}</h1>
        <p className="text-sm text-gray-600">
          {t('alreadyHaveOne')}{' '}
          <Link className="underline" href="/login">
            {t('signIn')}
          </Link>
          .
        </p>
      </header>

      <aside
        role="note"
        className="rounded border border-amber-300 bg-amber-50 px-3 py-2 text-xs text-amber-900"
      >
        <strong className="font-semibold">{t('betaTitle')}</strong>{' '}
        {t('betaBody')}
      </aside>

      {error ? (
        <p
          role="alert"
          className="rounded border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-800"
        >
          {error}
        </p>
      ) : null}

      {checkEmail ? (
        <p
          role="status"
          className="rounded border border-green-300 bg-green-50 px-3 py-2 text-sm text-green-800"
        >
          {t('checkInbox')}
        </p>
      ) : null}

      <form action={signUpWithPassword} className="flex flex-col gap-3">
        <label className="flex flex-col gap-1 text-sm">
          {t('email')}
          <input
            type="email"
            name="email"
            autoComplete="email"
            required
            className="rounded border border-gray-300 px-3 py-2"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          {t('password')}
          <input
            type="password"
            name="password"
            autoComplete="new-password"
            required
            minLength={8}
            className="rounded border border-gray-300 px-3 py-2"
          />
          <span className="text-xs text-gray-500">{t('passwordHint')}</span>
        </label>
        <button
          type="submit"
          className="rounded bg-black px-3 py-2 text-sm font-medium text-white hover:bg-gray-800"
        >
          {t('submit')}
        </button>
      </form>

      <div className="flex items-center gap-3 text-xs text-gray-500">
        <span className="h-px flex-1 bg-gray-200" />
        {t('or')}
        <span className="h-px flex-1 bg-gray-200" />
      </div>

      <form action={signInWithGoogle}>
        <button
          type="submit"
          className="w-full rounded border border-gray-300 px-3 py-2 text-sm font-medium hover:bg-gray-50"
        >
          {t('continueWithGoogle')}
        </button>
      </form>
    </main>
  );
}
