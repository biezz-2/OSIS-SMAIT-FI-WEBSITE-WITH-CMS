import { schema } from "./schema.mjs";
import { AnonymousOptions, AnonymousSession, UserWithAnonymous } from "./types.mjs";
import { anonymous } from "./index.mjs";
import { ANONYMOUS_ERROR_CODES } from "./error-codes.mjs";
//#region src/plugins/anonymous/client.d.ts
declare const anonymousClient: () => {
  id: "anonymous";
  version: string;
  $InferServerPlugin: ReturnType<typeof anonymous>;
  pathMethods: {
    "/sign-in/anonymous": "POST";
    "/delete-anonymous-user": "POST";
  };
  atomListeners: {
    matcher: (path: string) => path is "/sign-in/anonymous";
    signal: "$sessionSignal";
  }[];
  $ERROR_CODES: {
    FAILED_TO_CREATE_USER: import("@better-auth/core/utils/error-codes").RawError<"FAILED_TO_CREATE_USER">;
    INVALID_EMAIL_FORMAT: import("@better-auth/core/utils/error-codes").RawError<"INVALID_EMAIL_FORMAT">;
    COULD_NOT_CREATE_SESSION: import("@better-auth/core/utils/error-codes").RawError<"COULD_NOT_CREATE_SESSION">;
    ANONYMOUS_USERS_CANNOT_SIGN_IN_AGAIN_ANONYMOUSLY: import("@better-auth/core/utils/error-codes").RawError<"ANONYMOUS_USERS_CANNOT_SIGN_IN_AGAIN_ANONYMOUSLY">;
    FAILED_TO_DELETE_ANONYMOUS_USER: import("@better-auth/core/utils/error-codes").RawError<"FAILED_TO_DELETE_ANONYMOUS_USER">;
    FAILED_TO_DELETE_ANONYMOUS_USER_SESSIONS: import("@better-auth/core/utils/error-codes").RawError<"FAILED_TO_DELETE_ANONYMOUS_USER_SESSIONS">;
    USER_IS_NOT_ANONYMOUS: import("@better-auth/core/utils/error-codes").RawError<"USER_IS_NOT_ANONYMOUS">;
    DELETE_ANONYMOUS_USER_DISABLED: import("@better-auth/core/utils/error-codes").RawError<"DELETE_ANONYMOUS_USER_DISABLED">;
  };
};
//#endregion
export { ANONYMOUS_ERROR_CODES, type AnonymousOptions, type AnonymousSession, type UserWithAnonymous, anonymousClient, type schema };