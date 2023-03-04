"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetByIdSchema = void 0;
const clanMembers_1 = __importDefault(require("../../clan/clanMembers"));
const server_1 = require("@trpc/server");
const zod_1 = require("zod");
const pictures_1 = __importDefault(require("../pictures"));
exports.GetByIdSchema = zod_1.z.object({
    pictureId: zod_1.z.number(),
});
async function getByIdUseCase(prisma, session, input) {
    const picture = await prisma.picture.findUnique({
        where: { id: input.pictureId },
        include: {
            sender: { include: { clan: { include: { members: { select: { userId: true } } } } } },
        },
    });
    if (!picture)
        throw new server_1.TRPCError({ code: "BAD_REQUEST" });
    if (picture.sender.clan.members.every((member) => member.userId !== session))
        throw new server_1.TRPCError({ code: "UNAUTHORIZED" });
    const picturesService = (0, pictures_1.default)(prisma);
    const clanMembersService = (0, clanMembers_1.default)(prisma);
    return Object.assign(Object.assign({}, picturesService.populateImageUrl(picture)), { sender: clanMembersService.populateAvatarUrl(picture.sender) });
}
exports.default = getByIdUseCase;
