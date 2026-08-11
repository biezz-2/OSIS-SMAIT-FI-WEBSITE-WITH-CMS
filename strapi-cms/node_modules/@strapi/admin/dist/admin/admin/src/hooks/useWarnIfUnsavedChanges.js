'use strict';

var React = require('react');

function useWarnIfUnsavedChanges(enabled) {
    React.useEffect(()=>{
        if (!enabled) return;
        const handleBeforeUnload = (e)=>{
            e.preventDefault();
            e.returnValue = '';
            return '';
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return ()=>window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [
        enabled
    ]);
}

exports.useWarnIfUnsavedChanges = useWarnIfUnsavedChanges;
//# sourceMappingURL=useWarnIfUnsavedChanges.js.map
