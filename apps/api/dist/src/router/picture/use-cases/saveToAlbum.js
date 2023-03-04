"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SaveToAlbumSchema = void 0;
const server_1 = require("@trpc/server");
const zod_1 = require("zod");
exports.SaveToAlbumSchema = zod_1.z.object({
    pictureId: zod_1.z.number(),
});
async function toggleSavedUseCase(prisma, session, input) {
    await prisma.$transaction(async (tx) => {
        const picture = await tx.picture.findFirst({
            where: {
                id: input.pictureId,
            },
            select: {
                sender: { select: { clan: { select: { members: { select: { userId: true } } } } } },
                saved: true,
            },
        });
        // No picture
        if (!picture)
            throw new server_1.TRPCError({ code: "BAD_REQUEST" });
        // Not a member
        if (picture.sender.clan.members.every((member) => member.userId !== session))
            throw new server_1.TRPCError({ code: "UNAUTHORIZED" });
        await tx.picture.update({
            where: { id: input.pictureId },
            data: { saved: true },
        });
    });
    return { message: "success" };
}
exports.default = toggleSavedUseCase;
