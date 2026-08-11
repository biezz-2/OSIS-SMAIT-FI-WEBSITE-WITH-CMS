//#region src/plugins/oauth-popup/error-codes.d.ts
declare const OAUTH_POPUP_ERROR_CODES: {
  POPUP_SIGN_IN_FAILED: import("@better-auth/core/utils/error-codes").RawError<"POPUP_SIGN_IN_FAILED">;
  POPUP_BLOCKED: import("@better-auth/core/utils/error-codes").RawError<"POPUP_BLOCKED">;
  POPUP_CLOSED: import("@better-auth/core/utils/error-codes").RawError<"POPUP_CLOSED">;
  POPUP_TIMEOUT: import("@better-auth/core/utils/error-codes").RawError<"POPUP_TIMEOUT">;
};
//#endregion
export { OAUTH_POPUP_ERROR_CODES };