'use strict';

var React = require('react');
var sessionContext = require('./sessionContext.js');

/**
 * Hook to access the current CTB session context.
 *
 * @throws Error if used outside of CTBSessionProvider
 * @returns The CTB session context containing sessionId and regenerateSessionId
 *
 * @example
 * ```tsx
 * const { sessionId, regenerateSessionId } = useCTBSession();
 * ```
 */ const useCTBSession = ()=>{
    const context = React.useContext(sessionContext.CTBSessionContext);
    if (!context) {
        throw new Error('useCTBSession must be used within a CTBSessionProvider');
    }
    return context;
};

exports.useCTBSession = useCTBSession;
//# sourceMappingURL=useCTBSession.js.map
