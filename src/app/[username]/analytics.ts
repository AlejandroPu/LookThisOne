'use server';

import { headers } from 'next/headers';

import { prisma } from '@/lib/prisma';
import { hasConsent } from '@/lib/consent/cookie';

export async function recordView(pageId: string): Promise<void> {
  if (!(await hasConsent())) return;

  const h = await headers();
  const userAgent = h.get('user-agent');
  const referrer = h.get('referer');

  await prisma.analyticsEvent.create({
    data: { pageId, type: 'view', userAgent, referrer },
  });
}
