import { PrismaClient } from "@prisma/client";
type withAvatarUrl<General> = General & {
    avatarUrl: string;
};
export default function ClanMembers(prisma: PrismaClient): import(".prisma/client").Prisma.ClanMemberDelegate<import(".prisma/client").Prisma.RejectOnNotFound | import(".prisma/client").Prisma.RejectPerOperation | undefined> & {
    populateAvatarUrl<T extends {
        avatarKey: string;
    }>(data: T): withAvatarUrl<T>;
    populateAvatarUrls<T_1 extends {
        avatarKey: string;
    }>(data: T_1[]): withAvatarUrl<T_1>[];
};
export {};
