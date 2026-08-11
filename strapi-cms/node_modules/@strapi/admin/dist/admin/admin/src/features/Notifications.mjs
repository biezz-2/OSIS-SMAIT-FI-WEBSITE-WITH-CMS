import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import * as React from 'react';
import { Box, Alert, Link } from '@strapi/design-system';
import { useIntl } from 'react-intl';
import { toast, Toaster } from 'sonner';

const NotificationsContext = /*#__PURE__*/ React.createContext({
    toggleNotification: ()=>{}
});
/* -------------------------------------------------------------------------------------------------
 * Provider
 * -----------------------------------------------------------------------------------------------*/ /**
 * @internal
 * @description exposes the `NotificationsContext` to its children and renders notifications
 */ const NotificationsProvider = ({ children })=>{
    const toggleNotification = React.useCallback(({ type, message, link, timeout, blockTransition, onClose, title })=>{
        toast.custom((id)=>{
            return /*#__PURE__*/ jsx(Box, {
                width: "50rem",
                maxWidth: "100%",
                children: /*#__PURE__*/ jsx(Notification, {
                    type: type,
                    message: message,
                    title: title,
                    link: link,
                    clearNotification: ()=>{
                        toast.dismiss(id);
                        onClose?.();
                    }
                })
            });
        }, {
            duration: blockTransition ? Infinity : timeout
        });
    }, []);
    const value = React.useMemo(()=>({
            toggleNotification
        }), [
        toggleNotification
    ]);
    return /*#__PURE__*/ jsxs(Fragment, {
        children: [
            /*#__PURE__*/ jsx(Toaster, {
                position: "top-center"
            }),
            /*#__PURE__*/ jsx(NotificationsContext.Provider, {
                value: value,
                children: children
            })
        ]
    });
};
const Notification = ({ clearNotification, link, message, onClose, title, type })=>{
    const { formatMessage } = useIntl();
    const getVariant = ()=>{
        switch(type){
            case 'info':
                return 'default';
            case 'danger':
                return 'danger';
            case 'warning':
                return 'warning';
            default:
                return 'success';
        }
    };
    return /*#__PURE__*/ jsx(Alert, {
        action: link ? /*#__PURE__*/ jsx(Link, {
            href: link.url,
            isExternal: true,
            children: link.label
        }) : undefined,
        onClose: ()=>{
            onClose?.();
            clearNotification();
        },
        closeLabel: formatMessage({
            id: 'global.close',
            defaultMessage: 'Close'
        }),
        title: title,
        variant: getVariant(),
        children: message
    });
};
/* -------------------------------------------------------------------------------------------------
 * Hook
 * -----------------------------------------------------------------------------------------------*/ /**
 * @preserve
 * @description Returns an object to interact with the notification
 * system. The callbacks are wrapped in `useCallback` for a stable
 * identity.
 *
 * @example
 * ```tsx
 * import { useNotification } from '@strapi/strapi/admin';
 *
 * const MyComponent = () => {
 *  const { toggleNotification } = useNotification();
 *
 *  return <button onClick={() => toggleNotification({ message: 'Hello world!' })}>Click me</button>;
 */ const useNotification = ()=>React.useContext(NotificationsContext);

export { NotificationsProvider, useNotification };
//# sourceMappingURL=Notifications.mjs.map
