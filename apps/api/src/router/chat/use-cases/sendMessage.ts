import {uploadImage} from "@/s3";
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
  session: number,
  input: z.infer<typeof SendMessageSchema>
) {
  if (!input.content && !input.hasImage)
    throw new TRPCError({code: "BAD_REQUEST"});

  const [messageId, imageKey] = await prisma.$transaction(async (tx) => {
    const message = await tx.chatMessage.create({
      data: {
        content: input.content,
        senderUserId: session,
        senderClanId: input.clanId,
      },
    });

    let image = undefined;
    if (input.hasImage)
      image = await tx.chatImage.create({data: {messageId: message.id}});

    return [message.id, image?.key];
  });

  return {messageId, upload: imageKey ? uploadImage(imageKey) : undefined};
}
