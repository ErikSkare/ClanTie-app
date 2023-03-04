export type FieldErrors = {
    [x: string]: string[] | undefined;
    [x: number]: string[] | undefined;
    [x: symbol]: string[] | undefined;
};
export declare class ApplicationError extends Error {
    constructor(message: string);
}
export declare class ValidationError extends ApplicationError {
    fieldErrors: FieldErrors;
    constructor(fieldErrors: FieldErrors);
}
