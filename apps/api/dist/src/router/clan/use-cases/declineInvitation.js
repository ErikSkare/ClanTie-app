"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeclineInvitationSchema = void 0;
const zod_1 = require("zod");
exports.DeclineInvitationSchema = zod_1.z.object({
    fromId: zod_1.z.number(),
    clanId: zod_1.z.number(),
});
async function DeclineInvitationUseCase(prisma, session, input) {
    await prisma.invitation.delete({
        where: {
            fromUserId_toUserId_clanId: {
                clanId: input.clanId,
                fromUserId: input.fromId,
                toUserId: session,
            },
        },
    });
}
exports.default = DeclineInvitationUseCase;
