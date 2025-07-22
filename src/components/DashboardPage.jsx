"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";

const DashboardPage = ({ session }) => {
  const [tradeHistory, setTradeHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  const userName = session?.user?.name || "Guest";
  const userInitial = userName.charAt(0).toUpperCase();
  const initialCapital = session?.user?.initialCapital || 0;

  const parseResponseBody = async (response) => {
    const contentType = response.headers.get("content-type");
    return contentType?.includes("application/json")
      ? await response.json()
      : await response.text();
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      setError(null);

      if (!session?.user?.id) {
        setError("User not authenticated. Please log in again.");
        setIsLoading(false);
        return;
      }

      try {
        const res = await fetch("/api/v1/trades");

        if (!res.ok) {
          const body = await parseResponseBody(res);
          const errorMessage =
            typeof body === "object" && body.message
              ? body.message
              : body.toString();
          throw new Error(errorMessage || res.statusText);
        }

        const data = await res.json();
        setTradeHistory(data.tradeHistory);
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
        setError(err.message || "Failed to load data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [session]);

  const getNetPnl = (trade) => {
    const net = Number(trade.netPnl);
    const gross = Number(trade.grossPnl);
    const charges = Number(trade.charges);
    return !isNaN(net)
      ? net
      : !isNaN(gross) && !isNaN(charges)
      ? gross - charges
      : 0;
  };

  const totalProfit = tradeHistory.reduce((sum, t) => {
    const pnl = getNetPnl(t);
    return pnl > 0 ? sum + pnl : sum;
  }, 0);

  const totalLoss = tradeHistory.reduce((sum, t) => {
    const pnl = getNetPnl(t);
    return pnl < 0 ? sum + pnl : sum;
  }, 0);

  const totalCharges = tradeHistory.reduce(
    (sum, t) => sum + (Number(t.charges) || 0),
    0
  );

  const totalPnl = tradeHistory.reduce((sum, t) => sum + getNetPnl(t), 0);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-800 p-4 flex items-center justify-center">
        <div className="text-gray-200 text-lg">Loading your trade data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-zinc-800 p-4 flex items-center justify-center">
        <div className="text-red-500 text-lg">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-800 p-4 flex items-center justify-center w-full">
      <div className="bg-zinc-900 p-8 rounded-xl shadow-lg w-full max-w-4xl mx-auto min-h-[calc(100vh-8rem)] flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <h2 className="text-3xl font-bold text-gray-200">
              Welcome, {userName}!
            </h2>
          </div>
          <nav className="relative">
            <button
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              className="w-10 h-10 rounded-full bg-pink-600 flex items-center justify-center text-white font-bold text-lg hover:bg-pink-700 transition-colors"
              aria-label="Profile menu"
            >
              {userInitial}
            </button>
            {showProfileDropdown && (
              <div className="absolute  top-6 right-8 mt-2 w-48  bg-zinc-950 rounded-md shadow-lg z-10">
                <Link
                  href="/profile"
                  className="block px-4 py-2 text-gray-200 hover:bg-slate-700 rounded-t-md"
                  onClick={() => setShowProfileDropdown(false)}
                >
                  View Profile
                </Link>
                <button
                  onClick={() => {
                    signOut();
                    setShowProfileDropdown(false);
                  }}
                  className="block w-full text-left cursor-pointer px-4 py-2 text-gray-200 hover:bg-slate-700 rounded-b-md"
                >
                  Logout
                </button>
              </div>
            )}
          </nav>
        </div>

        <h3 className="text-2xl font-semibold text-gray-300 mb-6">
          Your Trading Overview
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <InfoCard
            title="Initial Capital"
            value={`₹${initialCapital.toLocaleString()}`}
          />
          <InfoCard title="Total Trades" value={tradeHistory.length} />
          <InfoCard
            title="Total Charges"
            value={`₹${totalCharges.toFixed(2)}`}
            color="text-yellow-300"
          />
          <InfoCard
            title="Total Profit"
            value={`₹${totalProfit.toFixed(2)}`}
            color="text-green-500"
          />
          <InfoCard
            title="Total Loss"
            value={`₹${totalLoss.toFixed(2)}`}
            color="text-red-500"
          />
          <InfoCard
            title="Total P&L (Net)"
            value={`₹${totalPnl.toFixed(2)}`}
            color={totalPnl >= 0 ? "text-green-500" : "text-red-500"}
          />
        </div>

        <div className="flex items-center justify-between mt-auto">
          <Link
            href="/journal"
            className="bg-slate-700 hover:bg-slate-800 text-white font-bold py-3 px-4 rounded-lg shadow-md transition transform hover:scale-[1.01]"
          >
            Go to Journal
          </Link>
          <Link
            href="/all-trades"
            className="bg-slate-700 hover:bg-slate-800 text-white font-bold py-3 px-4 rounded-lg shadow-md transition transform hover:scale-[1.01]"
          >
            View All Trades
          </Link>
        </div>
      </div>
    </div>
  );
};

const InfoCard = ({ title, value, color = "text-gray-300" }) => (
  <div className="bg-zinc-700 p-4 rounded-lg shadow-md">
    <p className="text-lg font-medium text-white">{title}:</p>
    <p className={`text-3xl font-bold ${color}`}>{value}</p>
  </div>
);

export default DashboardPage;
