const normalizeMcpCapability = (type, rawName, telemetry)=>({
        type,
        source: telemetry?.source ?? 'unknown',
        name: telemetry?.name ?? rawName
    });

export { normalizeMcpCapability };
//# sourceMappingURL=normalizeMcpCapability.mjs.map
