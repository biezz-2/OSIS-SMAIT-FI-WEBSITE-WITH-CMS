'use strict';

/**
 * JSON-RPC error codes and messages
 * @see https://json-rpc.dev/docs/reference/error-codes
 */ const JSON_RPC_ERRORS = {
    INTERNAL_ERROR: {
        code: -32603,
        message: 'Internal error',
        httpStatus: 500
    },
    AUTHENTICATION_REQUIRED: {
        code: -32e3,
        message: 'Authentication required',
        httpStatus: 401
    },
    METHOD_NOT_ALLOWED: {
        code: -32601,
        message: 'Method not allowed',
        httpStatus: 405
    }
};

exports.JSON_RPC_ERRORS = JSON_RPC_ERRORS;
//# sourceMappingURL=jsonRpcErrors.js.map
