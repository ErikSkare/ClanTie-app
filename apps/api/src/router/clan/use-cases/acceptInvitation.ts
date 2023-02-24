import {z} from "zod";
import {PrismaClient} from "@prisma/client";
import {uploadImage} from "@/s3";
import {IoType} from "@/io";

export const AcceptInvitationSchema = z.object({
  fromId: z.number(),
  clanId: z.number(),
  nickname: z.string(),
});

export default async function AcceptInvitationUseCase(
  prisma: PrismaClient,
  io: IoType,
  session: number,
  input: z.infer<typeof AcceptInvitationSchema>
) {
  // eslint-disable-next-line
  const [invitation, member] = await prisma.$transaction([
    prisma.invitation.delete({
      where: {
        fromUserId_toUserId_clanId: {
          clanId: input.clanId,
          fromUserId: input.fromId,
          toUserId: session,
        },
      },
    }),
    prisma.clanMember.create({
      data: {
        clanId: input.clanId,
        nickname: input.nickname,
        userId: session,
      },
    }),
  ]);

  io.to(`clan-${input.clanId}`).emit("clan:new-member");

  return uploadImage(member.avatarKey);
}
