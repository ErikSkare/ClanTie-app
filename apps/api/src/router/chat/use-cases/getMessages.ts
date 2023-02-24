import ClanMembers from "@/router/clan/clanMembers";
import {retrieveImage} from "@/s3";
import {PrismaClient} from "@prisma/client";
import {TRPCError} from "@trpc/server";
import {z} from "zod";

export const GetMessagesSchema = z.object({
  clanId: z.number(),
  cursor: z.number().nullish(),
  limit: z.number().min(1).max(50).default(5),
});

export default async function getMessagesUseCase(
  prisma: PrismaClient,
  session: number,
  input: z.infer<typeof GetMessagesSchema>
) {
  const userWithClan = await prisma.user.findFirst({
    where: {id: session, memberships: {some: {clanId: input.clanId}}},
  });

  if (!userWithClan) throw new TRPCError({code: "UNAUTHORIZED"});

  const result = await prisma.chatMessage.findMany({
    where: {senderClanId: input.clanId},
    select: {
      id: true,
      content: true,
      images: {select: {key: true}},
      sentBy: {
        select: {
          avatarKey: true,
          nickname: true,
          user: {select: {isActive: true, id: true}},
        },
      },
      createdAt: true,
    },
    take: input.limit + 1,
    cursor: input.cursor ? {id: input.cursor} : undefined,
    orderBy: {id: "desc"},
  });

  const newCursor = result[input.limit]?.id;

  if (result.length > input.limit) {
    result.pop();
  }

  const clanMembersService = ClanMembers(prisma);
  return {
    result: result.map((message) => {
      return {
        ...(message as Omit<typeof message, "id">),
        sentBy: clanMembersService.populateAvatarUrl(message.sentBy) as Omit<
          typeof message.sentBy,
          "avatarKey"
        > & {avatarUrl: string},
        images: message.images.map((image) => {
          return {url: retrieveImage(image.key)};
        }),
      };
    }),
    newCursor,
  };
}
