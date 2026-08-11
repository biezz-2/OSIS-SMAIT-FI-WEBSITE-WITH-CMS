import { AdditionalSessionFieldsInput } from "../../types/models.mjs";
import "../../types/index.mjs";
import { BetterAuthOptions } from "@better-auth/core";
import * as z from "zod";
//#region src/api/routes/update-session.d.ts
declare const updateSession: <O extends BetterAuthOptions>() => import("better-call").StrictEndpoint<"/update-session", {
  method: "POST";
  operationId: string;
  body: z.ZodRecord<z.ZodString, z.ZodAny>;
  use: ((inputContext: import("better-call").MiddlewareInputContext<import("better-call").MiddlewareOptions>) => Promise<{
    session: {
      session: Record<string, any> & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        expiresAt: Date;
        token: string;
        ipAddress?: string | null | undefined;
        userAgent?: string | null | undefined;
      };
      user: Record<string, any> & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        emailVerified: boolean;
        name: string;
        image?: string | null | undefined;
      };
    };
  }>)[];
  metadata: {
    $Infer: {
      body: Partial<AdditionalSessionFieldsInput<O>>;
    };
    openapi: {
      operationId: string;
      description: string;
      responses: {
        "200": {
          description: string;
          content: {
            "application/json": {
              schema: {
                type: "object";
                properties: {
                  session: {
                    type: string;
                    $ref: string;
                  };
                };
              };
            };
          };
        };
      };
    };
  };
}, {
  session: {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    expiresAt: Date;
    token: string;
    ipAddress?: string | null | undefined;
    userAgent?: string | null | undefined;
  };
}>;
//#endregion
export { updateSession };