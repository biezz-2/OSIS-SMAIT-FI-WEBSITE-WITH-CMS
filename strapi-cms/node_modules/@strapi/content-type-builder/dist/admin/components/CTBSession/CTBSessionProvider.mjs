import { jsx } from 'react/jsx-runtime';
import { useState, useCallback, useMemo } from 'react';
import { CTBSessionContext } from './sessionContext.mjs';

/**
 * Generates a unique session identifier for CTB tracking
 * Uses crypto.randomUUID() for guaranteed uniqueness and readability
 *
 * @returns Session ID in format: ctb-{uuid}
 */ const generateSessionId = ()=>{
    if (crypto.randomUUID) {
        return `ctb-${crypto.randomUUID()}`;
    }
};
/**
 * Provider for CTB session tracking context.
 *
 * This provider should wrap components that need to track CTB events with session IDs.
 * It manages the session ID lifecycle and provides methods to regenerate it when needed.
 *
 * Usage:
 * ```tsx
 * <CTBSessionProvider>
 *       {children}
 * </CTBSessionProvider>
 * ```
 */ const CTBSessionProvider = ({ children })=>{
    const [sessionId, setSessionId] = useState(()=>generateSessionId());
    const regenerateSessionId = useCallback(()=>{
        setSessionId(generateSessionId());
    }, []);
    const value = useMemo(()=>({
            sessionId,
            regenerateSessionId
        }), [
        sessionId,
        regenerateSessionId
    ]);
    return /*#__PURE__*/ jsx(CTBSessionContext.Provider, {
        value: value,
        children: children
    });
};

export { CTBSessionProvider, generateSessionId };
//# sourceMappingURL=CTBSessionProvider.mjs.map
