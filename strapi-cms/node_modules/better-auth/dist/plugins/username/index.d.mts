import { InferOptionSchema } from "../../types/plugins.mjs";
import { UsernameSchema } from "./schema.mjs";
import { USERNAME_ERROR_CODES } from "./error-codes.mjs";
import * as z from "zod";
//#region src/plugins/username/index.d.ts
declare module "@better-auth/core" {
  interface BetterAuthPluginRegistry<AuthOptions, Options> {
    username: {
      creator: typeof username;
    };
  }
}
type UsernameOptions = {
  schema?: InferOptionSchema<UsernameSchema> | undefined;
  /**
   * The minimum length of the username
   *
   * @default 3
   */
  minUsernameLength?: number | undefined;
  /**
   * The maximum length of the username
   *
   * @default 30
   */
  maxUsernameLength?: number | undefined;
  /**
   * A function to validate the username
   *
   * By default, the username should only contain alphanumeric characters and underscores
   */
  usernameValidator?: ((username: string) => boolean | Promise<boolean>) | undefined;
  /**
   * A function to validate the display username
   *
   * By default, no validation is applied to display username
   */
  displayUsernameValidator?: ((displayUsername: string) => boolean | Promise<boolean>) | undefined;
  /**
   * A function to normalize the username
   *
   * @default (username) => username.toLowerCase()
   */
  usernameNormalization?: (((username: string) => string) | false) | undefined;
  /**
   * A function to normalize the display username
   *
   * @default false
   */
  displayUsernameNormalization?: (((displayUsername: string) => string) | false) | undefined;
  /**
   * The order of validation
   *
   * @default { username: "pre-normalization", displayUsername: "pre-normalization" }
   */
  validationOrder?: {
    /**
     * The order of username validation
     *
     * @default "pre-normalization"
     */
    username?: "pre-normalization" | "post-normalization";
    /**
     * The order of display username validation
     *
     * @default "pre-normalization"
     */
    displayUsername?: "pre-normalization" | "post-normalization";
  } | undefined;
};
declare const username: (options?: UsernameOptions | undefined) => {
  id: "username";
  version: string;
  init(ctx: import("@better-auth/core").AuthContext): {
    options: {
      databaseHooks: {
        user: {
          create: {
            before(user: {
              id: string;
              createdAt: Date;
              updatedAt: Date;
              email: string;
              emailVerified: boolean;
              name: string;
              image?: string | null | undefined;
            } & Record<string, unknown>, context: import("@better-auth/core").GenericEndpointContext | null): Promise<{
              data: {
                username: string;
                displayUsername: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                email: string;
                emailVerified: boolean;
                name: string;
                image?: string | null | undefined;
              };
            } | {
              data: {
                displayUsername?: string | undefined;
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
          update: {
            before(user: Partial<{
              id: string;
              createdAt: Date;
              updatedAt: Date;
              email: string;
              emailVerified: boolean;
              name: string;
              image?: string | null | undefined;
            }> & Record<string, unknown>, context: import("@better-auth/core").GenericEndpointContext | null): Promise<{
              data: {
                displayUsername?: string | undefined;
                username: string;
                id?: string | undefined;
                createdAt?: Date | undefined;
                updatedAt?: Date | undefined;
                email?: string | undefined;
                emailVerified?: boolean | undefined;
                name?: string | undefined;
                image?: string | null | undefined;
              };
            } | {
              data: {
                displayUsername?: string | undefined;
                id?: string | undefined;
                createdAt?: Date | undefined;
                updatedAt?: Date | undefined;
                email?: string | undefined;
                emailVerified?: boolean | undefined;
                name?: string | undefined;
                image?: string | null | undefined;
              };
            }>;
          };
        };
      };
    };
  };
  endpoints: {
    signInUsername: import("better-call").StrictEndpoint<"/sign-in/username", {
      method: "POST";
      body: z.ZodObject<{
        username: z.ZodString;
        password: z.ZodString;
        rememberMe: z.ZodOptional<z.ZodBoolean>;
        callbackURL: z.ZodOptional<z.ZodString>;
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
                      redirect: {
                        type: string;
                        description: string;
                      };
                      token: {
                        type: string;
                        description: string;
                      };
                      url: {
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
            422: {
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
      redirect: boolean;
      token: string;
      url: string | undefined;
      user: {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        emailVerified: boolean;
        name: string;
        image?: string | null | undefined;
      } & {
        username: string;
        displayUsername: string;
      };
    }>;
    isUsernameAvailable: import("better-call").StrictEndpoint<"/is-username-available", {
      method: "POST";
      body: z.ZodObject<{
        username: z.ZodString;
      }, z.core.$strip>;
    }, {
      available: boolean;
    }>;
  };
  schema: {
    user: {
      fields: {
        username: {
          type: "string";
          required: false;
          sortable: true;
          unique: true;
          returned: true;
          transform: {
            input(value: import("@better-auth/core/db").DBPrimitive): string | number | boolean | Date | Record<string, unknown> | unknown[] | null | undefined;
          };
        };
        displayUsername: {
          type: "string";
          required: false;
          transform: {
            input(value: import("@better-auth/core/db").DBPrimitive): string | number | boolean | Date | Record<string, unknown> | unknown[] | null | undefined;
          };
        };
      };
    };
  };
  hooks: {
    before: {
      matcher(context: import("@better-auth/core").HookEndpointContext): boolean;
      handler: (inputContext: import("better-call").MiddlewareInputContext<import("better-call").MiddlewareOptions>) => Promise<void>;
    }[];
  };
  options: UsernameOptions | undefined;
  $ERROR_CODES: {
    EMAIL_NOT_VERIFIED: import("@better-auth/core/utils/error-codes").RawError<"EMAIL_NOT_VERIFIED">;
    UNEXPECTED_ERROR: import("@better-auth/core/utils/error-codes").RawError<"UNEXPECTED_ERROR">;
    INVALID_USERNAME_OR_PASSWORD: import("@better-auth/core/utils/error-codes").RawError<"INVALID_USERNAME_OR_PASSWORD">;
    USERNAME_IS_ALREADY_TAKEN: import("@better-auth/core/utils/error-codes").RawError<"USERNAME_IS_ALREADY_TAKEN">;
    USERNAME_TOO_SHORT: import("@better-auth/core/utils/error-codes").RawError<"USERNAME_TOO_SHORT">;
    USERNAME_TOO_LONG: import("@better-auth/core/utils/error-codes").RawError<"USERNAME_TOO_LONG">;
    INVALID_USERNAME: import("@better-auth/core/utils/error-codes").RawError<"INVALID_USERNAME">;
    INVALID_DISPLAY_USERNAME: import("@better-auth/core/utils/error-codes").RawError<"INVALID_DISPLAY_USERNAME">;
  };
};
//#endregion
export { USERNAME_ERROR_CODES, UsernameOptions, username };