/** Rate-limited via core telemetry `LIMITED_EVENTS`. */ const MCP_LIMITED_TELEMETRY_EVENTS = {
    didStartMcpServer: 'didStartMcpServer',
    didUseMcpServer: 'didUseMcpServer',
    didNotAuthenticateMcpRequest: 'didNotAuthenticateMcpRequest',
    didNotHandleMcpRequest: 'didNotHandleMcpRequest'
};
const ONE_DAY_MS = 24 * 60 * 60 * 1000;
let capabilityCacheExpiresAt = Date.now() + ONE_DAY_MS;
const executedCapabilities = new Set();
const failedCapabilities = new Set();
const capabilityCacheKey = (identity, succeeded)=>`${succeeded ? 'execute' : 'notExecute'}:${identity.type}:${identity.source}:${identity.name}`;
const shouldSendCapabilityEvent = (identity, succeeded)=>{
    const cache = succeeded ? executedCapabilities : failedCapabilities;
    if (Date.now() > capabilityCacheExpiresAt) {
        executedCapabilities.clear();
        failedCapabilities.clear();
        capabilityCacheExpiresAt = Date.now() + ONE_DAY_MS;
    }
    const key = capabilityCacheKey(identity, succeeded);
    if (cache.has(key)) {
        return false;
    }
    cache.add(key);
    return true;
};
const classifyMcpRequestFailure = (error)=>{
    if (error instanceof Error && error.message.includes('timed out')) {
        return 'timeout';
    }
    return 'error';
};
const sendDidStartMcpServer = (strapi, properties)=>{
    strapi.telemetry.send(MCP_LIMITED_TELEMETRY_EVENTS.didStartMcpServer, {
        eventProperties: {
            path: properties.path
        },
        groupProperties: {
            numberOfTools: properties.numberOfTools,
            numberOfPrompts: properties.numberOfPrompts,
            numberOfResources: properties.numberOfResources
        }
    }).catch(()=>{});
};
const sendDidUseMcpServer = (strapi)=>{
    strapi.telemetry.send(MCP_LIMITED_TELEMETRY_EVENTS.didUseMcpServer).catch(()=>{});
};
const sendDidNotAuthenticateMcpRequest = (strapi, errorClass)=>{
    strapi.telemetry.send(MCP_LIMITED_TELEMETRY_EVENTS.didNotAuthenticateMcpRequest, {
        eventProperties: {
            errorClass
        }
    }).catch(()=>{});
};
const sendDidNotHandleMcpRequest = (strapi, errorClass)=>{
    strapi.telemetry.send(MCP_LIMITED_TELEMETRY_EVENTS.didNotHandleMcpRequest, {
        eventProperties: {
            errorClass
        }
    }).catch(()=>{});
};
const sendDidExecuteMcpCapability = (strapi, identity)=>{
    if (!shouldSendCapabilityEvent(identity, true)) {
        return;
    }
    strapi.telemetry.send('didExecuteMcpCapability', {
        eventProperties: {
            type: identity.type,
            source: identity.source,
            name: identity.name
        }
    }).catch(()=>{});
};
const sendDidNotExecuteMcpCapability = (strapi, identity, errorClass)=>{
    if (!shouldSendCapabilityEvent(identity, false)) {
        return;
    }
    strapi.telemetry.send('didNotExecuteMcpCapability', {
        eventProperties: {
            type: identity.type,
            source: identity.source,
            name: identity.name,
            errorClass
        }
    }).catch(()=>{});
};

export { MCP_LIMITED_TELEMETRY_EVENTS, classifyMcpRequestFailure, sendDidExecuteMcpCapability, sendDidNotAuthenticateMcpRequest, sendDidNotExecuteMcpCapability, sendDidNotHandleMcpRequest, sendDidStartMcpServer, sendDidUseMcpServer };
//# sourceMappingURL=metrics.mjs.map
