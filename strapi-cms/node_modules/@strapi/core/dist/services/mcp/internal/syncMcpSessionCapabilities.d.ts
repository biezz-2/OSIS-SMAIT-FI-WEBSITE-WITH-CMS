import type { Modules } from '@strapi/types';
import type { McpAdminTokenAbility } from '../authentication';
import type { McpCapabilityDefinitions, McpRegistries } from './McpServerFactory';
export type CanUseMcpCapabilityParams = {
    ability: McpAdminTokenAbility;
    definition: Modules.MCP.McpCapabilityDefinition;
    isDevMode: boolean;
};
export type SyncMcpSessionCapabilitiesParams = {
    registries: McpRegistries;
    definitions: McpCapabilityDefinitions;
    ability: McpAdminTokenAbility;
    isDevMode: boolean;
};
export type SyncMcpSessionCapabilitiesSummary = {
    enabled: string[];
    disabled: string[];
};
export declare const canUseMcpCapability: ({ ability, definition, isDevMode, }: CanUseMcpCapabilityParams) => boolean;
export declare const syncMcpSessionCapabilities: ({ registries, definitions, ability, isDevMode, }: SyncMcpSessionCapabilitiesParams) => SyncMcpSessionCapabilitiesSummary;
//# sourceMappingURL=syncMcpSessionCapabilities.d.ts.map