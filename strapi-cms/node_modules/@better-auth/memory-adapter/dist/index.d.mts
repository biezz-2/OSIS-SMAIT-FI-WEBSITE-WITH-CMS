import { DBAdapterDebugLogOption } from "@better-auth/core/db/adapter";
import { BetterAuthOptions } from "@better-auth/core";
//#region src/memory-adapter.d.ts
interface MemoryDB {
  [key: string]: any[];
}
interface MemoryAdapterConfig {
  debugLogs?: DBAdapterDebugLogOption | undefined;
}
declare const memoryAdapter: (db: MemoryDB, config?: MemoryAdapterConfig | undefined) => (options: BetterAuthOptions) => import("@better-auth/core/db/adapter").DBAdapter<BetterAuthOptions>;
//#endregion
export { type MemoryAdapterConfig, type MemoryDB, memoryAdapter };