'use server';

import { revalidatePath } from 'next/cache';

import { requirePage } from '@/lib/auth/dal';
import { prisma } from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';
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

// --- Profile actions ---

export type ProfileActionState = { error?: string; success?: boolean } | null;

export async function updateProfile(
  _prev: ProfileActionState,
  formData: FormData,
): Promise<ProfileActionState> {
  const { user, page } = await requirePage();

  const title = formData.get('title');
  const bio = formData.get('bio');
  const avatarFile = formData.get('avatar');

  if (typeof title !== 'string') return { error: 'Invalid display name.' };
  if (typeof bio !== 'string') return { error: 'Invalid bio.' };

  const trimmedTitle = title.trim();
  const trimmedBio = bio.trim();

  if (trimmedTitle.length > 100)
    return { error: 'Display name is too long (max 100 characters).' };
  if (trimmedBio.length > 300)
    return { error: 'Bio is too long (max 300 characters).' };

  let avatarUrl = page.avatarUrl;

  if (avatarFile instanceof File && avatarFile.size > 0) {
    if (!avatarFile.type.startsWith('image/'))
      return { error: 'Avatar must be an image file.' };
    if (avatarFile.size > 2 * 1024 * 1024)
      return { error: 'Avatar must be smaller than 2 MB.' };

    const supabase = await createClient();
    const bytes = await avatarFile.arrayBuffer();

    // Path is always derived from the authenticated user's ID (from the DAL),
    // never from user-supplied input, so no path traversal is possible.
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(`${user.id}/avatar`, bytes, {
        contentType: avatarFile.type,
        upsert: true,
      });

    if (uploadError) return { error: 'Failed to upload avatar. Try again.' };

    const {
      data: { publicUrl },
    } = supabase.storage.from('avatars').getPublicUrl(`${user.id}/avatar`);

    avatarUrl = publicUrl;
  }

  await prisma.page.update({
    where: { id: page.id },
    data: {
      title: trimmedTitle || null,
      bio: trimmedBio || null,
      avatarUrl,
    },
  });

  revalidatePath('/dashboard');
  revalidatePath(`/${page.username}`);
  return { success: true };
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
