import { notFound } from 'next/navigation';
import Image from 'next/image';
import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';

export const revalidate = 60;

type Params = Promise<{ username: string }>;

async function getPage(username: string) {
  return prisma.page.findFirst({
    where: { username, published: true },
    include: {
      theme: true,
      links: {
        where: { enabled: true },
        orderBy: { position: 'asc' },
      },
    },
  });
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { username } = await params;
  const page = await getPage(username);
  if (!page) return { title: 'No encontrado' };

  return {
    title: page.title ?? `@${page.username}`,
    description: page.bio ?? undefined,
    openGraph: {
      title: page.title ?? `@${page.username}`,
      description: page.bio ?? undefined,
      images: page.avatarUrl ? [{ url: page.avatarUrl }] : undefined,
    },
  };
}

export default async function ProfilePage({ params }: { params: Params }) {
  const { username } = await params;
  const page = await getPage(username);

  if (!page) notFound();

  const bg = page.theme?.background ?? '#0b0b0f';
  const fg = page.theme?.foreground ?? '#ffffff';
  const accent = page.theme?.accent ?? '#6366f1';

  return (
    <main
      className="flex min-h-screen flex-col items-center px-4 py-16"
      style={{ backgroundColor: bg, color: fg }}
    >
      <div className="flex w-full max-w-md flex-col items-center">
        {page.avatarUrl ? (
          <Image
            src={page.avatarUrl}
            alt={page.title ?? page.username}
            width={96}
            height={96}
            className="mb-4 h-24 w-24 rounded-full object-cover"
          />
        ) : (
          <div
            className="mb-4 flex h-24 w-24 items-center justify-center rounded-full text-3xl font-semibold"
            style={{ backgroundColor: accent }}
          >
            {page.username.charAt(0).toUpperCase()}
          </div>
        )}

        <h1 className="text-2xl font-bold">
          {page.title ?? `@${page.username}`}
        </h1>
        {page.bio && <p className="mt-2 text-center opacity-80">{page.bio}</p>}

        <ul className="mt-8 w-full space-y-3">
          {page.links.map((link) => (
            <li key={link.id}>
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full rounded-xl border py-4 text-center font-medium transition hover:scale-[1.02]"
                style={{ borderColor: accent }}
              >
                {link.title}
              </a>
            </li>
          ))}
        </ul>

        {page.links.length === 0 && (
          <p className="mt-8 text-sm opacity-60">Todavía no hay links.</p>
        )}
      </div>
    </main>
  );
}
