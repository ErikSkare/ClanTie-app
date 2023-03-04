"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.retrieveImage = exports.uploadImage = void 0;
const s3_1 = __importDefault(require("aws-sdk/clients/s3"));
const timekeeper_1 = __importDefault(require("timekeeper"));
const MAX_IMG_SIZE = 5000000;
const UPLOAD_EXPIRES = 60; // seconds
const DOWNLOAD_EXPIRES = 60 * 60; //seconds
const URL_CACHING_TIME = 45; // minutes;
const s3 = new s3_1.default({
    region: process.env.AWS_BUCKET_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
});
function getTruncatedTime() {
    const currentTime = new Date();
    const d = new Date(currentTime);
    d.setMinutes(Math.floor(d.getMinutes() / URL_CACHING_TIME) * URL_CACHING_TIME);
    d.setSeconds(0);
    d.setMilliseconds(0);
    return d;
}
function uploadImage(key) {
    return s3.createPresignedPost({
        Fields: {
            key,
        },
        Conditions: [
            ["starts-with", "$Content-Type", "image/"],
            ["content-length-range", 0, MAX_IMG_SIZE],
        ],
        Expires: UPLOAD_EXPIRES,
        Bucket: process.env.AWS_BUCKET_NAME,
    });
}
exports.uploadImage = uploadImage;
function retrieveImage(key) {
    return timekeeper_1.default.withFreeze(getTruncatedTime(), () => s3.getSignedUrl("getObject", {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key,
        Expires: DOWNLOAD_EXPIRES,
    }));
}
exports.retrieveImage = retrieveImage;
