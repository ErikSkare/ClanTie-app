"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateClanSchema = void 0;
const zod_1 = require("zod");
const s3_1 = require("../../../s3");
exports.CreateClanSchema = zod_1.z.object({
    clanName: zod_1.z.string(),
    nickname: zod_1.z.string(),
});
async function CreateClanUseCase(prisma, session, input) {
    const member = await prisma.clanMember.create({
        data: {
            nickname: input.nickname,
            user: { connect: { id: session } },
            clan: {
                create: {
                    name: input.clanName,
                },
            },
        },
    });
    return (0, s3_1.uploadImage)(member.avatarKey);
}
exports.default = CreateClanUseCase;
