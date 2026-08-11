//#region src/integrations/tanstack-start-solid.d.ts
/**
 * TanStack Start cookie plugin for Solid.js.
 *
 * This plugin automatically handles cookie setting for TanStack Start with Solid.js.
 * It uses `@tanstack/solid-start-server` to set cookies.
 *
 * For React, use `better-auth/tanstack-start` instead.
 *
 * @example
 * ```ts
 * import { tanstackStartCookies } from "better-auth/tanstack-start/solid";
 *
 * const auth = betterAuth({
 *   plugins: [tanstackStartCookies()],
 * });
 * ```
 */
declare const tanstackStartCookies: () => {
  id: "tanstack-start-cookies-solid";
  version: string;
  hooks: {
    after: {
      matcher(ctx: import("@better-auth/core").HookEndpointContext): true;
      handler: (inputContext: import("better-call").MiddlewareInputContext<import("better-call").MiddlewareOptions>) => Promise<void>;
    }[];
  };
};
//#endregion
export { tanstackStartCookies };