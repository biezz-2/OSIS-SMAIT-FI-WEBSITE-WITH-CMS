export type McpCapabilityType = 'tool' | 'prompt' | 'resource';
export type McpCapabilityIdentity = {
    type: McpCapabilityType;
    source: string;
    name: string;
};
export declare const normalizeMcpCapability: (type: McpCapabilityType, rawName: string, telemetry?: {
    source?: string;
    name?: string;
}) => McpCapabilityIdentity;
//# sourceMappingURL=normalizeMcpCapability.d.ts.map