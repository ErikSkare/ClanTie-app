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
exports.setupClanIo = void 0;
const trpc_1 = require("../../trpc");
const expressApp_1 = require("../../expressApp");
const create_1 = __importStar(require("./use-cases/create"));
const getAll_1 = __importDefault(require("./use-cases/getAll"));
const invite_1 = __importStar(require("./use-cases/invite"));
const declineInvitation_1 = __importStar(require("./use-cases/declineInvitation"));
const acceptInvitation_1 = __importStar(require("./use-cases/acceptInvitation"));
const getById_1 = __importStar(require("./use-cases/getById"));
const getLastLocations_1 = __importStar(require("./use-cases/getLastLocations"));
const getCurrentMember_1 = __importStar(require("./use-cases/getCurrentMember"));
// Trpc
exports.default = (0, trpc_1.router)({
    create: trpc_1.protectedProcedure
        .input(create_1.CreateClanSchema)
        .mutation(async ({ input, ctx }) => (0, create_1.default)(ctx.prisma, ctx.session, input)),
    getAll: trpc_1.protectedProcedure.query(async ({ ctx }) => (0, getAll_1.default)(ctx.prisma, ctx.session)),
    getById: trpc_1.protectedProcedure
        .input(getById_1.GetByIdSchema)
        .query(async ({ ctx, input }) => (0, getById_1.default)(ctx.prisma, ctx.session, input)),
    invite: trpc_1.protectedProcedure
        .input(invite_1.InviteSchema)
        .mutation(async ({ input, ctx }) => (0, invite_1.default)(ctx.prisma, expressApp_1.io, ctx.session, input)),
    declineInvitation: trpc_1.protectedProcedure
        .input(declineInvitation_1.DeclineInvitationSchema)
        .mutation(async ({ input, ctx }) => (0, declineInvitation_1.default)(ctx.prisma, ctx.session, input)),
    acceptInvitation: trpc_1.protectedProcedure
        .input(acceptInvitation_1.AcceptInvitationSchema)
        .mutation(async ({ input, ctx }) => (0, acceptInvitation_1.default)(ctx.prisma, expressApp_1.io, ctx.session, input)),
    getLastLocations: trpc_1.protectedProcedure
        .input(getLastLocations_1.GetLastLocationsSchema)
        .query(async ({ input, ctx }) => await (0, getLastLocations_1.default)(ctx.prisma, ctx.session, input)),
    getCurrentMember: trpc_1.protectedProcedure
        .input(getCurrentMember_1.GetCurrentMemberSchema)
        .query(async ({ input, ctx }) => await (0, getCurrentMember_1.default)(ctx.prisma, ctx.session, input)),
});
// Socket.io
function setupClanIo(io) {
    io.on("connection", (socket) => {
        socket.on("clan:start", (clanId) => {
            socket.join(`clan-${clanId}`);
        });
        socket.on("clan:stop", (clanId) => {
            socket.leave(`clan-${clanId}`);
        });
    });
}
exports.setupClanIo = setupClanIo;
