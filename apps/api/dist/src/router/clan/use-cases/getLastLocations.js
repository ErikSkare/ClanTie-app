"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetLastLocationsSchema = void 0;
const zod_1 = require("zod");
const clanMembers_1 = __importDefault(require("../clanMembers"));
const server_1 = require("@trpc/server");
exports.GetLastLocationsSchema = zod_1.z.object({
    clanId: zod_1.z.number(),
});
async function GetLastLocationsUseCase(prisma, session, input) {
    var _a;
    const membersWithLastPicture = (_a = (await prisma.clan.findUnique({
        where: { id: input.clanId },
        select: {
            members: {
                include: {
                    user: true,
                    sentPictures: {
                        where: {
                            createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
                        },
                        orderBy: { createdAt: "desc" },
                        take: 1,
                    },
                },
            },
        },
    }))) === null || _a === void 0 ? void 0 : _a.members;
    // No clan
    if (!membersWithLastPicture)
        throw new server_1.TRPCError({ code: "BAD_REQUEST" });
    // Not member
    if (membersWithLastPicture.every((member) => member.userId !== session))
        throw new server_1.TRPCError({ code: "UNAUTHORIZED" });
    const clanMembersService = (0, clanMembers_1.default)(prisma);
    return clanMembersService
        .populateAvatarUrls(membersWithLastPicture)
        .map((member) => {
        var _a, _b, _c;
        return Object.assign(Object.assign({}, member), { lastPosition: {
                longitude: (_a = member.sentPictures[0]) === null || _a === void 0 ? void 0 : _a.longitude,
                latitude: (_b = member.sentPictures[0]) === null || _b === void 0 ? void 0 : _b.latitude,
                when: (_c = member.sentPictures[0]) === null || _c === void 0 ? void 0 : _c.createdAt,
            } });
    });
}
exports.default = GetLastLocationsUseCase;
