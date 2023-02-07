import {ClanMember, PrismaClient} from "@prisma/client";
import {retrieveImage} from "@/s3";

type withAvatarUrl<General> = General & {
  avatarUrl: string;
};

export default function ClanMembers(prisma: PrismaClient) {
  return Object.assign(prisma.clanMember, {
    populateAvatarUrl(data: ClanMember): withAvatarUrl<ClanMember> {
      const url = retrieveImage(data.avatarKey);
      return {
        ...data,
        avatarUrl: url,
      };
    },
    populateAvatarUrls(data: ClanMember[]) {
      const clanMembersService = ClanMembers(prisma);
      return data.map((current) =>
        clanMembersService.populateAvatarUrl(current)
      );
    },
  });
}
