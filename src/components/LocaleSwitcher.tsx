'use client';

import { useTransition } from 'react';
import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';

function setLocaleCookie(locale: string) {
  const maxAge = 60 * 60 * 24 * 365;
  const secure =
    typeof location !== 'undefined' && location.protocol === 'https:'
      ? '; Secure'
      : '';
  document.cookie = `lto_locale=${locale}; Path=/; Max-Age=${maxAge}; SameSite=Lax${secure}`;
}

export function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleChange(next: string) {
    setLocaleCookie(next);
    startTransition(() => {
      router.refresh();
    });
  }

  return (
    <div className="flex items-center gap-1 text-xs" aria-label="Language">
      <button
        onClick={() => handleChange('en')}
        disabled={locale === 'en' || isPending}
        className={
          locale === 'en'
            ? 'font-semibold'
            : 'text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
        }
      >
        EN
      </button>
      <span className="text-zinc-300 dark:text-zinc-600" aria-hidden="true">
        |
      </span>
      <button
        onClick={() => handleChange('es')}
        disabled={locale === 'es' || isPending}
        className={
          locale === 'es'
            ? 'font-semibold'
            : 'text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
        }
      >
        ES
      </button>
    </div>
  );
}
