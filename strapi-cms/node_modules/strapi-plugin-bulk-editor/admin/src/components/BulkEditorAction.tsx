import React, { useState } from 'react';
import { Button } from '@strapi/design-system';
import { Pencil } from '@strapi/icons';
import { BulkEditModal } from './BulkEditModal';

interface BulkEditorActionProps {
  documents: any[];
  model: string;
}

export const BulkEditorAction: React.FC<BulkEditorActionProps> = ({
  documents = [],
  model = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    if (documents.length === 0) return;
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      <Button
        onClick={handleClick}
        variant="secondary"
        size="S"
        startIcon={<Pencil />}
      >
        Bulk Edit
      </Button>

      {isOpen && (
        <BulkEditModal
          documents={documents}
          contentType={model}
          onClose={handleClose}
        />
      )}
    </>
  );
};
