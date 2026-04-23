'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { prisma } from '@/lib/prisma';
import { getOwnerPage } from '@/lib/pages/owner';
import { createClient } from '@/lib/supabase/server';

// Toggles `pages.published`. We re-resolve the owner's page from the session
// (rather than trusting a hidden form field) so a malicious client cannot
// publish somebody else's page by posting their pageId.
export async function togglePublish() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const page = await getOwnerPage(user.id);
  if (!page) {
    redirect('/onboarding');
  }

  await prisma.page.update({
    where: { id: page.id },
    data: { published: !page.published },
  });

  // Invalidate both the dashboard view and the public profile's ISR cache.
  revalidatePath('/dashboard');
  revalidatePath(`/${page.username}`);
}
