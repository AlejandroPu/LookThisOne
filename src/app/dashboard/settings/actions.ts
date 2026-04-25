'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

import { requirePage } from '@/lib/auth/dal';
import { prisma } from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

export type SettingsActionState = { error?: string; success?: string } | null;

// --- Change email ---

export async function changeEmail(
  _prev: SettingsActionState,
  formData: FormData,
): Promise<SettingsActionState> {
  const { user } = await requirePage();

  const email = String(formData.get('email') ?? '')
    .trim()
    .toLowerCase();
  if (!email) return { error: 'Email is required.' };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return { error: 'Enter a valid email address.' };
  if (email === user.email) return { error: 'That is already your email.' };

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ email });
  if (error) return { error: error.message };

  return {
    success:
      'Confirmation sent. For security, check BOTH inboxes (current and new) and click the link in each. Then log out and back in.',
  };
}

// --- Change password ---

export async function changePassword(
  _prev: SettingsActionState,
  formData: FormData,
): Promise<SettingsActionState> {
  await requirePage();

  const password = String(formData.get('password') ?? '');
  const confirm = String(formData.get('confirm') ?? '');

  if (password.length < 8)
    return { error: 'Password must be at least 8 characters.' };
  if (password !== confirm) return { error: 'Passwords do not match.' };

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password });
  if (error) return { error: error.message };

  return { success: 'Password updated.' };
}

// --- Delete account ---

export async function deleteAccount(
  _prev: SettingsActionState,
  formData: FormData,
): Promise<SettingsActionState> {
  const { user, page } = await requirePage();

  const confirmation = String(formData.get('confirmation') ?? '').trim();
  if (confirmation !== page.username)
    return { error: `Type your username "${page.username}" to confirm.` };

  // 1. Delete storage avatar (best-effort — don't fail if it doesn't exist)
  const supabase = await createClient();
  await supabase.storage
    .from('avatars')
    .remove([`${user.id}/avatar`])
    .catch(() => {});

  // 2. Delete workspaces → cascades: workspace_members, pages, links,
  //    analytics_events (via FK ON DELETE CASCADE defined in the init migration)
  const memberships = await prisma.workspaceMember.findMany({
    where: { userId: user.id },
    select: { workspaceId: true },
  });
  await prisma.workspace.deleteMany({
    where: { id: { in: memberships.map((m) => m.workspaceId) } },
  });

  // 3. Delete the public.users row
  await prisma.user.delete({ where: { id: user.id } });

  // 4. Delete the auth.users row — requires service-role admin client
  const admin = createAdminClient();
  const { error: deleteError } = await admin.auth.admin.deleteUser(user.id);
  if (deleteError) {
    // At this point public data is already gone; log and proceed — the auth
    // orphan can be cleaned up from the Supabase dashboard if needed.
    console.error('Failed to delete auth user:', deleteError.message);
  }

  // 5. Sign out the session and redirect to home
  await supabase.auth.signOut();

  revalidatePath('/');
  redirect('/');
}
