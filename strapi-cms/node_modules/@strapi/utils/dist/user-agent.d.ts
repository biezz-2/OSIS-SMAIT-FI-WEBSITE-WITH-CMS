/**
 * Minimal, dependency-free User-Agent parsing.
 *
 * This is intentionally heuristic and only aims to produce a human-readable label
 * (e.g. "Chrome on macOS") for displaying active sessions/devices. It is not a full
 * UA parser and should not be relied upon for feature detection.
 */
export interface ParsedUserAgent {
    browser?: string;
    os?: string;
    /** Human-readable label combining browser and OS, e.g. "Chrome on macOS". */
    deviceName?: string;
}
/**
 * Parses a User-Agent string into a best-effort browser/OS and a display label.
 * Returns an empty object when the input is missing or unrecognized.
 */
export declare const parseUserAgent: (userAgent?: string | null) => ParsedUserAgent;
/**
 * Convenience helper returning only the human-readable device label, or undefined.
 */
export declare const getDeviceName: (userAgent?: string | null) => string | undefined;
//# sourceMappingURL=user-agent.d.ts.map