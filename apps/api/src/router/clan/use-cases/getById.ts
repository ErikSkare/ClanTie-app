import {z} from "zod";
import {PrismaClient} from "@prisma/client";
import {TRPCError} from "@trpc/server";
import ClanMembers from "../clanMembers";

export const GetByIdSchema = z.object({
  clanId: z.number(),
});

export default async function getByIdUseCase(
  prisma: PrismaClient,
  session: number,
  input: z.infer<typeof GetByIdSchema>
) {
  const clan = await prisma.clan.findUnique({
    where: {id: input.clanId},
    include: {
      members: {
        include: {
          user: true,
          sentPictures: {orderBy: {createdAt: "desc"}, take: 1},
        },
      },
    },
  });

  // Cannot find
  if (!clan) throw new TRPCError({code: "BAD_REQUEST"});

  // Not member
  if (clan.members.every((member) => member.userId !== session))
    throw new TRPCError({code: "UNAUTHORIZED"});

  const clanMembersService = ClanMembers(prisma);
  return {
    ...(clan as Omit<typeof clan, "sentPictures">),
    members: clanMembersService
      .populateAvatarUrls(clan.members)
      .map((member) => {
        return {...member, lastPictureId: member.sentPictures[0]?.id};
      }),
  };
}
