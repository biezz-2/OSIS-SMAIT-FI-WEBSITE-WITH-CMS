import { getDeviceName } from './user-agent.mjs';

/**
 * Sanitizes a session record for client consumption (active devices UI/API).
 * Never includes tokens or internal database identifiers.
 */ const sanitizeSessionEntry = (session, currentSessionId)=>{
    const metadata = session.metadata ?? {};
    return {
        id: session.sessionId,
        deviceId: session.deviceId,
        deviceName: typeof metadata.deviceName === 'string' ? metadata.deviceName : undefined,
        current: Boolean(currentSessionId) && session.sessionId === currentSessionId,
        loginAt: typeof metadata.loginAt === 'string' ? metadata.loginAt : undefined,
        // The active record is re-created on each rotation, so its creation time is the
        // best available "last used" signal without an extra write per request.
        lastActiveAt: session.createdAt ? new Date(session.createdAt).toISOString() : undefined
    };
};
/**
 * Builds origin-defined session metadata from generic request context fields.
 */ const buildSessionMetadata = (params)=>{
    const deviceName = getDeviceName(params.userAgent);
    return {
        loginAt: params.loginAt ?? new Date().toISOString(),
        ...deviceName ? {
            deviceName
        } : {}
    };
};
/**
 * Sorts sessions for display: current session first, then most recently used.
 */ const sortSessionsForDisplay = (sessions)=>[
        ...sessions
    ].sort((a, b)=>{
        if (a.current !== b.current) {
            return a.current ? -1 : 1;
        }
        return (b.lastActiveAt ?? '').localeCompare(a.lastActiveAt ?? '');
    });

export { buildSessionMetadata, sanitizeSessionEntry, sortSessionsForDisplay };
//# sourceMappingURL=sessions.mjs.map
