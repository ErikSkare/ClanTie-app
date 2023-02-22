import {PrismaClient} from "@prisma/client";
import {TRPCError} from "@trpc/server";
import {z} from "zod";
import Pictures from "../pictures";

export const GetAlbumPicturesSchema = z.object({
  clanId: z.number(),
  cursor: z.number().nullish(),
  limit: z.number().min(1).max(50).default(5),
});

export default async function getAlbumPicturesUseCase(
  prisma: PrismaClient,
  session: number,
  input: z.infer<typeof GetAlbumPicturesSchema>
) {
  const userWithClan = await prisma.user.findFirst({
    where: {id: session, memberships: {some: {clanId: input.clanId}}},
  });

  if (!userWithClan) throw new TRPCError({code: "UNAUTHORIZED"});

  const result = await prisma.picture.findMany({
    where: {senderClanId: input.clanId, saved: true},
    take: input.limit + 1,
    cursor: input.cursor ? {id: input.cursor} : undefined,
    orderBy: {
      id: "asc",
    },
  });

  const newCursor = result[input.limit]?.id;

  if (result.length > input.limit) {
    result.pop();
  }

  const picturesService = Pictures(prisma);
  return {
    result: result.map((picture) => picturesService.populateImageUrl(picture)),
    newCursor,
  };
}
