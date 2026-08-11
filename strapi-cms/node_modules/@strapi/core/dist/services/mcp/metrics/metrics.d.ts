import type { Core } from '@strapi/types';
import type { McpCapabilityIdentity } from './normalizeMcpCapability';
/** Rate-limited via core telemetry `LIMITED_EVENTS`. */
export declare const MCP_LIMITED_TELEMETRY_EVENTS: {
    readonly didStartMcpServer: "didStartMcpServer";
    readonly didUseMcpServer: "didUseMcpServer";
    readonly didNotAuthenticateMcpRequest: "didNotAuthenticateMcpRequest";
    readonly didNotHandleMcpRequest: "didNotHandleMcpRequest";
};
export type McpLimitedTelemetryEvent = (typeof MCP_LIMITED_TELEMETRY_EVENTS)[keyof typeof MCP_LIMITED_TELEMETRY_EVENTS];
export type McpAuthErrorClass = 'missing_token' | 'invalid_token';
export type McpRequestErrorClass = 'timeout' | 'error';
export type McpCapabilityErrorClass = 'execution_error';
export type McpStartTelemetryProperties = {
    path: string;
    numberOfTools: number;
    numberOfPrompts: number;
    numberOfResources: number;
};
/** Resets in-memory capability metrics state (unit tests only). */
export declare const resetMcpMetricsStateForTests: () => void;
export declare const classifyMcpRequestFailure: (error: unknown) => McpRequestErrorClass;
export declare const sendDidStartMcpServer: (strapi: Core.Strapi, properties: McpStartTelemetryProperties) => void;
export declare const sendDidUseMcpServer: (strapi: Core.Strapi) => void;
export declare const sendDidNotAuthenticateMcpRequest: (strapi: Core.Strapi, errorClass: McpAuthErrorClass) => void;
export declare const sendDidNotHandleMcpRequest: (strapi: Core.Strapi, errorClass: McpRequestErrorClass) => void;
export declare const sendDidExecuteMcpCapability: (strapi: Core.Strapi, identity: McpCapabilityIdentity) => void;
export declare const sendDidNotExecuteMcpCapability: (strapi: Core.Strapi, identity: McpCapabilityIdentity, errorClass: McpCapabilityErrorClass) => void;
//# sourceMappingURL=metrics.d.ts.map