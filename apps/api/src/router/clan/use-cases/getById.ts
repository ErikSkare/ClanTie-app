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
  const [clan] = await prisma.$transaction(async (tx) => {
    const clan = await tx.clan.findUnique({
      where: {id: input.clanId},
      include: {
        members: {
          include: {
            user: true,
            sentPictures: {
              where: {
                createdAt: {gte: new Date(Date.now() - 24 * 60 * 60 * 1000)},
              },
              include: {seenBy: {select: {memberUserId: true}}},
              orderBy: {createdAt: "asc"},
            },
          },
        },
      },
    });

    return [clan];
  });

  // Cannot find
  if (!clan) throw new TRPCError({code: "BAD_REQUEST"});

  // Not member
  if (clan.members.every((member) => member.userId !== session))
    throw new TRPCError({code: "UNAUTHORIZED"});

  const clanMembersService = ClanMembers(prisma);
  return {
    ...clan,
    members: clanMembersService
      .populateAvatarUrls(clan.members)
      .map((member) => {
        return {
          ...(member as Omit<typeof member, "sentPictures">),
          content: {
            hasNew: member.sentPictures.some((picture) =>
              picture.seenBy.every((seen) => seen.memberUserId !== session)
            ),
            hasAny: member.sentPictures.length > 0,
          },
        };
      }),
  };
}
