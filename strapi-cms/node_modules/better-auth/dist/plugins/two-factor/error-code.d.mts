//#region src/plugins/two-factor/error-code.d.ts
declare const TWO_FACTOR_ERROR_CODES: {
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
//#endregion
export { TWO_FACTOR_ERROR_CODES };