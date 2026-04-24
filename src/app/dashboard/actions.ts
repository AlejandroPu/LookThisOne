'use server';

import { revalidatePath } from 'next/cache';

import { requirePage } from '@/lib/auth/dal';
import { prisma } from '@/lib/prisma';
import { validateLink, LINK_ERROR_MESSAGES } from '@/lib/validation/link';

export async function togglePublish() {
  const { page } = await requirePage();

  await prisma.page.update({
    where: { id: page.id },
    data: { published: !page.published },
  });

  revalidatePath('/dashboard');
  revalidatePath(`/${page.username}`);
}

// --- Link actions ---
// All actions re-resolve the page from the session via the DAL. linkId
// ownership is verified against that page before any mutation.

export type LinkActionState = { error?: string } | null;

export async function createLink(
  _prev: LinkActionState,
  formData: FormData,
): Promise<LinkActionState> {
  const { page } = await requirePage();

  const result = validateLink({
    title: formData.get('title'),
    url: formData.get('url'),
  });
  if (!result.ok) return { error: LINK_ERROR_MESSAGES[result.error] };

  const count = await prisma.link.count({ where: { pageId: page.id } });

  await prisma.link.create({
    data: {
      pageId: page.id,
      title: result.value.title,
      url: result.value.url,
      position: count,
    },
  });

  revalidatePath('/dashboard');
  revalidatePath(`/${page.username}`);
  return {};
}

export async function updateLink(
  linkId: string,
  _prev: LinkActionState,
  formData: FormData,
): Promise<LinkActionState> {
  const { page } = await requirePage();

  const existing = await prisma.link.findFirst({
    where: { id: linkId, pageId: page.id },
  });
  if (!existing) return { error: 'Link not found.' };

  const result = validateLink({
    title: formData.get('title'),
    url: formData.get('url'),
  });
  if (!result.ok) return { error: LINK_ERROR_MESSAGES[result.error] };

  await prisma.link.update({
    where: { id: linkId },
    data: { title: result.value.title, url: result.value.url },
  });

  revalidatePath('/dashboard');
  revalidatePath(`/${page.username}`);
  return {};
}

export async function deleteLink(linkId: string): Promise<void> {
  const { page } = await requirePage();

  // deleteMany lets us filter by pageId in one query; silently no-ops if the
  // link doesn't belong to this page (prevents cross-user deletion).
  await prisma.link.deleteMany({ where: { id: linkId, pageId: page.id } });

  revalidatePath('/dashboard');
  revalidatePath(`/${page.username}`);
}

export async function toggleLinkEnabled(linkId: string): Promise<void> {
  const { page } = await requirePage();

  const link = await prisma.link.findFirst({
    where: { id: linkId, pageId: page.id },
  });
  if (!link) return;

  await prisma.link.update({
    where: { id: linkId },
    data: { enabled: !link.enabled },
  });

  revalidatePath('/dashboard');
  revalidatePath(`/${page.username}`);
}

export async function reorderLinks(orderedIds: string[]): Promise<void> {
  const { page } = await requirePage();

  const existing = await prisma.link.findMany({
    where: { pageId: page.id },
    select: { id: true },
  });

  // Reject if the submitted order is not a permutation of the page's links:
  // same count, same set. Prevents partial reorders, cross-page IDs, and
  // duplicates from corrupting `position`.
  const existingIds = new Set(existing.map((l) => l.id));
  if (
    orderedIds.length !== existingIds.size ||
    new Set(orderedIds).size !== orderedIds.length ||
    !orderedIds.every((id) => existingIds.has(id))
  ) {
    return;
  }

  await prisma.$transaction(
    orderedIds.map((id, index) =>
      prisma.link.update({ where: { id }, data: { position: index } }),
    ),
  );

  revalidatePath('/dashboard');
  revalidatePath(`/${page.username}`);
}
