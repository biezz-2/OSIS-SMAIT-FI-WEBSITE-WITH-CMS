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
import { BaseOAuthProviderOptions, genericOAuth } from "./index.mjs";
import { GENERIC_OAUTH_ERROR_CODES } from "./error-codes.mjs";
//#region src/plugins/generic-oauth/client.d.ts
declare const genericOAuthClient: () => {
  id: "generic-oauth-client";
  version: string;
  $InferServerPlugin: ReturnType<typeof genericOAuth>;
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
export { type Auth0Options, type BaseOAuthProviderOptions, GENERIC_OAUTH_ERROR_CODES, type GenericOAuthConfig, type GenericOAuthOptions, type GumroadOptions, type HubSpotOptions, type KeycloakOptions, type LineOptions, type MicrosoftEntraIdOptions, type OktaOptions, type PatreonOptions, type SlackOptions, type YandexOptions, type auth0, genericOAuthClient, type gumroad, type hubspot, type keycloak, type line, type microsoftEntraId, type okta, type patreon, type slack, type yandex };