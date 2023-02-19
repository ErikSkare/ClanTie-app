import {z} from "zod";
import {PrismaClient} from "@prisma/client";
import {TRPCError} from "@trpc/server";
import Pictures from "../pictures";
import ClanMembers from "@/router/clan/clanMembers";

export const GetByMemberSchema = z.object({
  clanId: z.number(),
  userId: z.number(),
});

export default async function getByMemberUseCase(
  prisma: PrismaClient,
  session: number,
  input: z.infer<typeof GetByMemberSchema>
) {
  const userWithClan = await prisma.user.findFirst({
    where: {id: session, memberships: {some: {clanId: input.clanId}}},
  });

  if (!userWithClan) throw new TRPCError({code: "UNAUTHORIZED"});

  const pictures = await prisma.picture.findMany({
    where: {
      sender: {clanId: input.clanId, userId: input.userId},
      createdAt: {gte: new Date(Date.now() - 24 * 60 * 60 * 1000)},
    },
    include: {
      sender: true,
    },
    orderBy: {createdAt: "asc"},
  });

  const picturesService = Pictures(prisma);
  const clanMemberService = ClanMembers(prisma);
  return pictures
    .map((picture) => picturesService.populateImageUrl(picture))
    .map((picture) => {
      return {
        ...picture,
        sender: clanMemberService.populateAvatarUrl(picture.sender),
      };
    });
}
