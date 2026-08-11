import { OAUTH_POPUP_DATA_ELEMENT_ID, OAUTH_POPUP_MESSAGE_TYPE, POPUP_MARKER_COOKIE } from "./constants.mjs";
import { OAUTH_POPUP_ERROR_CODES } from "./error-codes.mjs";
import { OAuthPopupData, OAuthPopupMessage } from "./types.mjs";
import * as z from "zod";
//#region src/plugins/oauth-popup/index.d.ts
declare module "@better-auth/core" {
  interface BetterAuthPluginRegistry<AuthOptions, Options> {
    "oauth-popup": {
      creator: typeof oauthPopup;
    };
  }
}
/**
 * The completion-page script.
 */
declare const OAUTH_POPUP_COMPLETE_SCRIPT: string;
/**
 * sha256 of `OAUTH_POPUP_COMPLETE_SCRIPT`, pinned in the completion CSP.
 */
declare const OAUTH_POPUP_SCRIPT_CSP_HASH = "sha256-tIo2K8VBC9SnhvdZ+9GsGkQoZm+jm/JcxL+d+i8b8KQ=";
/**
 * Server plugin for popup-based OAuth. `signIn.popup` navigates the popup to
 * `/oauth-popup/start`; on the OAuth callback this plugin swaps the redirect for
 * a page that posts the session token (or error) back to the opener. Pair with
 * the `bearer` plugin and `oauthPopupClient`.
 */
declare const oauthPopup: () => {
  id: "oauth-popup";
  version: string;
  $ERROR_CODES: {
    POPUP_SIGN_IN_FAILED: import("@better-auth/core/utils/error-codes").RawError<"POPUP_SIGN_IN_FAILED">;
    POPUP_BLOCKED: import("@better-auth/core/utils/error-codes").RawError<"POPUP_BLOCKED">;
    POPUP_CLOSED: import("@better-auth/core/utils/error-codes").RawError<"POPUP_CLOSED">;
    POPUP_TIMEOUT: import("@better-auth/core/utils/error-codes").RawError<"POPUP_TIMEOUT">;
  };
  endpoints: {
    oauthPopupStart: import("better-call").StrictEndpoint<"/oauth-popup/start", {
      method: "GET";
      query: z.ZodObject<{
        provider: z.ZodString;
        popupOrigin: z.ZodString;
        popupNonce: z.ZodOptional<z.ZodString>;
        callbackURL: z.ZodOptional<z.ZodString>;
        errorCallbackURL: z.ZodOptional<z.ZodString>;
        newUserCallbackURL: z.ZodOptional<z.ZodString>;
        scopes: z.ZodOptional<z.ZodString>;
        requestSignUp: z.ZodOptional<z.ZodString>;
        additionalData: z.ZodOptional<z.ZodString>;
      }, z.core.$strip>;
      metadata: {
        readonly scope: "server";
      };
    }, Response>;
  };
  hooks: {
    after: {
      matcher(context: import("@better-auth/core").HookEndpointContext): boolean;
      handler: (inputContext: import("better-call").MiddlewareInputContext<import("better-call").MiddlewareOptions>) => Promise<void>;
    }[];
  };
};
//#endregion
export { OAUTH_POPUP_COMPLETE_SCRIPT, OAUTH_POPUP_DATA_ELEMENT_ID, OAUTH_POPUP_ERROR_CODES, OAUTH_POPUP_MESSAGE_TYPE, OAUTH_POPUP_SCRIPT_CSP_HASH, type OAuthPopupData, type OAuthPopupMessage, POPUP_MARKER_COOKIE, oauthPopup };