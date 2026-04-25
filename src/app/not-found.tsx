import Link from 'next/link';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

export const metadata: Metadata = {
  title: 'Page not found',
};

export default async function NotFound() {
  const t = await getTranslations('NotFound');

  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-24 text-center">
      <p className="text-5xl font-bold text-gray-200">404</p>
      <h1 className="mt-4 text-xl font-semibold text-gray-900">{t('title')}</h1>
      <p className="mt-2 text-sm text-gray-500">{t('description')}</p>
      <Link
        href="/"
        className="mt-8 rounded bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
      >
        {t('goHome')}
      </Link>
    </main>
  );
}
