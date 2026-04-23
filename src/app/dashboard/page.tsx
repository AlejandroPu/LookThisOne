import Link from 'next/link';

import { requirePage } from '@/lib/auth/dal';

import { togglePublish } from './actions';

export const metadata = {
  title: 'Dashboard',
};

export default async function DashboardPage() {
  const { user, page } = await requirePage();
  const publicPath = `/${page.username}`;

  return (
    <main className="mx-auto max-w-2xl px-6 py-12">
      <header className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <p className="text-sm text-gray-600">
            Signed in as <span className="font-mono">{user.email}</span>
          </p>
        </div>
        <form action="/auth/signout" method="post">
          <button
            type="submit"
            className="rounded border border-gray-300 px-3 py-2 text-sm font-medium hover:bg-gray-50"
          >
            Sign out
          </button>
        </form>
      </header>

      <section className="mt-8 space-y-4 rounded border border-gray-200 p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-sm font-medium text-gray-500">Your page</h2>
            <p className="mt-1 font-mono text-lg">lookthis.one{publicPath}</p>
          </div>
          <span
            className={
              page.published
                ? 'rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800'
                : 'rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700'
            }
          >
            {page.published ? 'Published' : 'Draft'}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <form action={togglePublish}>
            <button
              type="submit"
              className="rounded bg-black px-3 py-2 text-sm font-medium text-white hover:bg-gray-800"
            >
              {page.published ? 'Unpublish' : 'Publish'}
            </button>
          </form>

          {page.published ? (
            <Link
              href={publicPath}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded border border-gray-300 px-3 py-2 text-sm font-medium hover:bg-gray-50"
            >
              View public page ↗
            </Link>
          ) : (
            <span className="text-xs text-gray-500">
              Publish to make your page reachable at the URL above.
            </span>
          )}
        </div>
      </section>

      <section className="mt-8 rounded border border-dashed border-gray-300 p-6 text-sm text-gray-600">
        Links editor lands here in the next PR.
      </section>
    </main>
  );
}
