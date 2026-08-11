import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import * as React from 'react';
import { createContext, useQueryParams, useStrapiApp, DescriptionComponentRenderer, useIsDesktop } from '@strapi/admin/strapi-admin';
import { Flex, Typography } from '@strapi/design-system';
import { useIntl } from 'react-intl';
import { useMatch } from 'react-router-dom';
import { InjectionZone } from '../../../components/InjectionZone.mjs';
import { useDoc } from '../../../hooks/useDocument.mjs';
import { CLONE_PATH } from '../../../router.mjs';
import { DocumentActions } from './DocumentActions.mjs';

const PanelsItems = ({ panels, setVisiblePanels, visiblePanelsLength })=>{
    React.useEffect(()=>{
        if (setVisiblePanels && visiblePanelsLength !== panels.length) {
            setVisiblePanels(panels);
        }
    }, [
        panels,
        panels.length,
        setVisiblePanels,
        visiblePanelsLength
    ]);
    return /*#__PURE__*/ jsx(Fragment, {
        children: panels.map(({ content, id, ...description })=>/*#__PURE__*/ jsx(Panel, {
                ...description,
                children: content
            }, id))
    });
};
/* -------------------------------------------------------------------------------------------------
 * Panels
 * -----------------------------------------------------------------------------------------------*/ const Panels = ({ withActions = true })=>{
    const isCloning = useMatch(CLONE_PATH) !== null;
    const [{ query: { status } }] = useQueryParams({
        status: 'draft'
    });
    const { model, id, document, meta, collectionType } = useDoc();
    const plugins = useStrapiApp('Panels', (state)=>state.plugins);
    // Optional context consumer
    const setVisiblePanels = usePanelsContext('Panels', (s)=>s.setVisiblePanels, false);
    const visiblePanels = usePanelsContext('Panels', (s)=>s.visiblePanels, false);
    const allPanels = plugins['content-manager'].apis.getEditViewSidePanels();
    const filteredPanels = allPanels.filter((panel)=>panel.type !== 'actions');
    const panelsToDisplay = withActions ? allPanels : filteredPanels;
    const props = {
        activeTab: status,
        model,
        documentId: id,
        document: isCloning ? undefined : document,
        meta: isCloning ? undefined : meta,
        collectionType
    };
    return /*#__PURE__*/ jsx(Flex, {
        direction: "column",
        alignItems: "stretch",
        gap: 2,
        children: /*#__PURE__*/ jsx(DescriptionComponentRenderer, {
            props: props,
            descriptions: panelsToDisplay,
            children: (panels)=>/*#__PURE__*/ jsx(PanelsItems, {
                    panels: panels,
                    setVisiblePanels: setVisiblePanels,
                    visiblePanelsLength: visiblePanels?.length
                })
        })
    });
};
/* -------------------------------------------------------------------------------------------------
 * Default Action Panels (CE)
 * -----------------------------------------------------------------------------------------------*/ const ActionsPanel = ()=>{
    const { formatMessage } = useIntl();
    return {
        title: formatMessage({
            id: 'content-manager.containers.edit.panels.default.title',
            defaultMessage: 'Entry'
        }),
        content: /*#__PURE__*/ jsx(ActionsPanelContent, {})
    };
};
ActionsPanel.type = 'actions';
const ActionsPanelContent = ()=>{
    const isCloning = useMatch(CLONE_PATH) !== null;
    const [{ query: { status = 'draft' } }] = useQueryParams();
    const { model, id, document, meta, collectionType } = useDoc();
    const plugins = useStrapiApp('ActionsPanel', (state)=>state.plugins);
    const props = {
        activeTab: status,
        model,
        documentId: id,
        document: isCloning ? undefined : document,
        meta: isCloning ? undefined : meta,
        collectionType
    };
    return /*#__PURE__*/ jsxs(Flex, {
        direction: "column",
        gap: 2,
        width: "100%",
        children: [
            /*#__PURE__*/ jsx(DescriptionComponentRenderer, {
                props: props,
                descriptions: plugins['content-manager'].apis.getDocumentActions('panel'),
                children: (actions)=>/*#__PURE__*/ jsx(DocumentActions, {
                        actions: actions
                    })
            }),
            /*#__PURE__*/ jsx(InjectionZone, {
                area: "editView.right-links",
                slug: model
            })
        ]
    });
};
const Panel = /*#__PURE__*/ React.forwardRef(({ children, title }, ref)=>{
    const isDesktop = useIsDesktop();
    return /*#__PURE__*/ jsxs(Flex, {
        ref: ref,
        tag: "aside",
        "aria-labelledby": "additional-information",
        background: {
            initial: 'transparent',
            large: 'neutral0'
        },
        borderColor: {
            initial: 'transparent',
            large: 'neutral150'
        },
        hasRadius: isDesktop,
        padding: {
            initial: 0,
            large: 4
        },
        shadow: {
            initial: 'none',
            large: 'tableShadow'
        },
        gap: {
            initial: 4,
            large: 3
        },
        direction: "column",
        justifyContent: "stretch",
        alignItems: "flex-start",
        children: [
            /*#__PURE__*/ jsx(Typography, {
                tag: "h2",
                variant: "sigma",
                textTransform: "uppercase",
                textColor: "neutral600",
                children: title
            }),
            children
        ]
    });
});
/* -------------------------------------------------------------------------------------------------
 * PanelsContext
 * -----------------------------------------------------------------------------------------------*/ const [PanelsProviderImpl, usePanelsContext] = createContext('PanelsContext');
const PanelsProvider = ({ children })=>{
    const [visiblePanels, setVisiblePanels] = React.useState([]);
    return /*#__PURE__*/ jsx(PanelsProviderImpl, {
        visiblePanels: visiblePanels,
        setVisiblePanels: setVisiblePanels,
        children: children
    });
};

export { ActionsPanel, ActionsPanelContent, Panels, PanelsProvider, usePanelsContext };
//# sourceMappingURL=Panels.mjs.map
