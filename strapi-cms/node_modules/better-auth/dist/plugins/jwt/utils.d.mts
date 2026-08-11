import { Jwk, JwtOptions } from "./types.mjs";
import { GenericEndpointContext } from "@better-auth/core";
//#region src/plugins/jwt/utils.d.ts
/**
 * Converts an expirationTime to ISO seconds expiration time (the format of JWT exp)
 *
 * See https://github.com/panva/jose/blob/main/src/lib/jwt_claims_set.ts#L245
 *
 * @param expirationTime - see options.jwt.expirationTime
 * @param iat - the iat time to consolidate on
 * @returns
 */
declare function toExpJWT(expirationTime: number | Date | string, iat: number): number;
declare function generateExportedKeyPair(options?: JwtOptions | undefined): Promise<{
  publicWebKey: import("jose").JWK;
  privateWebKey: import("jose").JWK;
  alg: "EdDSA" | "ES256" | "ES512" | "PS256" | "RS256";
  cfg: {
    crv?: "Ed25519" | undefined;
  } | {
    crv?: never | undefined;
  } | {
    crv?: never | undefined;
  } | {
    modulusLength?: number | undefined;
  } | {
    modulusLength?: number | undefined;
  };
}>;
/**
 * Creates a Jwk on the database
 *
 * @param ctx
 * @param options
 * @returns
 */
declare function createJwk(ctx: GenericEndpointContext, options?: JwtOptions | undefined): Promise<Jwk>;
//#endregion
export { createJwk, generateExportedKeyPair, toExpJWT };