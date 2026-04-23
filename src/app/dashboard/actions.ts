'use server';

import { revalidatePath } from 'next/cache';

import { requirePage } from '@/lib/auth/dal';
import { prisma } from '@/lib/prisma';

// Toggles `pages.published`. The page is re-resolved from the session (via
// the DAL) rather than trusted from a form field, so a malicious client
// cannot publish somebody else's page by posting their pageId.
export async function togglePublish() {
  const { page } = await requirePage();

  await prisma.page.update({
    where: { id: page.id },
    data: { published: !page.published },
  });

  // Invalidate both the dashboard view and the public profile's ISR cache so
  // the Published/Draft badge and the public page reflect the new state.
  revalidatePath('/dashboard');
  revalidatePath(`/${page.username}`);
}
