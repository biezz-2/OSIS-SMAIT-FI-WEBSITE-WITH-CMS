export interface SessionEntryLike {
    sessionId: string;
    deviceId?: string;
    createdAt?: Date | string | null;
    metadata?: Record<string, unknown> | null;
}
export interface SanitizedSessionEntry {
    id: string;
    deviceId?: string;
    deviceName?: string;
    current: boolean;
    loginAt?: string;
    lastActiveAt?: string;
}
export interface SessionDisplayEntry {
    current: boolean;
    lastActiveAt?: string;
}
/**
 * Sanitizes a session record for client consumption (active devices UI/API).
 * Never includes tokens or internal database identifiers.
 */
export declare const sanitizeSessionEntry: (session: SessionEntryLike, currentSessionId?: string) => SanitizedSessionEntry;
/**
 * Builds origin-defined session metadata from generic request context fields.
 */
export declare const buildSessionMetadata: (params: {
    userAgent?: string | null;
    loginAt?: string;
}) => Record<string, unknown>;
/**
 * Sorts sessions for display: current session first, then most recently used.
 */
export declare const sortSessionsForDisplay: <T extends SessionDisplayEntry>(sessions: T[]) => T[];
//# sourceMappingURL=sessions.d.ts.map