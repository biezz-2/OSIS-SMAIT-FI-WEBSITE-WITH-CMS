import { z } from '@strapi/utils';
export declare const logToolDefinition: import("@strapi/types/dist/modules/mcp.js").McpToolDefinitionFields<"log", z.ZodObject<{
    message: z.ZodString;
    level: z.ZodDefault<z.ZodEnum<{
        http: "http";
        info: "info";
        error: "error";
        log: "log";
        warn: "warn";
    }>>;
}, z.core.$strip>, z.ZodObject<{
    status: z.ZodString;
    message: z.ZodString;
    level: z.ZodString;
    timestamp: z.ZodString;
}, z.core.$strip>, "Strapi Log", "Logs a message to the Strapi logger with specified level"> & import("@strapi/types/dist/modules/mcp.js").McpDevModeAccess;
//# sourceMappingURL=log.d.ts.map