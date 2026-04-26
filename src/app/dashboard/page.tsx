import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

import { requirePage } from '@/lib/auth/dal';
import { prisma } from '@/lib/prisma';

import { LocaleSwitcher } from '@/components/LocaleSwitcher';

import { togglePublish } from './actions';
import { LinksEditor } from './LinksEditor';
import { ProfileEditor } from './ProfileEditor';
import { ThemePicker } from './ThemePicker';

export const metadata = {
  title: 'Dashboard',
};

export default async function DashboardPage() {
  const { user, page } = await requirePage();
  const publicPath = `/${page.username}`;
  const t = await getTranslations('Dashboard');

  const builtInThemes = await prisma.theme.findMany({
    where: { isBuiltIn: true },
    select: {
      id: true,
      name: true,
      background: true,
      foreground: true,
      accent: true,
    },
    orderBy: { name: 'asc' },
  });

  return (
    <main className="mx-auto max-w-2xl px-6 py-12">
      <header className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">{t('title')}</h1>
          <p className="text-sm text-gray-600">
            {t('signedInAs')} <span className="font-mono">{user.email}</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <LocaleSwitcher />
          <Link
            href="/dashboard/settings"
            className="rounded border border-gray-300 px-3 py-2 text-sm font-medium hover:bg-gray-50"
          >
            {t('settings')}
          </Link>
          <form action="/auth/signout" method="post">
            <button
              type="submit"
              className="rounded border border-gray-300 px-3 py-2 text-sm font-medium hover:bg-gray-50"
            >
              {t('signOut')}
            </button>
          </form>
        </div>
      </header>

      <section className="mt-8 space-y-4 rounded border border-gray-200 p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-sm font-medium text-gray-500">
              {t('yourPage')}
            </h2>
            <p className="mt-1 font-mono text-lg">lookthis.one{publicPath}</p>
          </div>
          <span
            className={
              page.published
                ? 'rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800'
                : 'rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700'
            }
          >
            {page.published ? t('published') : t('draft')}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <form action={togglePublish}>
            <button
              type="submit"
              className="rounded bg-black px-3 py-2 text-sm font-medium text-white hover:bg-gray-800"
            >
              {page.published ? t('unpublish') : t('publish')}
            </button>
          </form>

          {page.published ? (
            <Link
              href={publicPath}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded border border-gray-300 px-3 py-2 text-sm font-medium hover:bg-gray-50"
            >
              {t('viewPublicPage')}
            </Link>
          ) : (
            <span className="text-xs text-gray-500">{t('publishHint')}</span>
          )}
        </div>
      </section>

      <ProfileEditor
        title={page.title}
        bio={page.bio}
        avatarUrl={page.avatarUrl}
        username={page.username}
      />

      <ThemePicker
        themes={builtInThemes}
        currentThemeId={page.themeId}
        page={{
          title: page.title,
          bio: page.bio,
          avatarUrl: page.avatarUrl,
          username: page.username,
          links: page.links,
        }}
      />

      <LinksEditor links={page.links} />
    </main>
  );
}
