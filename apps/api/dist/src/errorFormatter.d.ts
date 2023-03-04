import { DefaultErrorShape, TRPCError } from "@trpc/server";
import { ZodError } from "zod";
import { ValidationError } from "./router/errors";
export declare function transformZodError(error: ZodError): ValidationError;
export default function errorFormatter({ shape, error, }: {
    shape: DefaultErrorShape;
    error: TRPCError;
}): {
    data: {
        fieldErrors: import("./router/errors").FieldErrors | null;
        code: "PARSE_ERROR" | "BAD_REQUEST" | "INTERNAL_SERVER_ERROR" | "UNAUTHORIZED" | "FORBIDDEN" | "NOT_FOUND" | "METHOD_NOT_SUPPORTED" | "TIMEOUT" | "CONFLICT" | "PRECONDITION_FAILED" | "PAYLOAD_TOO_LARGE" | "TOO_MANY_REQUESTS" | "CLIENT_CLOSED_REQUEST";
        httpStatus: number;
        path?: string | undefined;
        stack?: string | undefined;
    };
    message: string;
    code: import("@trpc/server/dist/rpc").TRPC_ERROR_CODE_NUMBER;
};
