import { useEffect } from 'react';

function useWarnIfUnsavedChanges(enabled) {
    useEffect(()=>{
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

export { useWarnIfUnsavedChanges };
//# sourceMappingURL=useWarnIfUnsavedChanges.mjs.map
