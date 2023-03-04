"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupUserIo = void 0;
const trpc_1 = require("../../trpc");
const meWithMemberships_1 = __importDefault(require("./use-cases/meWithMemberships"));
const goOnline_1 = __importDefault(require("./use-cases/goOnline"));
const context_1 = require("../../context");
const goOffline_1 = __importDefault(require("./use-cases/goOffline"));
// Trpc
exports.default = (0, trpc_1.router)({
    meWithMemberships: trpc_1.protectedProcedure.query(async ({ ctx }) => (0, meWithMemberships_1.default)(ctx.prisma, ctx.session)),
});
// Socket.io
function setupUserIo(io) {
    const socketCnt = new Map();
    context_1.prisma.user.updateMany({ data: { isActive: false } });
    io.on("connection", (socket) => {
        var _a;
        const userId = socket.data.userId;
        socketCnt.set(userId, ((_a = socketCnt.get(userId)) !== null && _a !== void 0 ? _a : 0) + 1);
        (0, goOnline_1.default)(context_1.prisma, io, userId);
        socket.on("disconnect", () => {
            var _a;
            socketCnt.set(userId, ((_a = socketCnt.get(userId)) !== null && _a !== void 0 ? _a : 0) - 1);
            if (socketCnt.get(userId) == 0) {
                (0, goOffline_1.default)(context_1.prisma, io, socket.data.userId);
            }
        });
    });
}
exports.setupUserIo = setupUserIo;
