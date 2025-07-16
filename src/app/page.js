"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

export default function DashboardPage() {
  const [tradeHistory, setTradeHistory] = useState([]);
  const [userName, setUserName] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [tempName, setTempName] = useState("");
  const [userNameLoaded, setUserNameLoaded] = useState(false);
  const [tradesLoaded, setTradesLoaded] = useState(false);

  // Load user name and trade data from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedUserName = localStorage.getItem("tradeJournalUserName");
      if (savedUserName) setUserName(savedUserName);
      setUserNameLoaded(true);

      const savedTrades = localStorage.getItem("tradeJournalData");
      if (savedTrades) {
        try {
          const parsed = JSON.parse(savedTrades);
          setTradeHistory(parsed);
        } catch (error) {
          console.error("Error parsing trade history:", error);
          setTradeHistory([]);
        }
      }
      setTradesLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (userNameLoaded && !userName && typeof window !== "undefined") {
      setShowModal(true);
    }
  }, [userNameLoaded, userName]);

  const handleSaveName = () => {
    const finalName = tempName.trim() || "Guest";
    setUserName(finalName);
    localStorage.setItem("tradeJournalUserName", finalName);
    setShowModal(false);
  };

  const initialCapital = 31000;

  // Helper to safely get net P&L
  const getNetPnl = (trade) => {
    const net = Number(trade.netPnl);
    const gross = Number(trade.grossPnl);
    const charges = Number(trade.charges);

    if (!isNaN(net)) return net;
    if (!isNaN(gross) && !isNaN(charges)) return gross - charges;
    return 0;
  };

  const totalProfit = tradeHistory.reduce((sum, trade) => {
    const pnl = getNetPnl(trade);
    return pnl > 0 ? sum + pnl : sum;
  }, 0);

  const totalLoss = tradeHistory.reduce((sum, trade) => {
    const pnl = getNetPnl(trade);
    return pnl < 0 ? sum + pnl : sum;
  }, 0);

  const totalCharges = tradeHistory.reduce(
    (sum, trade) => sum + (Number(trade.charges) || 0),
    0
  );

  const totalPnl = tradeHistory.reduce((sum, trade) => sum + getNetPnl(trade), 0);

  if (!userNameLoaded || !tradesLoaded) {
    return (
      <div className="min-h-screen bg-zinc-800 p-4 flex items-center justify-center">
        <div className="text-gray-200 text-lg">Loading your trade data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-800 p-4 flex items-center justify-center w-full">
      <div className="bg-zinc-900 p-8 rounded-xl shadow-lg w-full max-w-4xl mx-auto min-h-[calc(100vh-8rem)] flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-2 gap-4">
            <h2 className="text-3xl font-bold text-gray-200">Welcome, {userName}!</h2>
            <button
              onClick={() => {
                localStorage.removeItem("tradeJournalUserName");
                setUserName("");
                setTempName("");
                setShowModal(true);
              }}
              className="text-xs bg-gray-700 px-3 py-2 hover:bg-gray-600 transition-all duration-200 rounded-md"
            >
              Change Name
            </button>
          </div>
          <nav className="flex space-x-4">
            <Link href="/" className="text-blue-400 hover:text-blue-800 font-medium">
              Home
            </Link>
            <Link href="#" className="text-blue-400 hover:text-blue-800 font-medium">
              News
            </Link>
          </nav>
        </div>

        <h3 className="text-2xl font-semibold text-gray-300 mb-6">Your Trading Overview</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-zinc-700 p-4 rounded-lg shadow-md">
            <p className="text-lg font-medium text-white">Initial Capital:</p>
            <p className="text-3xl font-bold text-gray-300">
              ₹{initialCapital.toLocaleString()}
            </p>
          </div>
          <div className="bg-zinc-700 p-4 rounded-lg shadow-md">
            <p className="text-lg font-medium text-white">Total Trades:</p>
            <p className="text-3xl font-bold text-gray-300">
              {tradeHistory.length}
            </p>
          </div>
          <div className="bg-zinc-700 p-4 rounded-lg shadow-md">
            <p className="text-lg font-medium text-white">Total Charges:</p>
            <p className="text-3xl font-bold text-yellow-300">
              ₹{totalCharges.toFixed(2)}
            </p>
          </div>
          <div className="bg-zinc-700 p-4 rounded-lg shadow-md">
            <p className="text-lg font-medium text-white">Total Profit:</p>
            <p className="text-3xl font-bold text-green-500">
              ₹{totalProfit.toFixed(2)}
            </p>
          </div>
          <div className="bg-zinc-700 p-4 rounded-lg shadow-md">
            <p className="text-lg font-medium text-white">Total Loss:</p>
            <p className="text-3xl font-bold text-red-500">
              ₹{totalLoss.toFixed(2)}
            </p>
          </div>
          <div className="p-4 rounded-lg shadow-md bg-zinc-700">
            <p className="text-lg font-medium text-white">Total P&L (Net):</p>
            <p
              className={`text-3xl font-bold ${
                totalPnl >= 0 ? "text-green-500" : "text-red-500"
              }`}
            >
              ₹{totalPnl.toFixed(2)}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between mt-auto">
          <Link
            href="/journal"
            className="bg-slate-700 hover:bg-slate-800 text-white font-bold py-3 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-[1.01] text-center"
          >
            Go to Journal
          </Link>
          <Link
            href="/all-trades"
            className="bg-slate-700 hover:bg-slate-800 text-white font-bold py-3 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-[1.01] text-center"
          >
            View All Trades
          </Link>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-zinc-900 rounded-lg p-6 shadow-lg w-full max-w-sm">
            <h2 className="text-xl font-semibold text-gray-100 mb-4">
              Enter Your Name
            </h2>
            <input
              type="text"
              placeholder="Your name"
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-500"
            />
            <div className="flex justify-end mt-4">
              <button
                onClick={handleSaveName}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
