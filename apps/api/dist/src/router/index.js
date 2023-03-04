"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const trpc_1 = require("../trpc");
const auth_1 = __importDefault(require("./auth"));
const clan_1 = __importDefault(require("./clan"));
const user_1 = __importDefault(require("./user"));
const notification_1 = __importDefault(require("./notification"));
const picture_1 = __importDefault(require("./picture"));
const push_1 = __importDefault(require("./push"));
const chat_1 = __importDefault(require("./chat"));
const appRouter = (0, trpc_1.router)({
    auth: auth_1.default,
    clan: clan_1.default,
    user: user_1.default,
    notification: notification_1.default,
    picture: picture_1.default,
    push: push_1.default,
    chat: chat_1.default,
});
exports.default = appRouter;
