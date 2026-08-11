import { JSON_RPC_ERRORS } from './jsonRpcErrors.mjs';

const sendJsonRpcError = (res, errorKey, customMessage)=>{
    if (res.headersSent === false) {
        const { code, message, httpStatus } = JSON_RPC_ERRORS[errorKey];
        res.writeHead(httpStatus, {
            'Content-Type': 'application/json'
        });
        res.end(JSON.stringify({
            jsonrpc: '2.0',
            error: {
                code,
                message: message
            },
            id: null
        }));
    }
};

export { sendJsonRpcError };
//# sourceMappingURL=sendJsonRpcError.mjs.map
