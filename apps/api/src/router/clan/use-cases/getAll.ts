import {PrismaClient} from "@prisma/client";
import ClanMembers from "../clanMembers";

export default async function GetAllClansUseCase(
  prisma: PrismaClient,
  session: number
) {
  const clanMembersService = ClanMembers(prisma);
  const clans = await prisma.clan.findMany({
    where: {
      members: {some: {userId: session}},
    },
    include: {members: true},
  });
  return clans.map((clan) => {
    return {
      ...clan,
      members: clanMembersService.populateAvatarUrls(clan.members),
    };
  });
}
