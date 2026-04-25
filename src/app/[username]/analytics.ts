'use server';

import { headers } from 'next/headers';

import { prisma } from '@/lib/prisma';

export async function recordView(pageId: string): Promise<void> {
  const h = await headers();
  const userAgent = h.get('user-agent');
  const referrer = h.get('referer');

  await prisma.analyticsEvent.create({
    data: { pageId, type: 'view', userAgent, referrer },
  });
}
