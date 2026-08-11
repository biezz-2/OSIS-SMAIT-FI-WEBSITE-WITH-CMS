import type { ServerResponse } from 'node:http';
import { JSON_RPC_ERRORS } from './jsonRpcErrors';
export declare const sendJsonRpcError: (res: ServerResponse, errorKey: keyof typeof JSON_RPC_ERRORS, customMessage?: string) => void;
//# sourceMappingURL=sendJsonRpcError.d.ts.map