"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const clanMembers_1 = __importDefault(require("../../clan/clanMembers"));
async function MeWithMembershipsUseCase(prisma, session) {
    const user = await prisma.user.findUniqueOrThrow({
        where: {
            id: session,
        },
        include: {
            memberships: true,
        },
    });
    const clanMembersService = (0, clanMembers_1.default)(prisma);
    return Object.assign(Object.assign({}, user), { memberships: clanMembersService.populateAvatarUrls(user.memberships) });
}
exports.default = MeWithMembershipsUseCase;
