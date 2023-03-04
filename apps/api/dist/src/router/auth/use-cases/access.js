"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tokens_1 = __importDefault(require("../tokens"));
function AccessUseCase(accessToken) {
    if (!accessToken)
        return undefined;
    const userId = tokens_1.default.getUserId(accessToken, process.env.ACCESS_SECRET);
    return userId;
}
exports.default = AccessUseCase;
