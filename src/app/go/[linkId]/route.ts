import type { NextRequest } from 'next/server';

import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ linkId: string }> },
) {
  const { linkId } = await params;

  const link = await prisma.link.findFirst({
    where: { id: linkId, enabled: true, page: { published: true } },
    select: { url: true, pageId: true },
  });

  if (!link) {
    return Response.redirect(new URL('/', request.url));
  }

  // Fire-and-forget — don't await so the redirect is instant
  prisma.analyticsEvent
    .create({
      data: {
        pageId: link.pageId,
        linkId,
        type: 'click',
        userAgent: request.headers.get('user-agent'),
        referrer: request.headers.get('referer'),
      },
    })
    .catch(() => {});

  return Response.redirect(link.url);
}
