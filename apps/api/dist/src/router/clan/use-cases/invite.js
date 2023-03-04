"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InviteSchema = void 0;
const zod_1 = require("zod");
const client_1 = require("@prisma/client");
const server_1 = require("@trpc/server");
const errors_1 = require("../../errors");
const utils_1 = require("../../utils");
exports.InviteSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    clanId: zod_1.z.number(),
});
async function InviteUseCase(prisma, io, session, input) {
    const toUser = await prisma.user.findUnique({
        where: { email: input.email.toLowerCase() },
        include: { memberships: true, receivedInvitations: true },
    });
    if (!toUser || // no user
        toUser.id == session || // trying to invite myself
        toUser.memberships.some((value) => value.clanId == input.clanId) || // already member
        toUser.receivedInvitations.some((value) => value.clanId == input.clanId) // already invited
    )
        throw new server_1.TRPCError({
            code: "BAD_REQUEST",
            cause: new errors_1.ValidationError({
                email: ["A cím nem található!"],
            }),
        });
    try {
        const newInv = await prisma.invitation.create({
            data: {
                clanId: input.clanId,
                fromUserId: session,
                toUserId: toUser.id,
            },
            include: {
                fromUser: { select: { id: true, firstName: true, lastName: true } },
                clan: { select: { name: true, id: true } },
            },
        });
        io.to(`user-${newInv.toUserId}`).emit("notification:new", newInv);
    }
    catch (error) {
        if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
            if ((0, utils_1.isUniqueConstraintViolation)(error, ["fromUserId", "toUserId", "clanId"]))
                throw new server_1.TRPCError({
                    code: "BAD_REQUEST",
                    cause: new errors_1.ValidationError({ email: ["A cím nem található!"] }),
                });
        }
    }
}
exports.default = InviteUseCase;
