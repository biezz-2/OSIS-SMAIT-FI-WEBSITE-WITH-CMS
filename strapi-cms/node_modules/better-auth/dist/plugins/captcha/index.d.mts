import { BaseCaptchaOptions, CaptchaFoxOptions, CaptchaOptions, CloudflareTurnstileOptions, GoogleRecaptchaOptions, HCaptchaOptions, Provider } from "./types.mjs";
//#region src/plugins/captcha/index.d.ts
declare module "@better-auth/core" {
  interface BetterAuthPluginRegistry<AuthOptions, Options> {
    captcha: {
      creator: typeof captcha;
    };
  }
}
declare const captcha: (options: CaptchaOptions) => {
  id: "captcha";
  version: string;
  $ERROR_CODES: {
    VERIFICATION_FAILED: import("@better-auth/core/utils/error-codes").RawError<"VERIFICATION_FAILED">;
    MISSING_RESPONSE: import("@better-auth/core/utils/error-codes").RawError<"MISSING_RESPONSE">;
    UNKNOWN_ERROR: import("@better-auth/core/utils/error-codes").RawError<"UNKNOWN_ERROR">;
  };
  onRequest: (request: Request, ctx: import("@better-auth/core").AuthContext) => Promise<{
    response: Response;
  } | undefined>;
  options: CaptchaOptions;
};
//#endregion
export { type BaseCaptchaOptions, type CaptchaFoxOptions, type CaptchaOptions, type CloudflareTurnstileOptions, type GoogleRecaptchaOptions, type HCaptchaOptions, type Provider, captcha };