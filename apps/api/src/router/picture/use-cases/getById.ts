import ClanMembers from "@/router/clan/clanMembers";
import {PrismaClient} from "@prisma/client";
import {TRPCError} from "@trpc/server";
import {z} from "zod";
import Pictures from "../pictures";

export const GetByIdSchema = z.object({
  pictureId: z.number(),
});

export default async function getByIdUseCase(
  prisma: PrismaClient,
  session: number,
  input: z.infer<typeof GetByIdSchema>
) {
  const picture = await prisma.picture.findUnique({
    where: {id: input.pictureId},
    include: {
      sender: {include: {clan: {include: {members: {select: {userId: true}}}}}},
    },
  });

  if (!picture) throw new TRPCError({code: "BAD_REQUEST"});

  if (picture.sender.clan.members.every((member) => member.userId !== session))
    throw new TRPCError({code: "UNAUTHORIZED"});

  const picturesService = Pictures(prisma);
  const clanMembersService = ClanMembers(prisma);
  return {
    ...picturesService.populateImageUrl(picture),
    sender: clanMembersService.populateAvatarUrl(picture.sender),
  };
}
