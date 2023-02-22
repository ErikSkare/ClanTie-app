import {PrismaClient} from "@prisma/client";
import {TRPCError} from "@trpc/server";
import {z} from "zod";

export const SaveToAlbumSchema = z.object({
  pictureId: z.number(),
});

export default async function toggleSavedUseCase(
  prisma: PrismaClient,
  session: number,
  input: z.infer<typeof SaveToAlbumSchema>
) {
  await prisma.$transaction(async (tx) => {
    const picture = await tx.picture.findFirst({
      where: {
        id: input.pictureId,
      },
      select: {
        sender: {select: {clan: {select: {members: {select: {userId: true}}}}}},
        saved: true,
      },
    });

    // No picture
    if (!picture) throw new TRPCError({code: "BAD_REQUEST"});

    // Not a member
    if (
      picture.sender.clan.members.every((member) => member.userId !== session)
    )
      throw new TRPCError({code: "UNAUTHORIZED"});

    await tx.picture.update({
      where: {id: input.pictureId},
      data: {saved: true},
    });
  });

  return {message: "success"};
}
