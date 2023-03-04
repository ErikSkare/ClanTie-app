"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tokens_1 = __importDefault(require("../tokens"));
function RefreshUseCase(refreshToken) {
    if (!refreshToken)
        return undefined;
    const userId = tokens_1.default.getUserId(refreshToken, process.env.REFRESH_SECRET);
    if (!userId)
        return undefined;
    return tokens_1.default.generate(userId);
}
exports.default = RefreshUseCase;
