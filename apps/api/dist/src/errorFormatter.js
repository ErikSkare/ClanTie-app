"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformZodError = void 0;
const zod_1 = require("zod");
const errors_1 = require("./router/errors");
function transformZodError(error) {
    const { fieldErrors } = error.flatten();
    return new errors_1.ValidationError(fieldErrors);
}
exports.transformZodError = transformZodError;
function errorFormatter({ shape, error, }) {
    let transformedError;
    if (error.cause instanceof zod_1.ZodError)
        transformedError = transformZodError(error.cause);
    else
        transformedError = error.cause;
    return Object.assign(Object.assign({}, shape), { data: Object.assign(Object.assign({}, shape.data), { fieldErrors: error.code == "BAD_REQUEST" &&
                transformedError instanceof errors_1.ValidationError
                ? transformedError.fieldErrors
                : null }) });
}
exports.default = errorFormatter;
