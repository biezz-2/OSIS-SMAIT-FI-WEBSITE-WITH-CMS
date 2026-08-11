import * as React from 'react';
import type { PanelComponent } from '../../../content-manager';
interface PanelDescription {
    title: string;
    content: React.ReactNode;
}
declare const Panels: ({ withActions }: {
    withActions?: boolean;
}) => import("react/jsx-runtime").JSX.Element;
declare const ActionsPanel: PanelComponent;
declare const ActionsPanelContent: () => import("react/jsx-runtime").JSX.Element;
declare const usePanelsContext: <Selected, ShouldThrow extends boolean = true>(consumerName: string, selector: (value: {
    visiblePanels: (PanelDescription & {
        id: string;
    })[];
    setVisiblePanels: React.Dispatch<React.SetStateAction<(PanelDescription & {
        id: string;
    })[]>>;
}) => Selected, shouldThrowOnMissingContext?: ShouldThrow | undefined) => ShouldThrow extends true ? Selected : Selected | undefined;
declare const PanelsProvider: ({ children }: React.PropsWithChildren) => import("react/jsx-runtime").JSX.Element;
export { Panels, ActionsPanel, ActionsPanelContent, PanelsProvider, usePanelsContext };
export type { PanelDescription };
