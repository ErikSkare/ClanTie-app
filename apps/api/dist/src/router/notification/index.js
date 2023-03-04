"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const trpc_1 = require("../../trpc");
const getReceivedInvitations_1 = __importDefault(require("./use-cases/getReceivedInvitations"));
// Trpc
exports.default = (0, trpc_1.router)({
    getReceivedInvitations: trpc_1.protectedProcedure.query(async ({ ctx }) => {
        return await (0, getReceivedInvitations_1.default)(ctx.prisma, ctx.session);
    }),
});
