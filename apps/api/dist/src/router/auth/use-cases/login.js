"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginSchema = void 0;
const zod_1 = require("zod");
const server_1 = require("@trpc/server");
const passwords_1 = __importDefault(require("../passwords"));
const tokens_1 = __importDefault(require("../tokens"));
exports.LoginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string(),
});
async function LoginUseCase(prisma, input) {
    const user = await prisma.user.findUnique({
        where: { email: input.email.toLowerCase() },
    });
    if (!user)
        throw new server_1.TRPCError({ code: "BAD_REQUEST", message: "Hibás adatok!" });
    const isPasswordsMatching = await passwords_1.default.verify(input.password, user.password);
    if (!isPasswordsMatching)
        throw new server_1.TRPCError({ code: "BAD_REQUEST", message: "Hibás adatok!" });
    return tokens_1.default.generate(user.id);
}
exports.default = LoginUseCase;
