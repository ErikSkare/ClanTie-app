import {PrismaClient} from "@prisma/client";
import {z} from "zod";

export const MarkSeenSchema = z.object({
  clanId: z.number(),
  pictureId: z.number(),
});

export default async function markSeenUseCase(
  prisma: PrismaClient,
  session: number,
  input: z.infer<typeof MarkSeenSchema>
) {
  await prisma.clanMemberSeenPicture.create({
    data: {
      memberClanId: input.clanId,
      memberUserId: session,
      pictureId: input.pictureId,
    },
  });

  return {message: "success"};
}
