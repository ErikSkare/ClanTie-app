import {z} from "zod";
import {PrismaClient} from "@prisma/client";
import ClanMembers from "../clanMembers";
import {TRPCError} from "@trpc/server";

export const GetLastLocationsSchema = z.object({
  clanId: z.number(),
});

export default async function GetLastLocationsUseCase(
  prisma: PrismaClient,
  session: number,
  input: z.infer<typeof GetLastLocationsSchema>
) {
  const membersWithLastPicture = (
    await prisma.clan.findUnique({
      where: {id: input.clanId},
      select: {
        members: {
          include: {
            user: true,
            sentPictures: {
              where: {
                createdAt: {gte: new Date(Date.now() - 24 * 60 * 60 * 1000)},
              },
              orderBy: {createdAt: "desc"},
              take: 1,
            },
          },
        },
      },
    })
  )?.members;

  // No clan
  if (!membersWithLastPicture) throw new TRPCError({code: "BAD_REQUEST"});

  // Not member
  if (membersWithLastPicture.every((member) => member.userId !== session))
    throw new TRPCError({code: "UNAUTHORIZED"});

  const clanMembersService = ClanMembers(prisma);
  return clanMembersService
    .populateAvatarUrls(membersWithLastPicture)
    .map((member) => {
      return {
        ...(member as Omit<typeof member, "sentPictures">),
        lastPosition: {
          longitude: member.sentPictures[0]?.longitude as number | undefined,
          latitude: member.sentPictures[0]?.latitude as number | undefined,
          when: member.sentPictures[0]?.createdAt,
        },
      };
    });
}
