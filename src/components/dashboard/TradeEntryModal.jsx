// components/dashboard/TradeEntryModal.jsx
import React from "react";
import Modal from "../Modal"; // Ensure this path is correct
import NewTradeEntryForm from "../new-trade-entry-form/NewTradeEntryForm"; // Ensure this path is correct

const TradeEntryModal = ({ show, onClose, onAddTrade }) => {
  if (!show) return null;

  return (
    <Modal onClose={onClose}>
      <NewTradeEntryForm addTrade={onAddTrade} />
    </Modal>
  );
};

export default TradeEntryModal;