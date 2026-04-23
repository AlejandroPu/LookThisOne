import { redirectIfOnboarded } from '@/lib/auth/dal';

import { createInitialWorkspace } from './actions';

export const metadata = {
  title: 'Choose your username',
};

type SearchParams = Promise<{ error?: string }>;

export default async function OnboardingPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  // Auth gate + already-onboarded redirect. Must run here (not in the layout)
  // because Next 16 layouts can't reliably gate child pages.
  await redirectIfOnboarded();

  const { error } = await searchParams;

  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col justify-center gap-6 px-6 py-12">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">Pick your username</h1>
        <p className="text-sm text-gray-600">
          This becomes your public link:{' '}
          <span className="font-mono">lookthis.one/your-username</span>. You can
          change it later from settings.
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

      <form action={createInitialWorkspace} className="flex flex-col gap-3">
        <label className="flex flex-col gap-1 text-sm">
          Username
          <input
            type="text"
            name="username"
            autoComplete="off"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            required
            minLength={3}
            maxLength={20}
            className="rounded border border-gray-300 px-3 py-2 font-mono"
            placeholder="yourname"
          />
          <span className="text-xs text-gray-500">
            3–20 chars. Lowercase letters, digits, underscore or hyphen. Input
            is normalised to lowercase before saving.
          </span>
        </label>
        <button
          type="submit"
          className="rounded bg-black px-3 py-2 text-sm font-medium text-white hover:bg-gray-800"
        >
          Continue
        </button>
      </form>
    </main>
  );
}
