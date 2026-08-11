'use strict';

var jsonRpcErrors = require('./jsonRpcErrors.js');

const sendJsonRpcError = (res, errorKey, customMessage)=>{
    if (res.headersSent === false) {
        const { code, message, httpStatus } = jsonRpcErrors.JSON_RPC_ERRORS[errorKey];
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

exports.sendJsonRpcError = sendJsonRpcError;
//# sourceMappingURL=sendJsonRpcError.js.map
