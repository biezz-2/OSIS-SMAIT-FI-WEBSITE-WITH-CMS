import type { Core } from '@strapi/types';
interface ConfigLogger {
    warn: (message: string) => void;
}
/**
 * Log once at startup when deprecated server config keys are present.
 * These keys are not read; warnings point users to the supported alternatives.
 */
export declare const warnDeprecatedServerConfig: (config: Core.ConfigProvider, log: ConfigLogger) => void;
export {};
//# sourceMappingURL=server-config.d.ts.map