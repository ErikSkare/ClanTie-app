import {IoType} from "@/io";
import ClanMembers from "@/router/clan/clanMembers";
import {retrieveImage, uploadImage} from "@/s3";
import {PrismaClient} from "@prisma/client";
import {TRPCError} from "@trpc/server";
import {z} from "zod";

export const SendMessageSchema = z.object({
  clanId: z.number(),
  hasImage: z.boolean(),
  content: z.string().nullable(),
});

export default async function SendMessageUseCase(
  prisma: PrismaClient,
  io: IoType,
  session: number,
  input: z.infer<typeof SendMessageSchema>
) {
  if (!input.content && !input.hasImage)
    throw new TRPCError({code: "BAD_REQUEST"});

  const [message, imageKey] = await prisma.$transaction(async (tx) => {
    const message = await tx.chatMessage.create({
      data: {
        content: input.content,
        senderUserId: session,
        senderClanId: input.clanId,
      },
      select: {
        id: true,
        content: true,
        sentBy: {
          select: {
            avatarKey: true,
            nickname: true,
            user: {select: {isActive: true, id: true}},
          },
        },
        createdAt: true,
      },
    });

    let image = undefined;
    if (input.hasImage)
      image = await tx.chatImage.create({data: {messageId: message.id}});

    return [message, image?.key];
  });

  const clanMembersService = ClanMembers(prisma);

  io.to(`chat-${input.clanId}`)
    .except(`user-${session}`)
    .emit("chat:new-message", {
      ...(message as Omit<typeof message, "id">),
      sentBy: clanMembersService.populateAvatarUrl(message.sentBy) as Omit<
        typeof message.sentBy,
        "avatarKey"
      > & {avatarUrl: string},
      images: imageKey ? [{url: retrieveImage(imageKey)}] : [],
    });

  return {upload: imageKey ? uploadImage(imageKey) : undefined};
}
