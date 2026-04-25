'use client';

import { useOptimistic, useTransition } from 'react';
import { useTranslations } from 'next-intl';

import { setTheme } from './actions';

type Theme = {
  id: string;
  name: string;
  background: string | null;
  foreground: string | null;
  accent: string | null;
};

type PagePreviewData = {
  title: string | null;
  bio: string | null;
  avatarUrl: string | null;
  username: string;
  links: { id: string; title: string }[];
};

type Props = {
  themes: Theme[];
  currentThemeId: string | null;
  page: PagePreviewData;
};

export function ThemePicker({ themes, currentThemeId, page }: Props) {
  const t = useTranslations('Theme');
  const [optimisticThemeId, setOptimisticThemeId] =
    useOptimistic(currentThemeId);
  const [, startTransition] = useTransition();

  const activeTheme = themes.find((t) => t.id === optimisticThemeId) ?? null;
  const bg = activeTheme?.background ?? '#0b0b0f';
  const fg = activeTheme?.foreground ?? '#ffffff';
  const accent = activeTheme?.accent ?? '#6366f1';

  const initial = (page.title ?? page.username).charAt(0).toUpperCase();

  function handleSelect(themeId: string) {
    startTransition(async () => {
      setOptimisticThemeId(themeId);
      await setTheme(themeId);
    });
  }

  return (
    <section className="mt-8 space-y-6 rounded border border-gray-200 p-6">
      <h2 className="text-sm font-medium text-gray-500">{t('heading')}</h2>

      {/* Swatches */}
      <div className="flex flex-wrap gap-3">
        {themes.map((theme) => {
          const isActive = theme.id === optimisticThemeId;
          return (
            <button
              key={theme.id}
              type="button"
              onClick={() => handleSelect(theme.id)}
              title={theme.name}
              className={`flex flex-col items-center gap-1.5 rounded-lg border-2 p-2 transition ${
                isActive
                  ? 'border-black'
                  : 'border-transparent hover:border-gray-300'
              }`}
            >
              {/* Colour chip */}
              <span
                className="block h-8 w-14 rounded"
                style={{ backgroundColor: theme.background ?? '#0b0b0f' }}
              />
              <span className="text-xs text-gray-600">{theme.name}</span>
            </button>
          );
        })}
      </div>

      {/* Live preview */}
      <div
        className="overflow-hidden rounded-xl"
        style={{ backgroundColor: bg, color: fg }}
        aria-label={t('previewAriaLabel')}
      >
        <div className="flex flex-col items-center px-4 py-8">
          {page.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={page.avatarUrl}
              alt={t('avatarAlt')}
              className="mb-3 h-14 w-14 rounded-full object-cover"
            />
          ) : (
            <div
              className="mb-3 flex h-14 w-14 items-center justify-center rounded-full text-xl font-semibold"
              style={{ backgroundColor: accent }}
            >
              {initial}
            </div>
          )}
          <p className="font-bold">{page.title ?? `@${page.username}`}</p>
          {page.bio && (
            <p className="mt-1 text-center text-xs opacity-70">{page.bio}</p>
          )}
          <ul className="mt-4 w-full max-w-xs space-y-2">
            {page.links.slice(0, 3).map((link) => (
              <li key={link.id}>
                <div
                  className="w-full rounded-lg border py-2.5 text-center text-sm font-medium"
                  style={{ borderColor: accent }}
                >
                  {link.title}
                </div>
              </li>
            ))}
            {page.links.length === 0 && (
              <li
                className="w-full rounded-lg border py-2.5 text-center text-sm opacity-40"
                style={{ borderColor: accent }}
              >
                {t('yourLinkHere')}
              </li>
            )}
          </ul>
        </div>
      </div>
    </section>
  );
}
