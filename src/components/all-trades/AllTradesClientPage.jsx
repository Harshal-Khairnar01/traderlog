// src/app/all-trades/AllTradesClientPage.jsx
"use client";

import React, { useState, useCallback } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";
import AllTradesTable from "@/components/all-trades/AllTradesTable";
import NewTradeEntryForm from "@/components/new-trade-entry-form/NewTradeEntryForm";
import { useTradeJournal } from "@/hooks/useTradeJournal";

export default function AllTradesClientPage() {
  const {
    tradeHistory,
    loading,
    error,
    addTrade,
    updateTrade,
    deleteTrade,
    loadTrades,
  } = useTradeJournal();

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [tradeToEdit, setTradeToEdit] = useState(null);

  const openAddTradeForm = () => {
    setTradeToEdit(null);
    setIsFormModalOpen(true);
  };

  const openEditTradeForm = useCallback((trade) => {
    setTradeToEdit(trade);
    setIsFormModalOpen(true);
  }, []);

  const closeFormModal = () => {
    setIsFormModalOpen(false);
    setTradeToEdit(null);
    loadTrades();
  };

  const sortedTradeHistory = [...tradeHistory].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  const groupedTrades = {};
  const colors = [
    "bg-gray-100",
    "bg-blue-50",
    "bg-green-50",
    "bg-yellow-50",
    "bg-red-50",
    "bg-purple-50",
  ];

  if (sortedTradeHistory.length > 0) {
    const firstDate = new Date(sortedTradeHistory[0].date);
    sortedTradeHistory.forEach((trade) => {
      const tradeDate = new Date(trade.date);
      const diffTime = Math.abs(tradeDate - firstDate);
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      const groupIndex = Math.floor(diffDays / 3);
      const groupKey = `group-${groupIndex}`;
      if (!groupedTrades[groupKey]) {
        groupedTrades[groupKey] = {
          color: colors[groupIndex % colors.length],
          trades: [],
        };
      }
      groupedTrades[groupKey].trades.push(trade);
    });
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <p className="text-gray-300 text-lg">Loading trade history...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 relative p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-200">All Trade Data</h2>
        <button
          onClick={openAddTradeForm}
          className="px-6 py-2 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors duration-200"
        >
          Add New Trade
        </button>
      </div>

      <AllTradesTable
        groupedTrades={groupedTrades}
        onDeleteTrade={deleteTrade}
        onEditTrade={openEditTradeForm}
      />

      {isFormModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 p-4">
          <div className="relative bg-zinc-800 rounded-lg shadow-xl text-white w-full max-w-4xl max-h-[90vh] mx-auto flex flex-col">
            <NewTradeEntryForm
              addTrade={addTrade}
              updateTrade={updateTrade}
              onClose={closeFormModal}
              tradeToEdit={tradeToEdit}
            />
          </div>
        </div>
      )}
    </div>
  );
}
