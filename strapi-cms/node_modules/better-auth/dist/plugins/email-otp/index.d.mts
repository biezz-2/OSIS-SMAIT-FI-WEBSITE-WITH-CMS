import { EmailOTPOptions } from "./types.mjs";
//#region src/plugins/email-otp/index.d.ts
declare module "@better-auth/core" {
  interface BetterAuthPluginRegistry<AuthOptions, Options> {
    "email-otp": {
      creator: typeof emailOTP;
    };
  }
}
declare const emailOTP: (options: EmailOTPOptions) => {
  id: "email-otp";
  version: string;
  init(ctx: import("@better-auth/core").AuthContext): {
    options: {
      emailVerification: {
        sendVerificationEmail(data: {
          user: import("@better-auth/core/db").User;
          url: string;
          token: string;
        }, request: Request | undefined): Promise<void>;
      };
    };
  } | undefined;
  endpoints: {
    sendVerificationOTP: import("better-call").StrictEndpoint<"/email-otp/send-verification-otp", {
      method: "POST";
      use: ((inputContext: import("better-call").MiddlewareInputContext<import("better-call").MiddlewareOptions>) => Promise<void>)[];
      body: import("zod").ZodObject<{
        email: import("zod").ZodString;
        type: import("zod").ZodEnum<{
          "sign-in": "sign-in";
          "change-email": "change-email";
          "email-verification": "email-verification";
          "forget-password": "forget-password";
        }>;
      }, import("zod/v4/core").$strip>;
      metadata: {
        openapi: {
          operationId: string;
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
          };
        };
      };
    }, {
      success: boolean;
    }>;
    createVerificationOTP: import("better-call").StrictEndpoint<string, {
      method: "POST";
      body: import("zod").ZodObject<{
        email: import("zod").ZodString;
        type: import("zod").ZodEnum<{
          "sign-in": "sign-in";
          "change-email": "change-email";
          "email-verification": "email-verification";
          "forget-password": "forget-password";
        }>;
      }, import("zod/v4/core").$strip>;
      metadata: {
        openapi: {
          operationId: string;
          description: string;
          responses: {
            200: {
              description: string;
              content: {
                "application/json": {
                  schema: {
                    type: "string";
                  };
                };
              };
            };
          };
        };
      };
    }, string>;
    getVerificationOTP: import("better-call").StrictEndpoint<string, {
      method: "GET";
      query: import("zod").ZodObject<{
        email: import("zod").ZodString;
        type: import("zod").ZodEnum<{
          "sign-in": "sign-in";
          "change-email": "change-email";
          "email-verification": "email-verification";
          "forget-password": "forget-password";
        }>;
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
                      otp: {
                        type: string;
                        nullable: boolean;
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
      otp: null;
    } | {
      otp: string;
    }>;
    checkVerificationOTP: import("better-call").StrictEndpoint<"/email-otp/check-verification-otp", {
      method: "POST";
      body: import("zod").ZodObject<{
        email: import("zod").ZodString;
        type: import("zod").ZodEnum<{
          "sign-in": "sign-in";
          "change-email": "change-email";
          "email-verification": "email-verification";
          "forget-password": "forget-password";
        }>;
        otp: import("zod").ZodString;
      }, import("zod/v4/core").$strip>;
      metadata: {
        openapi: {
          operationId: string;
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
          };
        };
      };
    }, {
      success: boolean;
    }>;
    verifyEmailOTP: import("better-call").StrictEndpoint<"/email-otp/verify-email", {
      method: "POST";
      body: import("zod").ZodObject<{
        email: import("zod").ZodString;
        otp: import("zod").ZodString;
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
                      status: {
                        type: string;
                        description: string;
                        enum: boolean[];
                      };
                      token: {
                        type: string;
                        nullable: boolean;
                        description: string;
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
      status: boolean;
      token: string;
      user: {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        emailVerified: boolean;
        name: string;
        image?: string | null | undefined;
      } & Record<string, any>;
    } | {
      status: boolean;
      token: null;
      user: {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        emailVerified: boolean;
        name: string;
        image?: string | null | undefined;
      } & Record<string, any>;
    }>;
    signInEmailOTP: import("better-call").StrictEndpoint<"/sign-in/email-otp", {
      method: "POST";
      body: import("zod").ZodIntersection<import("zod").ZodObject<{
        email: import("zod").ZodString;
        otp: import("zod").ZodString;
        name: import("zod").ZodOptional<import("zod").ZodString>;
        image: import("zod").ZodOptional<import("zod").ZodString>;
      }, import("zod/v4/core").$strip>, import("zod").ZodRecord<import("zod").ZodString, import("zod").ZodAny>>;
      metadata: {
        openapi: {
          operationId: string;
          description: string;
          responses: {
            200: {
              description: string;
              content: {
                "application/json": {
                  schema: {
                    type: "object";
                    properties: {
                      token: {
                        type: string;
                        description: string;
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
      token: string;
      user: {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        emailVerified: boolean;
        name: string;
        image?: string | null | undefined;
      };
    }>;
    requestPasswordResetEmailOTP: import("better-call").StrictEndpoint<"/email-otp/request-password-reset", {
      method: "POST";
      body: import("zod").ZodObject<{
        email: import("zod").ZodString;
      }, import("zod/v4/core").$strip>;
      metadata: {
        openapi: {
          operationId: string;
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
                        description: string;
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
    forgetPasswordEmailOTP: import("better-call").StrictEndpoint<"/forget-password/email-otp", {
      method: "POST";
      body: import("zod").ZodObject<{
        email: import("zod").ZodString;
      }, import("zod/v4/core").$strip>;
      metadata: {
        openapi: {
          operationId: string;
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
                        description: string;
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
    resetPasswordEmailOTP: import("better-call").StrictEndpoint<"/email-otp/reset-password", {
      method: "POST";
      body: import("zod").ZodObject<{
        email: import("zod").ZodString;
        otp: import("zod").ZodString;
        password: import("zod").ZodString;
      }, import("zod/v4/core").$strip>;
      metadata: {
        openapi: {
          operationId: string;
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
          };
        };
      };
    }, {
      success: boolean;
    }>;
    requestEmailChangeEmailOTP: import("better-call").StrictEndpoint<"/email-otp/request-email-change", {
      method: "POST";
      body: import("zod").ZodObject<{
        newEmail: import("zod").ZodString;
        otp: import("zod").ZodOptional<import("zod").ZodString>;
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
          };
        };
      };
    }, {
      success: boolean;
    }>;
    changeEmailEmailOTP: import("better-call").StrictEndpoint<"/email-otp/change-email", {
      method: "POST";
      body: import("zod").ZodObject<{
        newEmail: import("zod").ZodString;
        otp: import("zod").ZodString;
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
          };
        };
      };
    }, {
      success: boolean;
    }>;
  };
  hooks: {
    after: {
      matcher(context: import("@better-auth/core").HookEndpointContext): boolean;
      handler: (inputContext: import("better-call").MiddlewareInputContext<import("better-call").MiddlewareOptions>) => Promise<void>;
    }[];
  };
  rateLimit: ({
    pathMatcher(path: string): path is "/email-otp/send-verification-otp";
    window: number;
    max: number;
  } | {
    pathMatcher(path: string): path is "/email-otp/check-verification-otp";
    window: number;
    max: number;
  } | {
    pathMatcher(path: string): path is "/email-otp/verify-email";
    window: number;
    max: number;
  } | {
    pathMatcher(path: string): path is "/sign-in/email-otp";
    window: number;
    max: number;
  } | {
    pathMatcher(path: string): path is "/email-otp/request-password-reset";
    window: number;
    max: number;
  } | {
    pathMatcher(path: string): path is "/email-otp/reset-password";
    window: number;
    max: number;
  } | {
    pathMatcher(path: string): path is "/forget-password/email-otp";
    window: number;
    max: number;
  } | {
    pathMatcher(path: string): path is "/email-otp/request-email-change";
    window: number;
    max: number;
  } | {
    pathMatcher(path: string): path is "/email-otp/change-email";
    window: number;
    max: number;
  })[];
  options: EmailOTPOptions;
  $ERROR_CODES: {
    OTP_EXPIRED: import("@better-auth/core/utils/error-codes").RawError<"OTP_EXPIRED">;
    INVALID_OTP: import("@better-auth/core/utils/error-codes").RawError<"INVALID_OTP">;
    TOO_MANY_ATTEMPTS: import("@better-auth/core/utils/error-codes").RawError<"TOO_MANY_ATTEMPTS">;
  };
};
//#endregion
export { type EmailOTPOptions, emailOTP };