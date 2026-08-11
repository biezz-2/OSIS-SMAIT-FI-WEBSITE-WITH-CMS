import type { Core } from '@strapi/types';
export declare class McpConfiguration {
    #private;
    readonly path: string;
    readonly connectTimeoutMs: number;
    readonly requestTimeoutMs: number;
    constructor(strapi: Core.Strapi);
    isEnabled(): boolean;
    isDevMode(): boolean;
}
//# sourceMappingURL=McpConfiguration.d.ts.map