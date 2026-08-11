import type { Core } from '@strapi/types';
import type { RegisteredCapability } from '../internal/McpCapabilityRegistry';
/**
 * A no-op registered capability used as fallback when SDK registration fails.
 *
 * This prevents one broken capability from aborting the entire registration loop.
 * The capability will appear as "disabled" and cannot be enabled.
 */
export declare const FAILED_REGISTERED_CAPABILITY: RegisteredCapability;
/**
 * Configuration for creating a safe capability registration
 */
export type SafeCapabilityRegistrationConfig<THandler, TErrorResult, TRegistered> = {
    strapi: Core.Strapi;
    capabilityType: string;
    name: string;
    createHandler: (strapi: Core.Strapi) => THandler;
    createFallbackHandler: (errorMessage: string) => NoInfer<THandler>;
    createErrorResult: (error: Error, args: unknown[]) => TErrorResult;
    registerWithSdk: (safeHandler: THandler) => TRegistered;
};
/**
 * Creates a safe capability registration that protects Strapi core from user callback errors
 * at three levels:
 *
 * - Level 1: Catch factory invocation errors (createHandler throws)
 * - Level 2: Catch runtime execution errors (handler throws during invocation)
 * - Level 3: Catch MCP SDK registration errors (SDK rejects the registration)
 *
 * This prevents one broken capability from:
 * - Aborting the entire registration loop
 * - Crashing the MCP server
 * - Leaking unhandled errors to the user
 */
export declare const createSafeCapabilityRegistration: <THandler, TErrorResult, TRegistered>(config: SafeCapabilityRegistrationConfig<THandler, TErrorResult, TRegistered>) => TRegistered;
//# sourceMappingURL=createSafeCapabilityRegistration.d.ts.map