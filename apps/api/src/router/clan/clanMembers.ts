import {PrismaClient} from "@prisma/client";
import {retrieveImage} from "@/s3";

type withAvatarUrl<General> = General & {
  avatarUrl: string;
};

export default function ClanMembers(prisma: PrismaClient) {
  return Object.assign(prisma.clanMember, {
    populateAvatarUrl<T extends {avatarKey: string}>(
      data: T
    ): withAvatarUrl<T> {
      const url = retrieveImage(data.avatarKey);
      return {
        ...data,
        avatarUrl: url,
      };
    },
    populateAvatarUrls<T extends {avatarKey: string}>(data: T[]) {
      const clanMembersService = ClanMembers(prisma);
      return data.map((current) =>
        clanMembersService.populateAvatarUrl(current)
      );
    },
  });
}
