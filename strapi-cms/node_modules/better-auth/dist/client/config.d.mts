import { BetterAuthClientOptions, ClientAtomListener } from "@better-auth/core";
import { WritableAtom } from "nanostores";
//#region src/client/config.d.ts
declare const getClientConfig: (options?: BetterAuthClientOptions | undefined, loadEnv?: boolean | undefined) => {
  readonly baseURL: string;
  pluginsActions: Record<string, any>;
  pluginsAtoms: Record<string, WritableAtom<any>>;
  pluginPathMethods: Record<string, "GET" | "POST">;
  atomListeners: ClientAtomListener[];
  $fetch: import("@better-fetch/fetch").BetterFetch<{
    plugins: (import("@better-fetch/fetch").BetterFetchPlugin<Record<string, any>> | {
      id: string;
      name: string;
      hooks: {
        onSuccess(context: import("@better-fetch/fetch").SuccessContext<any>): void;
      };
    } | {
      id: string;
      name: string;
      hooks: {
        onSuccess: ((context: import("@better-fetch/fetch").SuccessContext<any>) => Promise<void> | void) | undefined;
        onError: ((context: import("@better-fetch/fetch").ErrorContext) => Promise<void> | void) | undefined;
        onRequest: (<T extends Record<string, any>>(context: import("@better-fetch/fetch").RequestContext<T>) => Promise<import("@better-fetch/fetch").RequestContext | void> | import("@better-fetch/fetch").RequestContext | void) | undefined;
        onResponse: ((context: import("@better-fetch/fetch").ResponseContext) => Promise<Response | void | import("@better-fetch/fetch").ResponseContext> | Response | import("@better-fetch/fetch").ResponseContext | void) | undefined;
      };
    })[];
    priority?: RequestPriority | undefined;
    cache?: RequestCache | undefined;
    credentials?: RequestCredentials;
    integrity?: string | undefined;
    keepalive?: boolean | undefined;
    method: string;
    mode?: RequestMode | undefined;
    redirect?: RequestRedirect | undefined;
    referrer?: string | undefined;
    referrerPolicy?: ReferrerPolicy | undefined;
    signal?: (AbortSignal | null) | undefined;
    window?: null | undefined;
    onRetry?: ((response: import("@better-fetch/fetch").ResponseContext) => Promise<void> | void) | undefined;
    hookOptions?: {
      cloneResponse?: boolean;
    } | undefined;
    timeout?: number | undefined;
    customFetchImpl: import("@better-fetch/fetch").FetchEsque;
    baseURL: string;
    throw?: boolean | undefined;
    auth?: ({
      type: "Bearer";
      token: string | Promise<string | undefined> | (() => string | Promise<string | undefined> | undefined) | undefined;
    } | {
      type: "Basic";
      username: string | (() => string | undefined) | undefined;
      password: string | (() => string | undefined) | undefined;
    } | {
      type: "Custom";
      prefix: string | (() => string | undefined) | undefined;
      value: string | (() => string | undefined) | undefined;
    }) | undefined;
    headers?: {} | {
      [x: string]: string | undefined;
      accept?: ((string & {}) | "application/json" | "text/plain" | "application/octet-stream") | undefined;
      "content-type"?: ((string & {}) | "application/x-www-form-urlencoded" | "application/json" | "text/plain" | "application/octet-stream" | "multipart/form-data") | undefined;
      authorization?: ((string & {}) | `Bearer ${string}` | `Basic ${string}`) | undefined;
    } | undefined;
    body?: any;
    query?: any;
    params?: any;
    duplex?: "full" | "half" | undefined;
    jsonParser: (text: string) => Promise<any> | any;
    retry?: import("@better-fetch/fetch").RetryOptions | undefined;
    retryAttempt?: number | undefined;
    output?: (import("@better-fetch/fetch").StandardSchemaV1 | typeof Blob | typeof File) | undefined;
    errorSchema?: import("@better-fetch/fetch").StandardSchemaV1 | undefined;
    disableValidation?: boolean | undefined;
    disableSignal?: boolean | undefined;
  }, unknown, unknown, {}>;
  $store: {
    notify: (signal?: (Omit<string, "$sessionSignal"> | "$sessionSignal") | undefined) => void;
    listen: (signal: Omit<string, "$sessionSignal"> | "$sessionSignal", listener: (value: boolean, oldValue?: boolean | undefined) => void) => void;
    atoms: Record<string, WritableAtom<any>>;
  };
};
//#endregion
export { getClientConfig };