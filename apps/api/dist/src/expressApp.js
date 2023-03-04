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
exports.io = void 0;
// eslint-disable-next-line
require("dotenv").config();
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const http_1 = __importDefault(require("http"));
const trpcExpress = __importStar(require("@trpc/server/adapters/express"));
const router_1 = __importDefault(require("./router"));
const context_1 = require("./context");
const io_1 = __importDefault(require("./io"));
const auth_1 = require("./router/auth");
const clan_1 = require("./router/clan");
const user_1 = require("./router/user");
const chat_1 = require("./router/chat");
const PORT = 3000;
const app = (0, express_1.default)();
const httpServer = http_1.default.createServer(app);
const io = (0, io_1.default)(httpServer);
exports.io = io;
app.use("/trpc", trpcExpress.createExpressMiddleware({ router: router_1.default, createContext: context_1.createContext }));
app.use(express_1.default.json());
app.use((0, cors_1.default)());
(0, auth_1.setupAuthRoutes)(app);
(0, auth_1.setupAuthIo)(io);
(0, clan_1.setupClanIo)(io);
(0, user_1.setupUserIo)(io);
(0, chat_1.setupChatIo)(io);
httpServer.listen(PORT);
