import { USERNAME_ERROR_CODES } from "./error-codes.mjs";
import { username } from "./index.mjs";
//#region src/plugins/username/client.d.ts
declare const usernameClient: () => {
  id: "username";
  version: string;
  $InferServerPlugin: ReturnType<typeof username>;
  atomListeners: {
    matcher: (path: string) => path is "/sign-in/username";
    signal: "$sessionSignal";
  }[];
  $ERROR_CODES: {
    EMAIL_NOT_VERIFIED: import("@better-auth/core/utils/error-codes").RawError<"EMAIL_NOT_VERIFIED">;
    UNEXPECTED_ERROR: import("@better-auth/core/utils/error-codes").RawError<"UNEXPECTED_ERROR">;
    INVALID_USERNAME_OR_PASSWORD: import("@better-auth/core/utils/error-codes").RawError<"INVALID_USERNAME_OR_PASSWORD">;
    USERNAME_IS_ALREADY_TAKEN: import("@better-auth/core/utils/error-codes").RawError<"USERNAME_IS_ALREADY_TAKEN">;
    USERNAME_TOO_SHORT: import("@better-auth/core/utils/error-codes").RawError<"USERNAME_TOO_SHORT">;
    USERNAME_TOO_LONG: import("@better-auth/core/utils/error-codes").RawError<"USERNAME_TOO_LONG">;
    INVALID_USERNAME: import("@better-auth/core/utils/error-codes").RawError<"INVALID_USERNAME">;
    INVALID_DISPLAY_USERNAME: import("@better-auth/core/utils/error-codes").RawError<"INVALID_DISPLAY_USERNAME">;
  };
};
//#endregion
export { USERNAME_ERROR_CODES, usernameClient };