import { TimeString, ms, sec } from "../../utils/time.mjs";
import * as z from "zod";
//#region src/plugins/device-authorization/index.d.ts
declare module "@better-auth/core" {
  interface BetterAuthPluginRegistry<AuthOptions, Options> {
    "device-authorization": {
      creator: typeof deviceAuthorization;
    };
  }
}
declare const deviceAuthorizationOptionsSchema: z.ZodObject<{
  expiresIn: z.ZodDefault<z.ZodCustom<TimeString, TimeString>>;
  interval: z.ZodDefault<z.ZodCustom<TimeString, TimeString>>;
  deviceCodeLength: z.ZodDefault<z.ZodNumber>;
  userCodeLength: z.ZodDefault<z.ZodNumber>;
  generateDeviceCode: z.ZodOptional<z.ZodCustom<() => string | Promise<string>, () => string | Promise<string>>>;
  generateUserCode: z.ZodOptional<z.ZodCustom<() => string | Promise<string>, () => string | Promise<string>>>;
  validateClient: z.ZodOptional<z.ZodCustom<(clientId: string) => boolean | Promise<boolean>, (clientId: string) => boolean | Promise<boolean>>>;
  onDeviceAuthRequest: z.ZodOptional<z.ZodCustom<(clientId: string, scope: string | undefined) => void | Promise<void>, (clientId: string, scope: string | undefined) => void | Promise<void>>>;
  verificationUri: z.ZodOptional<z.ZodString>;
  schema: z.ZodOptional<z.ZodCustom<{
    deviceCode?: {
      modelName?: string | undefined;
      fields?: {
        deviceCode?: string | undefined;
        userCode?: string | undefined;
        userId?: string | undefined;
        expiresAt?: string | undefined;
        status?: string | undefined;
        lastPolledAt?: string | undefined;
        pollingInterval?: string | undefined;
        clientId?: string | undefined;
        scope?: string | undefined;
      } | undefined;
    } | undefined;
  }, {
    deviceCode?: {
      modelName?: string | undefined;
      fields?: {
        deviceCode?: string | undefined;
        userCode?: string | undefined;
        userId?: string | undefined;
        expiresAt?: string | undefined;
        status?: string | undefined;
        lastPolledAt?: string | undefined;
        pollingInterval?: string | undefined;
        clientId?: string | undefined;
        scope?: string | undefined;
      } | undefined;
    } | undefined;
  }>>;
}, z.core.$strip>;
type DeviceAuthorizationOptions = z.infer<typeof deviceAuthorizationOptionsSchema>;
declare const deviceAuthorization: (options?: Partial<DeviceAuthorizationOptions>) => {
  id: "device-authorization";
  version: string;
  schema: {
    deviceCode: {
      fields: {
        deviceCode: {
          type: "string";
          required: true;
        };
        userCode: {
          type: "string";
          required: true;
        };
        userId: {
          type: "string";
          required: false;
        };
        expiresAt: {
          type: "date";
          required: true;
        };
        status: {
          type: "string";
          required: true;
        };
        lastPolledAt: {
          type: "date";
          required: false;
        };
        pollingInterval: {
          type: "number";
          required: false;
        };
        clientId: {
          type: "string";
          required: false;
        };
        scope: {
          type: "string";
          required: false;
        };
      };
    };
  };
  endpoints: {
    deviceCode: import("better-call").StrictEndpoint<"/device/code", {
      method: "POST";
      body: z.ZodObject<{
        client_id: z.ZodString;
        user_id: z.ZodOptional<z.ZodString>;
        scope: z.ZodOptional<z.ZodString>;
      }, z.core.$strip>;
      error: z.ZodObject<{
        error: z.ZodEnum<{
          invalid_request: "invalid_request";
          invalid_client: "invalid_client";
        }>;
        error_description: z.ZodString;
      }, z.core.$strip>;
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
                      device_code: {
                        type: string;
                        description: string;
                      };
                      user_code: {
                        type: string;
                        description: string;
                      };
                      verification_uri: {
                        type: string;
                        format: string;
                        description: string;
                      };
                      verification_uri_complete: {
                        type: string;
                        format: string;
                        description: string;
                      };
                      expires_in: {
                        type: string;
                        description: string;
                      };
                      interval: {
                        type: string;
                        description: string;
                      };
                    };
                  };
                };
              };
            };
            400: {
              description: string;
              content: {
                "application/json": {
                  schema: {
                    type: "object";
                    properties: {
                      error: {
                        type: string;
                        enum: string[];
                      };
                      error_description: {
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
      device_code: string;
      user_code: string;
      verification_uri: string;
      verification_uri_complete: string;
      expires_in: number;
      interval: number;
    }>;
    deviceToken: import("better-call").StrictEndpoint<"/device/token", {
      method: "POST";
      body: z.ZodObject<{
        grant_type: z.ZodLiteral<"urn:ietf:params:oauth:grant-type:device_code">;
        device_code: z.ZodString;
        client_id: z.ZodString;
      }, z.core.$strip>;
      error: z.ZodObject<{
        error: z.ZodEnum<{
          invalid_request: "invalid_request";
          authorization_pending: "authorization_pending";
          slow_down: "slow_down";
          expired_token: "expired_token";
          access_denied: "access_denied";
          invalid_grant: "invalid_grant";
        }>;
        error_description: z.ZodString;
      }, z.core.$strip>;
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
                      session: {
                        $ref: string;
                      };
                      user: {
                        $ref: string;
                      };
                    };
                  };
                };
              };
            };
            400: {
              description: string;
              content: {
                "application/json": {
                  schema: {
                    type: "object";
                    properties: {
                      error: {
                        type: string;
                        enum: string[];
                      };
                      error_description: {
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
      access_token: string;
      token_type: string;
      expires_in: number;
      scope: string;
    }>;
    deviceVerify: import("better-call").StrictEndpoint<"/device", {
      method: "GET";
      query: z.ZodObject<{
        user_code: z.ZodString;
      }, z.core.$strip>;
      error: z.ZodObject<{
        error: z.ZodEnum<{
          invalid_request: "invalid_request";
        }>;
        error_description: z.ZodString;
      }, z.core.$strip>;
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
                      user_code: {
                        type: string;
                        description: string;
                      };
                      status: {
                        type: string;
                        enum: string[];
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
      user_code: string;
      status: string;
    }>;
    deviceApprove: import("better-call").StrictEndpoint<"/device/approve", {
      method: "POST";
      body: z.ZodObject<{
        userCode: z.ZodString;
      }, z.core.$strip>;
      error: z.ZodObject<{
        error: z.ZodEnum<{
          invalid_request: "invalid_request";
          expired_token: "expired_token";
          access_denied: "access_denied";
          device_code_already_processed: "device_code_already_processed";
          unauthorized: "unauthorized";
        }>;
        error_description: z.ZodString;
      }, z.core.$strip>;
      requireHeaders: true;
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
          };
        };
      };
    }, {
      success: boolean;
    }>;
    deviceDeny: import("better-call").StrictEndpoint<"/device/deny", {
      method: "POST";
      body: z.ZodObject<{
        userCode: z.ZodString;
      }, z.core.$strip>;
      error: z.ZodObject<{
        error: z.ZodEnum<{
          invalid_request: "invalid_request";
          expired_token: "expired_token";
          access_denied: "access_denied";
          unauthorized: "unauthorized";
        }>;
        error_description: z.ZodString;
      }, z.core.$strip>;
      requireHeaders: true;
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
          };
        };
      };
    }, {
      success: boolean;
    }>;
  };
  $ERROR_CODES: {
    USER_NOT_FOUND: import("@better-auth/core/utils/error-codes").RawError<"USER_NOT_FOUND">;
    FAILED_TO_CREATE_SESSION: import("@better-auth/core/utils/error-codes").RawError<"FAILED_TO_CREATE_SESSION">;
    INVALID_DEVICE_CODE: import("@better-auth/core/utils/error-codes").RawError<"INVALID_DEVICE_CODE">;
    EXPIRED_DEVICE_CODE: import("@better-auth/core/utils/error-codes").RawError<"EXPIRED_DEVICE_CODE">;
    EXPIRED_USER_CODE: import("@better-auth/core/utils/error-codes").RawError<"EXPIRED_USER_CODE">;
    AUTHORIZATION_PENDING: import("@better-auth/core/utils/error-codes").RawError<"AUTHORIZATION_PENDING">;
    ACCESS_DENIED: import("@better-auth/core/utils/error-codes").RawError<"ACCESS_DENIED">;
    INVALID_USER_CODE: import("@better-auth/core/utils/error-codes").RawError<"INVALID_USER_CODE">;
    DEVICE_CODE_ALREADY_PROCESSED: import("@better-auth/core/utils/error-codes").RawError<"DEVICE_CODE_ALREADY_PROCESSED">;
    DEVICE_CODE_NOT_CLAIMED: import("@better-auth/core/utils/error-codes").RawError<"DEVICE_CODE_NOT_CLAIMED">;
    POLLING_TOO_FREQUENTLY: import("@better-auth/core/utils/error-codes").RawError<"POLLING_TOO_FREQUENTLY">;
    INVALID_DEVICE_CODE_STATUS: import("@better-auth/core/utils/error-codes").RawError<"INVALID_DEVICE_CODE_STATUS">;
    AUTHENTICATION_REQUIRED: import("@better-auth/core/utils/error-codes").RawError<"AUTHENTICATION_REQUIRED">;
  };
  options: Partial<{
    expiresIn: TimeString;
    interval: TimeString;
    deviceCodeLength: number;
    userCodeLength: number;
    generateDeviceCode?: (() => string | Promise<string>) | undefined;
    generateUserCode?: (() => string | Promise<string>) | undefined;
    validateClient?: ((clientId: string) => boolean | Promise<boolean>) | undefined;
    onDeviceAuthRequest?: ((clientId: string, scope: string | undefined) => void | Promise<void>) | undefined;
    verificationUri?: string | undefined;
    schema?: {
      deviceCode?: {
        modelName?: string | undefined;
        fields?: {
          deviceCode?: string | undefined;
          userCode?: string | undefined;
          userId?: string | undefined;
          expiresAt?: string | undefined;
          status?: string | undefined;
          lastPolledAt?: string | undefined;
          pollingInterval?: string | undefined;
          clientId?: string | undefined;
          scope?: string | undefined;
        } | undefined;
      } | undefined;
    } | undefined;
  }>;
};
//#endregion
export { DeviceAuthorizationOptions, type TimeString, deviceAuthorization, deviceAuthorizationOptionsSchema, type ms, type sec };