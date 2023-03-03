import {PrismaClient} from "@prisma/client";
import {z} from "zod";
import {Expo, ExpoPushMessage} from "expo-server-sdk";
import {TRPCError} from "@trpc/server";

export const BroadcastToClanSchema = z.object({
  byUserId: z.number(),
  clanId: z.number(),
  title: z.string(),
  body: z.string(),
  data: z.any(),
});

export default async function broadcastToClanUseCase(
  prisma: PrismaClient,
  input: z.infer<typeof BroadcastToClanSchema>
) {
  const expo = new Expo();

  const clan = await prisma.clan.findUnique({
    where: {id: input.clanId},
    select: {
      members: {
        select: {
          user: {select: {id: true, devices: {select: {pushToken: true}}}},
        },
      },
    },
  });

  if (!clan) throw new TRPCError({code: "BAD_REQUEST"});

  const messages: ExpoPushMessage[] = [];

  // Messages
  clan.members.map((member) => {
    if (member.user.id !== input.byUserId) {
      member.user.devices.map((device) => {
        if (Expo.isExpoPushToken(device.pushToken)) {
          messages.push({
            to: device.pushToken,
            sound: "default",
            title: input.title,
            body: input.body,
            data: input.data,
          });
        }
      });
    }
  });

  // Sending notifications
  const chunks = expo.chunkPushNotifications(messages);
  for (const chunk of chunks) {
    expo.sendPushNotificationsAsync(chunk);
  }
}
