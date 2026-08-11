'use strict';

var normalizeMcpCapability = require('./normalizeMcpCapability.js');
var metrics = require('./metrics.js');

const isCapabilityFailure = (result)=>{
    if (result === null || typeof result !== 'object') {
        return false;
    }
    return 'isError' in result && result.isError === true;
};
const wrapCapabilityHandlerForMetrics = (strapi, type, capabilityName, telemetry, handler)=>{
    const wrapped = async (...args)=>{
        const result = await handler(...args);
        const identity = normalizeMcpCapability.normalizeMcpCapability(type, capabilityName, telemetry);
        if (isCapabilityFailure(result)) {
            metrics.sendDidNotExecuteMcpCapability(strapi, identity, 'execution_error');
        } else {
            metrics.sendDidExecuteMcpCapability(strapi, identity);
        }
        return result;
    };
    return wrapped;
};

exports.wrapCapabilityHandlerForMetrics = wrapCapabilityHandlerForMetrics;
//# sourceMappingURL=wrapCapabilityHandlerForMetrics.js.map
