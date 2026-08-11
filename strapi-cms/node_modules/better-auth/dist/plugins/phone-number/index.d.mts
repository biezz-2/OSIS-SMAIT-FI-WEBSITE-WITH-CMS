import { PhoneNumberOptions, UserWithPhoneNumber } from "./types.mjs";
//#region src/plugins/phone-number/index.d.ts
declare module "@better-auth/core" {
  interface BetterAuthPluginRegistry<AuthOptions, Options> {
    "phone-number": {
      creator: typeof phoneNumber;
    };
  }
}
declare const phoneNumber: (options?: PhoneNumberOptions | undefined) => {
  id: "phone-number";
  version: string;
  init(): {
    options: {
      databaseHooks: {
        user: {
          update: {
            before(data: Partial<{
              id: string;
              createdAt: Date;
              updatedAt: Date;
              email: string;
              emailVerified: boolean;
              name: string;
              image?: string | null | undefined;
            }> & Record<string, unknown>): Promise<{
              data: {
                [x: string]: unknown;
                id?: string | undefined;
                createdAt?: Date | undefined;
                updatedAt?: Date | undefined;
                email?: string | undefined;
                emailVerified?: boolean | undefined;
                name?: string | undefined;
                image?: string | null | undefined;
              };
            } | undefined>;
          };
        };
      };
    };
  };
  hooks: {
    before: {
      matcher: (ctx: import("@better-auth/core").HookEndpointContext) => boolean;
      handler: (inputContext: import("better-call").MiddlewareInputContext<import("better-call").MiddlewareOptions>) => Promise<never>;
    }[];
  };
  endpoints: {
    signInPhoneNumber: import("better-call").StrictEndpoint<"/sign-in/phone-number", {
      method: "POST";
      body: import("zod").ZodObject<{
        phoneNumber: import("zod").ZodString;
        password: import("zod").ZodString;
        rememberMe: import("zod").ZodOptional<import("zod").ZodBoolean>;
      }, import("zod/v4/core").$strip>;
      metadata: {
        openapi: {
          summary: string;
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
            400: {
              description: string;
            };
          };
        };
      };
    }, {
      token: string;
      user: UserWithPhoneNumber;
    }>;
    sendPhoneNumberOTP: import("better-call").StrictEndpoint<"/phone-number/send-otp", {
      method: "POST";
      body: import("zod").ZodObject<{
        phoneNumber: import("zod").ZodString;
      }, import("zod/v4/core").$strip>;
      metadata: {
        openapi: {
          summary: string;
          description: string;
          responses: {
            200: {
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
      message: string;
    }>;
    verifyPhoneNumber: import("better-call").StrictEndpoint<"/phone-number/verify", {
      method: "POST";
      body: import("zod").ZodIntersection<import("zod").ZodObject<{
        phoneNumber: import("zod").ZodString;
        code: import("zod").ZodString;
        disableSession: import("zod").ZodOptional<import("zod").ZodBoolean>;
        updatePhoneNumber: import("zod").ZodOptional<import("zod").ZodBoolean>;
      }, import("zod/v4/core").$strip>, import("zod").ZodRecord<import("zod").ZodString, import("zod").ZodAny>>;
      metadata: {
        openapi: {
          summary: string;
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
                        enum: boolean[];
                      };
                      token: {
                        type: string;
                        nullable: boolean;
                        description: string;
                      };
                      user: {
                        type: string;
                        nullable: boolean;
                        properties: {
                          id: {
                            type: string;
                            description: string;
                          };
                          email: {
                            type: string;
                            format: string;
                            nullable: boolean;
                            description: string;
                          };
                          emailVerified: {
                            type: string;
                            nullable: boolean;
                            description: string;
                          };
                          name: {
                            type: string;
                            nullable: boolean;
                            description: string;
                          };
                          image: {
                            type: string;
                            format: string;
                            nullable: boolean;
                            description: string;
                          };
                          phoneNumber: {
                            type: string;
                            description: string;
                          };
                          phoneNumberVerified: {
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
                        description: string;
                      };
                    };
                    required: string[];
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
      } & UserWithPhoneNumber;
    } | {
      status: boolean;
      token: null;
      user: UserWithPhoneNumber;
    }>;
    requestPasswordResetPhoneNumber: import("better-call").StrictEndpoint<"/phone-number/request-password-reset", {
      method: "POST";
      body: import("zod").ZodObject<{
        phoneNumber: import("zod").ZodString;
      }, import("zod/v4/core").$strip>;
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
                        enum: boolean[];
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
    resetPasswordPhoneNumber: import("better-call").StrictEndpoint<"/phone-number/reset-password", {
      method: "POST";
      body: import("zod").ZodObject<{
        otp: import("zod").ZodString;
        phoneNumber: import("zod").ZodString;
        newPassword: import("zod").ZodString;
      }, import("zod/v4/core").$strip>;
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
                        enum: boolean[];
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
  };
  schema: {
    user: {
      fields: {
        phoneNumber: {
          type: "string";
          required: false;
          unique: true;
          sortable: true;
          returned: true;
        };
        phoneNumberVerified: {
          type: "boolean";
          required: false;
          returned: true;
          input: false;
        };
      };
    };
  };
  rateLimit: {
    pathMatcher(path: string): boolean;
    window: number;
    max: number;
  }[];
  options: PhoneNumberOptions | undefined;
  $ERROR_CODES: {
    OTP_EXPIRED: import("@better-auth/core/utils/error-codes").RawError<"OTP_EXPIRED">;
    INVALID_OTP: import("@better-auth/core/utils/error-codes").RawError<"INVALID_OTP">;
    TOO_MANY_ATTEMPTS: import("@better-auth/core/utils/error-codes").RawError<"TOO_MANY_ATTEMPTS">;
    INVALID_PHONE_NUMBER: import("@better-auth/core/utils/error-codes").RawError<"INVALID_PHONE_NUMBER">;
    PHONE_NUMBER_EXIST: import("@better-auth/core/utils/error-codes").RawError<"PHONE_NUMBER_EXIST">;
    PHONE_NUMBER_NOT_EXIST: import("@better-auth/core/utils/error-codes").RawError<"PHONE_NUMBER_NOT_EXIST">;
    INVALID_PHONE_NUMBER_OR_PASSWORD: import("@better-auth/core/utils/error-codes").RawError<"INVALID_PHONE_NUMBER_OR_PASSWORD">;
    UNEXPECTED_ERROR: import("@better-auth/core/utils/error-codes").RawError<"UNEXPECTED_ERROR">;
    OTP_NOT_FOUND: import("@better-auth/core/utils/error-codes").RawError<"OTP_NOT_FOUND">;
    PHONE_NUMBER_NOT_VERIFIED: import("@better-auth/core/utils/error-codes").RawError<"PHONE_NUMBER_NOT_VERIFIED">;
    PHONE_NUMBER_CANNOT_BE_UPDATED: import("@better-auth/core/utils/error-codes").RawError<"PHONE_NUMBER_CANNOT_BE_UPDATED">;
    SEND_OTP_NOT_IMPLEMENTED: import("@better-auth/core/utils/error-codes").RawError<"SEND_OTP_NOT_IMPLEMENTED">;
  };
};
//#endregion
export { type PhoneNumberOptions, type UserWithPhoneNumber, phoneNumber };