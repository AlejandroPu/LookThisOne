import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

import { signInWithGoogle, signInWithPassword } from './actions';

export const metadata = {
  title: 'Sign in',
};

type SearchParams = Promise<{ error?: string }>;

export default async function LoginPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { error } = await searchParams;
  const t = await getTranslations('Login');

  return (
    <main className="mx-auto flex min-h-dvh max-w-sm flex-col justify-center gap-6 px-6 py-12">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">{t('title')}</h1>
        <p className="text-sm text-gray-600">
          {t('newHere')}{' '}
          <Link className="underline" href="/signup">
            {t('createAccount')}
          </Link>
          .
        </p>
      </header>

      {error ? (
        <p
          role="alert"
          className="rounded border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-800"
        >
          {error}
        </p>
      ) : null}

      <form action={signInWithPassword} className="flex flex-col gap-3">
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
            autoComplete="current-password"
            required
            minLength={8}
            className="rounded border border-gray-300 px-3 py-2"
          />
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
