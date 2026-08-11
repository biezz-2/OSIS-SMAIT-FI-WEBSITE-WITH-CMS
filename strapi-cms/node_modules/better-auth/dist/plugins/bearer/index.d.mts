//#region src/plugins/bearer/index.d.ts
declare module "@better-auth/core" {
  interface BetterAuthPluginRegistry<AuthOptions, Options> {
    bearer: {
      creator: typeof bearer;
    };
  }
}
interface BearerOptions {
  /**
   * If true, only signed tokens
   * will be converted to session
   * cookies
   *
   * @default false
   */
  requireSignature?: boolean | undefined;
}
/**
 * Converts bearer token to session cookie
 */
declare const bearer: (options?: BearerOptions | undefined) => {
  id: "bearer";
  version: string;
  hooks: {
    before: {
      matcher(context: import("@better-auth/core").HookEndpointContext): boolean;
      handler: (inputContext: import("better-call").MiddlewareInputContext<import("better-call").MiddlewareOptions>) => Promise<{
        context: {
          headers: Headers;
        };
      } | undefined>;
    }[];
    after: {
      matcher(context: import("@better-auth/core").HookEndpointContext): true;
      handler: (inputContext: import("better-call").MiddlewareInputContext<import("better-call").MiddlewareOptions>) => Promise<void>;
    }[];
  };
  options: BearerOptions | undefined;
};
//#endregion
export { BearerOptions, bearer };