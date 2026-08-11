//#region src/env/logger.d.ts
declare const TTY_COLORS: {
  readonly reset: "[0m";
  readonly bright: "[1m";
  readonly dim: "[2m";
  readonly undim: "[22m";
  readonly underscore: "[4m";
  readonly blink: "[5m";
  readonly reverse: "[7m";
  readonly hidden: "[8m";
  readonly fg: {
    readonly black: "[30m";
    readonly red: "[31m";
    readonly green: "[32m";
    readonly yellow: "[33m";
    readonly blue: "[34m";
    readonly magenta: "[35m";
    readonly cyan: "[36m";
    readonly white: "[37m";
  };
  readonly bg: {
    readonly black: "[40m";
    readonly red: "[41m";
    readonly green: "[42m";
    readonly yellow: "[43m";
    readonly blue: "[44m";
    readonly magenta: "[45m";
    readonly cyan: "[46m";
    readonly white: "[47m";
  };
};
type LogLevel = "debug" | "info" | "success" | "warn" | "error";
declare const levels: readonly ["debug", "info", "success", "warn", "error"];
declare function shouldPublishLog(currentLogLevel: LogLevel, logLevel: LogLevel): boolean;
interface Logger {
  disabled?: boolean | undefined;
  disableColors?: boolean | undefined;
  level?: Exclude<LogLevel, "success"> | undefined;
  log?: ((level: Exclude<LogLevel, "success">, message: string, ...args: any[]) => void) | undefined;
}
type LogHandlerParams = Parameters<NonNullable<Logger["log"]>> extends [LogLevel, ...infer Rest] ? Rest : never;
type InternalLogger = { [K in LogLevel]: (...params: LogHandlerParams) => void; } & {
  get level(): LogLevel;
};
declare const createLogger: (options?: Logger | undefined) => InternalLogger;
declare const logger: InternalLogger;
//#endregion
export { InternalLogger, LogHandlerParams, LogLevel, Logger, TTY_COLORS, createLogger, levels, logger, shouldPublishLog };