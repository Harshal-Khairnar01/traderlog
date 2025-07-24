// components/AllTradesClientPage.jsx
"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import AllTradesTable from "@/components/AllTradesTable";
import NewTradeEntryForm from "@/components/NewTradeEntryForm"; // Import the form component

export default function AllTradesClientPage() {
  const [tradeHistory, setTradeHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false); // State to control form modal visibility
  const [tradeToEdit, setTradeToEdit] = useState(null); // State to hold the trade being edited

  const calculateGrossPnl = (trade) => {
    if (trade.entryPrice && trade.exitPrice && trade.quantity) {
      if (trade.direction === "Long") {
        return (trade.exitPrice - trade.entryPrice) * trade.quantity;
      } else if (trade.direction === "Short") {
        return (trade.entryPrice - trade.exitPrice) * trade.quantity;
      }
    }
    return 0;
  };

  const getTradeCharges = (trade) => {
    return trade.charges ?? 0;
  };

  // Function to load trades from localStorage
  const loadTrades = useCallback(() => {
    try {
      setLoading(true);
      const savedTrades = localStorage.getItem("tradeJournalData");
      if (savedTrades) {
        const parsedTrades = JSON.parse(savedTrades);

        const enhancedTrades = parsedTrades.map((trade) => ({
          ...trade,
          // Ensure each trade has a unique ID. If not present, create one.
          // This is crucial for reliable deletion and editing.
          id: trade.id || crypto.randomUUID(),
          grossPnl: calculateGrossPnl(trade),
          charges: getTradeCharges(trade),
          // Ensure confidenceLevel has a default if missing
          confidenceLevel: trade.confidenceLevel || "5",
        }));
        setTradeHistory(enhancedTrades);
      } else {
        setTradeHistory([]); // If no trades, initialize as empty array
      }
    } catch (err) {
      console.error(
        "Failed to load or parse trade history from localStorage:",
        err
      );
      setError("Error loading trade data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTrades(); // Load trades when the component mounts
  }, [loadTrades]);

  // Function to save trades to localStorage
  const saveTradesToLocalStorage = useCallback((tradesToSave) => {
    localStorage.setItem("tradeJournalData", JSON.stringify(tradesToSave));
  }, []);

  // Function to add a new trade
  const addTrade = useCallback((newTrade) => {
    setTradeHistory((prevTrades) => {
      const tradesWithId = { ...newTrade, id: crypto.randomUUID() }; // Ensure new trade has an ID
      const updatedTrades = [...prevTrades, tradesWithId];
      saveTradesToLocalStorage(updatedTrades);
      return updatedTrades;
    });
  }, [saveTradesToLocalStorage]);

  // Function to update an existing trade
  const updateTrade = useCallback((updatedTrade) => {
    setTradeHistory((prevTrades) => {
      const newTradeHistory = prevTrades.map((trade) =>
        trade.id === updatedTrade.id ? updatedTrade : trade
      );
      saveTradesToLocalStorage(newTradeHistory);
      return newTradeHistory;
    });
  }, [saveTradesToLocalStorage]);

  // Function to delete a trade
  const deleteTrade = useCallback((tradeIdToDelete) => {
    setTradeHistory((prevTrades) => {
      const updatedTrades = prevTrades.filter(
        (trade) => trade.id !== tradeIdToDelete
      );
      saveTradesToLocalStorage(updatedTrades);
      return updatedTrades;
    });
  }, [saveTradesToLocalStorage]);

  // Function to open the form for adding a new trade
  const openAddTradeForm = () => {
    setTradeToEdit(null); // Ensure no trade is selected for editing
    setIsFormModalOpen(true);
  };

  // Function to open the form for editing an existing trade
  const openEditTradeForm = useCallback((trade) => {
    setTradeToEdit(trade); // Set the trade object to be edited
    setIsFormModalOpen(true);
  }, []);

  // Function to close the form modal
  const closeFormModal = () => {
    setIsFormModalOpen(false);
    setTradeToEdit(null); // Clear the trade being edited when closing the modal
    loadTrades(); // Reload trades to ensure UI is consistent after add/edit/delete
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
          onClick={openAddTradeForm} // Button to open the form for adding a new trade
          className="px-6 py-2 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors duration-200"
        >
          Add New Trade
        </button>
      </div>

      <AllTradesTable
        groupedTrades={groupedTrades}
        onDeleteTrade={deleteTrade}
        onEditTrade={openEditTradeForm} // Pass the function to open edit form
      />

      {/* Conditional rendering for the NewTradeEntryForm modal */}
      {isFormModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 p-4"> {/* Added p-4 for padding */}
          {/* Apply max-width, max-height, and mx-auto for centering */}
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