import { AccessControl, ArrayElement, Statements } from "../access/types.mjs";
import { AdminOptions, InferAdminRolesFromOption, SessionWithImpersonatedBy, UserWithRole } from "./types.mjs";
import "../index.mjs";
//#region src/plugins/admin/admin.d.ts
declare module "@better-auth/core" {
  interface BetterAuthPluginRegistry<AuthOptions, Options> {
    admin: {
      creator: typeof admin;
    };
  }
}
declare const admin: <O extends AdminOptions>(options?: O | undefined) => {
  id: "admin";
  version: string;
  init(): {
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
            } & Record<string, unknown>): Promise<{
              data: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                email: string;
                emailVerified: boolean;
                name: string;
                image?: string | null | undefined;
                role: string;
              };
            }>;
          };
        };
        session: {
          create: {
            before(session: {
              id: string;
              createdAt: Date;
              updatedAt: Date;
              userId: string;
              expiresAt: Date;
              token: string;
              ipAddress?: string | null | undefined;
              userAgent?: string | null | undefined;
            } & Record<string, unknown>, ctx: import("@better-auth/core").GenericEndpointContext | null): Promise<void>;
          };
        };
      };
    };
  };
  hooks: {
    after: {
      matcher(context: import("@better-auth/core").HookEndpointContext): boolean;
      handler: (inputContext: import("better-call").MiddlewareInputContext<import("better-call").MiddlewareOptions>) => Promise<SessionWithImpersonatedBy[] | undefined>;
    }[];
  };
  endpoints: {
    setRole: import("better-call").StrictEndpoint<"/admin/set-role", {
      method: "POST";
      body: import("zod").ZodObject<{
        userId: import("zod").ZodCoercedString<unknown>;
        role: import("zod").ZodUnion<readonly [import("zod").ZodString, import("zod").ZodArray<import("zod").ZodString>]>;
      }, import("zod/v4/core").$strip>;
      requireHeaders: true;
      use: ((inputContext: import("better-call").MiddlewareInputContext<import("better-call").MiddlewareOptions>) => Promise<{
        session: {
          user: UserWithRole;
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
        };
      }>)[];
      metadata: {
        openapi: {
          operationId: string;
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
                    };
                  };
                };
              };
            };
          };
        };
        $Infer: {
          body: {
            userId: string;
            role: InferAdminRolesFromOption<O & Required<Pick<AdminOptions, "defaultRole" | "adminRoles" | "bannedUserMessage">>> | InferAdminRolesFromOption<O & Required<Pick<AdminOptions, "defaultRole" | "adminRoles" | "bannedUserMessage">>>[];
          };
        };
      };
    }, {
      user: UserWithRole;
    }>;
    getUser: import("better-call").StrictEndpoint<"/admin/get-user", {
      method: "GET";
      query: import("zod").ZodObject<{
        id: import("zod").ZodString;
      }, import("zod/v4/core").$strip>;
      use: ((inputContext: import("better-call").MiddlewareInputContext<import("better-call").MiddlewareOptions>) => Promise<{
        session: {
          user: UserWithRole;
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
        };
      }>)[];
      metadata: {
        openapi: {
          operationId: string;
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
                    };
                  };
                };
              };
            };
          };
        };
      };
    }, UserWithRole>;
    createUser: import("better-call").StrictEndpoint<"/admin/create-user", {
      method: "POST";
      body: import("zod").ZodObject<{
        email: import("zod").ZodString;
        password: import("zod").ZodOptional<import("zod").ZodString>;
        name: import("zod").ZodString;
        role: import("zod").ZodOptional<import("zod").ZodUnion<readonly [import("zod").ZodString, import("zod").ZodArray<import("zod").ZodString>]>>;
        data: import("zod").ZodOptional<import("zod").ZodRecord<import("zod").ZodString, import("zod").ZodAny>>;
      }, import("zod/v4/core").$strip>;
      metadata: {
        openapi: {
          operationId: string;
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
                    };
                  };
                };
              };
            };
          };
        };
        $Infer: {
          body: {
            email: string;
            password?: string | undefined;
            name: string;
            role?: InferAdminRolesFromOption<O & Required<Pick<AdminOptions, "defaultRole" | "adminRoles" | "bannedUserMessage">>> | InferAdminRolesFromOption<O & Required<Pick<AdminOptions, "defaultRole" | "adminRoles" | "bannedUserMessage">>>[] | undefined;
            data?: Record<string, any> | undefined;
          };
        };
      };
    }, {
      user: UserWithRole;
    }>;
    adminUpdateUser: import("better-call").StrictEndpoint<"/admin/update-user", {
      method: "POST";
      body: import("zod").ZodObject<{
        userId: import("zod").ZodCoercedString<unknown>;
        data: import("zod").ZodRecord<import("zod").ZodAny, import("zod").ZodAny>;
      }, import("zod/v4/core").$strip>;
      use: ((inputContext: import("better-call").MiddlewareInputContext<import("better-call").MiddlewareOptions>) => Promise<{
        session: {
          user: UserWithRole;
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
        };
      }>)[];
      metadata: {
        openapi: {
          operationId: string;
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
                    };
                  };
                };
              };
            };
          };
        };
      };
    }, UserWithRole>;
    listUsers: import("better-call").StrictEndpoint<"/admin/list-users", {
      method: "GET";
      use: ((inputContext: import("better-call").MiddlewareInputContext<import("better-call").MiddlewareOptions>) => Promise<{
        session: {
          user: UserWithRole;
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
        };
      }>)[];
      query: import("zod").ZodObject<{
        searchValue: import("zod").ZodOptional<import("zod").ZodString>;
        searchField: import("zod").ZodOptional<import("zod").ZodEnum<{
          email: "email";
          name: "name";
        }>>;
        searchOperator: import("zod").ZodOptional<import("zod").ZodEnum<{
          contains: "contains";
          starts_with: "starts_with";
          ends_with: "ends_with";
        }>>;
        limit: import("zod").ZodOptional<import("zod").ZodUnion<[import("zod").ZodString, import("zod").ZodNumber]>>;
        offset: import("zod").ZodOptional<import("zod").ZodUnion<[import("zod").ZodString, import("zod").ZodNumber]>>;
        sortBy: import("zod").ZodOptional<import("zod").ZodString>;
        sortDirection: import("zod").ZodOptional<import("zod").ZodEnum<{
          asc: "asc";
          desc: "desc";
        }>>;
        filterField: import("zod").ZodOptional<import("zod").ZodString>;
        filterValue: import("zod").ZodOptional<import("zod").ZodUnion<[import("zod").ZodUnion<[import("zod").ZodUnion<[import("zod").ZodUnion<[import("zod").ZodString, import("zod").ZodNumber]>, import("zod").ZodBoolean]>, import("zod").ZodArray<import("zod").ZodString>]>, import("zod").ZodArray<import("zod").ZodNumber>]>>;
        filterOperator: import("zod").ZodOptional<import("zod").ZodEnum<{
          eq: "eq";
          ne: "ne";
          gt: "gt";
          gte: "gte";
          lt: "lt";
          lte: "lte";
          in: "in";
          not_in: "not_in";
          contains: "contains";
          starts_with: "starts_with";
          ends_with: "ends_with";
        }>>;
      }, import("zod/v4/core").$strip>;
      metadata: {
        openapi: {
          operationId: string;
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
                      users: {
                        type: string;
                        items: {
                          $ref: string;
                        };
                      };
                      total: {
                        type: string;
                      };
                      limit: {
                        type: string;
                      };
                      offset: {
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
      users: UserWithRole[];
      total: number;
    }>;
    listUserSessions: import("better-call").StrictEndpoint<"/admin/list-user-sessions", {
      method: "POST";
      use: ((inputContext: import("better-call").MiddlewareInputContext<import("better-call").MiddlewareOptions>) => Promise<{
        session: {
          user: UserWithRole;
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
        };
      }>)[];
      body: import("zod").ZodObject<{
        userId: import("zod").ZodCoercedString<unknown>;
      }, import("zod/v4/core").$strip>;
      metadata: {
        openapi: {
          operationId: string;
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
                      sessions: {
                        type: string;
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
        };
      };
    }, {
      sessions: SessionWithImpersonatedBy[];
    }>;
    unbanUser: import("better-call").StrictEndpoint<"/admin/unban-user", {
      method: "POST";
      body: import("zod").ZodObject<{
        userId: import("zod").ZodCoercedString<unknown>;
      }, import("zod/v4/core").$strip>;
      use: ((inputContext: import("better-call").MiddlewareInputContext<import("better-call").MiddlewareOptions>) => Promise<{
        session: {
          user: UserWithRole;
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
        };
      }>)[];
      metadata: {
        openapi: {
          operationId: string;
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
                    };
                  };
                };
              };
            };
          };
        };
      };
    }, {
      user: UserWithRole;
    }>;
    banUser: import("better-call").StrictEndpoint<"/admin/ban-user", {
      method: "POST";
      body: import("zod").ZodObject<{
        userId: import("zod").ZodCoercedString<unknown>;
        banReason: import("zod").ZodOptional<import("zod").ZodString>;
        banExpiresIn: import("zod").ZodOptional<import("zod").ZodNumber>;
      }, import("zod/v4/core").$strip>;
      use: ((inputContext: import("better-call").MiddlewareInputContext<import("better-call").MiddlewareOptions>) => Promise<{
        session: {
          user: UserWithRole;
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
        };
      }>)[];
      metadata: {
        openapi: {
          operationId: string;
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
                    };
                  };
                };
              };
            };
          };
        };
      };
    }, {
      user: UserWithRole;
    }>;
    impersonateUser: import("better-call").StrictEndpoint<"/admin/impersonate-user", {
      method: "POST";
      body: import("zod").ZodObject<{
        userId: import("zod").ZodCoercedString<unknown>;
      }, import("zod/v4/core").$strip>;
      use: ((inputContext: import("better-call").MiddlewareInputContext<import("better-call").MiddlewareOptions>) => Promise<{
        session: {
          user: UserWithRole;
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
        };
      }>)[];
      metadata: {
        openapi: {
          operationId: string;
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
      user: UserWithRole;
    }>;
    stopImpersonating: import("better-call").StrictEndpoint<"/admin/stop-impersonating", {
      method: "POST";
      requireHeaders: true;
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
      } & Record<string, any>;
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
    revokeUserSession: import("better-call").StrictEndpoint<"/admin/revoke-user-session", {
      method: "POST";
      body: import("zod").ZodObject<{
        sessionToken: import("zod").ZodString;
      }, import("zod/v4/core").$strip>;
      use: ((inputContext: import("better-call").MiddlewareInputContext<import("better-call").MiddlewareOptions>) => Promise<{
        session: {
          user: UserWithRole;
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
        };
      }>)[];
      metadata: {
        openapi: {
          operationId: string;
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
    revokeUserSessions: import("better-call").StrictEndpoint<"/admin/revoke-user-sessions", {
      method: "POST";
      body: import("zod").ZodObject<{
        userId: import("zod").ZodCoercedString<unknown>;
      }, import("zod/v4/core").$strip>;
      use: ((inputContext: import("better-call").MiddlewareInputContext<import("better-call").MiddlewareOptions>) => Promise<{
        session: {
          user: UserWithRole;
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
        };
      }>)[];
      metadata: {
        openapi: {
          operationId: string;
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
    removeUser: import("better-call").StrictEndpoint<"/admin/remove-user", {
      method: "POST";
      body: import("zod").ZodObject<{
        userId: import("zod").ZodCoercedString<unknown>;
      }, import("zod/v4/core").$strip>;
      use: ((inputContext: import("better-call").MiddlewareInputContext<import("better-call").MiddlewareOptions>) => Promise<{
        session: {
          user: UserWithRole;
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
        };
      }>)[];
      metadata: {
        openapi: {
          operationId: string;
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
    setUserPassword: import("better-call").StrictEndpoint<"/admin/set-user-password", {
      method: "POST";
      body: import("zod").ZodObject<{
        newPassword: import("zod").ZodString;
        userId: import("zod").ZodCoercedString<unknown>;
      }, import("zod/v4/core").$strip>;
      use: ((inputContext: import("better-call").MiddlewareInputContext<import("better-call").MiddlewareOptions>) => Promise<{
        session: {
          user: UserWithRole;
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
        };
      }>)[];
      metadata: {
        openapi: {
          operationId: string;
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
    userHasPermission: import("better-call").StrictEndpoint<"/admin/has-permission", {
      method: "POST";
      body: import("zod").ZodIntersection<import("zod").ZodObject<{
        userId: import("zod").ZodOptional<import("zod").ZodCoercedString<unknown>>;
        role: import("zod").ZodOptional<import("zod").ZodString>;
      }, import("zod/v4/core").$strip>, import("zod").ZodXor<readonly [import("zod").ZodObject<{
        permission: import("zod").ZodRecord<import("zod").ZodString, import("zod").ZodArray<import("zod").ZodString>>;
      }, import("zod/v4/core").$strip>, import("zod").ZodObject<{
        permissions: import("zod").ZodRecord<import("zod").ZodString, import("zod").ZodArray<import("zod").ZodString>>;
      }, import("zod/v4/core").$strip>]>>;
      metadata: {
        openapi: {
          description: string;
          requestBody: {
            content: {
              "application/json": {
                schema: {
                  type: "object";
                  properties: {
                    permissions: {
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
                      error: {
                        type: string;
                      };
                      success: {
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
        $Infer: {
          body: {
            permissions: { [key in keyof (O["ac"] extends AccessControl<infer S extends Statements> ? S : {
              readonly user: readonly ["create", "list", "set-role", "ban", "impersonate", "impersonate-admins", "delete", "set-password", "set-email", "get", "update"];
              readonly session: readonly ["list", "revoke", "delete"];
            })]?: ((O["ac"] extends AccessControl<infer S extends Statements> ? S : {
              readonly user: readonly ["create", "list", "set-role", "ban", "impersonate", "impersonate-admins", "delete", "set-password", "set-email", "get", "update"];
              readonly session: readonly ["list", "revoke", "delete"];
            })[key] extends readonly unknown[] ? ArrayElement<(O["ac"] extends AccessControl<infer S extends Statements> ? S : {
              readonly user: readonly ["create", "list", "set-role", "ban", "impersonate", "impersonate-admins", "delete", "set-password", "set-email", "get", "update"];
              readonly session: readonly ["list", "revoke", "delete"];
            })[key]> : never)[] | undefined; };
          } & {
            userId?: string | undefined;
            role?: InferAdminRolesFromOption<O> | undefined;
          };
        };
      };
    }, {
      error: null;
      success: boolean;
    }>;
  };
  $ERROR_CODES: {
    USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL: import("@better-auth/core/utils/error-codes").RawError<"USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL">;
    FAILED_TO_CREATE_USER: import("@better-auth/core/utils/error-codes").RawError<"FAILED_TO_CREATE_USER">;
    USER_ALREADY_EXISTS: import("@better-auth/core/utils/error-codes").RawError<"USER_ALREADY_EXISTS">;
    YOU_CANNOT_BAN_YOURSELF: import("@better-auth/core/utils/error-codes").RawError<"YOU_CANNOT_BAN_YOURSELF">;
    YOU_ARE_NOT_ALLOWED_TO_CHANGE_USERS_ROLE: import("@better-auth/core/utils/error-codes").RawError<"YOU_ARE_NOT_ALLOWED_TO_CHANGE_USERS_ROLE">;
    YOU_ARE_NOT_ALLOWED_TO_CREATE_USERS: import("@better-auth/core/utils/error-codes").RawError<"YOU_ARE_NOT_ALLOWED_TO_CREATE_USERS">;
    YOU_ARE_NOT_ALLOWED_TO_LIST_USERS: import("@better-auth/core/utils/error-codes").RawError<"YOU_ARE_NOT_ALLOWED_TO_LIST_USERS">;
    YOU_ARE_NOT_ALLOWED_TO_LIST_USERS_SESSIONS: import("@better-auth/core/utils/error-codes").RawError<"YOU_ARE_NOT_ALLOWED_TO_LIST_USERS_SESSIONS">;
    YOU_ARE_NOT_ALLOWED_TO_BAN_USERS: import("@better-auth/core/utils/error-codes").RawError<"YOU_ARE_NOT_ALLOWED_TO_BAN_USERS">;
    YOU_ARE_NOT_ALLOWED_TO_IMPERSONATE_USERS: import("@better-auth/core/utils/error-codes").RawError<"YOU_ARE_NOT_ALLOWED_TO_IMPERSONATE_USERS">;
    YOU_ARE_NOT_ALLOWED_TO_REVOKE_USERS_SESSIONS: import("@better-auth/core/utils/error-codes").RawError<"YOU_ARE_NOT_ALLOWED_TO_REVOKE_USERS_SESSIONS">;
    YOU_ARE_NOT_ALLOWED_TO_DELETE_USERS: import("@better-auth/core/utils/error-codes").RawError<"YOU_ARE_NOT_ALLOWED_TO_DELETE_USERS">;
    YOU_ARE_NOT_ALLOWED_TO_SET_USERS_PASSWORD: import("@better-auth/core/utils/error-codes").RawError<"YOU_ARE_NOT_ALLOWED_TO_SET_USERS_PASSWORD">;
    BANNED_USER: import("@better-auth/core/utils/error-codes").RawError<"BANNED_USER">;
    YOU_ARE_NOT_ALLOWED_TO_GET_USER: import("@better-auth/core/utils/error-codes").RawError<"YOU_ARE_NOT_ALLOWED_TO_GET_USER">;
    NO_DATA_TO_UPDATE: import("@better-auth/core/utils/error-codes").RawError<"NO_DATA_TO_UPDATE">;
    YOU_ARE_NOT_ALLOWED_TO_UPDATE_USERS: import("@better-auth/core/utils/error-codes").RawError<"YOU_ARE_NOT_ALLOWED_TO_UPDATE_USERS">;
    YOU_CANNOT_REMOVE_YOURSELF: import("@better-auth/core/utils/error-codes").RawError<"YOU_CANNOT_REMOVE_YOURSELF">;
    YOU_ARE_NOT_ALLOWED_TO_SET_NON_EXISTENT_VALUE: import("@better-auth/core/utils/error-codes").RawError<"YOU_ARE_NOT_ALLOWED_TO_SET_NON_EXISTENT_VALUE">;
    YOU_CANNOT_IMPERSONATE_ADMINS: import("@better-auth/core/utils/error-codes").RawError<"YOU_CANNOT_IMPERSONATE_ADMINS">;
    INVALID_ROLE_TYPE: import("@better-auth/core/utils/error-codes").RawError<"INVALID_ROLE_TYPE">;
    YOU_ARE_NOT_ALLOWED_TO_SET_USERS_EMAIL: import("@better-auth/core/utils/error-codes").RawError<"YOU_ARE_NOT_ALLOWED_TO_SET_USERS_EMAIL">;
    PASSWORD_CANNOT_BE_UPDATED_VIA_UPDATE_USER: import("@better-auth/core/utils/error-codes").RawError<"PASSWORD_CANNOT_BE_UPDATED_VIA_UPDATE_USER">;
  };
  schema: {
    user: {
      fields: {
        role: {
          type: "string";
          required: false;
          input: false;
        };
        banned: {
          type: "boolean";
          defaultValue: false;
          required: false;
          input: false;
        };
        banReason: {
          type: "string";
          required: false;
          input: false;
        };
        banExpires: {
          type: "date";
          required: false;
          input: false;
        };
      };
    };
    session: {
      fields: {
        impersonatedBy: {
          type: "string";
          required: false;
          input: false;
        };
      };
    };
  };
  options: NoInfer<O>;
};
//#endregion
export { admin };