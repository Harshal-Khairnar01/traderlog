'use client';

import React, { useEffect, useState } from "react";
import Link from "next/link";
import AllTradesTable from "@/components/AllTradesTable";

export default function AllTradesClientPage() {
  const [tradeHistory, setTradeHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  useEffect(() => {
    try {
      setLoading(true);
      const savedTrades = localStorage.getItem("tradeJournalData");
      if (savedTrades) {
        const parsedTrades = JSON.parse(savedTrades);

        const enhancedTrades = parsedTrades.map(trade => ({
          ...trade,
          grossPnl: calculateGrossPnl(trade),
          charges: getTradeCharges(trade),
        }));
        setTradeHistory(enhancedTrades);
      }
    } catch (err) {
      console.error("Failed to load or parse trade history from localStorage:", err);
      setError("Error loading trade data.");
    } finally {
      setLoading(false);
    }
  }, []);

  const sortedTradeHistory = [...tradeHistory].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  const groupedTrades = {};
  const colors = [
    'bg-gray-100',
    'bg-blue-50',
    'bg-green-50',
    'bg-yellow-50',
    'bg-red-50',
    'bg-purple-50'
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
        <Link
          href="/"
          className="bg-gray-700 hover:bg-gray-950 text-zinc-200 font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out"
        >
          Back to Dashboard
        </Link>
      </div>

      <AllTradesTable groupedTrades={groupedTrades} />
    </div>
  );
}