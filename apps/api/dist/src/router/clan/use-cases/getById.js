"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetByIdSchema = void 0;
const zod_1 = require("zod");
const server_1 = require("@trpc/server");
const clanMembers_1 = __importDefault(require("../clanMembers"));
exports.GetByIdSchema = zod_1.z.object({
    clanId: zod_1.z.number(),
});
async function getByIdUseCase(prisma, session, input) {
    const [clan] = await prisma.$transaction(async (tx) => {
        const clan = await tx.clan.findUnique({
            where: { id: input.clanId },
            include: {
                members: {
                    include: {
                        user: true,
                        sentPictures: {
                            where: {
                                createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
                            },
                            include: { seenBy: { select: { memberUserId: true } } },
                            orderBy: { createdAt: "asc" },
                        },
                    },
                },
            },
        });
        return [clan];
    });
    // Cannot find
    if (!clan)
        throw new server_1.TRPCError({ code: "BAD_REQUEST" });
    // Not member
    if (clan.members.every((member) => member.userId !== session))
        throw new server_1.TRPCError({ code: "UNAUTHORIZED" });
    const clanMembersService = (0, clanMembers_1.default)(prisma);
    return Object.assign(Object.assign({}, clan), { members: clanMembersService
            .populateAvatarUrls(clan.members)
            .map((member) => {
            return Object.assign(Object.assign({}, member), { content: {
                    hasNew: member.sentPictures.some((picture) => picture.seenBy.every((seen) => seen.memberUserId !== session)),
                    hasAny: member.sentPictures.length > 0,
                } });
        }) });
}
exports.default = getByIdUseCase;
