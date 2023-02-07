import {Clan, ClanMember, PrismaClient} from "@prisma/client";
import ClanMembers from "./clanMembers";

type ClanWithMembers = Clan & {
  members: ClanMember[];
};

export default function Clans(prisma: PrismaClient) {
  return Object.assign(prisma.clan, {
    async populateMemberAvatarUrls(clan: ClanWithMembers) {
      const clanMembers = ClanMembers(prisma);
      return {
        ...clan,
        members: await Promise.all(
          clan.members.map((member) => clanMembers.populateAvatarUrl(member))
        ),
      };
    },
  });
}
