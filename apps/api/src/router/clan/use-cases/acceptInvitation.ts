import {z} from "zod";
import {PrismaClient} from "@prisma/client";
import {uploadImage} from "@/s3";

export const AcceptInvitationSchema = z.object({
  fromId: z.number(),
  clanId: z.number(),
  nickname: z.string(),
});

export default async function AcceptInvitationUseCase(
  prisma: PrismaClient,
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
  return uploadImage(member.avatarKey);
}
