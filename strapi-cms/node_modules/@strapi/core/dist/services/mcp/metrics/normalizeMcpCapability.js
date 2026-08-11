'use strict';

const normalizeMcpCapability = (type, rawName, telemetry)=>({
        type,
        source: telemetry?.source ?? 'unknown',
        name: telemetry?.name ?? rawName
    });

exports.normalizeMcpCapability = normalizeMcpCapability;
//# sourceMappingURL=normalizeMcpCapability.js.map
