import { PreviewSidePanel } from './components/PreviewSidePanel.mjs';

const previewAdmin = {
    bootstrap (app) {
        const contentManagerPluginApis = app.getPlugin('content-manager').apis;
        contentManagerPluginApis.addEditViewSidePanel((panels)=>{
            // Insert PreviewSidePanel after the actions panel
            const actionsPanelIndex = panels.findIndex((panel)=>panel.type === 'actions');
            return [
                ...panels.slice(0, actionsPanelIndex + 1),
                PreviewSidePanel,
                ...panels.slice(actionsPanelIndex + 1)
            ];
        });
    }
};

export { previewAdmin };
//# sourceMappingURL=index.mjs.map
