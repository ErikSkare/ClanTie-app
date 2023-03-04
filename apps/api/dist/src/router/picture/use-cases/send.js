"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendSchema = void 0;
const zod_1 = require("zod");
const s3_1 = require("../../../s3");
const broadcastToClan_1 = __importDefault(require("../../push/use-cases/broadcastToClan"));
exports.SendSchema = zod_1.z.object({
    clanId: zod_1.z.number(),
    longitude: zod_1.z.number(),
    latitude: zod_1.z.number(),
});
async function sendUseCase(prisma, io, session, input) {
    const candidate = await prisma.picture.create({
        data: {
            senderUserId: session,
            senderClanId: input.clanId,
            latitude: input.latitude,
            longitude: input.longitude,
        },
        include: { sender: { include: { clan: true } } },
    });
    io.to(`clan-${input.clanId}`).emit("clan:user-picture", session);
    (0, broadcastToClan_1.default)(prisma, {
        byUserId: session,
        clanId: input.clanId,
        title: candidate.sender.clan.name,
        body: `${candidate.sender.nickname} új képet küldött!`,
        data: { clanId: candidate.senderClanId, userId: candidate.senderUserId },
    });
    return (0, s3_1.uploadImage)(candidate.key);
}
exports.default = sendUseCase;
