import { emailOTP } from "./index.mjs";
import { EMAIL_OTP_ERROR_CODES } from "./error-codes.mjs";
//#region src/plugins/email-otp/client.d.ts
declare const emailOTPClient: () => {
  id: "email-otp";
  version: string;
  $InferServerPlugin: ReturnType<typeof emailOTP>;
  atomListeners: {
    matcher: (path: string) => path is "/email-otp/verify-email" | "/sign-in/email-otp" | "/email-otp/request-email-change";
    signal: "$sessionSignal";
  }[];
  $ERROR_CODES: {
    OTP_EXPIRED: import("@better-auth/core/utils/error-codes").RawError<"OTP_EXPIRED">;
    INVALID_OTP: import("@better-auth/core/utils/error-codes").RawError<"INVALID_OTP">;
    TOO_MANY_ATTEMPTS: import("@better-auth/core/utils/error-codes").RawError<"TOO_MANY_ATTEMPTS">;
  };
};
//#endregion
export { EMAIL_OTP_ERROR_CODES, emailOTPClient };