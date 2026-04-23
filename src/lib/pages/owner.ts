import { prisma } from '@/lib/prisma';

// Returns the first page owned by the given user, via workspace_members.
// v1 assumes 1 user = 1 workspace = 1 page; when we add multi-workspace, this
// helper needs a workspaceId parameter.
export async function getOwnerPage(userId: string) {
  return prisma.page.findFirst({
    where: {
      workspace: {
        members: { some: { userId } },
      },
    },
    include: {
      links: { orderBy: { position: 'asc' } },
      workspace: true,
    },
  });
}

export type OwnerPage = NonNullable<Awaited<ReturnType<typeof getOwnerPage>>>;
