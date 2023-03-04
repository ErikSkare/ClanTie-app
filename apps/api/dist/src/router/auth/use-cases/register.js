"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterSchema = void 0;
const zod_1 = require("zod");
const server_1 = require("@trpc/server");
const client_1 = require("@prisma/client");
const utils_1 = require("../../utils");
const errors_1 = require("../../errors");
const passwords_1 = __importDefault(require("../passwords"));
const tokens_1 = __importDefault(require("../tokens"));
exports.RegisterSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    firstName: zod_1.z.string(),
    lastName: zod_1.z.string(),
    password: zod_1.z.string(),
});
async function RegisterUseCase(prisma, input) {
    try {
        const user = await prisma.user.create({
            data: {
                email: input.email.toLowerCase(),
                firstName: input.firstName,
                lastName: input.lastName,
                password: await passwords_1.default.hash(input.password),
            },
        });
        return tokens_1.default.generate(user.id);
    }
    catch (error) {
        if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
            if ((0, utils_1.isUniqueConstraintViolation)(error, ["email"])) {
                throw new server_1.TRPCError({
                    code: "BAD_REQUEST",
                    cause: new errors_1.ValidationError({
                        email: ["A cím már regisztrálva van!"],
                    }),
                });
            }
        }
    }
}
exports.default = RegisterUseCase;
