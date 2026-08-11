import type { Context, Next } from 'koa';
/**
 * Middleware to ensure Content-Type Builder modifications only happen in development mode
 * This prevents SQL injection vulnerabilities in production by blocking schema modifications
 * when autoReload is disabled.
 */
declare const _default: (ctx: Context, next: Next) => Promise<void>;
export default _default;
//# sourceMappingURL=is-development-mode.d.ts.map