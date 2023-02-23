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

  const [pictures, offset, seenAll] = await prisma.$transaction(async (tx) => {
    let pictures = await tx.picture.findMany({
      where: {
        sender: {clanId: input.clanId, userId: input.userId},
        createdAt: {gte: new Date(Date.now() - 24 * 60 * 60 * 1000)},
        seenBy: {none: {memberUserId: session}},
      },
      include: {
        sender: true,
      },
      orderBy: {createdAt: "asc"},
    });

    let offset = 0;
    let seenAll = false;

    if (pictures.length > 0) {
      offset = await tx.picture.count({
        where: {
          sender: {clanId: input.clanId, userId: input.userId},
          createdAt: {gte: new Date(Date.now() - 24 * 60 * 60 * 1000)},
          seenBy: {some: {memberUserId: session}},
        },
      });
    } else {
      seenAll = true;
      pictures = await tx.picture.findMany({
        where: {
          sender: {clanId: input.clanId, userId: input.userId},
          createdAt: {gte: new Date(Date.now() - 24 * 60 * 60 * 1000)},
        },
        include: {
          sender: true,
        },
        orderBy: {createdAt: "asc"},
      });
    }

    return [pictures, offset, seenAll];
  });

  const picturesService = Pictures(prisma);
  const clanMemberService = ClanMembers(prisma);
  return {
    pictures: pictures
      .map((picture) => picturesService.populateImageUrl(picture))
      .map((picture) => {
        return {
          ...picture,
          sender: clanMemberService.populateAvatarUrl(picture.sender),
        };
      }),
    offset,
    seenAll,
  };
}
