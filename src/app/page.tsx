import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

import { LocaleSwitcher } from '@/components/LocaleSwitcher';

const features = [
  {
    title: 'Lorem ipsum dolor sit',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  },
  {
    title: 'Consectetur adipiscing',
    description:
      'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
  },
  {
    title: 'Eiusmod tempor incididunt',
    description:
      'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
  },
  {
    title: 'Labore et dolore magna',
    description:
      'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  },
];

export default async function Home() {
  const tNav = await getTranslations('Nav');
  const tHome = await getTranslations('Home');

  return (
    <div className="flex flex-1 flex-col">
      <header className="border-b border-black/5 dark:border-white/10">
        <nav
          className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-5"
          aria-label={tNav('ariaLabel')}
        >
          <Link
            href="/"
            className="text-lg font-semibold tracking-tight"
            aria-label={tNav('homeAriaLabel')}
          >
            LookThisOne
          </Link>
          <div className="flex items-center gap-3 text-sm">
            <LocaleSwitcher />
            <Link
              href="#features"
              className="hidden text-zinc-600 hover:text-zinc-900 sm:inline dark:text-zinc-400 dark:hover:text-zinc-100"
            >
              {tNav('features')}
            </Link>
            <Link
              href="/dashboard"
              className="rounded-full bg-zinc-900 px-4 py-2 font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              {tNav('getStarted')}
            </Link>
          </div>
        </nav>
      </header>

      <main className="flex flex-1 flex-col">
        <section className="mx-auto w-full max-w-6xl px-6 py-24 sm:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-6 inline-block rounded-full border border-black/10 px-3 py-1 text-xs font-medium tracking-wide text-zinc-600 uppercase dark:border-white/15 dark:text-zinc-400">
              Lorem ipsum dolor
            </p>
            <h1 className="text-5xl leading-tight font-semibold tracking-tight text-balance sm:text-6xl">
              Lorem ipsum dolor sit amet,{' '}
              <span className="text-zinc-500 dark:text-zinc-400">
                consectetur adipiscing elit
              </span>
              .
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-pretty text-zinc-600 dark:text-zinc-400">
              Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/dashboard"
                className="inline-flex h-12 items-center justify-center rounded-full bg-zinc-900 px-6 text-base font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
              >
                {tNav('getStarted')}
              </Link>
              <Link
                href="#features"
                className="inline-flex h-12 items-center justify-center rounded-full border border-black/10 px-6 text-base font-medium transition-colors hover:bg-black/[0.04] dark:border-white/15 dark:hover:bg-white/[0.06]"
              >
                {tHome('learnMore')}
              </Link>
            </div>
          </div>
        </section>

        <section
          id="features"
          aria-labelledby="features-heading"
          className="border-t border-black/5 bg-zinc-50 dark:border-white/10 dark:bg-zinc-950"
        >
          <div className="mx-auto w-full max-w-6xl px-6 py-24">
            <div className="mx-auto max-w-2xl text-center">
              <h2
                id="features-heading"
                className="text-3xl font-semibold tracking-tight sm:text-4xl"
              >
                Lorem ipsum dolor sit amet
              </h2>
              <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
                Consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
                labore et dolore magna aliqua.
              </p>
            </div>

            <ul className="mt-16 grid gap-6 sm:grid-cols-2">
              {features.map((f) => (
                <li
                  key={f.title}
                  className="rounded-2xl border border-black/5 bg-white p-8 dark:border-white/10 dark:bg-zinc-900"
                >
                  <h3 className="text-lg font-semibold tracking-tight">
                    {f.title}
                  </h3>
                  <p className="mt-2 leading-relaxed text-zinc-600 dark:text-zinc-400">
                    {f.description}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-6 py-24 text-center sm:py-32">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Lorem ipsum dolor sit amet.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-zinc-600 dark:text-zinc-400">
            Consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
            labore et dolore magna aliqua.
          </p>
          <div className="mt-8">
            <Link
              href="/dashboard"
              className="inline-flex h-12 items-center justify-center rounded-full bg-zinc-900 px-6 text-base font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              {tNav('getStarted')}
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-black/5 dark:border-white/10">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-3 px-6 py-8 text-sm text-zinc-500 sm:flex-row dark:text-zinc-500">
          <p>{tHome('copyright', { year: new Date().getFullYear() })}</p>
          <a
            href="https://github.com/AlejandroPu/LookThisOne"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-zinc-900 dark:hover:text-zinc-100"
          >
            GitHub
          </a>
        </div>
      </footer>
    </div>
  );
}
