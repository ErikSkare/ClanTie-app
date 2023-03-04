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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupAuthIo = exports.setupAuthRoutes = void 0;
const long_timeout_1 = __importDefault(require("long-timeout"));
const trpc_1 = require("../../trpc");
const tokens_1 = __importDefault(require("./tokens"));
const register_1 = __importStar(require("./use-cases/register"));
const login_1 = __importStar(require("./use-cases/login"));
const access_1 = __importDefault(require("./use-cases/access"));
const refresh_1 = __importDefault(require("./use-cases/refresh"));
// Trpc
exports.default = (0, trpc_1.router)({
    register: trpc_1.publicProcedure
        .input(register_1.RegisterSchema)
        .mutation(async ({ input, ctx }) => (0, register_1.default)(ctx.prisma, input)),
    login: trpc_1.publicProcedure
        .input(login_1.LoginSchema)
        .mutation(async ({ input, ctx }) => (0, login_1.default)(ctx.prisma, input)),
});
// Express
function setupAuthRoutes(app) {
    app.post("/refresh", async (req, res) => {
        const result = (0, refresh_1.default)(req.body.refreshToken);
        if (!result)
            return res.sendStatus(400);
        return res.status(200).json(result);
    });
}
exports.setupAuthRoutes = setupAuthRoutes;
// Socket.io
function setupAuthIo(io) {
    io.use((socket, next) => {
        let tokens = {
            accessToken: socket.handshake.auth.accessToken,
            refreshToken: socket.handshake.auth.refreshToken,
        };
        let userId = (0, access_1.default)(tokens.accessToken);
        if (!userId) {
            tokens = (0, refresh_1.default)(tokens.refreshToken);
            if (!tokens)
                return next(new Error("Authentication failed!"));
            socket.emit("me:tokens", tokens);
            userId = (0, access_1.default)(tokens.accessToken);
        }
        socket.data.userId = userId;
        socket.data.refreshToken = tokens.refreshToken;
        return next();
    });
    io.on("connection", (socket) => {
        socket.join(`user-${socket.data.userId}`);
        const interval = long_timeout_1.default.setInterval(() => {
            const result = (0, refresh_1.default)(socket.data.refreshToken);
            if (!result) {
                socket.emit("me:expired");
                return socket.disconnect(true);
            }
            socket.emit("me:tokens", result);
            socket.data.refreshToken = result.refreshToken;
        }, tokens_1.default.getAccessExpirationInMs());
        socket.on("disconnect", () => long_timeout_1.default.clearInterval(interval));
    });
}
exports.setupAuthIo = setupAuthIo;
