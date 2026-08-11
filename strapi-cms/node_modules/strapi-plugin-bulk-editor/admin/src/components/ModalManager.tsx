import React, { useState, useEffect } from 'react';
import { BulkEditModal } from './BulkEditModal';

interface ModalData {
  isOpen: boolean;
  documents: any[];
  model: string;
  notificationFn?: any;
  fetchClient?: any;
}

// Event emitter for modal
const modalEmitter = {
  listeners: [] as Array<(data: ModalData) => void>,
  emit(data: ModalData) {
    this.listeners.forEach(listener => listener(data));
  },
  subscribe(listener: (data: ModalData) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }
};

export const openBulkEditModal = (documents: any[], model: string, notificationFn: any, fetchClient: any) => {
  modalEmitter.emit({ isOpen: true, documents, model, notificationFn, fetchClient });
};

export const ModalManager: React.FC = () => {
  const [modalState, setModalState] = useState<ModalData>({
    isOpen: false,
    documents: [],
    model: '',
    notificationFn: null,
    fetchClient: null,
  });

  useEffect(() => {
    const unsubscribe = modalEmitter.subscribe((data) => {
      setModalState(data);
    });

    return unsubscribe;
  }, []);

  if (!modalState.isOpen || !modalState.notificationFn || !modalState.fetchClient) {
    return null;
  }

  return (
    <BulkEditModal
      documents={modalState.documents}
      contentType={modalState.model}
      onClose={() => setModalState({ isOpen: false, documents: [], model: '', notificationFn: null, fetchClient: null })}
      notificationFn={modalState.notificationFn}
      fetchClient={modalState.fetchClient}
    />
  );
};
