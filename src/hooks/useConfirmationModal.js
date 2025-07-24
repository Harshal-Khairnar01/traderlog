// src/hooks/useConfirmationModal.js
import { useState, useCallback } from "react";

export const useConfirmationModal = (onConfirmAction) => {
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const openConfirmation = useCallback((id, name) => {
    setItemToDelete({ id, name });
    setIsConfirmModalOpen(true);
  }, []);

  const confirmAction = useCallback(() => {
    if (itemToDelete) {
      onConfirmAction(itemToDelete.id);
      setItemToDelete(null);
    }
    setIsConfirmModalOpen(false);
  }, [itemToDelete, onConfirmAction]);

  const cancelAction = useCallback(() => {
    setItemToDelete(null);
    setIsConfirmModalOpen(false);
  }, []);

  return {
    isConfirmModalOpen,
    itemToDelete,
    openConfirmation,
    confirmAction,
    cancelAction,
  };
};