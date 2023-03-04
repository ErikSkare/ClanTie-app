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
const expressApp_1 = require("../../expressApp");
const trpc_1 = require("../../trpc");
const send_1 = __importStar(require("./use-cases/send"));
const getByMember_1 = __importStar(require("./use-cases/getByMember"));
const saveToAlbum_1 = __importStar(require("./use-cases/saveToAlbum"));
const getAlbumPictures_1 = __importStar(require("./use-cases/getAlbumPictures"));
const getById_1 = __importStar(require("./use-cases/getById"));
const markSeen_1 = __importStar(require("./use-cases/markSeen"));
// Trpc
exports.default = (0, trpc_1.router)({
    send: trpc_1.protectedProcedure
        .input(send_1.SendSchema)
        .mutation(async ({ ctx, input }) => await (0, send_1.default)(ctx.prisma, expressApp_1.io, ctx.session, input)),
    getByMember: trpc_1.protectedProcedure
        .input(getByMember_1.GetByMemberSchema)
        .query(async ({ ctx, input }) => await (0, getByMember_1.default)(ctx.prisma, ctx.session, input)),
    saveToAlbum: trpc_1.protectedProcedure
        .input(saveToAlbum_1.SaveToAlbumSchema)
        .mutation(async ({ ctx, input }) => await (0, saveToAlbum_1.default)(ctx.prisma, ctx.session, input)),
    getAlbumPictures: trpc_1.protectedProcedure
        .input(getAlbumPictures_1.GetAlbumPicturesSchema)
        .query(async ({ ctx, input }) => await (0, getAlbumPictures_1.default)(ctx.prisma, ctx.session, input)),
    getById: trpc_1.protectedProcedure
        .input(getById_1.GetByIdSchema)
        .query(async ({ ctx, input }) => await (0, getById_1.default)(ctx.prisma, ctx.session, input)),
    markSeen: trpc_1.protectedProcedure
        .input(markSeen_1.MarkSeenSchema)
        .mutation(async ({ ctx, input }) => await (0, markSeen_1.default)(ctx.prisma, ctx.session, input)),
});
