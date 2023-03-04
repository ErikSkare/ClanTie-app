"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
async function getReceivedInvitationsUseCase(prisma, session) {
    return await prisma.invitation.findMany({
        where: {
            toUserId: session,
        },
        include: {
            fromUser: { select: { id: true, firstName: true, lastName: true } },
            clan: { select: { name: true, id: true } },
        },
        orderBy: {
            createdAt: "desc",
        },
    });
}
exports.default = getReceivedInvitationsUseCase;
