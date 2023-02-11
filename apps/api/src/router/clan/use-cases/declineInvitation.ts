import {z} from "zod";
import {PrismaClient} from "@prisma/client";

export const DeclineInvitationSchema = z.object({
  fromId: z.number(),
  clanId: z.number(),
});

export default async function DeclineInvitationUseCase(
  prisma: PrismaClient,
  session: number,
  input: z.infer<typeof DeclineInvitationSchema>
) {
  await prisma.invitation.delete({
    where: {
      fromUserId_toUserId_clanId: {
        clanId: input.clanId,
        fromUserId: input.fromId,
        toUserId: session,
      },
    },
  });
}
