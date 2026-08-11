import { BetterAuthDBSchema, ModelNames, SecondaryStorage } from "../db/type.mjs";
import { DBAdapter } from "../db/adapter/index.mjs";
import { createLogger } from "../env/logger.mjs";
import "../db/index.mjs";
import { AuthContext } from "../types/context.mjs";
import "../types/index.mjs";
import { OAuthProvider } from "../oauth2/oauth-provider.mjs";
import "../oauth2/index.mjs";
import { EndpointContext, EndpointOptions, StrictEndpoint } from "better-call";
//#region src/api/index.d.ts
declare const optionsMiddleware: <InputCtx extends import("better-call").MiddlewareInputContext<import("better-call").MiddlewareOptions>>(inputContext: InputCtx) => Promise<AuthContext>;
declare const createAuthMiddleware: {
  <Options extends import("better-call").MiddlewareOptions, R>(options: Options, handler: (ctx: import("better-call").MiddlewareContext<Options, {
    returned?: unknown | undefined;
    responseHeaders?: Headers | undefined;
  } & import("@better-auth/core").PluginContext<import("@better-auth/core").BetterAuthOptions> & import("@better-auth/core").InfoContext & {
    options: import("@better-auth/core").BetterAuthOptions;
    trustedOrigins: string[];
    trustedProviders: string[];
    isTrustedOrigin: (url: string, settings?: {
      allowRelativePaths: boolean;
    }) => boolean;
    oauthConfig: {
      skipStateCookieCheck?: boolean | undefined;
      storeStateStrategy: "database" | "cookie";
    };
    newSession: {
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
    } | null;
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
    } | null;
    setNewSession: (session: {
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
    } | null) => void;
    socialProviders: OAuthProvider[];
    authCookies: import("@better-auth/core").BetterAuthCookies;
    logger: ReturnType<typeof createLogger>;
    rateLimit: {
      enabled: boolean;
      window: number;
      max: number;
      storage: "memory" | "database" | "secondary-storage";
    } & Omit<import("@better-auth/core").BetterAuthRateLimitOptions, "enabled" | "window" | "max" | "storage">;
    adapter: DBAdapter<import("@better-auth/core").BetterAuthOptions>;
    internalAdapter: import("@better-auth/core").InternalAdapter<import("@better-auth/core").BetterAuthOptions>;
    createAuthCookie: (cookieName: string, overrideAttributes?: Partial<import("better-call").CookieOptions> | undefined) => import("@better-auth/core").BetterAuthCookie;
    secret: string;
    secretConfig: string | import("@better-auth/core").SecretConfig;
    sessionConfig: {
      updateAge: number;
      expiresIn: number;
      freshAge: number;
      cookieRefreshCache: false | {
        enabled: true;
        updateAge: number;
      };
    };
    generateId: (options: {
      model: ModelNames;
      size?: number | undefined;
    }) => string | false;
    secondaryStorage: SecondaryStorage | undefined;
    password: {
      hash: (password: string) => Promise<string>;
      verify: (data: {
        password: string;
        hash: string;
      }) => Promise<boolean>;
      config: {
        minPasswordLength: number;
        maxPasswordLength: number;
      };
      checkPassword: (userId: string, ctx: import("@better-auth/core").GenericEndpointContext<import("@better-auth/core").BetterAuthOptions>) => Promise<boolean>;
    };
    tables: BetterAuthDBSchema;
    runMigrations: () => Promise<void>;
    publishTelemetry: (event: {
      type: string;
      anonymousId?: string | undefined;
      payload: Record<string, any>;
    }) => Promise<void>;
    skipOriginCheck: boolean | string[];
    skipCSRFCheck: boolean;
    runInBackground: (promise: Promise<unknown>) => void;
    runInBackgroundOrAwait: (promise: Promise<unknown> | void) => import("@better-auth/core").Awaitable<unknown>;
  }>) => Promise<R>): (inputContext: import("better-call").MiddlewareInputContext<Options>) => Promise<R>;
  <Options extends import("better-call").MiddlewareOptions, R_1>(handler: (ctx: import("better-call").MiddlewareContext<Options, {
    returned?: unknown | undefined;
    responseHeaders?: Headers | undefined;
  } & import("@better-auth/core").PluginContext<import("@better-auth/core").BetterAuthOptions> & import("@better-auth/core").InfoContext & {
    options: import("@better-auth/core").BetterAuthOptions;
    trustedOrigins: string[];
    trustedProviders: string[];
    isTrustedOrigin: (url: string, settings?: {
      allowRelativePaths: boolean;
    }) => boolean;
    oauthConfig: {
      skipStateCookieCheck?: boolean | undefined;
      storeStateStrategy: "database" | "cookie";
    };
    newSession: {
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
    } | null;
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
    } | null;
    setNewSession: (session: {
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
    } | null) => void;
    socialProviders: OAuthProvider[];
    authCookies: import("@better-auth/core").BetterAuthCookies;
    logger: ReturnType<typeof createLogger>;
    rateLimit: {
      enabled: boolean;
      window: number;
      max: number;
      storage: "memory" | "database" | "secondary-storage";
    } & Omit<import("@better-auth/core").BetterAuthRateLimitOptions, "enabled" | "window" | "max" | "storage">;
    adapter: DBAdapter<import("@better-auth/core").BetterAuthOptions>;
    internalAdapter: import("@better-auth/core").InternalAdapter<import("@better-auth/core").BetterAuthOptions>;
    createAuthCookie: (cookieName: string, overrideAttributes?: Partial<import("better-call").CookieOptions> | undefined) => import("@better-auth/core").BetterAuthCookie;
    secret: string;
    secretConfig: string | import("@better-auth/core").SecretConfig;
    sessionConfig: {
      updateAge: number;
      expiresIn: number;
      freshAge: number;
      cookieRefreshCache: false | {
        enabled: true;
        updateAge: number;
      };
    };
    generateId: (options: {
      model: ModelNames;
      size?: number | undefined;
    }) => string | false;
    secondaryStorage: SecondaryStorage | undefined;
    password: {
      hash: (password: string) => Promise<string>;
      verify: (data: {
        password: string;
        hash: string;
      }) => Promise<boolean>;
      config: {
        minPasswordLength: number;
        maxPasswordLength: number;
      };
      checkPassword: (userId: string, ctx: import("@better-auth/core").GenericEndpointContext<import("@better-auth/core").BetterAuthOptions>) => Promise<boolean>;
    };
    tables: BetterAuthDBSchema;
    runMigrations: () => Promise<void>;
    publishTelemetry: (event: {
      type: string;
      anonymousId?: string | undefined;
      payload: Record<string, any>;
    }) => Promise<void>;
    skipOriginCheck: boolean | string[];
    skipCSRFCheck: boolean;
    runInBackground: (promise: Promise<unknown>) => void;
    runInBackgroundOrAwait: (promise: Promise<unknown> | void) => import("@better-auth/core").Awaitable<unknown>;
  }>) => Promise<R_1>): (inputContext: import("better-call").MiddlewareInputContext<Options>) => Promise<R_1>;
};
type EndpointHandler<Path extends string, Options extends EndpointOptions, R> = (context: EndpointContext<Path, Options, AuthContext>) => Promise<R>;
declare function createAuthEndpoint<Path extends string, Options extends EndpointOptions, R>(path: Path, options: Options, handler: EndpointHandler<Path, Options, R>): StrictEndpoint<Path, Options, R>;
declare function createAuthEndpoint<Path extends string, Options extends EndpointOptions, R>(options: Options, handler: EndpointHandler<Path, Options, R>): StrictEndpoint<Path, Options, R>;
declare namespace createAuthEndpoint {
  var serverOnly: <Path extends string, Options extends EndpointOptions, R>(options: Options, handler: EndpointHandler<Path, Options, R>) => StrictEndpoint<Path, Options, R>;
}
type AuthEndpoint<Path extends string, Opts extends EndpointOptions, R> = ReturnType<typeof createAuthEndpoint<Path, Opts, R>>;
type AuthMiddleware = ReturnType<typeof createAuthMiddleware>;
//#endregion
export { AuthEndpoint, AuthMiddleware, createAuthEndpoint, createAuthMiddleware, optionsMiddleware };