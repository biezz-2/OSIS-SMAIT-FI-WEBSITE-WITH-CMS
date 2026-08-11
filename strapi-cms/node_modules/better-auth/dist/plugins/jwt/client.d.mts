import { JWKOptions, JWSAlgorithms, Jwk, JwtOptions } from "./types.mjs";
import { jwt } from "./index.mjs";
import { JSONWebKeySet } from "jose";
//#region src/plugins/jwt/client.d.ts
interface JwtClientOptions {
  jwks?: {
    /**
     * The path of the endpoint exposing the JWKS.
     * Must match the server configuration.
     *
     * @default /jwks
     */
    jwksPath?: string;
  };
}
declare const jwtClient: (options?: JwtClientOptions) => {
  id: "better-auth-client";
  version: string;
  $InferServerPlugin: ReturnType<typeof jwt>;
  pathMethods: {
    [x: string]: "GET";
  };
  getActions: ($fetch: import("@better-fetch/fetch").BetterFetch) => {
    jwks: (fetchOptions?: any) => Promise<{
      data: null;
      error: {
        message?: string | undefined;
        status: number;
        statusText: string;
      };
    } | {
      data: JSONWebKeySet;
      error: null;
    }>;
  };
};
//#endregion
export { type JWKOptions, type JWSAlgorithms, type Jwk, type JwtOptions, jwtClient };