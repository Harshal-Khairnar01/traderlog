// components/ReportClient.jsx
"use client";

import React, { useState, useEffect, useCallback } from "react";
import PerformanceReport from "./reports/PerformanceReport";
import PsychologyReport from "./reports/PsychologyReport";
import RiskReport from "./reports/RiskReport";
import JournalReport from "./reports/JournalReport";

const ReportClient = () => {
  const [activeTab, setActiveTab] = useState("performance");
  const [tradeHistory, setTradeHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const localStorageKey = "tradeJournalData";

  const loadTrades = useCallback(() => {
    try {
      setLoading(true);
      const savedTrades = localStorage.getItem(localStorageKey);
      let parsedTrades = [];

      if (savedTrades) {
        parsedTrades = JSON.parse(savedTrades);
      }

      const enhancedTrades = parsedTrades.map((trade) => ({
        ...trade,
        id: trade.id || crypto.randomUUID(),
        entryPrice: parseFloat(trade.entryPrice || 0),
        exitPrice: parseFloat(trade.exitPrice || 0),
        quantity: parseFloat(trade.quantity || 0),
        stopLoss: trade.stopLoss !== null && trade.stopLoss !== undefined ? parseFloat(trade.stopLoss) : null,
        target: trade.target !== null && trade.target !== undefined ? parseFloat(trade.target) : null,
        charges: parseFloat(trade.charges || 0),
        pnlAmount: parseFloat(trade.pnlAmount || 0),
        pnlPercentage: parseFloat(trade.pnlPercentage || 0),
        totalAmount: parseFloat(trade.totalAmount || 0),
        confidenceLevel: parseFloat(trade.confidenceLevel || 5),
      }));
      setTradeHistory(enhancedTrades);
    } catch (err) {
      console.error(
        "Failed to load or parse trade history from localStorage:",
        err
      );
      setError("Error loading trade data. Please check console for details.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTrades();
  }, [loadTrades]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <p className="text-gray-300 text-lg">Loading reports data...</p>
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
    <div className="min-h-screen bg-slate-900 p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-200">Trading Reports</h2>
      </div>

      <div className="flex border-b border-zinc-700 mb-6">
        <button
          className={`px-4 py-2 text-lg font-medium ${
            activeTab === "performance"
              ? "text-blue-500 border-b-2 border-blue-500"
              : "text-gray-400 hover:text-gray-200"
          } focus:outline-none transition-colors duration-200`}
          onClick={() => setActiveTab("performance")}
        >
          Performance
        </button>
        <button
          className={`ml-4 px-4 py-2 text-lg font-medium ${
            activeTab === "psychology"
              ? "text-blue-500 border-b-2 border-blue-500"
              : "text-gray-400 hover:text-gray-200"
          } focus:outline-none transition-colors duration-200`}
          onClick={() => setActiveTab("psychology")}
        >
          Psychology
        </button>
        <button
          className={`ml-4 px-4 py-2 text-lg font-medium ${
            activeTab === "risk"
              ? "text-blue-500 border-b-2 border-blue-500"
              : "text-gray-400 hover:text-gray-200"
          } focus:outline-none transition-colors duration-200`}
          onClick={() => setActiveTab("risk")}
        >
          Risk
        </button>
        <button
          className={`ml-4 px-4 py-2 text-lg font-medium ${
            activeTab === "journal"
            ? "text-blue-500 border-b-2 border-blue-500"
            : "text-gray-400 hover:text-gray-200"
          } focus:outline-none transition-colors duration-200`}
          onClick={() => setActiveTab("journal")}
        >
          Journal
        </button>
      </div>

      <div className="mt-6">
        {activeTab === "performance" && <PerformanceReport tradeHistory={tradeHistory} />}
        {activeTab === "psychology" && <PsychologyReport tradeHistory={tradeHistory} />}
        {activeTab === "risk" && <RiskReport tradeHistory={tradeHistory} />}
        {activeTab === "journal" && <JournalReport tradeHistory={tradeHistory} />}
      </div>
    </div>
  );
};

export default ReportClient;