'use strict';

var jsxRuntime = require('react/jsx-runtime');
var React = require('react');
var sessionContext = require('./sessionContext.js');

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
    const [sessionId, setSessionId] = React.useState(()=>generateSessionId());
    const regenerateSessionId = React.useCallback(()=>{
        setSessionId(generateSessionId());
    }, []);
    const value = React.useMemo(()=>({
            sessionId,
            regenerateSessionId
        }), [
        sessionId,
        regenerateSessionId
    ]);
    return /*#__PURE__*/ jsxRuntime.jsx(sessionContext.CTBSessionContext.Provider, {
        value: value,
        children: children
    });
};

exports.CTBSessionProvider = CTBSessionProvider;
exports.generateSessionId = generateSessionId;
//# sourceMappingURL=CTBSessionProvider.js.map
