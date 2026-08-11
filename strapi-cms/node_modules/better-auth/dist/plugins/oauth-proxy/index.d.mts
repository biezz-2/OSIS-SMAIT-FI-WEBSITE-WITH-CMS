import { SecretConfig } from "@better-auth/core";
import * as z from "zod";
//#region src/plugins/oauth-proxy/index.d.ts
declare module "@better-auth/core" {
  interface BetterAuthPluginRegistry<AuthOptions, Options> {
    "oauth-proxy": {
      creator: typeof oAuthProxy;
    };
  }
}
interface OAuthProxyOptions {
  /**
   * The current URL of the application.
   * The plugin will attempt to infer the current URL from your environment
   * by checking the base URL from popular hosting providers,
   * from the request URL if invoked by a client,
   * or as a fallback, from the `baseURL` in your auth config.
   * If the URL is not inferred correctly, you can provide a value here."
   */
  currentURL?: string | undefined;
  /**
   * If a request in a production url it won't be proxied.
   *
   * default to `BETTER_AUTH_URL`
   */
  productionURL?: string | undefined;
  /**
   * Maximum age in seconds for the encrypted payload.
   * Payloads older than this will be rejected to prevent replay attacks.
   *
   * Keep this value short (e.g., 30-60 seconds) to minimize the window
   * for potential replay attacks while still allowing normal OAuth flows.
   *
   * @default 60 (1 minute)
   */
  maxAge?: number | undefined;
  /**
   * A dedicated secret used to encrypt and decrypt data passed between
   * servers during the OAuth proxy flow.
   *
   * When set, this secret is used **instead of** the global
   * `BETTER_AUTH_SECRET` for all OAuth proxy encryption operations.
   * This limits the blast radius if the secret is shared across
   * environments (production, preview, development): a leaked proxy
   * secret cannot be used to forge sessions or decrypt other data
   * protected by the main secret.
   *
   * All environments participating in the OAuth proxy flow must share
   * the same `secret` value.
   */
  secret?: string | SecretConfig | undefined;
}
declare const oAuthProxy: <O extends OAuthProxyOptions>(opts?: O) => {
  id: "oauth-proxy";
  version: string;
  options: NoInfer<O>;
  endpoints: {
    oAuthProxy: import("better-call").StrictEndpoint<"/oauth-proxy-callback", {
      method: "GET";
      operationId: string;
      query: z.ZodObject<{
        callbackURL: z.ZodString;
        profile: z.ZodOptional<z.ZodString>;
      }, z.core.$strip>;
      use: ((inputContext: import("better-call").MiddlewareInputContext<import("better-call").MiddlewareOptions>) => Promise<void>)[];
      metadata: {
        openapi: {
          operationId: string;
          description: string;
          parameters: ({
            in: "query";
            name: string;
            required: true;
            description: string;
          } | {
            in: "query";
            name: string;
            required: false;
            description: string;
          })[];
          responses: {
            302: {
              description: string;
              headers: {
                Location: {
                  description: string;
                  schema: {
                    type: string;
                  };
                };
              };
            };
          };
        };
      };
    }, never>;
  };
  hooks: {
    before: {
      matcher(context: import("@better-auth/core").HookEndpointContext): boolean;
      handler: (inputContext: import("better-call").MiddlewareInputContext<import("better-call").MiddlewareOptions>) => Promise<void>;
    }[];
    after: {
      matcher(context: import("@better-auth/core").HookEndpointContext): boolean;
      handler: (inputContext: import("better-call").MiddlewareInputContext<import("better-call").MiddlewareOptions>) => Promise<void>;
    }[];
  };
};
//#endregion
export { OAuthProxyOptions, oAuthProxy };