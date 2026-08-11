//#region src/integrations/tanstack-start.d.ts
/**
 * TanStack Start cookie plugin for React.
 *
 * This plugin automatically handles cookie setting for TanStack Start with React.
 * It uses `@tanstack/react-start-server` to set cookies.
 *
 * For Solid.js, use `better-auth/tanstack-start/solid` instead.
 *
 * @example
 * ```ts
 * import { tanstackStartCookies } from "better-auth/tanstack-start";
 *
 * const auth = betterAuth({
 *   plugins: [tanstackStartCookies()],
 * });
 * ```
 */
declare const tanstackStartCookies: () => {
  id: "tanstack-start-cookies";
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