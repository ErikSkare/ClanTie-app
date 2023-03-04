"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const clanMembers_1 = __importDefault(require("../clanMembers"));
async function GetAllClansUseCase(prisma, session) {
    const clanMembersService = (0, clanMembers_1.default)(prisma);
    const clans = await prisma.clan.findMany({
        where: {
            members: { some: { userId: session } },
        },
        include: { members: true },
    });
    return clans.map((clan) => {
        return Object.assign(Object.assign({}, clan), { members: clanMembersService.populateAvatarUrls(clan.members) });
    });
}
exports.default = GetAllClansUseCase;
