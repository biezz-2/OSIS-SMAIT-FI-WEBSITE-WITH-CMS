import { Auth } from "../types/auth.mjs";
import "../types/index.mjs";
import { IncomingHttpHeaders } from "node:http";
//#region src/integrations/node.d.ts
declare const toNodeHandler: (auth: {
  handler: Auth["handler"];
} | Auth["handler"]) => (req: import("node:http").IncomingMessage, res: import("node:http").ServerResponse) => Promise<void>;
declare function fromNodeHeaders(nodeHeaders: IncomingHttpHeaders): Headers;
//#endregion
export { fromNodeHeaders, toNodeHandler };