"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.protectedProcedure = exports.publicProcedure = exports.middleware = exports.router = void 0;
const server_1 = require("@trpc/server");
const errorFormatter_1 = __importDefault(require("./errorFormatter"));
const superjson_1 = __importDefault(require("superjson"));
const trpc = server_1.initTRPC.context().create({
    transformer: superjson_1.default,
    errorFormatter: errorFormatter_1.default,
});
exports.router = trpc.router;
exports.middleware = trpc.middleware;
exports.publicProcedure = trpc.procedure;
const isAuthed = trpc.middleware(({ next, ctx }) => {
    if (!ctx.session)
        throw new server_1.TRPCError({
            code: "UNAUTHORIZED",
            message: "INVALID_TOKEN",
        });
    return next({ ctx: Object.assign(Object.assign({}, ctx), { session: ctx.session }) });
});
exports.protectedProcedure = trpc.procedure.use(isAuthed);
