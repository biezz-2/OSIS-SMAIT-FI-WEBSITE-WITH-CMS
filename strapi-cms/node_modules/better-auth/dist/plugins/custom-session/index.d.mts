import { BetterAuthOptions, GenericEndpointContext } from "@better-auth/core";
import { Session, User } from "@better-auth/core/db";
//#region src/plugins/custom-session/index.d.ts
declare module "@better-auth/core" {
  interface BetterAuthPluginRegistry<AuthOptions, Options> {
    "custom-session": {
      creator: typeof customSession;
    };
  }
}
type CustomSessionPluginOptions = {
  /**
   * This option is used to determine if the list-device-sessions endpoint should be mutated to the custom session data.
   * @default false
   */
  shouldMutateListDeviceSessionsEndpoint?: boolean | undefined;
};
declare const customSession: <Returns extends Record<string, any>, O extends BetterAuthOptions = BetterAuthOptions>(fn: (session: {
  user: User<O["user"], O["plugins"]>;
  session: Session<O["session"], O["plugins"]>;
}, ctx: GenericEndpointContext) => Promise<Returns>, options?: O | undefined, pluginOptions?: CustomSessionPluginOptions | undefined) => {
  id: "custom-session";
  version: string;
  hooks: {
    after: {
      matcher: (ctx: import("@better-auth/core").HookEndpointContext) => boolean;
      handler: (inputContext: import("better-call").MiddlewareInputContext<import("better-call").MiddlewareOptions>) => Promise<Awaited<Returns>[] | undefined>;
    }[];
  };
  endpoints: {
    getSession: import("better-call").StrictEndpoint<"/get-session", {
      method: "GET";
      query: import("zod").ZodOptional<import("zod").ZodObject<{
        disableCookieCache: import("zod").ZodOptional<import("zod").ZodCoercedBoolean<unknown>>;
        disableRefresh: import("zod").ZodOptional<import("zod").ZodCoercedBoolean<unknown>>;
      }, import("zod/v4/core").$strip>>;
      metadata: {
        CUSTOM_SESSION: boolean;
        openapi: {
          description: string;
          responses: {
            "200": {
              description: string;
              content: {
                "application/json": {
                  schema: {
                    type: "array";
                    nullable: boolean;
                    items: {
                      $ref: string;
                    };
                  };
                };
              };
            };
          };
        };
      };
      requireHeaders: true;
    }, Returns | null>;
  };
  $Infer: {
    Session: Awaited<ReturnType<typeof fn>>;
  };
  options: CustomSessionPluginOptions | undefined;
};
//#endregion
export { CustomSessionPluginOptions, customSession };