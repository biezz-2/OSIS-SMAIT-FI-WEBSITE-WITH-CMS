//#region src/plugins/phone-number/error-codes.d.ts
declare const PHONE_NUMBER_ERROR_CODES: {
  OTP_EXPIRED: import("@better-auth/core/utils/error-codes").RawError<"OTP_EXPIRED">;
  INVALID_OTP: import("@better-auth/core/utils/error-codes").RawError<"INVALID_OTP">;
  TOO_MANY_ATTEMPTS: import("@better-auth/core/utils/error-codes").RawError<"TOO_MANY_ATTEMPTS">;
  INVALID_PHONE_NUMBER: import("@better-auth/core/utils/error-codes").RawError<"INVALID_PHONE_NUMBER">;
  PHONE_NUMBER_EXIST: import("@better-auth/core/utils/error-codes").RawError<"PHONE_NUMBER_EXIST">;
  PHONE_NUMBER_NOT_EXIST: import("@better-auth/core/utils/error-codes").RawError<"PHONE_NUMBER_NOT_EXIST">;
  INVALID_PHONE_NUMBER_OR_PASSWORD: import("@better-auth/core/utils/error-codes").RawError<"INVALID_PHONE_NUMBER_OR_PASSWORD">;
  UNEXPECTED_ERROR: import("@better-auth/core/utils/error-codes").RawError<"UNEXPECTED_ERROR">;
  OTP_NOT_FOUND: import("@better-auth/core/utils/error-codes").RawError<"OTP_NOT_FOUND">;
  PHONE_NUMBER_NOT_VERIFIED: import("@better-auth/core/utils/error-codes").RawError<"PHONE_NUMBER_NOT_VERIFIED">;
  PHONE_NUMBER_CANNOT_BE_UPDATED: import("@better-auth/core/utils/error-codes").RawError<"PHONE_NUMBER_CANNOT_BE_UPDATED">;
  SEND_OTP_NOT_IMPLEMENTED: import("@better-auth/core/utils/error-codes").RawError<"SEND_OTP_NOT_IMPLEMENTED">;
};
//#endregion
export { PHONE_NUMBER_ERROR_CODES };