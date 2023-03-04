"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemoveTokenSchema = void 0;
const server_1 = require("@trpc/server");
const zod_1 = require("zod");
exports.RemoveTokenSchema = zod_1.z.object({ token: zod_1.z.string() });
async function removeTokenUseCase(prisma, input) {
    try {
        await prisma.device.delete({
            where: { pushToken: input.token },
        });
    }
    catch (err) {
        throw new server_1.TRPCError({ code: "BAD_REQUEST" });
    }
}
exports.default = removeTokenUseCase;
