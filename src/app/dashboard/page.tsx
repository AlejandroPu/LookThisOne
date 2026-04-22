import { createClient } from '@/lib/supabase/server';

export const metadata = {
  title: 'Dashboard',
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <main className="mx-auto max-w-2xl px-6 py-12">
      <header className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <p className="text-sm text-gray-600">
            Signed in as <span className="font-mono">{user?.email}</span>
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

      <section className="mt-8 rounded border border-dashed border-gray-300 p-6 text-sm text-gray-600">
        Workspace, pages, and links editors land here in the next PR.
      </section>
    </main>
  );
}
