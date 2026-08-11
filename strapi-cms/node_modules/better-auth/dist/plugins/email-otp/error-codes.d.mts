//#region src/plugins/email-otp/error-codes.d.ts
declare const EMAIL_OTP_ERROR_CODES: {
  OTP_EXPIRED: import("@better-auth/core/utils/error-codes").RawError<"OTP_EXPIRED">;
  INVALID_OTP: import("@better-auth/core/utils/error-codes").RawError<"INVALID_OTP">;
  TOO_MANY_ATTEMPTS: import("@better-auth/core/utils/error-codes").RawError<"TOO_MANY_ATTEMPTS">;
};
//#endregion
export { EMAIL_OTP_ERROR_CODES };