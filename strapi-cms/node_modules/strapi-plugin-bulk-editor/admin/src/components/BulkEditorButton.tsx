import React, { useState } from 'react';
import { Button } from '@strapi/design-system';
import { Pencil } from '@strapi/icons';
import { BulkEditModal } from './BulkEditModal';

interface BulkEditorButtonProps {
  selectedEntries?: any[];
  model?: string;
}

export const BulkEditorButton: React.FC<BulkEditorButtonProps> = (props) => {
  const [isOpen, setIsOpen] = useState(false);

  // Try to get selected entries from props or context
  const selectedEntries = props.selectedEntries || [];
  const model = props.model || '';

  const handleClick = () => {
    if (selectedEntries && selectedEntries.length > 0) {
      setIsOpen(true);
    }
  };

  // Don't render if no entries are selected
  if (!selectedEntries || selectedEntries.length === 0) {
    return null;
  }

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
          entries={selectedEntries}
          contentType={model}
          onClose={() => setIsOpen(false)}
        />
      )}
    </>
  );
};
