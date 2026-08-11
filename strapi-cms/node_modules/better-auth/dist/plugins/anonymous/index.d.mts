import { AnonymousOptions, AnonymousSession, UserWithAnonymous } from "./types.mjs";
//#region src/plugins/anonymous/index.d.ts
declare module "@better-auth/core" {
  interface BetterAuthPluginRegistry<AuthOptions, Options> {
    anonymous: {
      creator: typeof anonymous;
    };
  }
}
declare const anonymous: (options?: AnonymousOptions | undefined) => {
  id: "anonymous";
  version: string;
  endpoints: {
    signInAnonymous: import("better-call").StrictEndpoint<"/sign-in/anonymous", {
      method: "POST";
      metadata: {
        openapi: {
          description: string;
          responses: {
            200: {
              description: string;
              content: {
                "application/json": {
                  schema: {
                    type: "object";
                    properties: {
                      user: {
                        $ref: string;
                      };
                      session: {
                        $ref: string;
                      };
                    };
                  };
                };
              };
            };
          };
        };
      };
    }, {
      token: string;
      user: Record<string, any> & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        emailVerified: boolean;
        name: string;
        image?: string | null | undefined;
      };
    }>;
    deleteAnonymousUser: import("better-call").StrictEndpoint<"/delete-anonymous-user", {
      method: "POST";
      use: ((inputContext: import("better-call").MiddlewareInputContext<import("better-call").MiddlewareOptions>) => Promise<{
        session: {
          session: Record<string, any> & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            expiresAt: Date;
            token: string;
            ipAddress?: string | null | undefined;
            userAgent?: string | null | undefined;
          };
          user: Record<string, any> & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            emailVerified: boolean;
            name: string;
            image?: string | null | undefined;
          };
        };
      }>)[];
      metadata: {
        openapi: {
          description: string;
          responses: {
            200: {
              description: string;
              content: {
                "application/json": {
                  schema: {
                    type: "object";
                    properties: {
                      success: {
                        type: string;
                      };
                    };
                  };
                };
              };
            };
            "400": {
              description: string;
              content: {
                "application/json": {
                  schema: {
                    type: "object";
                    properties: {
                      message: {
                        type: string;
                      };
                    };
                  };
                  required: string[];
                };
              };
            };
            "500": {
              description: string;
              content: {
                "application/json": {
                  schema: {
                    type: "object";
                    properties: {
                      message: {
                        type: string;
                      };
                    };
                    required: string[];
                  };
                };
              };
            };
          };
        };
      };
    }, {
      success: boolean;
    }>;
  };
  hooks: {
    after: {
      matcher(ctx: import("@better-auth/core").HookEndpointContext): boolean;
      handler: (inputContext: import("better-call").MiddlewareInputContext<import("better-call").MiddlewareOptions>) => Promise<void>;
    }[];
  };
  options: AnonymousOptions | undefined;
  schema: {
    user: {
      fields: {
        isAnonymous: {
          type: "boolean";
          required: false;
          input: false;
          defaultValue: false;
        };
      };
    };
  };
  $ERROR_CODES: {
    FAILED_TO_CREATE_USER: import("@better-auth/core/utils/error-codes").RawError<"FAILED_TO_CREATE_USER">;
    INVALID_EMAIL_FORMAT: import("@better-auth/core/utils/error-codes").RawError<"INVALID_EMAIL_FORMAT">;
    COULD_NOT_CREATE_SESSION: import("@better-auth/core/utils/error-codes").RawError<"COULD_NOT_CREATE_SESSION">;
    ANONYMOUS_USERS_CANNOT_SIGN_IN_AGAIN_ANONYMOUSLY: import("@better-auth/core/utils/error-codes").RawError<"ANONYMOUS_USERS_CANNOT_SIGN_IN_AGAIN_ANONYMOUSLY">;
    FAILED_TO_DELETE_ANONYMOUS_USER: import("@better-auth/core/utils/error-codes").RawError<"FAILED_TO_DELETE_ANONYMOUS_USER">;
    FAILED_TO_DELETE_ANONYMOUS_USER_SESSIONS: import("@better-auth/core/utils/error-codes").RawError<"FAILED_TO_DELETE_ANONYMOUS_USER_SESSIONS">;
    USER_IS_NOT_ANONYMOUS: import("@better-auth/core/utils/error-codes").RawError<"USER_IS_NOT_ANONYMOUS">;
    DELETE_ANONYMOUS_USER_DISABLED: import("@better-auth/core/utils/error-codes").RawError<"DELETE_ANONYMOUS_USER_DISABLED">;
  };
};
//#endregion
export { type AnonymousOptions, type AnonymousSession, type UserWithAnonymous, anonymous };