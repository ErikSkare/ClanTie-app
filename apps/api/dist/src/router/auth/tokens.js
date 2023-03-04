"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const ACCESS_TOKEN_EXPIRATION = "5m";
const REFRESH_TOKEN_EXPIRATION = "1d";
exports.default = Object.freeze({
    generate(userId) {
        const accessToken = jsonwebtoken_1.default.sign({ userId }, process.env.ACCESS_SECRET, {
            expiresIn: ACCESS_TOKEN_EXPIRATION,
        });
        const refreshToken = jsonwebtoken_1.default.sign({ userId }, process.env.REFRESH_SECRET, {
            expiresIn: REFRESH_TOKEN_EXPIRATION,
        });
        return {
            accessToken,
            refreshToken,
        };
    },
    getUserId(token, secret) {
        if (!token)
            return undefined;
        try {
            const { userId } = jsonwebtoken_1.default.verify(token, secret);
            return userId;
        }
        catch (_a) {
            return undefined;
        }
    },
    getAccessExpirationInMs() {
        // 1 minute
        return 1000 * 15;
    },
});
