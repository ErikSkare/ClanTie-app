"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createContext = exports.prisma = void 0;
const client_1 = require("@prisma/client");
const access_1 = __importDefault(require("./router/auth/use-cases/access"));
exports.prisma = new client_1.PrismaClient();
async function createContext({ req }) {
    var _a;
    const session = (0, access_1.default)((_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1]);
    return {
        prisma: exports.prisma,
        session,
    };
}
exports.createContext = createContext;
