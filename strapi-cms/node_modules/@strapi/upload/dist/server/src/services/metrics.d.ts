import type { Core } from '@strapi/types';
declare const _default: ({ strapi }: {
    strapi: Core.Strapi;
}) => {
    trackUsage(event: string, properties?: Record<string, any>): Promise<boolean>;
    sendUploadPluginMetrics(): Promise<void>;
};
export default _default;
//# sourceMappingURL=metrics.d.ts.map