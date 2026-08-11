import * as z from "zod";
//#region src/api/routes/callback.d.ts
declare const callbackOAuth: import("better-call").StrictEndpoint<"/callback/:id", {
  method: ("GET" | "POST")[];
  operationId: string;
  body: z.ZodOptional<z.ZodObject<{
    code: z.ZodOptional<z.ZodString>;
    error: z.ZodOptional<z.ZodString>;
    device_id: z.ZodOptional<z.ZodString>;
    error_description: z.ZodOptional<z.ZodString>;
    state: z.ZodOptional<z.ZodString>;
    user: z.ZodOptional<z.ZodString>;
  }, z.core.$strip>>;
  query: z.ZodOptional<z.ZodObject<{
    code: z.ZodOptional<z.ZodString>;
    error: z.ZodOptional<z.ZodString>;
    device_id: z.ZodOptional<z.ZodString>;
    error_description: z.ZodOptional<z.ZodString>;
    state: z.ZodOptional<z.ZodString>;
    user: z.ZodOptional<z.ZodString>;
  }, z.core.$strip>>;
  metadata: {
    allowedMediaTypes: string[];
    scope: "server";
  };
}, never>;
//#endregion
export { callbackOAuth };