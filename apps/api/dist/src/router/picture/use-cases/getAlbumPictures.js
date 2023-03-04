"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAlbumPicturesSchema = void 0;
const server_1 = require("@trpc/server");
const zod_1 = require("zod");
const pictures_1 = __importDefault(require("../pictures"));
exports.GetAlbumPicturesSchema = zod_1.z.object({
    clanId: zod_1.z.number(),
    cursor: zod_1.z.number().nullish(),
    limit: zod_1.z.number().min(1).max(50).default(5),
});
async function getAlbumPicturesUseCase(prisma, session, input) {
    var _a;
    const userWithClan = await prisma.user.findFirst({
        where: { id: session, memberships: { some: { clanId: input.clanId } } },
    });
    if (!userWithClan)
        throw new server_1.TRPCError({ code: "UNAUTHORIZED" });
    const result = await prisma.picture.findMany({
        where: { senderClanId: input.clanId, saved: true },
        take: input.limit + 1,
        cursor: input.cursor ? { id: input.cursor } : undefined,
        orderBy: {
            id: "asc",
        },
    });
    const newCursor = (_a = result[input.limit]) === null || _a === void 0 ? void 0 : _a.id;
    if (result.length > input.limit) {
        result.pop();
    }
    const picturesService = (0, pictures_1.default)(prisma);
    return {
        result: result.map((picture) => picturesService.populateImageUrl(picture)),
        newCursor,
    };
}
exports.default = getAlbumPicturesUseCase;
