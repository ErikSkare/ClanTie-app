"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exclude = exports.isUniqueConstraintViolation = void 0;
function isUniqueConstraintViolation(error, key) {
    const isUniqueConstraintViolation = error.code == "P2002";
    if (!isUniqueConstraintViolation)
        return false;
    const castedError = error;
    let isViolationWithKey = true;
    for (const curr of key)
        isViolationWithKey && (isViolationWithKey = castedError.meta.target.includes(curr));
    return isViolationWithKey;
}
exports.isUniqueConstraintViolation = isUniqueConstraintViolation;
function exclude(object, keys) {
    for (const key of keys) {
        delete object[key];
    }
    return object;
}
exports.exclude = exclude;
