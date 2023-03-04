"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetByMemberSchema = void 0;
const zod_1 = require("zod");
const server_1 = require("@trpc/server");
const pictures_1 = __importDefault(require("../pictures"));
const clanMembers_1 = __importDefault(require("../../clan/clanMembers"));
exports.GetByMemberSchema = zod_1.z.object({
    clanId: zod_1.z.number(),
    userId: zod_1.z.number(),
});
async function getByMemberUseCase(prisma, session, input) {
    const userWithClan = await prisma.user.findFirst({
        where: { id: session, memberships: { some: { clanId: input.clanId } } },
    });
    if (!userWithClan)
        throw new server_1.TRPCError({ code: "UNAUTHORIZED" });
    const [pictures, offset, seenAll] = await prisma.$transaction(async (tx) => {
        let pictures = await tx.picture.findMany({
            where: {
                sender: { clanId: input.clanId, userId: input.userId },
                createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
                seenBy: { none: { memberUserId: session } },
            },
            include: {
                sender: true,
            },
            orderBy: { createdAt: "asc" },
        });
        let offset = 0;
        let seenAll = false;
        if (pictures.length > 0) {
            offset = await tx.picture.count({
                where: {
                    sender: { clanId: input.clanId, userId: input.userId },
                    createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
                    seenBy: { some: { memberUserId: session } },
                },
            });
        }
        else {
            seenAll = true;
            pictures = await tx.picture.findMany({
                where: {
                    sender: { clanId: input.clanId, userId: input.userId },
                    createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
                },
                include: {
                    sender: true,
                },
                orderBy: { createdAt: "asc" },
            });
        }
        return [pictures, offset, seenAll];
    });
    const picturesService = (0, pictures_1.default)(prisma);
    const clanMemberService = (0, clanMembers_1.default)(prisma);
    return {
        pictures: pictures
            .map((picture) => picturesService.populateImageUrl(picture))
            .map((picture) => {
            return Object.assign(Object.assign({}, picture), { sender: clanMemberService.populateAvatarUrl(picture.sender) });
        }),
        offset,
        seenAll,
    };
}
exports.default = getByMemberUseCase;
