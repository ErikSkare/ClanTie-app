"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendMessageSchema = void 0;
const clanMembers_1 = __importDefault(require("../../clan/clanMembers"));
const s3_1 = require("../../../s3");
const server_1 = require("@trpc/server");
const zod_1 = require("zod");
exports.SendMessageSchema = zod_1.z.object({
    clanId: zod_1.z.number(),
    hasImage: zod_1.z.boolean(),
    content: zod_1.z.string().nullable(),
});
async function SendMessageUseCase(prisma, io, session, input) {
    if (!input.content && !input.hasImage)
        throw new server_1.TRPCError({ code: "BAD_REQUEST" });
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
                        user: { select: { isActive: true, id: true } },
                    },
                },
                createdAt: true,
            },
        });
        let image = undefined;
        if (input.hasImage)
            image = await tx.chatImage.create({ data: { messageId: message.id } });
        return [message, image === null || image === void 0 ? void 0 : image.key];
    });
    const clanMembersService = (0, clanMembers_1.default)(prisma);
    io.to(`chat-${input.clanId}`)
        .except(`user-${session}`)
        .emit("chat:new-message", Object.assign(Object.assign({}, message), { sentBy: clanMembersService.populateAvatarUrl(message.sentBy), images: imageKey ? [{ url: (0, s3_1.retrieveImage)(imageKey) }] : [] }));
    return { upload: imageKey ? (0, s3_1.uploadImage)(imageKey) : undefined };
}
exports.default = SendMessageUseCase;
