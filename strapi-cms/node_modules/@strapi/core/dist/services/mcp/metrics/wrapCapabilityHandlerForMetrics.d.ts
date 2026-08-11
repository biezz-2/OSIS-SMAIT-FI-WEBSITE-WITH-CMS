import type { Core, Modules } from '@strapi/types';
import { type McpCapabilityType } from './normalizeMcpCapability';
export declare const wrapCapabilityHandlerForMetrics: <THandler extends (...args: never[]) => Promise<unknown>>(strapi: Core.Strapi, type: McpCapabilityType, capabilityName: string, telemetry: Modules.MCP.McpCapabilityTelemetry | undefined, handler: THandler) => THandler;
//# sourceMappingURL=wrapCapabilityHandlerForMetrics.d.ts.map