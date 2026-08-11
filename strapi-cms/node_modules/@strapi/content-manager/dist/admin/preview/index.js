'use strict';

var PreviewSidePanel = require('./components/PreviewSidePanel.js');

const previewAdmin = {
    bootstrap (app) {
        const contentManagerPluginApis = app.getPlugin('content-manager').apis;
        contentManagerPluginApis.addEditViewSidePanel((panels)=>{
            // Insert PreviewSidePanel after the actions panel
            const actionsPanelIndex = panels.findIndex((panel)=>panel.type === 'actions');
            return [
                ...panels.slice(0, actionsPanelIndex + 1),
                PreviewSidePanel.PreviewSidePanel,
                ...panels.slice(actionsPanelIndex + 1)
            ];
        });
    }
};

exports.previewAdmin = previewAdmin;
//# sourceMappingURL=index.js.map
