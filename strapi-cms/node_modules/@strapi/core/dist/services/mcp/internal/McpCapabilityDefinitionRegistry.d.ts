import type { Modules } from '@strapi/types';
export declare class McpCapabilityDefinitionRegistry<CapabilityName extends 'tool' | 'prompt' | 'resource', Definition extends Modules.MCP.McpCapabilityDefinition> {
    #private;
    capability: CapabilityName;
    constructor(capability: CapabilityName);
    get size(): number;
    define(definition: Definition): void;
    get(name: string): Definition | undefined;
    delete(name: string): boolean;
    getAll(): Definition[];
    forEach(callback: (definition: Definition) => void): void;
}
//# sourceMappingURL=McpCapabilityDefinitionRegistry.d.ts.map