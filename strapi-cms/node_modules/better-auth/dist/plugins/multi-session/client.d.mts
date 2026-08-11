import { MULTI_SESSION_ERROR_CODES } from "./error-codes.mjs";
import { MultiSessionConfig, multiSession } from "./index.mjs";
//#region src/plugins/multi-session/client.d.ts
declare const multiSessionClient: () => {
  id: "multi-session";
  version: string;
  $InferServerPlugin: ReturnType<typeof multiSession>;
  atomListeners: {
    matcher(path: string): path is "/multi-session/set-active";
    signal: "$sessionSignal";
  }[];
  $ERROR_CODES: {
    INVALID_SESSION_TOKEN: import("@better-auth/core/utils/error-codes").RawError<"INVALID_SESSION_TOKEN">;
  };
};
//#endregion
export { MULTI_SESSION_ERROR_CODES, type MultiSessionConfig, multiSessionClient };