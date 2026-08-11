import { BackupCodeOptions, backupCode2fa, encodeBackupCodes, generateBackupCodes, getBackupCodes, verifyBackupCode } from "./backup-codes/index.mjs";
import { OTPOptions, otp2fa } from "./otp/index.mjs";
import { TOTPOptions, totp2fa } from "./totp/index.mjs";
import { TwoFactorOptions, TwoFactorProvider, TwoFactorTable, UserWithTwoFactor } from "./types.mjs";
import { TWO_FACTOR_ERROR_CODES } from "./error-code.mjs";
import { twoFactorClient } from "./client.mjs";
import * as z from "zod";
//#region src/plugins/two-factor/index.d.ts
declare module "@better-auth/core" {
  interface BetterAuthPluginRegistry<AuthOptions, Options> {
    "two-factor": {
      creator: typeof twoFactor;
    };
  }
}
declare const twoFactor: <O extends TwoFactorOptions>(options?: O) => {
  id: "two-factor";
  version: string;
  endpoints: {
    /**
     * ### Endpoint
     *
     * POST `/two-factor/enable`
     *
     * ### API Methods
     *
     * **server:**
     * `auth.api.enableTwoFactor`
     *
     * **client:**
     * `authClient.twoFactor.enable`
     *
     * @see [Read our docs to learn more.](https://better-auth.com/docs/plugins/2fa#api-method-two-factor-enable)
     */
    enableTwoFactor: import("better-call").StrictEndpoint<"/two-factor/enable", {
      method: "POST";
      body: z.ZodObject<{
        password: z.ZodOptional<z.ZodString>;
        issuer: z.ZodOptional<z.ZodString>;
      }, z.core.$strip> | z.ZodObject<{
        password: z.ZodString;
        issuer: z.ZodOptional<z.ZodString>;
      }, z.core.$strip>;
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
                      totpURI: {
                        type: string;
                        description: string;
                      };
                      backupCodes: {
                        type: string;
                        items: {
                          type: string;
                        };
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
      totpURI: string;
      backupCodes: string[];
    }>;
    /**
     * ### Endpoint
     *
     * POST `/two-factor/disable`
     *
     * ### API Methods
     *
     * **server:**
     * `auth.api.disableTwoFactor`
     *
     * **client:**
     * `authClient.twoFactor.disable`
     *
     * @see [Read our docs to learn more.](https://better-auth.com/docs/plugins/2fa#api-method-two-factor-disable)
     */
    disableTwoFactor: import("better-call").StrictEndpoint<"/two-factor/disable", {
      method: "POST";
      body: z.ZodObject<{
        password: z.ZodOptional<z.ZodString>;
      }, z.core.$strip> | z.ZodObject<{
        password: z.ZodString;
      }, z.core.$strip>;
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
    verifyBackupCode: import("better-call").StrictEndpoint<"/two-factor/verify-backup-code", {
      method: "POST";
      body: z.ZodObject<{
        code: z.ZodString;
        disableSession: z.ZodOptional<z.ZodBoolean>;
        trustDevice: z.ZodOptional<z.ZodBoolean>;
      }, z.core.$strip>;
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
                          twoFactorEnabled: {
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
                      session: {
                        type: string;
                        properties: {
                          token: {
                            type: string;
                            description: string;
                          };
                          userId: {
                            type: string;
                            description: string;
                          };
                          createdAt: {
                            type: string;
                            format: string;
                            description: string;
                          };
                          expiresAt: {
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
          };
        };
      };
    }, {
      token: string | undefined;
      user: (Record<string, any> & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        emailVerified: boolean;
        name: string;
        image?: string | null | undefined;
      }) | UserWithTwoFactor;
    }>;
    generateBackupCodes: import("better-call").StrictEndpoint<"/two-factor/generate-backup-codes", {
      method: "POST";
      body: z.ZodObject<{
        password: z.ZodOptional<z.ZodString>;
      }, z.core.$strip> | z.ZodObject<{
        password: z.ZodString;
      }, z.core.$strip>;
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
                        enum: boolean[];
                      };
                      backupCodes: {
                        type: string;
                        items: {
                          type: string;
                        };
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
      backupCodes: string[];
    }>;
    viewBackupCodes: import("better-call").StrictEndpoint<string, {
      method: "POST";
      body: z.ZodObject<{
        userId: z.ZodCoercedString<unknown>;
      }, z.core.$strip>;
    }, {
      status: boolean;
      backupCodes: string[];
    }>;
    sendTwoFactorOTP: import("better-call").StrictEndpoint<"/two-factor/send-otp", {
      method: "POST";
      body: z.ZodOptional<z.ZodObject<{
        trustDevice: z.ZodOptional<z.ZodBoolean>;
      }, z.core.$strip>>;
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
    verifyTwoFactorOTP: import("better-call").StrictEndpoint<"/two-factor/verify-otp", {
      method: "POST";
      body: z.ZodObject<{
        code: z.ZodString;
        trustDevice: z.ZodOptional<z.ZodBoolean>;
      }, z.core.$strip>;
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
                      token: {
                        type: string;
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
          };
        };
      };
    }, {
      token: string;
      user: UserWithTwoFactor;
    } | {
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
    generateTOTP: import("better-call").StrictEndpoint<string, {
      method: "POST";
      body: z.ZodObject<{
        secret: z.ZodString;
      }, z.core.$strip>;
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
                      code: {
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
      code: string;
    }>;
    getTOTPURI: import("better-call").StrictEndpoint<"/two-factor/get-totp-uri", {
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
      body: z.ZodObject<{
        password: z.ZodOptional<z.ZodString>;
      }, z.core.$strip> | z.ZodObject<{
        password: z.ZodString;
      }, z.core.$strip>;
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
                      totpURI: {
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
      totpURI: string;
    }>;
    verifyTOTP: import("better-call").StrictEndpoint<"/two-factor/verify-totp", {
      method: "POST";
      body: z.ZodObject<{
        code: z.ZodString;
        trustDevice: z.ZodOptional<z.ZodBoolean>;
      }, z.core.$strip>;
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
      token: string;
      user: UserWithTwoFactor;
    } | {
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
  };
  options: NoInfer<O>;
  hooks: {
    after: {
      matcher(context: import("@better-auth/core").HookEndpointContext): boolean;
      handler: (inputContext: import("better-call").MiddlewareInputContext<import("better-call").MiddlewareOptions>) => Promise<{
        twoFactorRedirect: boolean;
        twoFactorMethods: string[];
      } | undefined>;
    }[];
  };
  schema: {
    user: {
      fields: {
        twoFactorEnabled: {
          type: "boolean";
          required: false;
          defaultValue: false;
          input: false;
        };
      };
    };
    twoFactor: {
      fields: {
        secret: {
          type: "string";
          required: true;
          returned: false;
          index: true;
        };
        backupCodes: {
          type: "string";
          required: true;
          returned: false;
        };
        userId: {
          type: "string";
          required: true;
          returned: false;
          references: {
            model: string;
            field: string;
          };
          index: true;
        };
        verified: {
          type: "boolean";
          required: false;
          defaultValue: true;
          input: false;
        };
        failedVerificationCount: {
          type: "number";
          required: false;
          defaultValue: number;
          input: false;
          returned: false;
        };
        lockedUntil: {
          type: "date";
          required: false;
          input: false;
          returned: false;
        };
      };
    };
  };
  rateLimit: {
    pathMatcher(path: string): boolean;
    window: number;
    max: number;
  }[];
  $ERROR_CODES: {
    OTP_NOT_ENABLED: import("@better-auth/core/utils/error-codes").RawError<"OTP_NOT_ENABLED">;
    OTP_HAS_EXPIRED: import("@better-auth/core/utils/error-codes").RawError<"OTP_HAS_EXPIRED">;
    TOTP_NOT_ENABLED: import("@better-auth/core/utils/error-codes").RawError<"TOTP_NOT_ENABLED">;
    TWO_FACTOR_NOT_ENABLED: import("@better-auth/core/utils/error-codes").RawError<"TWO_FACTOR_NOT_ENABLED">;
    BACKUP_CODES_NOT_ENABLED: import("@better-auth/core/utils/error-codes").RawError<"BACKUP_CODES_NOT_ENABLED">;
    INVALID_BACKUP_CODE: import("@better-auth/core/utils/error-codes").RawError<"INVALID_BACKUP_CODE">;
    INVALID_CODE: import("@better-auth/core/utils/error-codes").RawError<"INVALID_CODE">;
    TOO_MANY_ATTEMPTS_REQUEST_NEW_CODE: import("@better-auth/core/utils/error-codes").RawError<"TOO_MANY_ATTEMPTS_REQUEST_NEW_CODE">;
    ACCOUNT_TEMPORARILY_LOCKED: import("@better-auth/core/utils/error-codes").RawError<"ACCOUNT_TEMPORARILY_LOCKED">;
    INVALID_TWO_FACTOR_COOKIE: import("@better-auth/core/utils/error-codes").RawError<"INVALID_TWO_FACTOR_COOKIE">;
  };
};
//#endregion
export { type BackupCodeOptions, type OTPOptions, type TOTPOptions, TWO_FACTOR_ERROR_CODES, TwoFactorOptions, TwoFactorProvider, TwoFactorTable, UserWithTwoFactor, type backupCode2fa, type encodeBackupCodes, type generateBackupCodes, type getBackupCodes, type otp2fa, type totp2fa, twoFactor, twoFactorClient, type verifyBackupCode };