import { DesignSystemProvider } from '@strapi/design-system';
import { Pencil } from '@strapi/icons';
import { useFetchClient, useNotification } from '@strapi/strapi/admin';
import React from 'react';
import { ModalManager, openBulkEditModal } from './components/ModalManager';

let modalMounted = false;

async function mountModalManager() {
  if (modalMounted) return;
  modalMounted = true;

  // Dynamic import to avoid ESM/CJS issues at parse time
  const ReactDOMClient = await import('react-dom/client');

  const modalRoot = document.createElement('div');
  modalRoot.id = 'bulk-editor-modal-root';
  document.body.appendChild(modalRoot);

  const root = ReactDOMClient.createRoot(modalRoot);
  root.render(
    <DesignSystemProvider locale="en">
      <ModalManager />
    </DesignSystemProvider>
  );
}

export default {
  register(app: any) {
    app.registerPlugin({
      id: 'bulk-editor',
      name: 'Bulk Editor',
    });
  },

  bootstrap(app: any) {
    // Mount the modal manager
    mountModalManager();

    const contentManager = app.getPlugin('content-manager');

    if (contentManager && contentManager.apis) {
      contentManager.apis.addBulkAction([
        function BulkEditAction({ documents, model }: { documents: any[]; model: string }) {
          const toggleNotification = useNotification();
          const fetchClient = useFetchClient();

          const handleClick = () => {
            openBulkEditModal(documents, model, toggleNotification, fetchClient);
          };

          return {
            label: 'Bulk Edit',
            icon: <Pencil />,
            onClick: handleClick,
          };
        },
      ]);
    }
  },

  async registerTrads(app: any) {
    return [];
  },
};
