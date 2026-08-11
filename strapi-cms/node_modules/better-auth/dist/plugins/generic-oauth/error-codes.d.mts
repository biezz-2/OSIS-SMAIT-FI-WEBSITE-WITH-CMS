//#region src/plugins/generic-oauth/error-codes.d.ts
declare const GENERIC_OAUTH_ERROR_CODES: {
  INVALID_OAUTH_CONFIGURATION: import("@better-auth/core/utils/error-codes").RawError<"INVALID_OAUTH_CONFIGURATION">;
  TOKEN_URL_NOT_FOUND: import("@better-auth/core/utils/error-codes").RawError<"TOKEN_URL_NOT_FOUND">;
  PROVIDER_CONFIG_NOT_FOUND: import("@better-auth/core/utils/error-codes").RawError<"PROVIDER_CONFIG_NOT_FOUND">;
  PROVIDER_ID_REQUIRED: import("@better-auth/core/utils/error-codes").RawError<"PROVIDER_ID_REQUIRED">;
  INVALID_OAUTH_CONFIG: import("@better-auth/core/utils/error-codes").RawError<"INVALID_OAUTH_CONFIG">;
  SESSION_REQUIRED: import("@better-auth/core/utils/error-codes").RawError<"SESSION_REQUIRED">;
  ISSUER_MISMATCH: import("@better-auth/core/utils/error-codes").RawError<"ISSUER_MISMATCH">;
  ISSUER_MISSING: import("@better-auth/core/utils/error-codes").RawError<"ISSUER_MISSING">;
};
//#endregion
export { GENERIC_OAUTH_ERROR_CODES };