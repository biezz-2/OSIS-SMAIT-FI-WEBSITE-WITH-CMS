//#region src/plugins/haveibeenpwned/index.d.ts
declare module "@better-auth/core" {
  interface BetterAuthPluginRegistry<AuthOptions, Options> {
    "have-i-been-pwned": {
      creator: typeof haveIBeenPwned;
    };
  }
}
interface HaveIBeenPwnedOptions {
  /**
   * Custom error message shown when a compromised password is detected.
   */
  customPasswordCompromisedMessage?: string | undefined;
  /**
   * Paths to check for password
   *
   * @default ["/sign-up/email", "/change-password", "/reset-password", "/email-otp/reset-password", "/phone-number/reset-password", "/admin/create-user", "/admin/set-user-password"]
   */
  paths?: string[];
  /**
   * Enable or disable password checks against the HIBP database.
   *
   * @default true
   */
  enabled?: boolean | undefined;
}
declare const haveIBeenPwned: (options?: HaveIBeenPwnedOptions | undefined) => {
  id: "have-i-been-pwned";
  version: string;
  init(ctx: import("@better-auth/core").AuthContext): {
    context: {
      password: {
        hash(password: string): Promise<string>;
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
    };
  };
  options: HaveIBeenPwnedOptions | undefined;
  $ERROR_CODES: {
    PASSWORD_COMPROMISED: import("@better-auth/core/utils/error-codes").RawError<"PASSWORD_COMPROMISED">;
  };
};
//#endregion
export { HaveIBeenPwnedOptions, haveIBeenPwned };