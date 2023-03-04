"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetCurrentMemberSchema = void 0;
const server_1 = require("@trpc/server");
const zod_1 = require("zod");
const clanMembers_1 = __importDefault(require("../clanMembers"));
exports.GetCurrentMemberSchema = zod_1.z.object({
    clanId: zod_1.z.number(),
});
async function getCurrentMemberUseCase(prisma, session, input) {
    const member = await prisma.clanMember.findUnique({
        where: { userId_clanId: { userId: session, clanId: input.clanId } },
        include: { user: true },
    });
    if (!member)
        throw new server_1.TRPCError({ code: "BAD_REQUEST" });
    const clanMembersService = (0, clanMembers_1.default)(prisma);
    return clanMembersService.populateAvatarUrl(member);
}
exports.default = getCurrentMemberUseCase;
