import {ClanMember, PrismaClient} from "@prisma/client";
import {retrieveImage} from "@/s3";

type withAvatarUrl<General> = General & {
  avatarUrl: string;
};

export default function ClanMembers(prisma: PrismaClient) {
  return Object.assign(prisma.clanMember, {
    async populateAvatarUrl(
      data: ClanMember
    ): Promise<withAvatarUrl<ClanMember>> {
      const url = await retrieveImage(data.avatarKey);
      return {
        ...data,
        avatarUrl: url,
      };
    },
  });
}
