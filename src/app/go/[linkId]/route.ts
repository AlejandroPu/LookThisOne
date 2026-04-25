import { after } from 'next/server';
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

  // Defence in depth: validateLink already rejects non-http(s) at write time,
  // but re-validating here means this route cannot become an open redirect
  // even if a bad URL ever lands in the DB through another code path.
  let target: URL;
  try {
    target = new URL(link.url);
  } catch {
    return Response.redirect(new URL('/', request.url));
  }
  if (target.protocol !== 'http:' && target.protocol !== 'https:') {
    return Response.redirect(new URL('/', request.url));
  }

  // after() runs the insert in the same invocation lifetime but after the
  // response has been sent. A bare fire-and-forget Promise can be cut short
  // when a Vercel function freezes — after() guarantees execution.
  after(() =>
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
      .catch(() => {}),
  );

  return Response.redirect(target.toString());
}
