
import { useState, useCallback } from "react";

export const useTradeDetailModal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [isSimpleTextModal, setIsSimpleTextModal] = useState(false);

  const openDetailedModal = useCallback((trade) => {
    setModalContent(trade);
    setIsSimpleTextModal(false);
    setIsModalOpen(true);
  }, []);

  const openTruncatedContentModal = useCallback((title, content) => {
    setModalContent({ title: title, content: content });
    setIsSimpleTextModal(true);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setModalContent(null);
    setIsSimpleTextModal(false);
  }, []);

  return {
    isModalOpen,
    modalContent,
    isSimpleTextModal,
    openDetailedModal,
    openTruncatedContentModal,
    closeModal,
  };
};