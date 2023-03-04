"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupChatIo = void 0;
const expressApp_1 = require("../../expressApp");
const trpc_1 = require("../../trpc");
const getMessages_1 = __importStar(require("./use-cases/getMessages"));
const sendMessage_1 = __importStar(require("./use-cases/sendMessage"));
// Trpc
exports.default = (0, trpc_1.router)({
    sendMessage: trpc_1.protectedProcedure
        .input(sendMessage_1.SendMessageSchema)
        .mutation(async ({ ctx, input }) => await (0, sendMessage_1.default)(ctx.prisma, expressApp_1.io, ctx.session, input)),
    getMessages: trpc_1.protectedProcedure
        .input(getMessages_1.GetMessagesSchema)
        .query(async ({ ctx, input }) => await (0, getMessages_1.default)(ctx.prisma, ctx.session, input)),
});
// Socket.io
function setupChatIo(io) {
    io.on("connection", (socket) => {
        socket.on("chat:start", (clanId) => socket.join(`chat-${clanId}`));
        socket.on("chat:stop", (clanId) => socket.leave(`chat-${clanId}`));
    });
}
exports.setupChatIo = setupChatIo;
