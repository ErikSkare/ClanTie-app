"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BroadcastToClanSchema = void 0;
const zod_1 = require("zod");
const expo_server_sdk_1 = require("expo-server-sdk");
const server_1 = require("@trpc/server");
exports.BroadcastToClanSchema = zod_1.z.object({
    byUserId: zod_1.z.number(),
    clanId: zod_1.z.number(),
    title: zod_1.z.string(),
    body: zod_1.z.string(),
    data: zod_1.z.any(),
});
async function broadcastToClanUseCase(prisma, input) {
    const expo = new expo_server_sdk_1.Expo();
    const clan = await prisma.clan.findUnique({
        where: { id: input.clanId },
        select: {
            members: {
                select: {
                    user: { select: { id: true, devices: { select: { pushToken: true } } } },
                },
            },
        },
    });
    if (!clan)
        throw new server_1.TRPCError({ code: "BAD_REQUEST" });
    const messages = [];
    // Messages
    clan.members.map((member) => {
        if (member.user.id !== input.byUserId) {
            member.user.devices.map((device) => {
                if (expo_server_sdk_1.Expo.isExpoPushToken(device.pushToken)) {
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
exports.default = broadcastToClanUseCase;
