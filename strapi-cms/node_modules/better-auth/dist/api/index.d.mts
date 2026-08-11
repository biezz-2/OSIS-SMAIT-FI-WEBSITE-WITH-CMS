import { OverrideMerge, Prettify, UnionToIntersection } from "../types/helper.mjs";
import { AdditionalSessionFieldsInput, AdditionalUserFieldsInput } from "../types/models.mjs";
import "../types/index.mjs";
import "../index.mjs";
import { isAPIError } from "../utils/is-api-error.mjs";
import { DispatchContext, dispatchAuthEndpoint } from "./dispatch.mjs";
import { requireOrgRole, requireResourceOwnership } from "./middlewares/authorization.mjs";
import { formCsrfMiddleware, originCheck, originCheckMiddleware } from "./middlewares/origin-check.mjs";
import "./middlewares/index.mjs";
import { accountInfo, getAccessToken, linkSocialAccount, listUserAccounts, refreshToken, unlinkAccount } from "./routes/account.mjs";
import { callbackOAuth } from "./routes/callback.mjs";
import { createEmailVerificationToken, sendVerificationEmail, sendVerificationEmailFn, verifyEmail } from "./routes/email-verification.mjs";
import { error } from "./routes/error.mjs";
import { ok } from "./routes/ok.mjs";
import { requestPasswordReset, requestPasswordResetCallback, resetPassword, verifyPassword } from "./routes/password.mjs";
import { freshSessionMiddleware, getAuthoritativeSessionFromCtx, getSession, getSessionFromCtx, isStateful, listSessions, requestOnlySessionMiddleware, revokeOtherSessions, revokeSession, revokeSessions, sensitiveSessionMiddleware, sessionMiddleware } from "./routes/session.mjs";
import { signInEmail, signInSocial } from "./routes/sign-in.mjs";
import { signOut } from "./routes/sign-out.mjs";
import { signUpEmail } from "./routes/sign-up.mjs";
import { updateSession } from "./routes/update-session.mjs";
import { changeEmail, changePassword, deleteUser, deleteUserCallback, setPassword, updateUser } from "./routes/update-user.mjs";
import "./routes/index.mjs";
import { getOAuthState } from "./state/oauth.mjs";
import { getShouldSkipSessionRefresh, setShouldSkipSessionRefresh } from "./state/should-session-refresh.mjs";
import { AuthContext, Awaitable, BetterAuthOptions, BetterAuthPlugin } from "@better-auth/core";
import { InternalLogger } from "@better-auth/core/env";
import { APIError } from "@better-auth/core/error";
import { getIp } from "@better-auth/core/utils/ip";
import { AuthEndpoint, AuthMiddleware, createAuthEndpoint, createAuthMiddleware, optionsMiddleware } from "@better-auth/core/api";
//#region src/api/index.d.ts
declare function checkEndpointConflicts(options: BetterAuthOptions, logger: InternalLogger): void;
declare function getEndpoints<Option extends BetterAuthOptions>(ctx: Awaitable<AuthContext>, options: Option): {
  api: OverrideMerge<{
    readonly ok: import("better-call").StrictEndpoint<"/ok", {
      method: "GET";
      metadata: {
        openapi: {
          description: string;
          responses: {
            "200": {
              description: string;
              content: {
                "application/json": {
                  schema: {
                    type: "object";
                    properties: {
                      ok: {
                        type: string;
                        description: string;
                      };
                    };
                    required: string[];
                  };
                };
              };
            };
          };
        };
        scope: "server";
      };
    }, {
      ok: boolean;
    }>;
    readonly error: import("better-call").StrictEndpoint<"/error", {
      method: "GET";
      metadata: {
        openapi: {
          description: string;
          responses: {
            "200": {
              description: string;
              content: {
                "text/html": {
                  schema: {
                    type: "string";
                    description: string;
                  };
                };
              };
            };
          };
        };
        scope: "server";
      };
    }, Response>;
    readonly signInSocial: import("better-call").StrictEndpoint<"/sign-in/social", {
      method: "POST";
      operationId: string;
      body: import("zod").ZodObject<{
        callbackURL: import("zod").ZodOptional<import("zod").ZodString>;
        newUserCallbackURL: import("zod").ZodOptional<import("zod").ZodString>;
        errorCallbackURL: import("zod").ZodOptional<import("zod").ZodString>;
        provider: import("zod").ZodType<(string & {}) | "linear" | "huggingface" | "github" | "apple" | "atlassian" | "cognito" | "discord" | "facebook" | "figma" | "microsoft" | "google" | "slack" | "spotify" | "twitch" | "twitter" | "dropbox" | "kick" | "linkedin" | "gitlab" | "tiktok" | "reddit" | "roblox" | "salesforce" | "vk" | "zoom" | "notion" | "kakao" | "naver" | "line" | "paybin" | "paypal" | "polar" | "railway" | "vercel" | "wechat", unknown, import("zod/v4/core").$ZodTypeInternals<(string & {}) | "linear" | "huggingface" | "github" | "apple" | "atlassian" | "cognito" | "discord" | "facebook" | "figma" | "microsoft" | "google" | "slack" | "spotify" | "twitch" | "twitter" | "dropbox" | "kick" | "linkedin" | "gitlab" | "tiktok" | "reddit" | "roblox" | "salesforce" | "vk" | "zoom" | "notion" | "kakao" | "naver" | "line" | "paybin" | "paypal" | "polar" | "railway" | "vercel" | "wechat", unknown>>;
        disableRedirect: import("zod").ZodOptional<import("zod").ZodBoolean>;
        idToken: import("zod").ZodOptional<import("zod").ZodObject<{
          token: import("zod").ZodString;
          nonce: import("zod").ZodOptional<import("zod").ZodString>;
          accessToken: import("zod").ZodOptional<import("zod").ZodString>;
          refreshToken: import("zod").ZodOptional<import("zod").ZodString>;
          expiresAt: import("zod").ZodOptional<import("zod").ZodNumber>;
          user: import("zod").ZodOptional<import("zod").ZodObject<{
            name: import("zod").ZodOptional<import("zod").ZodObject<{
              firstName: import("zod").ZodOptional<import("zod").ZodString>;
              lastName: import("zod").ZodOptional<import("zod").ZodString>;
            }, import("zod/v4/core").$strip>>;
            email: import("zod").ZodOptional<import("zod").ZodString>;
          }, import("zod/v4/core").$strip>>;
        }, import("zod/v4/core").$strip>>;
        scopes: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString>>;
        requestSignUp: import("zod").ZodOptional<import("zod").ZodBoolean>;
        loginHint: import("zod").ZodOptional<import("zod").ZodString>;
        additionalData: import("zod").ZodOptional<import("zod").ZodRecord<import("zod").ZodString, import("zod").ZodAny>>;
      }, import("zod/v4/core").$strip>;
      metadata: {
        $Infer: {
          body: import("zod").infer<import("zod").ZodObject<{
            callbackURL: import("zod").ZodOptional<import("zod").ZodString>;
            newUserCallbackURL: import("zod").ZodOptional<import("zod").ZodString>;
            errorCallbackURL: import("zod").ZodOptional<import("zod").ZodString>;
            provider: import("zod").ZodType<(string & {}) | "linear" | "huggingface" | "github" | "apple" | "atlassian" | "cognito" | "discord" | "facebook" | "figma" | "microsoft" | "google" | "slack" | "spotify" | "twitch" | "twitter" | "dropbox" | "kick" | "linkedin" | "gitlab" | "tiktok" | "reddit" | "roblox" | "salesforce" | "vk" | "zoom" | "notion" | "kakao" | "naver" | "line" | "paybin" | "paypal" | "polar" | "railway" | "vercel" | "wechat", unknown, import("zod/v4/core").$ZodTypeInternals<(string & {}) | "linear" | "huggingface" | "github" | "apple" | "atlassian" | "cognito" | "discord" | "facebook" | "figma" | "microsoft" | "google" | "slack" | "spotify" | "twitch" | "twitter" | "dropbox" | "kick" | "linkedin" | "gitlab" | "tiktok" | "reddit" | "roblox" | "salesforce" | "vk" | "zoom" | "notion" | "kakao" | "naver" | "line" | "paybin" | "paypal" | "polar" | "railway" | "vercel" | "wechat", unknown>>;
            disableRedirect: import("zod").ZodOptional<import("zod").ZodBoolean>;
            idToken: import("zod").ZodOptional<import("zod").ZodObject<{
              token: import("zod").ZodString;
              nonce: import("zod").ZodOptional<import("zod").ZodString>;
              accessToken: import("zod").ZodOptional<import("zod").ZodString>;
              refreshToken: import("zod").ZodOptional<import("zod").ZodString>;
              expiresAt: import("zod").ZodOptional<import("zod").ZodNumber>;
              user: import("zod").ZodOptional<import("zod").ZodObject<{
                name: import("zod").ZodOptional<import("zod").ZodObject<{
                  firstName: import("zod").ZodOptional<import("zod").ZodString>;
                  lastName: import("zod").ZodOptional<import("zod").ZodString>;
                }, import("zod/v4/core").$strip>>;
                email: import("zod").ZodOptional<import("zod").ZodString>;
              }, import("zod/v4/core").$strip>>;
            }, import("zod/v4/core").$strip>>;
            scopes: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString>>;
            requestSignUp: import("zod").ZodOptional<import("zod").ZodBoolean>;
            loginHint: import("zod").ZodOptional<import("zod").ZodString>;
            additionalData: import("zod").ZodOptional<import("zod").ZodRecord<import("zod").ZodString, import("zod").ZodAny>>;
          }, import("zod/v4/core").$strip>>;
          returned: {
            redirect: boolean;
            token?: string | undefined;
            url?: string | undefined;
            user?: ({
              id: string;
              createdAt: Date;
              updatedAt: Date;
              email: string;
              emailVerified: boolean;
              name: string;
              image?: string | null | undefined;
            } & import("@better-auth/core/db").InferDBFieldsFromOptions<Option["user"]> & import("@better-auth/core/db").InferDBFieldsFromPlugins<"user", Option["plugins"]> extends (infer T) ? { [K in keyof T]: T[K]; } : never) | undefined;
          };
        };
        openapi: {
          description: string;
          operationId: string;
          responses: {
            "200": {
              description: string;
              content: {
                "application/json": {
                  schema: {
                    type: "object";
                    description: string;
                    properties: {
                      token: {
                        type: string;
                      };
                      user: {
                        type: string;
                        $ref: string;
                      };
                      url: {
                        type: string;
                      };
                      redirect: {
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
      redirect: boolean;
      url: string;
    } | {
      redirect: boolean;
      token: string;
      url: undefined;
      user: {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        emailVerified: boolean;
        name: string;
        image?: string | null | undefined;
      } & import("@better-auth/core/db").InferDBFieldsFromOptions<Option["user"]> & import("@better-auth/core/db").InferDBFieldsFromPlugins<"user", Option["plugins"]> extends (infer T_1) ? { [K in keyof T_1]: T_1[K]; } : never;
    }>;
    readonly callbackOAuth: import("better-call").StrictEndpoint<"/callback/:id", {
      method: ("GET" | "POST")[];
      operationId: string;
      body: import("zod").ZodOptional<import("zod").ZodObject<{
        code: import("zod").ZodOptional<import("zod").ZodString>;
        error: import("zod").ZodOptional<import("zod").ZodString>;
        device_id: import("zod").ZodOptional<import("zod").ZodString>;
        error_description: import("zod").ZodOptional<import("zod").ZodString>;
        state: import("zod").ZodOptional<import("zod").ZodString>;
        user: import("zod").ZodOptional<import("zod").ZodString>;
      }, import("zod/v4/core").$strip>>;
      query: import("zod").ZodOptional<import("zod").ZodObject<{
        code: import("zod").ZodOptional<import("zod").ZodString>;
        error: import("zod").ZodOptional<import("zod").ZodString>;
        device_id: import("zod").ZodOptional<import("zod").ZodString>;
        error_description: import("zod").ZodOptional<import("zod").ZodString>;
        state: import("zod").ZodOptional<import("zod").ZodString>;
        user: import("zod").ZodOptional<import("zod").ZodString>;
      }, import("zod/v4/core").$strip>>;
      metadata: {
        allowedMediaTypes: string[];
        scope: "server";
      };
    }, never>;
    readonly getSession: import("better-call").StrictEndpoint<"/get-session", {
      method: ("GET" | "POST")[];
      operationId: string;
      query: import("zod").ZodOptional<import("zod").ZodObject<{
        disableCookieCache: import("zod").ZodOptional<import("zod").ZodCoercedBoolean<unknown>>;
        disableRefresh: import("zod").ZodOptional<import("zod").ZodCoercedBoolean<unknown>>;
      }, import("zod/v4/core").$strip>>;
      requireHeaders: true;
      metadata: {
        openapi: {
          operationId: string;
          description: string;
          responses: {
            "200": {
              description: string;
              content: {
                "application/json": {
                  schema: {
                    type: "object";
                    properties: {
                      session: {
                        $ref: string;
                      };
                      user: {
                        $ref: string;
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
      session: {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        expiresAt: Date;
        token: string;
        ipAddress?: string | null | undefined;
        userAgent?: string | null | undefined;
      } & import("@better-auth/core/db").InferDBFieldsFromOptions<Option["session"]> & import("@better-auth/core/db").InferDBFieldsFromPlugins<"session", Option["plugins"]> extends (infer T_2) ? { [K_1 in keyof T_2]: T_2[K_1]; } : never;
      user: {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        emailVerified: boolean;
        name: string;
        image?: string | null | undefined;
      } & import("@better-auth/core/db").InferDBFieldsFromOptions<Option["user"]> & import("@better-auth/core/db").InferDBFieldsFromPlugins<"user", Option["plugins"]> extends (infer T_3) ? { [K in keyof T_3]: T_3[K]; } : never;
    } | null>;
    readonly signOut: import("better-call").StrictEndpoint<"/sign-out", {
      method: "POST";
      operationId: string;
      requireHeaders: true;
      metadata: {
        openapi: {
          operationId: string;
          description: string;
          responses: {
            "200": {
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
          };
        };
      };
    }, {
      success: boolean;
    }>;
    readonly signUpEmail: import("better-call").StrictEndpoint<"/sign-up/email", {
      method: "POST";
      operationId: string;
      use: ((inputContext: import("better-call").MiddlewareInputContext<import("better-call").MiddlewareOptions>) => Promise<void>)[];
      body: import("zod").ZodIntersection<import("zod").ZodObject<{
        name: import("zod").ZodString;
        email: import("zod").ZodEmail;
        password: import("zod").ZodString;
        image: import("zod").ZodOptional<import("zod").ZodString>;
        callbackURL: import("zod").ZodOptional<import("zod").ZodString>;
        rememberMe: import("zod").ZodOptional<import("zod").ZodBoolean>;
      }, import("zod/v4/core").$strip>, import("zod").ZodRecord<import("zod").ZodString, import("zod").ZodAny>>;
      cloneRequest: true;
      metadata: {
        allowedMediaTypes: string[];
        $Infer: {
          body: {
            name: string;
            email: string;
            password: string;
            image?: string | undefined;
            callbackURL?: string | undefined;
            rememberMe?: boolean | undefined;
          } & import("@better-auth/core/db").InferDBFieldsFromPluginsInput<"user", Option["plugins"]> & import("@better-auth/core/db").InferDBFieldsFromOptionsInput<Option["user"]>;
          returned: {
            token: string | null;
            user: {
              id: string;
              createdAt: Date;
              updatedAt: Date;
              email: string;
              emailVerified: boolean;
              name: string;
              image?: string | null | undefined;
            } & import("@better-auth/core/db").InferDBFieldsFromOptions<Option["user"]> & import("@better-auth/core/db").InferDBFieldsFromPlugins<"user", Option["plugins"]> extends (infer T_4) ? { [K in keyof T_4]: T_4[K]; } : never;
          };
        };
        openapi: {
          operationId: string;
          description: string;
          requestBody: {
            content: {
              "application/json": {
                schema: {
                  type: "object";
                  properties: {
                    name: {
                      type: string;
                      description: string;
                    };
                    email: {
                      type: string;
                      description: string;
                    };
                    password: {
                      type: string;
                      description: string;
                    };
                    image: {
                      type: string;
                      description: string;
                    };
                    callbackURL: {
                      type: string;
                      description: string;
                    };
                    rememberMe: {
                      type: string;
                      description: string;
                    };
                  };
                  required: string[];
                };
              };
            };
          };
          responses: {
            "200": {
              description: string;
              content: {
                "application/json": {
                  schema: {
                    type: "object";
                    properties: {
                      token: {
                        type: string;
                        nullable: boolean;
                        description: string;
                      };
                      user: {
                        type: string;
                        properties: {
                          id: {
                            type: string;
                            description: string;
                          };
                          email: {
                            type: string;
                            format: string;
                            description: string;
                          };
                          name: {
                            type: string;
                            description: string;
                          };
                          image: {
                            type: string;
                            format: string;
                            nullable: boolean;
                            description: string;
                          };
                          emailVerified: {
                            type: string;
                            description: string;
                          };
                          createdAt: {
                            type: string;
                            format: string;
                            description: string;
                          };
                          updatedAt: {
                            type: string;
                            format: string;
                            description: string;
                          };
                        };
                        required: string[];
                      };
                    };
                    required: string[];
                  };
                };
              };
            };
            "422": {
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
                };
              };
            };
          };
        };
      };
    }, {
      token: null;
      user: {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        emailVerified: boolean;
        name: string;
        image?: string | null | undefined;
      } & import("@better-auth/core/db").InferDBFieldsFromOptions<Option["user"]> & import("@better-auth/core/db").InferDBFieldsFromPlugins<"user", Option["plugins"]> extends (infer T_5) ? { [K in keyof T_5]: T_5[K]; } : never;
    } | {
      token: string;
      user: {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        emailVerified: boolean;
        name: string;
        image?: string | null | undefined;
      } & import("@better-auth/core/db").InferDBFieldsFromOptions<Option["user"]> & import("@better-auth/core/db").InferDBFieldsFromPlugins<"user", Option["plugins"]> extends (infer T_6) ? { [K in keyof T_6]: T_6[K]; } : never;
    }>;
    readonly signInEmail: import("better-call").StrictEndpoint<"/sign-in/email", {
      method: "POST";
      operationId: string;
      use: ((inputContext: import("better-call").MiddlewareInputContext<import("better-call").MiddlewareOptions>) => Promise<void>)[];
      cloneRequest: true;
      body: import("zod").ZodObject<{
        email: import("zod").ZodString;
        password: import("zod").ZodString;
        callbackURL: import("zod").ZodOptional<import("zod").ZodString>;
        rememberMe: import("zod").ZodOptional<import("zod").ZodDefault<import("zod").ZodBoolean>>;
      }, import("zod/v4/core").$strip>;
      metadata: {
        allowedMediaTypes: string[];
        $Infer: {
          body: {
            email: string;
            password: string;
            callbackURL?: string | undefined;
            rememberMe?: boolean | undefined;
          };
          returned: {
            redirect: boolean;
            token: string;
            url?: string | undefined;
            user: {
              id: string;
              createdAt: Date;
              updatedAt: Date;
              email: string;
              emailVerified: boolean;
              name: string;
              image?: string | null | undefined;
            } & import("@better-auth/core/db").InferDBFieldsFromOptions<Option["user"]> & import("@better-auth/core/db").InferDBFieldsFromPlugins<"user", Option["plugins"]> extends (infer T_7) ? { [K in keyof T_7]: T_7[K]; } : never;
          };
        };
        openapi: {
          operationId: string;
          description: string;
          responses: {
            "200": {
              description: string;
              content: {
                "application/json": {
                  schema: {
                    type: "object";
                    description: string;
                    properties: {
                      redirect: {
                        type: string;
                        enum: boolean[];
                      };
                      token: {
                        type: string;
                        description: string;
                      };
                      url: {
                        type: string;
                        nullable: boolean;
                      };
                      user: {
                        type: string;
                        $ref: string;
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
      redirect: boolean;
      token: string;
      url?: string | undefined;
      user: {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        emailVerified: boolean;
        name: string;
        image?: string | null | undefined;
      } & import("@better-auth/core/db").InferDBFieldsFromOptions<Option["user"]> & import("@better-auth/core/db").InferDBFieldsFromPlugins<"user", Option["plugins"]> extends (infer T_8) ? { [K in keyof T_8]: T_8[K]; } : never;
    }>;
    readonly resetPassword: import("better-call").StrictEndpoint<"/reset-password", {
      method: "POST";
      operationId: string;
      query: import("zod").ZodOptional<import("zod").ZodObject<{
        token: import("zod").ZodOptional<import("zod").ZodString>;
      }, import("zod/v4/core").$strip>>;
      body: import("zod").ZodObject<{
        newPassword: import("zod").ZodString;
        token: import("zod").ZodOptional<import("zod").ZodString>;
      }, import("zod/v4/core").$strip>;
      metadata: {
        openapi: {
          operationId: string;
          description: string;
          responses: {
            "200": {
              description: string;
              content: {
                "application/json": {
                  schema: {
                    type: "object";
                    properties: {
                      status: {
                        type: string;
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
      status: boolean;
    }>;
    readonly verifyPassword: import("better-call").StrictEndpoint<"/verify-password", {
      method: "POST";
      body: import("zod").ZodObject<{
        password: import("zod").ZodString;
      }, import("zod/v4/core").$strip>;
      metadata: {
        scope: "server";
        openapi: {
          operationId: string;
          description: string;
          responses: {
            "200": {
              description: string;
              content: {
                "application/json": {
                  schema: {
                    type: "object";
                    properties: {
                      status: {
                        type: string;
                      };
                    };
                  };
                };
              };
            };
          };
        };
      };
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
    }, {
      status: boolean;
    }>;
    readonly verifyEmail: import("better-call").StrictEndpoint<"/verify-email", {
      method: "GET";
      operationId: string;
      query: import("zod").ZodObject<{
        token: import("zod").ZodString;
        callbackURL: import("zod").ZodOptional<import("zod").ZodString>;
      }, import("zod/v4/core").$strip>;
      use: ((inputContext: import("better-call").MiddlewareInputContext<import("better-call").MiddlewareOptions>) => Promise<void>)[];
      metadata: {
        openapi: {
          description: string;
          parameters: ({
            name: string;
            in: "query";
            description: string;
            required: true;
            schema: {
              type: "string";
            };
          } | {
            name: string;
            in: "query";
            description: string;
            required: false;
            schema: {
              type: "string";
            };
          })[];
          responses: {
            "200": {
              description: string;
              content: {
                "application/json": {
                  schema: {
                    type: "object";
                    properties: {
                      user: {
                        type: string;
                        $ref: string;
                      };
                      status: {
                        type: string;
                        description: string;
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
    }, void | {
      status: boolean;
    }>;
    readonly sendVerificationEmail: import("better-call").StrictEndpoint<"/send-verification-email", {
      method: "POST";
      operationId: string;
      cloneRequest: true;
      body: import("zod").ZodObject<{
        email: import("zod").ZodEmail;
        callbackURL: import("zod").ZodOptional<import("zod").ZodString>;
      }, import("zod/v4/core").$strip>;
      metadata: {
        openapi: {
          operationId: string;
          description: string;
          requestBody: {
            content: {
              "application/json": {
                schema: {
                  type: "object";
                  properties: {
                    email: {
                      type: string;
                      description: string;
                      example: string;
                    };
                    callbackURL: {
                      type: string;
                      description: string;
                      example: string;
                      nullable: boolean;
                    };
                  };
                  required: string[];
                };
              };
            };
          };
          responses: {
            "200": {
              description: string;
              content: {
                "application/json": {
                  schema: {
                    type: "object";
                    properties: {
                      status: {
                        type: string;
                        description: string;
                        example: boolean;
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
                        description: string;
                        example: string;
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
      status: boolean;
    }>;
    readonly changeEmail: import("better-call").StrictEndpoint<"/change-email", {
      method: "POST";
      body: import("zod").ZodObject<{
        newEmail: import("zod").ZodEmail;
        callbackURL: import("zod").ZodOptional<import("zod").ZodString>;
      }, import("zod/v4/core").$strip>;
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
          operationId: string;
          responses: {
            "200": {
              description: string;
              content: {
                "application/json": {
                  schema: {
                    type: "object";
                    properties: {
                      user: {
                        type: string;
                        $ref: string;
                      };
                      status: {
                        type: string;
                        description: string;
                      };
                      message: {
                        type: string;
                        enum: string[];
                        description: string;
                        nullable: boolean;
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
      status: boolean;
    }>;
    readonly changePassword: import("better-call").StrictEndpoint<"/change-password", {
      method: "POST";
      operationId: string;
      body: import("zod").ZodObject<{
        newPassword: import("zod").ZodString;
        currentPassword: import("zod").ZodString;
        revokeOtherSessions: import("zod").ZodOptional<import("zod").ZodBoolean>;
      }, import("zod/v4/core").$strip>;
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
          operationId: string;
          description: string;
          responses: {
            "200": {
              description: string;
              content: {
                "application/json": {
                  schema: {
                    type: "object";
                    properties: {
                      token: {
                        type: string;
                        nullable: boolean;
                        description: string;
                      };
                      user: {
                        type: string;
                        properties: {
                          id: {
                            type: string;
                            description: string;
                          };
                          email: {
                            type: string;
                            format: string;
                            description: string;
                          };
                          name: {
                            type: string;
                            description: string;
                          };
                          image: {
                            type: string;
                            format: string;
                            nullable: boolean;
                            description: string;
                          };
                          emailVerified: {
                            type: string;
                            description: string;
                          };
                          createdAt: {
                            type: string;
                            format: string;
                            description: string;
                          };
                          updatedAt: {
                            type: string;
                            format: string;
                            description: string;
                          };
                        };
                        required: string[];
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
      token: string | null;
      user: {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        emailVerified: boolean;
        name: string;
        image?: string | null | undefined;
      } & Record<string, any> & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        emailVerified: boolean;
        name: string;
        image?: string | null | undefined;
      };
    }>;
    readonly setPassword: import("better-call").StrictEndpoint<string, {
      method: "POST";
      body: import("zod").ZodObject<{
        newPassword: import("zod").ZodString;
      }, import("zod/v4/core").$strip>;
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
    }, {
      status: boolean;
    }>;
    readonly updateSession: import("better-call").StrictEndpoint<"/update-session", {
      method: "POST";
      operationId: string;
      body: import("zod").ZodRecord<import("zod").ZodString, import("zod").ZodAny>;
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
        $Infer: {
          body: Partial<AdditionalSessionFieldsInput<Option>>;
        };
        openapi: {
          operationId: string;
          description: string;
          responses: {
            "200": {
              description: string;
              content: {
                "application/json": {
                  schema: {
                    type: "object";
                    properties: {
                      session: {
                        type: string;
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
      session: {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        expiresAt: Date;
        token: string;
        ipAddress?: string | null | undefined;
        userAgent?: string | null | undefined;
      };
    }>;
    readonly updateUser: import("better-call").StrictEndpoint<"/update-user", {
      method: "POST";
      operationId: string;
      body: import("zod").ZodRecord<import("zod").ZodString, import("zod").ZodAny>;
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
        $Infer: {
          body: Partial<AdditionalUserFieldsInput<Option>> & {
            name?: string | undefined;
            image?: string | undefined | null;
          };
        };
        openapi: {
          operationId: string;
          description: string;
          requestBody: {
            content: {
              "application/json": {
                schema: {
                  type: "object";
                  properties: {
                    name: {
                      type: string;
                      description: string;
                    };
                    image: {
                      type: string;
                      description: string;
                      nullable: boolean;
                    };
                  };
                };
              };
            };
          };
          responses: {
            "200": {
              description: string;
              content: {
                "application/json": {
                  schema: {
                    type: "object";
                    properties: {
                      user: {
                        type: string;
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
      status: boolean;
    }>;
    readonly deleteUser: import("better-call").StrictEndpoint<"/delete-user", {
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
      body: import("zod").ZodObject<{
        callbackURL: import("zod").ZodOptional<import("zod").ZodString>;
        password: import("zod").ZodOptional<import("zod").ZodString>;
        token: import("zod").ZodOptional<import("zod").ZodString>;
      }, import("zod/v4/core").$strip>;
      metadata: {
        openapi: {
          operationId: string;
          description: string;
          requestBody: {
            content: {
              "application/json": {
                schema: {
                  type: "object";
                  properties: {
                    callbackURL: {
                      type: string;
                      description: string;
                    };
                    password: {
                      type: string;
                      description: string;
                    };
                    token: {
                      type: string;
                      description: string;
                    };
                  };
                };
              };
            };
          };
          responses: {
            "200": {
              description: string;
              content: {
                "application/json": {
                  schema: {
                    type: "object";
                    properties: {
                      success: {
                        type: string;
                        description: string;
                      };
                      message: {
                        type: string;
                        enum: string[];
                        description: string;
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
      message: string;
    }>;
    readonly requestPasswordReset: import("better-call").StrictEndpoint<"/request-password-reset", {
      method: "POST";
      body: import("zod").ZodObject<{
        email: import("zod").ZodEmail;
        redirectTo: import("zod").ZodOptional<import("zod").ZodString>;
      }, import("zod/v4/core").$strip>;
      metadata: {
        openapi: {
          operationId: string;
          description: string;
          responses: {
            "200": {
              description: string;
              content: {
                "application/json": {
                  schema: {
                    type: "object";
                    properties: {
                      status: {
                        type: string;
                      };
                      message: {
                        type: string;
                      };
                    };
                  };
                };
              };
            };
          };
        };
      };
      use: ((inputContext: import("better-call").MiddlewareInputContext<import("better-call").MiddlewareOptions>) => Promise<void>)[];
    }, {
      status: boolean;
      message: string;
    }>;
    readonly requestPasswordResetCallback: import("better-call").StrictEndpoint<"/reset-password/:token", {
      method: "GET";
      operationId: string;
      query: import("zod").ZodObject<{
        callbackURL: import("zod").ZodString;
      }, import("zod/v4/core").$strip>;
      use: ((inputContext: import("better-call").MiddlewareInputContext<import("better-call").MiddlewareOptions>) => Promise<void>)[];
      metadata: {
        openapi: {
          operationId: string;
          description: string;
          parameters: ({
            name: string;
            in: "path";
            required: true;
            description: string;
            schema: {
              type: "string";
            };
          } | {
            name: string;
            in: "query";
            required: true;
            description: string;
            schema: {
              type: "string";
            };
          })[];
          responses: {
            "200": {
              description: string;
              content: {
                "application/json": {
                  schema: {
                    type: "object";
                    properties: {
                      token: {
                        type: string;
                      };
                    };
                  };
                };
              };
            };
          };
        };
      };
    }, never>;
    readonly listSessions: import("better-call").StrictEndpoint<"/list-sessions", {
      method: "GET";
      operationId: string;
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
      requireHeaders: true;
      metadata: {
        openapi: {
          operationId: string;
          description: string;
          responses: {
            "200": {
              description: string;
              content: {
                "application/json": {
                  schema: {
                    type: "array";
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
    }, Prettify<{
      id: string;
      createdAt: Date;
      updatedAt: Date;
      userId: string;
      expiresAt: Date;
      token: string;
      ipAddress?: string | null | undefined;
      userAgent?: string | null | undefined;
    } & import("@better-auth/core/db").InferDBFieldsFromOptions<Option["session"]> & import("@better-auth/core/db").InferDBFieldsFromPlugins<"session", Option["plugins"]> extends (infer T_9) ? { [K_1 in keyof T_9]: T_9[K_1]; } : never>[]>;
    readonly revokeSession: import("better-call").StrictEndpoint<"/revoke-session", {
      method: "POST";
      body: import("zod").ZodObject<{
        token: import("zod").ZodString;
      }, import("zod/v4/core").$strip>;
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
      requireHeaders: true;
      metadata: {
        openapi: {
          description: string;
          requestBody: {
            content: {
              "application/json": {
                schema: {
                  type: "object";
                  properties: {
                    token: {
                      type: string;
                      description: string;
                    };
                  };
                  required: string[];
                };
              };
            };
          };
          responses: {
            "200": {
              description: string;
              content: {
                "application/json": {
                  schema: {
                    type: "object";
                    properties: {
                      status: {
                        type: string;
                        description: string;
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
      status: boolean;
    }>;
    readonly revokeSessions: import("better-call").StrictEndpoint<"/revoke-sessions", {
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
      requireHeaders: true;
      metadata: {
        openapi: {
          description: string;
          responses: {
            "200": {
              description: string;
              content: {
                "application/json": {
                  schema: {
                    type: "object";
                    properties: {
                      status: {
                        type: string;
                        description: string;
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
      status: boolean;
    }>;
    readonly revokeOtherSessions: import("better-call").StrictEndpoint<"/revoke-other-sessions", {
      method: "POST";
      requireHeaders: true;
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
            "200": {
              description: string;
              content: {
                "application/json": {
                  schema: {
                    type: "object";
                    properties: {
                      status: {
                        type: string;
                        description: string;
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
      status: boolean;
    }>;
    readonly linkSocialAccount: import("better-call").StrictEndpoint<"/link-social", {
      method: "POST";
      requireHeaders: true;
      body: import("zod").ZodObject<{
        callbackURL: import("zod").ZodOptional<import("zod").ZodString>;
        provider: import("zod").ZodType<(string & {}) | "linear" | "huggingface" | "github" | "apple" | "atlassian" | "cognito" | "discord" | "facebook" | "figma" | "microsoft" | "google" | "slack" | "spotify" | "twitch" | "twitter" | "dropbox" | "kick" | "linkedin" | "gitlab" | "tiktok" | "reddit" | "roblox" | "salesforce" | "vk" | "zoom" | "notion" | "kakao" | "naver" | "line" | "paybin" | "paypal" | "polar" | "railway" | "vercel" | "wechat", unknown, import("zod/v4/core").$ZodTypeInternals<(string & {}) | "linear" | "huggingface" | "github" | "apple" | "atlassian" | "cognito" | "discord" | "facebook" | "figma" | "microsoft" | "google" | "slack" | "spotify" | "twitch" | "twitter" | "dropbox" | "kick" | "linkedin" | "gitlab" | "tiktok" | "reddit" | "roblox" | "salesforce" | "vk" | "zoom" | "notion" | "kakao" | "naver" | "line" | "paybin" | "paypal" | "polar" | "railway" | "vercel" | "wechat", unknown>>;
        idToken: import("zod").ZodOptional<import("zod").ZodObject<{
          token: import("zod").ZodString;
          nonce: import("zod").ZodOptional<import("zod").ZodString>;
          accessToken: import("zod").ZodOptional<import("zod").ZodString>;
          refreshToken: import("zod").ZodOptional<import("zod").ZodString>;
          scopes: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString>>;
        }, import("zod/v4/core").$strip>>;
        requestSignUp: import("zod").ZodOptional<import("zod").ZodBoolean>;
        scopes: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString>>;
        errorCallbackURL: import("zod").ZodOptional<import("zod").ZodString>;
        disableRedirect: import("zod").ZodOptional<import("zod").ZodBoolean>;
        additionalData: import("zod").ZodOptional<import("zod").ZodRecord<import("zod").ZodString, import("zod").ZodAny>>;
      }, import("zod/v4/core").$strip>;
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
          operationId: string;
          responses: {
            "200": {
              description: string;
              content: {
                "application/json": {
                  schema: {
                    type: "object";
                    properties: {
                      url: {
                        type: string;
                        description: string;
                      };
                      redirect: {
                        type: string;
                        description: string;
                      };
                      status: {
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
      url: string;
      redirect: boolean;
    }>;
    readonly listUserAccounts: import("better-call").StrictEndpoint<"/list-accounts", {
      method: "GET";
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
          operationId: string;
          description: string;
          responses: {
            "200": {
              description: string;
              content: {
                "application/json": {
                  schema: {
                    type: "array";
                    items: {
                      type: string;
                      properties: {
                        id: {
                          type: string;
                        };
                        providerId: {
                          type: string;
                        };
                        createdAt: {
                          type: string;
                          format: string;
                        };
                        updatedAt: {
                          type: string;
                          format: string;
                        };
                        accountId: {
                          type: string;
                        };
                        userId: {
                          type: string;
                        };
                        scopes: {
                          type: string;
                          items: {
                            type: string;
                          };
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
      };
    }, {
      scopes: string[];
      id: string;
      createdAt: Date;
      updatedAt: Date;
      userId: string;
      providerId: string;
      accountId: string;
    }[]>;
    readonly deleteUserCallback: import("better-call").StrictEndpoint<"/delete-user/callback", {
      method: "GET";
      query: import("zod").ZodObject<{
        token: import("zod").ZodString;
        callbackURL: import("zod").ZodOptional<import("zod").ZodString>;
      }, import("zod/v4/core").$strip>;
      use: ((inputContext: import("better-call").MiddlewareInputContext<import("better-call").MiddlewareOptions>) => Promise<void>)[];
      metadata: {
        openapi: {
          description: string;
          responses: {
            "200": {
              description: string;
              content: {
                "application/json": {
                  schema: {
                    type: "object";
                    properties: {
                      success: {
                        type: string;
                        description: string;
                      };
                      message: {
                        type: string;
                        enum: string[];
                        description: string;
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
      message: string;
    }>;
    readonly unlinkAccount: import("better-call").StrictEndpoint<"/unlink-account", {
      method: "POST";
      body: import("zod").ZodObject<{
        providerId: import("zod").ZodString;
        accountId: import("zod").ZodOptional<import("zod").ZodString>;
      }, import("zod/v4/core").$strip>;
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
            "200": {
              description: string;
              content: {
                "application/json": {
                  schema: {
                    type: "object";
                    properties: {
                      status: {
                        type: string;
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
      status: boolean;
    }>;
    readonly refreshToken: import("better-call").StrictEndpoint<"/refresh-token", {
      method: "POST";
      body: import("zod").ZodObject<{
        providerId: import("zod").ZodString;
        accountId: import("zod").ZodOptional<import("zod").ZodString>;
        userId: import("zod").ZodOptional<import("zod").ZodString>;
      }, import("zod/v4/core").$strip>;
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
                      tokenType: {
                        type: string;
                      };
                      idToken: {
                        type: string;
                      };
                      accessToken: {
                        type: string;
                      };
                      refreshToken: {
                        type: string;
                      };
                      accessTokenExpiresAt: {
                        type: string;
                        format: string;
                      };
                      refreshTokenExpiresAt: {
                        type: string;
                        format: string;
                      };
                    };
                  };
                };
              };
            };
            400: {
              description: string;
            };
          };
        };
      };
    }, {
      accessToken: string | undefined;
      refreshToken: string;
      accessTokenExpiresAt: Date | undefined;
      refreshTokenExpiresAt: Date | null | undefined;
      scope: string | null | undefined;
      idToken: string | null | undefined;
      providerId: string;
      accountId: string;
    }>;
    readonly getAccessToken: import("better-call").StrictEndpoint<"/get-access-token", {
      method: "POST";
      body: import("zod").ZodObject<{
        providerId: import("zod").ZodString;
        accountId: import("zod").ZodOptional<import("zod").ZodString>;
        userId: import("zod").ZodOptional<import("zod").ZodString>;
      }, import("zod/v4/core").$strip>;
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
                      tokenType: {
                        type: string;
                      };
                      idToken: {
                        type: string;
                      };
                      accessToken: {
                        type: string;
                      };
                      accessTokenExpiresAt: {
                        type: string;
                        format: string;
                      };
                    };
                  };
                };
              };
            };
            400: {
              description: string;
            };
          };
        };
      };
    }, {
      accessToken: string;
      accessTokenExpiresAt: Date | undefined;
      scopes: string[];
      idToken: string | undefined;
    }>;
    readonly accountInfo: import("better-call").StrictEndpoint<"/account-info", {
      method: "GET";
      metadata: {
        openapi: {
          description: string;
          responses: {
            "200": {
              description: string;
              content: {
                "application/json": {
                  schema: {
                    type: "object";
                    properties: {
                      user: {
                        type: string;
                        properties: {
                          id: {
                            type: string;
                          };
                          name: {
                            type: string;
                          };
                          email: {
                            type: string;
                          };
                          image: {
                            type: string;
                          };
                          emailVerified: {
                            type: string;
                          };
                        };
                        required: string[];
                      };
                      data: {
                        type: string;
                        properties: {};
                        additionalProperties: boolean;
                      };
                    };
                    required: string[];
                    additionalProperties: boolean;
                  };
                };
              };
            };
          };
        };
      };
      query: import("zod").ZodOptional<import("zod").ZodObject<{
        accountId: import("zod").ZodOptional<import("zod").ZodString>;
        providerId: import("zod").ZodOptional<import("zod").ZodString>;
        userId: import("zod").ZodOptional<import("zod").ZodString>;
      }, import("zod/v4/core").$strip>>;
    }, {
      user: import("@better-auth/core/oauth2").OAuth2UserInfo;
      data: Record<string, any>;
    } | null>;
  }, UnionToIntersection<Option["plugins"] extends (infer T_10)[] ? T_10 extends BetterAuthPlugin ? T_10 extends {
    endpoints: infer E;
  } ? E : {} : {} : {}>>;
  middlewares: {
    path: string;
    middleware: any;
  }[];
};
declare const router: <Option extends BetterAuthOptions>(ctx: AuthContext, options: Option) => {
  handler: (request: Request) => Promise<Response>;
  endpoints: UnionToIntersection<Option["plugins"] extends (infer T)[] ? T extends BetterAuthPlugin ? T extends {
    endpoints: infer E;
  } ? E : {} : {} : {}> extends (infer T_1) ? T_1 extends UnionToIntersection<Option["plugins"] extends (infer T)[] ? T extends BetterAuthPlugin ? T extends {
    endpoints: infer E;
  } ? E : {} : {} : {}> ? T_1 extends unknown ? Prettify<({
    readonly ok: import("better-call").StrictEndpoint<"/ok", {
      method: "GET";
      metadata: {
        openapi: {
          description: string;
          responses: {
            "200": {
              description: string;
              content: {
                "application/json": {
                  schema: {
                    type: "object";
                    properties: {
                      ok: {
                        type: string;
                        description: string;
                      };
                    };
                    required: string[];
                  };
                };
              };
            };
          };
        };
        scope: "server";
      };
    }, {
      ok: boolean;
    }>;
    readonly error: import("better-call").StrictEndpoint<"/error", {
      method: "GET";
      metadata: {
        openapi: {
          description: string;
          responses: {
            "200": {
              description: string;
              content: {
                "text/html": {
                  schema: {
                    type: "string";
                    description: string;
                  };
                };
              };
            };
          };
        };
        scope: "server";
      };
    }, Response>;
    readonly signInSocial: import("better-call").StrictEndpoint<"/sign-in/social", {
      method: "POST";
      operationId: string;
      body: import("zod").ZodObject<{
        callbackURL: import("zod").ZodOptional<import("zod").ZodString>;
        newUserCallbackURL: import("zod").ZodOptional<import("zod").ZodString>;
        errorCallbackURL: import("zod").ZodOptional<import("zod").ZodString>;
        provider: import("zod").ZodType<(string & {}) | "linear" | "huggingface" | "github" | "apple" | "atlassian" | "cognito" | "discord" | "facebook" | "figma" | "microsoft" | "google" | "slack" | "spotify" | "twitch" | "twitter" | "dropbox" | "kick" | "linkedin" | "gitlab" | "tiktok" | "reddit" | "roblox" | "salesforce" | "vk" | "zoom" | "notion" | "kakao" | "naver" | "line" | "paybin" | "paypal" | "polar" | "railway" | "vercel" | "wechat", unknown, import("zod/v4/core").$ZodTypeInternals<(string & {}) | "linear" | "huggingface" | "github" | "apple" | "atlassian" | "cognito" | "discord" | "facebook" | "figma" | "microsoft" | "google" | "slack" | "spotify" | "twitch" | "twitter" | "dropbox" | "kick" | "linkedin" | "gitlab" | "tiktok" | "reddit" | "roblox" | "salesforce" | "vk" | "zoom" | "notion" | "kakao" | "naver" | "line" | "paybin" | "paypal" | "polar" | "railway" | "vercel" | "wechat", unknown>>;
        disableRedirect: import("zod").ZodOptional<import("zod").ZodBoolean>;
        idToken: import("zod").ZodOptional<import("zod").ZodObject<{
          token: import("zod").ZodString;
          nonce: import("zod").ZodOptional<import("zod").ZodString>;
          accessToken: import("zod").ZodOptional<import("zod").ZodString>;
          refreshToken: import("zod").ZodOptional<import("zod").ZodString>;
          expiresAt: import("zod").ZodOptional<import("zod").ZodNumber>;
          user: import("zod").ZodOptional<import("zod").ZodObject<{
            name: import("zod").ZodOptional<import("zod").ZodObject<{
              firstName: import("zod").ZodOptional<import("zod").ZodString>;
              lastName: import("zod").ZodOptional<import("zod").ZodString>;
            }, import("zod/v4/core").$strip>>;
            email: import("zod").ZodOptional<import("zod").ZodString>;
          }, import("zod/v4/core").$strip>>;
        }, import("zod/v4/core").$strip>>;
        scopes: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString>>;
        requestSignUp: import("zod").ZodOptional<import("zod").ZodBoolean>;
        loginHint: import("zod").ZodOptional<import("zod").ZodString>;
        additionalData: import("zod").ZodOptional<import("zod").ZodRecord<import("zod").ZodString, import("zod").ZodAny>>;
      }, import("zod/v4/core").$strip>;
      metadata: {
        $Infer: {
          body: import("zod").infer<import("zod").ZodObject<{
            callbackURL: import("zod").ZodOptional<import("zod").ZodString>;
            newUserCallbackURL: import("zod").ZodOptional<import("zod").ZodString>;
            errorCallbackURL: import("zod").ZodOptional<import("zod").ZodString>;
            provider: import("zod").ZodType<(string & {}) | "linear" | "huggingface" | "github" | "apple" | "atlassian" | "cognito" | "discord" | "facebook" | "figma" | "microsoft" | "google" | "slack" | "spotify" | "twitch" | "twitter" | "dropbox" | "kick" | "linkedin" | "gitlab" | "tiktok" | "reddit" | "roblox" | "salesforce" | "vk" | "zoom" | "notion" | "kakao" | "naver" | "line" | "paybin" | "paypal" | "polar" | "railway" | "vercel" | "wechat", unknown, import("zod/v4/core").$ZodTypeInternals<(string & {}) | "linear" | "huggingface" | "github" | "apple" | "atlassian" | "cognito" | "discord" | "facebook" | "figma" | "microsoft" | "google" | "slack" | "spotify" | "twitch" | "twitter" | "dropbox" | "kick" | "linkedin" | "gitlab" | "tiktok" | "reddit" | "roblox" | "salesforce" | "vk" | "zoom" | "notion" | "kakao" | "naver" | "line" | "paybin" | "paypal" | "polar" | "railway" | "vercel" | "wechat", unknown>>;
            disableRedirect: import("zod").ZodOptional<import("zod").ZodBoolean>;
            idToken: import("zod").ZodOptional<import("zod").ZodObject<{
              token: import("zod").ZodString;
              nonce: import("zod").ZodOptional<import("zod").ZodString>;
              accessToken: import("zod").ZodOptional<import("zod").ZodString>;
              refreshToken: import("zod").ZodOptional<import("zod").ZodString>;
              expiresAt: import("zod").ZodOptional<import("zod").ZodNumber>;
              user: import("zod").ZodOptional<import("zod").ZodObject<{
                name: import("zod").ZodOptional<import("zod").ZodObject<{
                  firstName: import("zod").ZodOptional<import("zod").ZodString>;
                  lastName: import("zod").ZodOptional<import("zod").ZodString>;
                }, import("zod/v4/core").$strip>>;
                email: import("zod").ZodOptional<import("zod").ZodString>;
              }, import("zod/v4/core").$strip>>;
            }, import("zod/v4/core").$strip>>;
            scopes: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString>>;
            requestSignUp: import("zod").ZodOptional<import("zod").ZodBoolean>;
            loginHint: import("zod").ZodOptional<import("zod").ZodString>;
            additionalData: import("zod").ZodOptional<import("zod").ZodRecord<import("zod").ZodString, import("zod").ZodAny>>;
          }, import("zod/v4/core").$strip>>;
          returned: {
            redirect: boolean;
            token?: string | undefined;
            url?: string | undefined;
            user?: ({
              id: string;
              createdAt: Date;
              updatedAt: Date;
              email: string;
              emailVerified: boolean;
              name: string;
              image?: string | null | undefined;
            } & import("@better-auth/core/db").InferDBFieldsFromOptions<Option["user"]> & import("@better-auth/core/db").InferDBFieldsFromPlugins<"user", Option["plugins"]> extends (infer T_3) ? { [K_1 in keyof T_3]: T_3[K_1]; } : never) | undefined;
          };
        };
        openapi: {
          description: string;
          operationId: string;
          responses: {
            "200": {
              description: string;
              content: {
                "application/json": {
                  schema: {
                    type: "object";
                    description: string;
                    properties: {
                      token: {
                        type: string;
                      };
                      user: {
                        type: string;
                        $ref: string;
                      };
                      url: {
                        type: string;
                      };
                      redirect: {
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
      redirect: boolean;
      url: string;
    } | {
      redirect: boolean;
      token: string;
      url: undefined;
      user: {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        emailVerified: boolean;
        name: string;
        image?: string | null | undefined;
      } & import("@better-auth/core/db").InferDBFieldsFromOptions<Option["user"]> & import("@better-auth/core/db").InferDBFieldsFromPlugins<"user", Option["plugins"]> extends (infer T_4) ? { [K_1 in keyof T_4]: T_4[K_1]; } : never;
    }>;
    readonly callbackOAuth: import("better-call").StrictEndpoint<"/callback/:id", {
      method: ("GET" | "POST")[];
      operationId: string;
      body: import("zod").ZodOptional<import("zod").ZodObject<{
        code: import("zod").ZodOptional<import("zod").ZodString>;
        error: import("zod").ZodOptional<import("zod").ZodString>;
        device_id: import("zod").ZodOptional<import("zod").ZodString>;
        error_description: import("zod").ZodOptional<import("zod").ZodString>;
        state: import("zod").ZodOptional<import("zod").ZodString>;
        user: import("zod").ZodOptional<import("zod").ZodString>;
      }, import("zod/v4/core").$strip>>;
      query: import("zod").ZodOptional<import("zod").ZodObject<{
        code: import("zod").ZodOptional<import("zod").ZodString>;
        error: import("zod").ZodOptional<import("zod").ZodString>;
        device_id: import("zod").ZodOptional<import("zod").ZodString>;
        error_description: import("zod").ZodOptional<import("zod").ZodString>;
        state: import("zod").ZodOptional<import("zod").ZodString>;
        user: import("zod").ZodOptional<import("zod").ZodString>;
      }, import("zod/v4/core").$strip>>;
      metadata: {
        allowedMediaTypes: string[];
        scope: "server";
      };
    }, never>;
    readonly getSession: import("better-call").StrictEndpoint<"/get-session", {
      method: ("GET" | "POST")[];
      operationId: string;
      query: import("zod").ZodOptional<import("zod").ZodObject<{
        disableCookieCache: import("zod").ZodOptional<import("zod").ZodCoercedBoolean<unknown>>;
        disableRefresh: import("zod").ZodOptional<import("zod").ZodCoercedBoolean<unknown>>;
      }, import("zod/v4/core").$strip>>;
      requireHeaders: true;
      metadata: {
        openapi: {
          operationId: string;
          description: string;
          responses: {
            "200": {
              description: string;
              content: {
                "application/json": {
                  schema: {
                    type: "object";
                    properties: {
                      session: {
                        $ref: string;
                      };
                      user: {
                        $ref: string;
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
      session: {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        expiresAt: Date;
        token: string;
        ipAddress?: string | null | undefined;
        userAgent?: string | null | undefined;
      } & import("@better-auth/core/db").InferDBFieldsFromOptions<Option["session"]> & import("@better-auth/core/db").InferDBFieldsFromPlugins<"session", Option["plugins"]> extends (infer T_5) ? { [K_2 in keyof T_5]: T_5[K_2]; } : never;
      user: {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        emailVerified: boolean;
        name: string;
        image?: string | null | undefined;
      } & import("@better-auth/core/db").InferDBFieldsFromOptions<Option["user"]> & import("@better-auth/core/db").InferDBFieldsFromPlugins<"user", Option["plugins"]> extends (infer T_6) ? { [K_1 in keyof T_6]: T_6[K_1]; } : never;
    } | null>;
    readonly signOut: import("better-call").StrictEndpoint<"/sign-out", {
      method: "POST";
      operationId: string;
      requireHeaders: true;
      metadata: {
        openapi: {
          operationId: string;
          description: string;
          responses: {
            "200": {
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
          };
        };
      };
    }, {
      success: boolean;
    }>;
    readonly signUpEmail: import("better-call").StrictEndpoint<"/sign-up/email", {
      method: "POST";
      operationId: string;
      use: ((inputContext: import("better-call").MiddlewareInputContext<import("better-call").MiddlewareOptions>) => Promise<void>)[];
      body: import("zod").ZodIntersection<import("zod").ZodObject<{
        name: import("zod").ZodString;
        email: import("zod").ZodEmail;
        password: import("zod").ZodString;
        image: import("zod").ZodOptional<import("zod").ZodString>;
        callbackURL: import("zod").ZodOptional<import("zod").ZodString>;
        rememberMe: import("zod").ZodOptional<import("zod").ZodBoolean>;
      }, import("zod/v4/core").$strip>, import("zod").ZodRecord<import("zod").ZodString, import("zod").ZodAny>>;
      cloneRequest: true;
      metadata: {
        allowedMediaTypes: string[];
        $Infer: {
          body: {
            name: string;
            email: string;
            password: string;
            image?: string | undefined;
            callbackURL?: string | undefined;
            rememberMe?: boolean | undefined;
          } & import("@better-auth/core/db").InferDBFieldsFromPluginsInput<"user", Option["plugins"]> & import("@better-auth/core/db").InferDBFieldsFromOptionsInput<Option["user"]>;
          returned: {
            token: string | null;
            user: {
              id: string;
              createdAt: Date;
              updatedAt: Date;
              email: string;
              emailVerified: boolean;
              name: string;
              image?: string | null | undefined;
            } & import("@better-auth/core/db").InferDBFieldsFromOptions<Option["user"]> & import("@better-auth/core/db").InferDBFieldsFromPlugins<"user", Option["plugins"]> extends (infer T_7) ? { [K_1 in keyof T_7]: T_7[K_1]; } : never;
          };
        };
        openapi: {
          operationId: string;
          description: string;
          requestBody: {
            content: {
              "application/json": {
                schema: {
                  type: "object";
                  properties: {
                    name: {
                      type: string;
                      description: string;
                    };
                    email: {
                      type: string;
                      description: string;
                    };
                    password: {
                      type: string;
                      description: string;
                    };
                    image: {
                      type: string;
                      description: string;
                    };
                    callbackURL: {
                      type: string;
                      description: string;
                    };
                    rememberMe: {
                      type: string;
                      description: string;
                    };
                  };
                  required: string[];
                };
              };
            };
          };
          responses: {
            "200": {
              description: string;
              content: {
                "application/json": {
                  schema: {
                    type: "object";
                    properties: {
                      token: {
                        type: string;
                        nullable: boolean;
                        description: string;
                      };
                      user: {
                        type: string;
                        properties: {
                          id: {
                            type: string;
                            description: string;
                          };
                          email: {
                            type: string;
                            format: string;
                            description: string;
                          };
                          name: {
                            type: string;
                            description: string;
                          };
                          image: {
                            type: string;
                            format: string;
                            nullable: boolean;
                            description: string;
                          };
                          emailVerified: {
                            type: string;
                            description: string;
                          };
                          createdAt: {
                            type: string;
                            format: string;
                            description: string;
                          };
                          updatedAt: {
                            type: string;
                            format: string;
                            description: string;
                          };
                        };
                        required: string[];
                      };
                    };
                    required: string[];
                  };
                };
              };
            };
            "422": {
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
                };
              };
            };
          };
        };
      };
    }, {
      token: null;
      user: {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        emailVerified: boolean;
        name: string;
        image?: string | null | undefined;
      } & import("@better-auth/core/db").InferDBFieldsFromOptions<Option["user"]> & import("@better-auth/core/db").InferDBFieldsFromPlugins<"user", Option["plugins"]> extends (infer T_8) ? { [K_1 in keyof T_8]: T_8[K_1]; } : never;
    } | {
      token: string;
      user: {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        emailVerified: boolean;
        name: string;
        image?: string | null | undefined;
      } & import("@better-auth/core/db").InferDBFieldsFromOptions<Option["user"]> & import("@better-auth/core/db").InferDBFieldsFromPlugins<"user", Option["plugins"]> extends (infer T_9) ? { [K_1 in keyof T_9]: T_9[K_1]; } : never;
    }>;
    readonly signInEmail: import("better-call").StrictEndpoint<"/sign-in/email", {
      method: "POST";
      operationId: string;
      use: ((inputContext: import("better-call").MiddlewareInputContext<import("better-call").MiddlewareOptions>) => Promise<void>)[];
      cloneRequest: true;
      body: import("zod").ZodObject<{
        email: import("zod").ZodString;
        password: import("zod").ZodString;
        callbackURL: import("zod").ZodOptional<import("zod").ZodString>;
        rememberMe: import("zod").ZodOptional<import("zod").ZodDefault<import("zod").ZodBoolean>>;
      }, import("zod/v4/core").$strip>;
      metadata: {
        allowedMediaTypes: string[];
        $Infer: {
          body: {
            email: string;
            password: string;
            callbackURL?: string | undefined;
            rememberMe?: boolean | undefined;
          };
          returned: {
            redirect: boolean;
            token: string;
            url?: string | undefined;
            user: {
              id: string;
              createdAt: Date;
              updatedAt: Date;
              email: string;
              emailVerified: boolean;
              name: string;
              image?: string | null | undefined;
            } & import("@better-auth/core/db").InferDBFieldsFromOptions<Option["user"]> & import("@better-auth/core/db").InferDBFieldsFromPlugins<"user", Option["plugins"]> extends (infer T_10) ? { [K_1 in keyof T_10]: T_10[K_1]; } : never;
          };
        };
        openapi: {
          operationId: string;
          description: string;
          responses: {
            "200": {
              description: string;
              content: {
                "application/json": {
                  schema: {
                    type: "object";
                    description: string;
                    properties: {
                      redirect: {
                        type: string;
                        enum: boolean[];
                      };
                      token: {
                        type: string;
                        description: string;
                      };
                      url: {
                        type: string;
                        nullable: boolean;
                      };
                      user: {
                        type: string;
                        $ref: string;
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
      redirect: boolean;
      token: string;
      url?: string | undefined;
      user: {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        emailVerified: boolean;
        name: string;
        image?: string | null | undefined;
      } & import("@better-auth/core/db").InferDBFieldsFromOptions<Option["user"]> & import("@better-auth/core/db").InferDBFieldsFromPlugins<"user", Option["plugins"]> extends (infer T_11) ? { [K_1 in keyof T_11]: T_11[K_1]; } : never;
    }>;
    readonly resetPassword: import("better-call").StrictEndpoint<"/reset-password", {
      method: "POST";
      operationId: string;
      query: import("zod").ZodOptional<import("zod").ZodObject<{
        token: import("zod").ZodOptional<import("zod").ZodString>;
      }, import("zod/v4/core").$strip>>;
      body: import("zod").ZodObject<{
        newPassword: import("zod").ZodString;
        token: import("zod").ZodOptional<import("zod").ZodString>;
      }, import("zod/v4/core").$strip>;
      metadata: {
        openapi: {
          operationId: string;
          description: string;
          responses: {
            "200": {
              description: string;
              content: {
                "application/json": {
                  schema: {
                    type: "object";
                    properties: {
                      status: {
                        type: string;
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
      status: boolean;
    }>;
    readonly verifyPassword: import("better-call").StrictEndpoint<"/verify-password", {
      method: "POST";
      body: import("zod").ZodObject<{
        password: import("zod").ZodString;
      }, import("zod/v4/core").$strip>;
      metadata: {
        scope: "server";
        openapi: {
          operationId: string;
          description: string;
          responses: {
            "200": {
              description: string;
              content: {
                "application/json": {
                  schema: {
                    type: "object";
                    properties: {
                      status: {
                        type: string;
                      };
                    };
                  };
                };
              };
            };
          };
        };
      };
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
    }, {
      status: boolean;
    }>;
    readonly verifyEmail: import("better-call").StrictEndpoint<"/verify-email", {
      method: "GET";
      operationId: string;
      query: import("zod").ZodObject<{
        token: import("zod").ZodString;
        callbackURL: import("zod").ZodOptional<import("zod").ZodString>;
      }, import("zod/v4/core").$strip>;
      use: ((inputContext: import("better-call").MiddlewareInputContext<import("better-call").MiddlewareOptions>) => Promise<void>)[];
      metadata: {
        openapi: {
          description: string;
          parameters: ({
            name: string;
            in: "query";
            description: string;
            required: true;
            schema: {
              type: "string";
            };
          } | {
            name: string;
            in: "query";
            description: string;
            required: false;
            schema: {
              type: "string";
            };
          })[];
          responses: {
            "200": {
              description: string;
              content: {
                "application/json": {
                  schema: {
                    type: "object";
                    properties: {
                      user: {
                        type: string;
                        $ref: string;
                      };
                      status: {
                        type: string;
                        description: string;
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
    }, void | {
      status: boolean;
    }>;
    readonly sendVerificationEmail: import("better-call").StrictEndpoint<"/send-verification-email", {
      method: "POST";
      operationId: string;
      cloneRequest: true;
      body: import("zod").ZodObject<{
        email: import("zod").ZodEmail;
        callbackURL: import("zod").ZodOptional<import("zod").ZodString>;
      }, import("zod/v4/core").$strip>;
      metadata: {
        openapi: {
          operationId: string;
          description: string;
          requestBody: {
            content: {
              "application/json": {
                schema: {
                  type: "object";
                  properties: {
                    email: {
                      type: string;
                      description: string;
                      example: string;
                    };
                    callbackURL: {
                      type: string;
                      description: string;
                      example: string;
                      nullable: boolean;
                    };
                  };
                  required: string[];
                };
              };
            };
          };
          responses: {
            "200": {
              description: string;
              content: {
                "application/json": {
                  schema: {
                    type: "object";
                    properties: {
                      status: {
                        type: string;
                        description: string;
                        example: boolean;
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
                        description: string;
                        example: string;
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
      status: boolean;
    }>;
    readonly changeEmail: import("better-call").StrictEndpoint<"/change-email", {
      method: "POST";
      body: import("zod").ZodObject<{
        newEmail: import("zod").ZodEmail;
        callbackURL: import("zod").ZodOptional<import("zod").ZodString>;
      }, import("zod/v4/core").$strip>;
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
          operationId: string;
          responses: {
            "200": {
              description: string;
              content: {
                "application/json": {
                  schema: {
                    type: "object";
                    properties: {
                      user: {
                        type: string;
                        $ref: string;
                      };
                      status: {
                        type: string;
                        description: string;
                      };
                      message: {
                        type: string;
                        enum: string[];
                        description: string;
                        nullable: boolean;
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
      status: boolean;
    }>;
    readonly changePassword: import("better-call").StrictEndpoint<"/change-password", {
      method: "POST";
      operationId: string;
      body: import("zod").ZodObject<{
        newPassword: import("zod").ZodString;
        currentPassword: import("zod").ZodString;
        revokeOtherSessions: import("zod").ZodOptional<import("zod").ZodBoolean>;
      }, import("zod/v4/core").$strip>;
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
          operationId: string;
          description: string;
          responses: {
            "200": {
              description: string;
              content: {
                "application/json": {
                  schema: {
                    type: "object";
                    properties: {
                      token: {
                        type: string;
                        nullable: boolean;
                        description: string;
                      };
                      user: {
                        type: string;
                        properties: {
                          id: {
                            type: string;
                            description: string;
                          };
                          email: {
                            type: string;
                            format: string;
                            description: string;
                          };
                          name: {
                            type: string;
                            description: string;
                          };
                          image: {
                            type: string;
                            format: string;
                            nullable: boolean;
                            description: string;
                          };
                          emailVerified: {
                            type: string;
                            description: string;
                          };
                          createdAt: {
                            type: string;
                            format: string;
                            description: string;
                          };
                          updatedAt: {
                            type: string;
                            format: string;
                            description: string;
                          };
                        };
                        required: string[];
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
      token: string | null;
      user: {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        emailVerified: boolean;
        name: string;
        image?: string | null | undefined;
      } & Record<string, any> & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        emailVerified: boolean;
        name: string;
        image?: string | null | undefined;
      };
    }>;
    readonly setPassword: import("better-call").StrictEndpoint<string, {
      method: "POST";
      body: import("zod").ZodObject<{
        newPassword: import("zod").ZodString;
      }, import("zod/v4/core").$strip>;
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
    }, {
      status: boolean;
    }>;
    readonly updateSession: import("better-call").StrictEndpoint<"/update-session", {
      method: "POST";
      operationId: string;
      body: import("zod").ZodRecord<import("zod").ZodString, import("zod").ZodAny>;
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
        $Infer: {
          body: Partial<AdditionalSessionFieldsInput<Option>>;
        };
        openapi: {
          operationId: string;
          description: string;
          responses: {
            "200": {
              description: string;
              content: {
                "application/json": {
                  schema: {
                    type: "object";
                    properties: {
                      session: {
                        type: string;
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
      session: {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        expiresAt: Date;
        token: string;
        ipAddress?: string | null | undefined;
        userAgent?: string | null | undefined;
      };
    }>;
    readonly updateUser: import("better-call").StrictEndpoint<"/update-user", {
      method: "POST";
      operationId: string;
      body: import("zod").ZodRecord<import("zod").ZodString, import("zod").ZodAny>;
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
        $Infer: {
          body: Partial<AdditionalUserFieldsInput<Option>> & {
            name?: string | undefined;
            image?: string | undefined | null;
          };
        };
        openapi: {
          operationId: string;
          description: string;
          requestBody: {
            content: {
              "application/json": {
                schema: {
                  type: "object";
                  properties: {
                    name: {
                      type: string;
                      description: string;
                    };
                    image: {
                      type: string;
                      description: string;
                      nullable: boolean;
                    };
                  };
                };
              };
            };
          };
          responses: {
            "200": {
              description: string;
              content: {
                "application/json": {
                  schema: {
                    type: "object";
                    properties: {
                      user: {
                        type: string;
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
      status: boolean;
    }>;
    readonly deleteUser: import("better-call").StrictEndpoint<"/delete-user", {
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
      body: import("zod").ZodObject<{
        callbackURL: import("zod").ZodOptional<import("zod").ZodString>;
        password: import("zod").ZodOptional<import("zod").ZodString>;
        token: import("zod").ZodOptional<import("zod").ZodString>;
      }, import("zod/v4/core").$strip>;
      metadata: {
        openapi: {
          operationId: string;
          description: string;
          requestBody: {
            content: {
              "application/json": {
                schema: {
                  type: "object";
                  properties: {
                    callbackURL: {
                      type: string;
                      description: string;
                    };
                    password: {
                      type: string;
                      description: string;
                    };
                    token: {
                      type: string;
                      description: string;
                    };
                  };
                };
              };
            };
          };
          responses: {
            "200": {
              description: string;
              content: {
                "application/json": {
                  schema: {
                    type: "object";
                    properties: {
                      success: {
                        type: string;
                        description: string;
                      };
                      message: {
                        type: string;
                        enum: string[];
                        description: string;
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
      message: string;
    }>;
    readonly requestPasswordReset: import("better-call").StrictEndpoint<"/request-password-reset", {
      method: "POST";
      body: import("zod").ZodObject<{
        email: import("zod").ZodEmail;
        redirectTo: import("zod").ZodOptional<import("zod").ZodString>;
      }, import("zod/v4/core").$strip>;
      metadata: {
        openapi: {
          operationId: string;
          description: string;
          responses: {
            "200": {
              description: string;
              content: {
                "application/json": {
                  schema: {
                    type: "object";
                    properties: {
                      status: {
                        type: string;
                      };
                      message: {
                        type: string;
                      };
                    };
                  };
                };
              };
            };
          };
        };
      };
      use: ((inputContext: import("better-call").MiddlewareInputContext<import("better-call").MiddlewareOptions>) => Promise<void>)[];
    }, {
      status: boolean;
      message: string;
    }>;
    readonly requestPasswordResetCallback: import("better-call").StrictEndpoint<"/reset-password/:token", {
      method: "GET";
      operationId: string;
      query: import("zod").ZodObject<{
        callbackURL: import("zod").ZodString;
      }, import("zod/v4/core").$strip>;
      use: ((inputContext: import("better-call").MiddlewareInputContext<import("better-call").MiddlewareOptions>) => Promise<void>)[];
      metadata: {
        openapi: {
          operationId: string;
          description: string;
          parameters: ({
            name: string;
            in: "path";
            required: true;
            description: string;
            schema: {
              type: "string";
            };
          } | {
            name: string;
            in: "query";
            required: true;
            description: string;
            schema: {
              type: "string";
            };
          })[];
          responses: {
            "200": {
              description: string;
              content: {
                "application/json": {
                  schema: {
                    type: "object";
                    properties: {
                      token: {
                        type: string;
                      };
                    };
                  };
                };
              };
            };
          };
        };
      };
    }, never>;
    readonly listSessions: import("better-call").StrictEndpoint<"/list-sessions", {
      method: "GET";
      operationId: string;
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
      requireHeaders: true;
      metadata: {
        openapi: {
          operationId: string;
          description: string;
          responses: {
            "200": {
              description: string;
              content: {
                "application/json": {
                  schema: {
                    type: "array";
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
    }, Prettify<{
      id: string;
      createdAt: Date;
      updatedAt: Date;
      userId: string;
      expiresAt: Date;
      token: string;
      ipAddress?: string | null | undefined;
      userAgent?: string | null | undefined;
    } & import("@better-auth/core/db").InferDBFieldsFromOptions<Option["session"]> & import("@better-auth/core/db").InferDBFieldsFromPlugins<"session", Option["plugins"]> extends (infer T_12) ? { [K_2 in keyof T_12]: T_12[K_2]; } : never>[]>;
    readonly revokeSession: import("better-call").StrictEndpoint<"/revoke-session", {
      method: "POST";
      body: import("zod").ZodObject<{
        token: import("zod").ZodString;
      }, import("zod/v4/core").$strip>;
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
      requireHeaders: true;
      metadata: {
        openapi: {
          description: string;
          requestBody: {
            content: {
              "application/json": {
                schema: {
                  type: "object";
                  properties: {
                    token: {
                      type: string;
                      description: string;
                    };
                  };
                  required: string[];
                };
              };
            };
          };
          responses: {
            "200": {
              description: string;
              content: {
                "application/json": {
                  schema: {
                    type: "object";
                    properties: {
                      status: {
                        type: string;
                        description: string;
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
      status: boolean;
    }>;
    readonly revokeSessions: import("better-call").StrictEndpoint<"/revoke-sessions", {
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
      requireHeaders: true;
      metadata: {
        openapi: {
          description: string;
          responses: {
            "200": {
              description: string;
              content: {
                "application/json": {
                  schema: {
                    type: "object";
                    properties: {
                      status: {
                        type: string;
                        description: string;
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
      status: boolean;
    }>;
    readonly revokeOtherSessions: import("better-call").StrictEndpoint<"/revoke-other-sessions", {
      method: "POST";
      requireHeaders: true;
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
            "200": {
              description: string;
              content: {
                "application/json": {
                  schema: {
                    type: "object";
                    properties: {
                      status: {
                        type: string;
                        description: string;
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
      status: boolean;
    }>;
    readonly linkSocialAccount: import("better-call").StrictEndpoint<"/link-social", {
      method: "POST";
      requireHeaders: true;
      body: import("zod").ZodObject<{
        callbackURL: import("zod").ZodOptional<import("zod").ZodString>;
        provider: import("zod").ZodType<(string & {}) | "linear" | "huggingface" | "github" | "apple" | "atlassian" | "cognito" | "discord" | "facebook" | "figma" | "microsoft" | "google" | "slack" | "spotify" | "twitch" | "twitter" | "dropbox" | "kick" | "linkedin" | "gitlab" | "tiktok" | "reddit" | "roblox" | "salesforce" | "vk" | "zoom" | "notion" | "kakao" | "naver" | "line" | "paybin" | "paypal" | "polar" | "railway" | "vercel" | "wechat", unknown, import("zod/v4/core").$ZodTypeInternals<(string & {}) | "linear" | "huggingface" | "github" | "apple" | "atlassian" | "cognito" | "discord" | "facebook" | "figma" | "microsoft" | "google" | "slack" | "spotify" | "twitch" | "twitter" | "dropbox" | "kick" | "linkedin" | "gitlab" | "tiktok" | "reddit" | "roblox" | "salesforce" | "vk" | "zoom" | "notion" | "kakao" | "naver" | "line" | "paybin" | "paypal" | "polar" | "railway" | "vercel" | "wechat", unknown>>;
        idToken: import("zod").ZodOptional<import("zod").ZodObject<{
          token: import("zod").ZodString;
          nonce: import("zod").ZodOptional<import("zod").ZodString>;
          accessToken: import("zod").ZodOptional<import("zod").ZodString>;
          refreshToken: import("zod").ZodOptional<import("zod").ZodString>;
          scopes: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString>>;
        }, import("zod/v4/core").$strip>>;
        requestSignUp: import("zod").ZodOptional<import("zod").ZodBoolean>;
        scopes: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString>>;
        errorCallbackURL: import("zod").ZodOptional<import("zod").ZodString>;
        disableRedirect: import("zod").ZodOptional<import("zod").ZodBoolean>;
        additionalData: import("zod").ZodOptional<import("zod").ZodRecord<import("zod").ZodString, import("zod").ZodAny>>;
      }, import("zod/v4/core").$strip>;
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
          operationId: string;
          responses: {
            "200": {
              description: string;
              content: {
                "application/json": {
                  schema: {
                    type: "object";
                    properties: {
                      url: {
                        type: string;
                        description: string;
                      };
                      redirect: {
                        type: string;
                        description: string;
                      };
                      status: {
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
      url: string;
      redirect: boolean;
    }>;
    readonly listUserAccounts: import("better-call").StrictEndpoint<"/list-accounts", {
      method: "GET";
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
          operationId: string;
          description: string;
          responses: {
            "200": {
              description: string;
              content: {
                "application/json": {
                  schema: {
                    type: "array";
                    items: {
                      type: string;
                      properties: {
                        id: {
                          type: string;
                        };
                        providerId: {
                          type: string;
                        };
                        createdAt: {
                          type: string;
                          format: string;
                        };
                        updatedAt: {
                          type: string;
                          format: string;
                        };
                        accountId: {
                          type: string;
                        };
                        userId: {
                          type: string;
                        };
                        scopes: {
                          type: string;
                          items: {
                            type: string;
                          };
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
      };
    }, {
      scopes: string[];
      id: string;
      createdAt: Date;
      updatedAt: Date;
      userId: string;
      providerId: string;
      accountId: string;
    }[]>;
    readonly deleteUserCallback: import("better-call").StrictEndpoint<"/delete-user/callback", {
      method: "GET";
      query: import("zod").ZodObject<{
        token: import("zod").ZodString;
        callbackURL: import("zod").ZodOptional<import("zod").ZodString>;
      }, import("zod/v4/core").$strip>;
      use: ((inputContext: import("better-call").MiddlewareInputContext<import("better-call").MiddlewareOptions>) => Promise<void>)[];
      metadata: {
        openapi: {
          description: string;
          responses: {
            "200": {
              description: string;
              content: {
                "application/json": {
                  schema: {
                    type: "object";
                    properties: {
                      success: {
                        type: string;
                        description: string;
                      };
                      message: {
                        type: string;
                        enum: string[];
                        description: string;
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
      message: string;
    }>;
    readonly unlinkAccount: import("better-call").StrictEndpoint<"/unlink-account", {
      method: "POST";
      body: import("zod").ZodObject<{
        providerId: import("zod").ZodString;
        accountId: import("zod").ZodOptional<import("zod").ZodString>;
      }, import("zod/v4/core").$strip>;
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
            "200": {
              description: string;
              content: {
                "application/json": {
                  schema: {
                    type: "object";
                    properties: {
                      status: {
                        type: string;
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
      status: boolean;
    }>;
    readonly refreshToken: import("better-call").StrictEndpoint<"/refresh-token", {
      method: "POST";
      body: import("zod").ZodObject<{
        providerId: import("zod").ZodString;
        accountId: import("zod").ZodOptional<import("zod").ZodString>;
        userId: import("zod").ZodOptional<import("zod").ZodString>;
      }, import("zod/v4/core").$strip>;
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
                      tokenType: {
                        type: string;
                      };
                      idToken: {
                        type: string;
                      };
                      accessToken: {
                        type: string;
                      };
                      refreshToken: {
                        type: string;
                      };
                      accessTokenExpiresAt: {
                        type: string;
                        format: string;
                      };
                      refreshTokenExpiresAt: {
                        type: string;
                        format: string;
                      };
                    };
                  };
                };
              };
            };
            400: {
              description: string;
            };
          };
        };
      };
    }, {
      accessToken: string | undefined;
      refreshToken: string;
      accessTokenExpiresAt: Date | undefined;
      refreshTokenExpiresAt: Date | null | undefined;
      scope: string | null | undefined;
      idToken: string | null | undefined;
      providerId: string;
      accountId: string;
    }>;
    readonly getAccessToken: import("better-call").StrictEndpoint<"/get-access-token", {
      method: "POST";
      body: import("zod").ZodObject<{
        providerId: import("zod").ZodString;
        accountId: import("zod").ZodOptional<import("zod").ZodString>;
        userId: import("zod").ZodOptional<import("zod").ZodString>;
      }, import("zod/v4/core").$strip>;
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
                      tokenType: {
                        type: string;
                      };
                      idToken: {
                        type: string;
                      };
                      accessToken: {
                        type: string;
                      };
                      accessTokenExpiresAt: {
                        type: string;
                        format: string;
                      };
                    };
                  };
                };
              };
            };
            400: {
              description: string;
            };
          };
        };
      };
    }, {
      accessToken: string;
      accessTokenExpiresAt: Date | undefined;
      scopes: string[];
      idToken: string | undefined;
    }>;
    readonly accountInfo: import("better-call").StrictEndpoint<"/account-info", {
      method: "GET";
      metadata: {
        openapi: {
          description: string;
          responses: {
            "200": {
              description: string;
              content: {
                "application/json": {
                  schema: {
                    type: "object";
                    properties: {
                      user: {
                        type: string;
                        properties: {
                          id: {
                            type: string;
                          };
                          name: {
                            type: string;
                          };
                          email: {
                            type: string;
                          };
                          image: {
                            type: string;
                          };
                          emailVerified: {
                            type: string;
                          };
                        };
                        required: string[];
                      };
                      data: {
                        type: string;
                        properties: {};
                        additionalProperties: boolean;
                      };
                    };
                    required: string[];
                    additionalProperties: boolean;
                  };
                };
              };
            };
          };
        };
      };
      query: import("zod").ZodOptional<import("zod").ZodObject<{
        accountId: import("zod").ZodOptional<import("zod").ZodString>;
        providerId: import("zod").ZodOptional<import("zod").ZodString>;
        userId: import("zod").ZodOptional<import("zod").ZodString>;
      }, import("zod/v4/core").$strip>>;
    }, {
      user: import("@better-auth/core/oauth2").OAuth2UserInfo;
      data: Record<string, any>;
    } | null>;
  } extends (infer T_2) ? { [K in keyof T_2 as K extends keyof T_1 ? never : K]: T_2[K]; } : never) & T_1> : never : never : never;
};
//#endregion
export { APIError, type AuthEndpoint, type AuthMiddleware, type DispatchContext, accountInfo, callbackOAuth, changeEmail, changePassword, checkEndpointConflicts, createAuthEndpoint, createAuthMiddleware, createEmailVerificationToken, deleteUser, deleteUserCallback, dispatchAuthEndpoint, error, formCsrfMiddleware, freshSessionMiddleware, getAccessToken, getAuthoritativeSessionFromCtx, getEndpoints, getIp, getOAuthState, getSession, getSessionFromCtx, getShouldSkipSessionRefresh, isAPIError, isStateful, linkSocialAccount, listSessions, listUserAccounts, ok, optionsMiddleware, originCheck, originCheckMiddleware, refreshToken, requestOnlySessionMiddleware, requestPasswordReset, requestPasswordResetCallback, requireOrgRole, requireResourceOwnership, resetPassword, revokeOtherSessions, revokeSession, revokeSessions, router, sendVerificationEmail, sendVerificationEmailFn, sensitiveSessionMiddleware, sessionMiddleware, setPassword, setShouldSkipSessionRefresh, signInEmail, signInSocial, signOut, signUpEmail, unlinkAccount, updateSession, updateUser, verifyEmail, verifyPassword };