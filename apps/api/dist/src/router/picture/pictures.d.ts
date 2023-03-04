import { Picture, PrismaClient } from "@prisma/client";
type withImageUrl<General> = General & {
    imageUrl: string;
};
export default function Pictures(prisma: PrismaClient): import(".prisma/client").Prisma.ClanMemberDelegate<import(".prisma/client").Prisma.RejectOnNotFound | import(".prisma/client").Prisma.RejectPerOperation | undefined> & {
    populateImageUrl<T extends Picture>(data: T): withImageUrl<T>;
};
export {};
