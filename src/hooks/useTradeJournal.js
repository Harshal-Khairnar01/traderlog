// src/hooks/useTradeJournal.js
import { useState, useEffect, useCallback } from "react";
import { toast } from 'react-toastify';

export const useTradeJournal = () => {
  const [tradeHistory, setTradeHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const calculateGrossPnl = (trade) => {
    if (trade.entryPrice && trade.exitPrice && trade.quantity) {
      const entry = parseFloat(trade.entryPrice);
      const exit = parseFloat(trade.exitPrice);
      const qty = parseFloat(trade.quantity);

      if (trade.direction === "Long") {
        return (exit - entry) * qty;
      } else if (trade.direction === "Short") {
        return (entry - exit) * qty;
      }
    }
    return 0;
  };

  const getTradeCharges = (trade) => {
    return parseFloat(trade.charges) ?? 0;
  };

  const saveTradesToLocalStorage = useCallback((tradesToSave) => {
    try {
      localStorage.setItem("tradeJournalData", JSON.stringify(tradesToSave));
    } catch (err) {
      console.error("Failed to save trades to localStorage:", err);
      toast.error("Failed to save trades.");
    }
  }, []);

  const loadTrades = useCallback(() => {
    try {
      setLoading(true);
      const savedTrades = localStorage.getItem("tradeJournalData");
      if (savedTrades) {
        const parsedTrades = JSON.parse(savedTrades);
        const enhancedTrades = parsedTrades.map((trade) => ({
          ...trade,
          id: trade.id || crypto.randomUUID(),
          grossPnl: calculateGrossPnl(trade),
          charges: getTradeCharges(trade),
          confidenceLevel: trade.confidenceLevel || "5",
        }));
        setTradeHistory(enhancedTrades);
      } else {
        setTradeHistory([]);
      }
    } catch (err) {
      console.error("Failed to load trade history:", err);
      setError("Error loading trade data.");
      toast.error("Failed to load trades. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTrades();
  }, [loadTrades]);

  const addTrade = useCallback((newTrade) => {
    const tradesWithId = { ...newTrade, id: crypto.randomUUID() };
    setTradeHistory((prevTrades) => {
      const newHistory = [...prevTrades, tradesWithId];
      saveTradesToLocalStorage(newHistory);
      return newHistory;
    });
    toast.success("Trade added successfully!");
  }, [saveTradesToLocalStorage]);

  const updateTrade = useCallback((updatedTrade) => {
    setTradeHistory((prevTrades) => {
      const newTradeHistory = prevTrades.map((trade) =>
        trade.id === updatedTrade.id ? updatedTrade : trade
      );
      saveTradesToLocalStorage(newTradeHistory);
      return newTradeHistory;
    });
    toast.success("Trade updated successfully!");
  }, [saveTradesToLocalStorage]);

  const deleteTrade = useCallback((tradeIdToDelete) => {
    setTradeHistory((prevTrades) => {
      const newHistory = prevTrades.filter(
        (trade) => trade.id !== tradeIdToDelete
      );
      saveTradesToLocalStorage(newHistory);
      return newHistory;
    });
    toast.success("Trade deleted successfully!");
  }, [saveTradesToLocalStorage]);

  return {
    tradeHistory,
    loading,
    error,
    addTrade,
    updateTrade,
    deleteTrade,
    loadTrades,
  };
};