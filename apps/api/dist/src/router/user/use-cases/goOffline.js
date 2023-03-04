"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
async function goOfflineUseCase(prisma, io, session) {
    await prisma.user.update({ where: { id: session }, data: { isActive: false } });
    const clans = await prisma.clan.findMany({
        where: { members: { some: { userId: session } } },
        select: { id: true },
    });
    for (const clan of clans) {
        io.to(`clan-${clan.id}`).emit("clan:user-offline", session);
    }
}
exports.default = goOfflineUseCase;
