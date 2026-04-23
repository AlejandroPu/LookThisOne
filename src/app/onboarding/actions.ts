'use server';

import { Prisma } from '@prisma/client';
import { redirect } from 'next/navigation';

import { redirectIfOnboarded } from '@/lib/auth/dal';
import { prisma } from '@/lib/prisma';
import {
  USERNAME_ERROR_MESSAGES,
  validateUsername,
} from '@/lib/validation/username';

export async function createInitialWorkspace(formData: FormData) {
  // Auth gate + bounce if the caller already completed onboarding. Prevents a
  // malicious/stale submission from creating a second workspace for the same
  // user.
  const user = await redirectIfOnboarded();

  const result = validateUsername(String(formData.get('username') ?? ''));

  if (!result.ok) {
    redirect(
      `/onboarding?error=${encodeURIComponent(USERNAME_ERROR_MESSAGES[result.error])}`,
    );
  }

  const username = result.value;

  try {
    await prisma.$transaction(async (tx) => {
      // Idempotent mirror insert. The handle_new_user trigger normally writes
      // this row on auth signup, but upserting here guarantees the FK from
      // workspace_members.user_id holds even if the trigger ever missed.
      await tx.user.upsert({
        where: { id: user.id },
        update: {},
        create: { id: user.id, email: user.email ?? '' },
      });

      const workspace = await tx.workspace.create({
        data: {
          slug: username,
          name: username,
          members: {
            create: { userId: user.id, role: 'OWNER' },
          },
        },
      });

      await tx.page.create({
        data: {
          workspaceId: workspace.id,
          username,
          published: false,
        },
      });
    });
  } catch (error) {
    // P2002 = unique constraint violation. Happens when the chosen username is
    // already taken on `pages.username` or `workspaces.slug`. We let Postgres
    // be the source of truth for uniqueness rather than a pre-flight SELECT,
    // which would race against a concurrent signup.
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      redirect('/onboarding?error=Username%20already%20taken.');
    }
    throw error;
  }

  redirect('/dashboard');
}
