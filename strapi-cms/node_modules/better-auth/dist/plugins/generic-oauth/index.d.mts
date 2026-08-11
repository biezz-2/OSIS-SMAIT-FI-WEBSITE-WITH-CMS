import { GenericOAuthConfig, GenericOAuthOptions } from "./types.mjs";
import { Auth0Options, auth0 } from "./providers/auth0.mjs";
import { GumroadOptions, gumroad } from "./providers/gumroad.mjs";
import { HubSpotOptions, hubspot } from "./providers/hubspot.mjs";
import { KeycloakOptions, keycloak } from "./providers/keycloak.mjs";
import { LineOptions, line } from "./providers/line.mjs";
import { MicrosoftEntraIdOptions, microsoftEntraId } from "./providers/microsoft-entra-id.mjs";
import { OktaOptions, okta } from "./providers/okta.mjs";
import { PatreonOptions, patreon } from "./providers/patreon.mjs";
import { SlackOptions, slack } from "./providers/slack.mjs";
import { YandexOptions, yandex } from "./providers/yandex.mjs";
import "./providers/index.mjs";
import { AuthContext } from "@better-auth/core";
import { OAuthProvider } from "@better-auth/core/oauth2";
//#region src/plugins/generic-oauth/index.d.ts
declare module "@better-auth/core" {
  interface BetterAuthPluginRegistry<AuthOptions, Options> {
    "generic-oauth": {
      creator: typeof genericOAuth;
    };
  }
}
/**
 * Base type for OAuth provider options.
 * Extracts common fields from GenericOAuthConfig and makes clientSecret required.
 */
type BaseOAuthProviderOptions = Omit<Pick<GenericOAuthConfig, "clientId" | "clientSecret" | "scopes" | "redirectURI" | "pkce" | "disableImplicitSignUp" | "disableSignUp" | "overrideUserInfo">, "clientSecret"> & {
  /** OAuth client secret (required for provider options) */
  clientSecret: string;
};
/**
 * A generic OAuth plugin that can be used to add OAuth support to any provider
 */
declare const genericOAuth: (options: GenericOAuthOptions) => {
  id: "generic-oauth";
  version: string;
  init: (ctx: AuthContext) => {
    context: {
      socialProviders: OAuthProvider<Record<string, any>, Partial<import("@better-auth/core/oauth2").ProviderOptions<any>>>[];
    };
  };
  endpoints: {
    signInWithOAuth2: import("better-call").StrictEndpoint<"/sign-in/oauth2", {
      method: "POST";
      body: import("zod").ZodObject<{
        providerId: import("zod").ZodString;
        callbackURL: import("zod").ZodOptional<import("zod").ZodString>;
        errorCallbackURL: import("zod").ZodOptional<import("zod").ZodString>;
        newUserCallbackURL: import("zod").ZodOptional<import("zod").ZodString>;
        disableRedirect: import("zod").ZodOptional<import("zod").ZodBoolean>;
        scopes: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString>>;
        requestSignUp: import("zod").ZodOptional<import("zod").ZodBoolean>;
        additionalData: import("zod").ZodOptional<import("zod").ZodRecord<import("zod").ZodString, import("zod").ZodAny>>;
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
                      url: {
                        type: string;
                      };
                      redirect: {
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
      url: string;
      redirect: boolean;
    }>;
    oAuth2Callback: import("better-call").StrictEndpoint<"/oauth2/callback/:providerId", {
      method: "GET";
      query: import("zod").ZodObject<{
        code: import("zod").ZodOptional<import("zod").ZodString>;
        error: import("zod").ZodOptional<import("zod").ZodString>;
        error_description: import("zod").ZodOptional<import("zod").ZodString>;
        state: import("zod").ZodOptional<import("zod").ZodString>;
        iss: import("zod").ZodOptional<import("zod").ZodString>;
      }, import("zod/v4/core").$strip>;
      metadata: {
        allowedMediaTypes: string[];
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
                      url: {
                        type: string;
                      };
                    };
                  };
                };
              };
            };
          };
        };
        scope: "server";
      };
    }, never>;
    oAuth2LinkAccount: import("better-call").StrictEndpoint<"/oauth2/link", {
      method: "POST";
      body: import("zod").ZodObject<{
        providerId: import("zod").ZodString;
        callbackURL: import("zod").ZodString;
        scopes: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString>>;
        errorCallbackURL: import("zod").ZodOptional<import("zod").ZodString>;
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
                      url: {
                        type: string;
                        format: string;
                        description: string;
                      };
                      redirect: {
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
      url: string;
      redirect: boolean;
    }>;
  };
  options: GenericOAuthOptions;
  $ERROR_CODES: {
    INVALID_OAUTH_CONFIGURATION: import("@better-auth/core/utils/error-codes").RawError<"INVALID_OAUTH_CONFIGURATION">;
    TOKEN_URL_NOT_FOUND: import("@better-auth/core/utils/error-codes").RawError<"TOKEN_URL_NOT_FOUND">;
    PROVIDER_CONFIG_NOT_FOUND: import("@better-auth/core/utils/error-codes").RawError<"PROVIDER_CONFIG_NOT_FOUND">;
    PROVIDER_ID_REQUIRED: import("@better-auth/core/utils/error-codes").RawError<"PROVIDER_ID_REQUIRED">;
    INVALID_OAUTH_CONFIG: import("@better-auth/core/utils/error-codes").RawError<"INVALID_OAUTH_CONFIG">;
    SESSION_REQUIRED: import("@better-auth/core/utils/error-codes").RawError<"SESSION_REQUIRED">;
    ISSUER_MISMATCH: import("@better-auth/core/utils/error-codes").RawError<"ISSUER_MISMATCH">;
    ISSUER_MISSING: import("@better-auth/core/utils/error-codes").RawError<"ISSUER_MISSING">;
  };
};
//#endregion
export { type Auth0Options, BaseOAuthProviderOptions, type GenericOAuthConfig, type GenericOAuthOptions, type GumroadOptions, type HubSpotOptions, type KeycloakOptions, type LineOptions, type MicrosoftEntraIdOptions, type OktaOptions, type PatreonOptions, type SlackOptions, type YandexOptions, auth0, genericOAuth, gumroad, hubspot, keycloak, line, microsoftEntraId, okta, patreon, slack, yandex };