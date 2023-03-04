"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetMessagesSchema = void 0;
const clanMembers_1 = __importDefault(require("../../clan/clanMembers"));
const s3_1 = require("../../../s3");
const server_1 = require("@trpc/server");
const zod_1 = require("zod");
exports.GetMessagesSchema = zod_1.z.object({
    clanId: zod_1.z.number(),
    cursor: zod_1.z.number().nullish(),
    limit: zod_1.z.number().min(1).max(50).default(5),
});
async function getMessagesUseCase(prisma, session, input) {
    var _a;
    const userWithClan = await prisma.user.findFirst({
        where: { id: session, memberships: { some: { clanId: input.clanId } } },
    });
    if (!userWithClan)
        throw new server_1.TRPCError({ code: "UNAUTHORIZED" });
    const result = await prisma.chatMessage.findMany({
        where: { senderClanId: input.clanId },
        select: {
            id: true,
            content: true,
            images: { select: { key: true } },
            sentBy: {
                select: {
                    avatarKey: true,
                    nickname: true,
                    user: { select: { isActive: true, id: true } },
                },
            },
            createdAt: true,
        },
        take: input.limit + 1,
        cursor: input.cursor ? { id: input.cursor } : undefined,
        orderBy: { id: "desc" },
    });
    const newCursor = (_a = result[input.limit]) === null || _a === void 0 ? void 0 : _a.id;
    if (result.length > input.limit) {
        result.pop();
    }
    const clanMembersService = (0, clanMembers_1.default)(prisma);
    return {
        result: result.map((message) => {
            return Object.assign(Object.assign({}, message), { sentBy: clanMembersService.populateAvatarUrl(message.sentBy), images: message.images.map((image) => {
                    return { url: (0, s3_1.retrieveImage)(image.key) };
                }) });
        }),
        newCursor,
    };
}
exports.default = getMessagesUseCase;
