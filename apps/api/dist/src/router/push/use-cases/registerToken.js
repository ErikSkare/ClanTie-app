"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterTokenSchema = void 0;
const utils_1 = require("../../utils");
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
exports.RegisterTokenSchema = zod_1.z.object({ token: zod_1.z.string() });
async function registerTokenUseCase(prisma, session, input) {
    try {
        await prisma.device.create({
            data: { userId: session, pushToken: input.token },
        });
        return { message: "success" };
    }
    catch (error) {
        if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
            if ((0, utils_1.isUniqueConstraintViolation)(error, ["userId", "pushToken"])) {
                return { message: "already registered!" };
            }
        }
    }
}
exports.default = registerTokenUseCase;
