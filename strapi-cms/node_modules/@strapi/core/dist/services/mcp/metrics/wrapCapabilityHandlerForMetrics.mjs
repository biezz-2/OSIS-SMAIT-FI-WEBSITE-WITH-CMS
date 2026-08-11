import { normalizeMcpCapability } from './normalizeMcpCapability.mjs';
import { sendDidNotExecuteMcpCapability, sendDidExecuteMcpCapability } from './metrics.mjs';

const isCapabilityFailure = (result)=>{
    if (result === null || typeof result !== 'object') {
        return false;
    }
    return 'isError' in result && result.isError === true;
};
const wrapCapabilityHandlerForMetrics = (strapi, type, capabilityName, telemetry, handler)=>{
    const wrapped = async (...args)=>{
        const result = await handler(...args);
        const identity = normalizeMcpCapability(type, capabilityName, telemetry);
        if (isCapabilityFailure(result)) {
            sendDidNotExecuteMcpCapability(strapi, identity, 'execution_error');
        } else {
            sendDidExecuteMcpCapability(strapi, identity);
        }
        return result;
    };
    return wrapped;
};

export { wrapCapabilityHandlerForMetrics };
//# sourceMappingURL=wrapCapabilityHandlerForMetrics.mjs.map
