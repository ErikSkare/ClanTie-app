import {Picture, PrismaClient} from "@prisma/client";
import {retrieveImage} from "@/s3";

type withImageUrl<General> = General & {
  imageUrl: string;
};

export default function Pictures(prisma: PrismaClient) {
  return Object.assign(prisma.clanMember, {
    populateImageUrl<T extends Picture>(data: T): withImageUrl<T> {
      const url = retrieveImage(data.key);
      return {
        ...data,
        imageUrl: url,
      };
    },
  });
}
