import { FieldAttributeToObject, InferAdditionalFieldsFromPluginOptions, RemoveFieldsWithReturnedFalse } from "../../../db/field.mjs";
import { Role } from "../../access/types.mjs";
import "../../../db/index.mjs";
import { OrganizationOptions } from "../types.mjs";
import { InferInvitation, InferMember, InferTeam } from "../schema.mjs";
import "../../index.mjs";
import { defaultRoles } from "../access/statement.mjs";
import "../access/index.mjs";
import * as z from "zod";
//#region src/plugins/organization/routes/crud-org.d.ts
declare const createOrganization: <O extends OrganizationOptions>(options?: O | undefined) => import("better-call").StrictEndpoint<"/organization/create", {
  method: "POST";
  body: z.ZodObject<{
    name: z.ZodString;
    slug: z.ZodString;
    userId: z.ZodOptional<z.ZodCoercedString<unknown>>;
    logo: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    keepCurrentActiveOrganization: z.ZodOptional<z.ZodBoolean>;
  }, z.core.$strip>;
  use: ((inputContext: import("better-call").MiddlewareInputContext<import("better-call").MiddlewareOptions>) => Promise<{
    orgOptions: OrganizationOptions;
    roles: typeof defaultRoles & {
      [key: string]: Role<{}>;
    };
    getSession: (context: import("@better-auth/core").GenericEndpointContext) => Promise<{
      session: {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        expiresAt: Date;
        token: string;
        ipAddress?: string | null | undefined;
        userAgent?: string | null | undefined;
      } & {
        activeTeamId?: string | undefined;
        activeOrganizationId?: string | undefined;
      };
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
  }>)[];
  metadata: {
    $Infer: {
      body: InferAdditionalFieldsFromPluginOptions<"organization", O> & {
        name: string;
        slug: string;
        userId?: string | undefined;
        logo?: string | null | undefined;
        metadata?: Record<string, any> | undefined;
        keepCurrentActiveOrganization?: boolean | undefined;
      };
    };
    openapi: {
      description: string;
      responses: {
        "200": {
          description: string;
          content: {
            "application/json": {
              schema: {
                type: "object";
                description: string;
                $ref: string;
              };
            };
          };
        };
      };
    };
  };
}, ({
  id: string;
  name: string;
  slug: string;
  createdAt: Date;
  logo?: string | null | undefined;
  metadata?: any;
} & (O["schema"] extends {
  organization?: {
    additionalFields: infer Field extends Record<string, import("@better-auth/core/db").DBFieldAttribute>;
  } | undefined;
} ? FieldAttributeToObject<RemoveFieldsWithReturnedFalse<Field>> : {}) extends (infer T) ? { [K in keyof T]: T[K]; } : never) & {
  metadata: any;
  members: (({
    id: string;
    organizationId: string;
    userId: string;
    role: string;
    createdAt: Date;
  } & InferAdditionalFieldsFromPluginOptions<"member", O, false>) | undefined)[];
}>;
declare const checkOrganizationSlug: <O extends OrganizationOptions>(options: O) => import("better-call").StrictEndpoint<"/organization/check-slug", {
  method: "POST";
  body: z.ZodObject<{
    slug: z.ZodString;
  }, z.core.$strip>;
  use: (((inputContext: import("better-call").MiddlewareInputContext<import("better-call").MiddlewareOptions>) => Promise<{
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
    } | null;
  }>) | ((inputContext: import("better-call").MiddlewareInputContext<import("better-call").MiddlewareOptions>) => Promise<{
    orgOptions: OrganizationOptions;
    roles: typeof defaultRoles & {
      [key: string]: Role<{}>;
    };
    getSession: (context: import("@better-auth/core").GenericEndpointContext) => Promise<{
      session: {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        expiresAt: Date;
        token: string;
        ipAddress?: string | null | undefined;
        userAgent?: string | null | undefined;
      } & {
        activeTeamId?: string | undefined;
        activeOrganizationId?: string | undefined;
      };
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
  }>))[];
}, {
  status: boolean;
}>;
declare const updateOrganization: <O extends OrganizationOptions>(options?: O | undefined) => import("better-call").StrictEndpoint<"/organization/update", {
  method: "POST";
  body: z.ZodObject<{
    data: z.ZodObject<{
      name: z.ZodOptional<z.ZodOptional<z.ZodString>>;
      slug: z.ZodOptional<z.ZodOptional<z.ZodString>>;
      logo: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
      metadata: z.ZodOptional<z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>>;
    }, z.core.$strip>;
    organizationId: z.ZodOptional<z.ZodString>;
  }, z.core.$strip>;
  requireHeaders: true;
  use: ((inputContext: import("better-call").MiddlewareInputContext<import("better-call").MiddlewareOptions>) => Promise<{
    orgOptions: OrganizationOptions;
    roles: typeof defaultRoles & {
      [key: string]: Role<{}>;
    };
    getSession: (context: import("@better-auth/core").GenericEndpointContext) => Promise<{
      session: {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        expiresAt: Date;
        token: string;
        ipAddress?: string | null | undefined;
        userAgent?: string | null | undefined;
      } & {
        activeTeamId?: string | undefined;
        activeOrganizationId?: string | undefined;
      };
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
  }>)[];
  metadata: {
    $Infer: {
      body: {
        data: {
          name?: string | undefined;
          slug?: string | undefined;
          logo?: string | null | undefined;
          metadata?: Record<string, any> | undefined;
        } & Partial<InferAdditionalFieldsFromPluginOptions<"organization", O>>;
        organizationId?: string | undefined;
      };
    };
    openapi: {
      description: string;
      responses: {
        "200": {
          description: string;
          content: {
            "application/json": {
              schema: {
                type: "object";
                description: string;
                $ref: string;
              };
            };
          };
        };
      };
    };
  };
}, ({
  id: string;
  name: string;
  slug: string;
  createdAt: Date;
  logo?: string | null | undefined;
  metadata?: any;
} & (O["schema"] extends {
  organization?: {
    additionalFields: infer Field extends Record<string, import("@better-auth/core/db").DBFieldAttribute>;
  } | undefined;
} ? FieldAttributeToObject<RemoveFieldsWithReturnedFalse<Field>> : {}) extends (infer T) ? { [K in keyof T]: T[K]; } : never) | null>;
declare const deleteOrganization: <O extends OrganizationOptions>(options: O) => import("better-call").StrictEndpoint<"/organization/delete", {
  method: "POST";
  body: z.ZodObject<{
    organizationId: z.ZodString;
  }, z.core.$strip>;
  requireHeaders: true;
  use: ((inputContext: import("better-call").MiddlewareInputContext<import("better-call").MiddlewareOptions>) => Promise<{
    orgOptions: OrganizationOptions;
    roles: typeof defaultRoles & {
      [key: string]: Role<{}>;
    };
    getSession: (context: import("@better-auth/core").GenericEndpointContext) => Promise<{
      session: {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        expiresAt: Date;
        token: string;
        ipAddress?: string | null | undefined;
        userAgent?: string | null | undefined;
      } & {
        activeTeamId?: string | undefined;
        activeOrganizationId?: string | undefined;
      };
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
                type: "string";
                description: string;
              };
            };
          };
        };
      };
    };
  };
}, {
  id: string;
  name: string;
  slug: string;
  createdAt: Date;
  logo?: string | null | undefined;
  metadata?: any;
} & (O["schema"] extends {
  organization?: {
    additionalFields: infer Field extends Record<string, import("@better-auth/core/db").DBFieldAttribute>;
  } | undefined;
} ? FieldAttributeToObject<RemoveFieldsWithReturnedFalse<Field>> : {}) extends (infer T) ? { [K in keyof T]: T[K]; } : never>;
declare const getFullOrganization: <O extends OrganizationOptions>(options: O) => import("better-call").StrictEndpoint<"/organization/get-full-organization", {
  method: "GET";
  query: z.ZodOptional<z.ZodObject<{
    organizationId: z.ZodOptional<z.ZodString>;
    organizationSlug: z.ZodOptional<z.ZodString>;
    membersLimit: z.ZodOptional<z.ZodUnion<[z.ZodNumber, z.ZodPipe<z.ZodString, z.ZodTransform<number, string>>]>>;
  }, z.core.$strip>>;
  requireHeaders: true;
  use: (((inputContext: import("better-call").MiddlewareInputContext<import("better-call").MiddlewareOptions>) => Promise<{
    orgOptions: OrganizationOptions;
    roles: typeof defaultRoles & {
      [key: string]: Role<{}>;
    };
    getSession: (context: import("@better-auth/core").GenericEndpointContext) => Promise<{
      session: {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        expiresAt: Date;
        token: string;
        ipAddress?: string | null | undefined;
        userAgent?: string | null | undefined;
      } & {
        activeTeamId?: string | undefined;
        activeOrganizationId?: string | undefined;
      };
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
  }>) | ((inputContext: import("better-call").MiddlewareInputContext<{
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
  }>) => Promise<{
    session: {
      session: {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        expiresAt: Date;
        token: string;
        ipAddress?: string | null | undefined;
        userAgent?: string | null | undefined;
      } & {
        activeTeamId?: string | undefined;
        activeOrganizationId?: string | undefined;
      };
      user: {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        emailVerified: boolean;
        name: string;
        image?: string | null | undefined;
      };
    };
  }>))[];
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
                description: string;
                $ref: string;
              };
            };
          };
        };
      };
    };
  };
}, (O["teams"] extends {
  enabled: true;
} ? {
  members: InferMember<O>[];
  invitations: InferInvitation<O>[];
  teams: InferTeam<O>[];
} & ({
  id: string;
  name: string;
  slug: string;
  createdAt: Date;
  logo?: string | null | undefined;
  metadata?: any;
} & (O["schema"] extends {
  organization?: {
    additionalFields: infer Field extends Record<string, import("@better-auth/core/db").DBFieldAttribute>;
  } | undefined;
} ? FieldAttributeToObject<RemoveFieldsWithReturnedFalse<Field>> : {}) extends (infer T) ? { [K in keyof T]: T[K]; } : never) : {
  members: InferMember<O>[];
  invitations: InferInvitation<O>[];
} & ({
  id: string;
  name: string;
  slug: string;
  createdAt: Date;
  logo?: string | null | undefined;
  metadata?: any;
} & (O["schema"] extends {
  organization?: {
    additionalFields: infer Field extends Record<string, import("@better-auth/core/db").DBFieldAttribute>;
  } | undefined;
} ? FieldAttributeToObject<RemoveFieldsWithReturnedFalse<Field>> : {}) extends (infer T_1) ? { [K in keyof T_1]: T_1[K]; } : never)) | null>;
declare const setActiveOrganization: <O extends OrganizationOptions>(options: O) => import("better-call").StrictEndpoint<"/organization/set-active", {
  method: "POST";
  body: z.ZodObject<{
    organizationId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    organizationSlug: z.ZodOptional<z.ZodString>;
  }, z.core.$strip>;
  use: (((inputContext: import("better-call").MiddlewareInputContext<import("better-call").MiddlewareOptions>) => Promise<{
    orgOptions: OrganizationOptions;
    roles: typeof defaultRoles & {
      [key: string]: Role<{}>;
    };
    getSession: (context: import("@better-auth/core").GenericEndpointContext) => Promise<{
      session: {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        expiresAt: Date;
        token: string;
        ipAddress?: string | null | undefined;
        userAgent?: string | null | undefined;
      } & {
        activeTeamId?: string | undefined;
        activeOrganizationId?: string | undefined;
      };
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
  }>) | ((inputContext: import("better-call").MiddlewareInputContext<{
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
  }>) => Promise<{
    session: {
      session: {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        expiresAt: Date;
        token: string;
        ipAddress?: string | null | undefined;
        userAgent?: string | null | undefined;
      } & {
        activeTeamId?: string | undefined;
        activeOrganizationId?: string | undefined;
      };
      user: {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        emailVerified: boolean;
        name: string;
        image?: string | null | undefined;
      };
    };
  }>))[];
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
                description: string;
                $ref: string;
              };
            };
          };
        };
      };
    };
  };
}, (O["teams"] extends {
  enabled: true;
} ? {
  members: InferMember<O>[];
  invitations: InferInvitation<O>[];
  teams: InferTeam<O>[];
} & ({
  id: string;
  name: string;
  slug: string;
  createdAt: Date;
  logo?: string | null | undefined;
  metadata?: any;
} & (O["schema"] extends {
  organization?: {
    additionalFields: infer Field extends Record<string, import("@better-auth/core/db").DBFieldAttribute>;
  } | undefined;
} ? FieldAttributeToObject<RemoveFieldsWithReturnedFalse<Field>> : {}) extends (infer T) ? { [K in keyof T]: T[K]; } : never) : {
  members: InferMember<O>[];
  invitations: InferInvitation<O>[];
} & ({
  id: string;
  name: string;
  slug: string;
  createdAt: Date;
  logo?: string | null | undefined;
  metadata?: any;
} & (O["schema"] extends {
  organization?: {
    additionalFields: infer Field extends Record<string, import("@better-auth/core/db").DBFieldAttribute>;
  } | undefined;
} ? FieldAttributeToObject<RemoveFieldsWithReturnedFalse<Field>> : {}) extends (infer T_1) ? { [K in keyof T_1]: T_1[K]; } : never)) | null>;
declare const listOrganizations: <O extends OrganizationOptions>(options: O) => import("better-call").StrictEndpoint<"/organization/list", {
  method: "GET";
  use: (((inputContext: import("better-call").MiddlewareInputContext<import("better-call").MiddlewareOptions>) => Promise<{
    orgOptions: OrganizationOptions;
    roles: typeof defaultRoles & {
      [key: string]: Role<{}>;
    };
    getSession: (context: import("@better-auth/core").GenericEndpointContext) => Promise<{
      session: {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        expiresAt: Date;
        token: string;
        ipAddress?: string | null | undefined;
        userAgent?: string | null | undefined;
      } & {
        activeTeamId?: string | undefined;
        activeOrganizationId?: string | undefined;
      };
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
  }>) | ((inputContext: import("better-call").MiddlewareInputContext<{
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
  }>) => Promise<{
    session: {
      session: {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        expiresAt: Date;
        token: string;
        ipAddress?: string | null | undefined;
        userAgent?: string | null | undefined;
      } & {
        activeTeamId?: string | undefined;
        activeOrganizationId?: string | undefined;
      };
      user: {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        emailVerified: boolean;
        name: string;
        image?: string | null | undefined;
      };
    };
  }>))[];
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
}, ({
  id: string;
  name: string;
  slug: string;
  createdAt: Date;
  logo?: string | null | undefined;
  metadata?: any;
} & (O["schema"] extends {
  organization?: {
    additionalFields: infer Field extends Record<string, import("@better-auth/core/db").DBFieldAttribute>;
  } | undefined;
} ? FieldAttributeToObject<RemoveFieldsWithReturnedFalse<Field>> : {}) extends (infer T) ? { [K in keyof T]: T[K]; } : never)[]>;
//#endregion
export { checkOrganizationSlug, createOrganization, deleteOrganization, getFullOrganization, listOrganizations, setActiveOrganization, updateOrganization };