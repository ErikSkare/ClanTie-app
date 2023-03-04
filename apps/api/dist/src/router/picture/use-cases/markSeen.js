"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarkSeenSchema = void 0;
const zod_1 = require("zod");
exports.MarkSeenSchema = zod_1.z.object({
    clanId: zod_1.z.number(),
    pictureId: zod_1.z.number(),
});
async function markSeenUseCase(prisma, session, input) {
    await prisma.clanMemberSeenPicture.create({
        data: {
            memberClanId: input.clanId,
            memberUserId: session,
            pictureId: input.pictureId,
        },
    });
    return { message: "success" };
}
exports.default = markSeenUseCase;
