"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationError = exports.ApplicationError = void 0;
class ApplicationError extends Error {
    constructor(message) {
        super(message);
    }
}
exports.ApplicationError = ApplicationError;
class ValidationError extends ApplicationError {
    constructor(fieldErrors) {
        super("Incorrect input!");
        this.fieldErrors = fieldErrors;
    }
}
exports.ValidationError = ValidationError;
