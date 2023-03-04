"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AcceptInvitationSchema = void 0;
const zod_1 = require("zod");
const s3_1 = require("../../../s3");
exports.AcceptInvitationSchema = zod_1.z.object({
    fromId: zod_1.z.number(),
    clanId: zod_1.z.number(),
    nickname: zod_1.z.string(),
});
async function AcceptInvitationUseCase(prisma, io, session, input) {
    // eslint-disable-next-line
    const [invitation, member] = await prisma.$transaction([
        prisma.invitation.delete({
            where: {
                fromUserId_toUserId_clanId: {
                    clanId: input.clanId,
                    fromUserId: input.fromId,
                    toUserId: session,
                },
            },
        }),
        prisma.clanMember.create({
            data: {
                clanId: input.clanId,
                nickname: input.nickname,
                userId: session,
            },
        }),
    ]);
    io.to(`clan-${input.clanId}`).emit("clan:new-member");
    return (0, s3_1.uploadImage)(member.avatarKey);
}
exports.default = AcceptInvitationUseCase;
