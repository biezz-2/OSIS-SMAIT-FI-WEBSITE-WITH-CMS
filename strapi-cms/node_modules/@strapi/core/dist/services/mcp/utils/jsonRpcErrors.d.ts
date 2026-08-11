/**
 * JSON-RPC error codes and messages
 * @see https://json-rpc.dev/docs/reference/error-codes
 */
export declare const JSON_RPC_ERRORS: {
    readonly INTERNAL_ERROR: {
        readonly code: -32603;
        readonly message: "Internal error";
        readonly httpStatus: 500;
    };
    readonly AUTHENTICATION_REQUIRED: {
        readonly code: -32000;
        readonly message: "Authentication required";
        readonly httpStatus: 401;
    };
    readonly METHOD_NOT_ALLOWED: {
        readonly code: -32601;
        readonly message: "Method not allowed";
        readonly httpStatus: 405;
    };
};
//# sourceMappingURL=jsonRpcErrors.d.ts.map