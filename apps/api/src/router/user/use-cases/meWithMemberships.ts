import {PrismaClient} from "@prisma/client";
import ClanMembers from "@/router/clan/clanMembers";

export default async function MeWithMembershipsUseCase(
  prisma: PrismaClient,
  session: number
) {
  const user = await prisma.user.findUniqueOrThrow({
    where: {
      id: session,
    },
    include: {
      memberships: true,
    },
  });

  const clanMembersService = ClanMembers(prisma);
  return {
    ...user,
    memberships: clanMembersService.populateAvatarUrls(user.memberships),
  };
}
