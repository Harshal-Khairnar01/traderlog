"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import NewTradeEntryForm from "./NewTradeEntryForm";
import Modal from "./Modal";

const DashboardPage = ({ session }) => {
  const [tradeHistory, setTradeHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showNewTradeModal, setShowNewTradeModal] = useState(false);

  const userName = session?.user?.name || "Guest";
  const userInitial = userName.charAt(0).toUpperCase();

  const parseResponseBody = async (response) => {
    const contentType = response.headers.get("content-type");
    return contentType?.includes("application/json")
      ? await response.json()
      : await response.text();
  };

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

  const fetchDashboardData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (typeof window !== "undefined" && window.localStorage) {
        const storedData = localStorage.getItem("tradeJournalData");
        if (storedData) {
          const data = JSON.parse(storedData);
          const processedTrades = data.map((trade) => ({
            ...trade,
            dateTime: new Date(`${trade.date}T${trade.time}`),
            pnlAmount: parseFloat(trade.pnlAmount || trade.netPnl || 0),
            grossPnl: calculateGrossPnl(trade),
            charges: getTradeCharges(trade),
          }));
          setTradeHistory(processedTrades);
          setIsLoading(false);
          return;
        }
      }
    } catch (err) {
      console.warn("Failed to load trade data from local storage, attempting API:", err);
    }

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
      const processedTrades = data.tradeHistory.map((trade) => ({
        ...trade,
        dateTime: new Date(`${trade.date}T${trade.time}`),
        pnlAmount: parseFloat(trade.pnlAmount || trade.netPnl || 0),
        grossPnl: calculateGrossPnl(trade),
        charges: getTradeCharges(trade),
      }));
      setTradeHistory(processedTrades);
      if (typeof window !== "undefined" && window.localStorage) {
        localStorage.setItem("tradeJournalData", JSON.stringify(data.tradeHistory));
      }
    } catch (err) {
      console.error("Failed to load dashboard data from API:", err);
      setError(err.message || "Failed to load data from API.");
    } finally {
      setIsLoading(false);
    }
  }, [session]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const addTrade = useCallback(async (newTrade) => {
    try {
      setTradeHistory((prev) => {
        const processedNewTrade = {
          ...newTrade,
          dateTime: new Date(`${newTrade.date}T${newTrade.time}`),
          pnlAmount: parseFloat(newTrade.pnlAmount || newTrade.netPnl || 0),
          grossPnl: calculateGrossPnl(newTrade),
          charges: getTradeCharges(newTrade),
        };
        const updatedHistory = [...prev, processedNewTrade];
        if (typeof window !== "undefined" && window.localStorage) {
          localStorage.setItem("tradeJournalData", JSON.stringify(updatedHistory));
        }
        return updatedHistory;
      });
      setShowNewTradeModal(false);

      const res = await fetch("/api/v1/trades", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTrade),
      });

      if (!res.ok) {
        const body = await parseResponseBody(res);
        const errorMessage =
          typeof body === "object" && body.message
            ? body.message
            : body.toString();
        throw new Error(errorMessage || res.statusText);
      }

      fetchDashboardData();
    } catch (err) {
      console.error("Failed to add new trade:", err);
      setError(err.message || "Failed to add new trade.");
      fetchDashboardData();
    }
  }, [fetchDashboardData]);

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const monthlyTrades = useMemo(() => {
    return tradeHistory.filter((t) => {
      const tradeDate = new Date(t.date);
      if (isNaN(tradeDate.getTime())) {
        console.warn("Invalid trade date found:", t.date);
        return false;
      }
      return (
        tradeDate.getMonth() === currentMonth &&
        tradeDate.getFullYear() === currentYear
      );
    });
  }, [tradeHistory, currentMonth, currentYear]);

  const highestPnl = useMemo(() => {
    if (tradeHistory.length === 0) return 0;
    const allPnls = tradeHistory.map((t) => t.pnlAmount);
    return Math.max(...allPnls);
  }, [tradeHistory]);

  const totalTradesCount = tradeHistory.length;
  const tradesThisMonthCount = monthlyTrades.length;

  const winRate = useMemo(() => {
    if (monthlyTrades.length === 0) return 0;
    const winningTrades = monthlyTrades.filter((t) => t.pnlAmount > 0).length;
    return (winningTrades / monthlyTrades.length) * 100;
  }, [monthlyTrades]);

  const avgRiskReward = useMemo(() => {
    if (monthlyTrades.length === 0) return "N/A";
    const positiveTrades = monthlyTrades.filter((t) => t.pnlAmount > 0);
    const negativeTrades = monthlyTrades.filter((t) => t.pnlAmount < 0);

    const avgWinPnl =
      positiveTrades.length > 0
        ? positiveTrades.reduce((sum, t) => sum + t.pnlAmount, 0) /
          positiveTrades.length
        : 0;
    const avgLossPnl =
      negativeTrades.length > 0
        ? negativeTrades.reduce((sum, t) => sum + t.pnlAmount, 0) /
          negativeTrades.length
        : 0;

    if (avgWinPnl > 0 && avgLossPnl < 0) {
      return `${(avgWinPnl / Math.abs(avgLossPnl)).toFixed(2)}:1`;
    } else if (avgWinPnl > 0) {
      return "Wins Only";
    } else if (avgLossPnl < 0) {
      return "Losses Only";
    } else {
      return "0:0";
    }
  }, [monthlyTrades]);

  const confidenceIndex = 0.65;

  const cumulativePnlData = useMemo(() => {
    if (tradeHistory.length === 0) return [];

    const sortedTrades = [...tradeHistory].sort(
      (a, b) => a.dateTime.getTime() - b.dateTime.getTime()
    );

    let cumulativeSum = 0;
    const data = [];

    sortedTrades.forEach((trade) => {
      cumulativeSum += trade.pnlAmount;
      data.push({
        name: `${trade.date} ${trade.time}`,
        pnl: cumulativeSum,
      });
    });

    return data;
  }, [tradeHistory]);

  const topProfitTrades = useMemo(() => {
    return [...monthlyTrades]
      .filter((trade) => trade.pnlAmount > 0)
      .sort((a, b) => b.pnlAmount - a.pnlAmount)
      .slice(0, 3);
  }, [monthlyTrades]);

  const topLosingTrades = useMemo(() => {
    return [...monthlyTrades]
      .filter((trade) => trade.pnlAmount < 0)
      .sort((a, b) => a.pnlAmount - b.pnlAmount)
      .slice(0, 3);
  }, [monthlyTrades]);

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
    <div className="  min-h-screen bg-slate-900 text-white flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-7xl flex justify-between items-center mb-6 ">
        <div className=" w-full flex items-center space-x-4 relative justify-between ">
          <select className="bg-slate-800 border border-slate-700 rounded px-3 py-1 text-sm text-gray-200">
            <option>Last 30 Days</option>
          </select>
          <div className=" flex items-center gap-5">
            <button
              onClick={() => setShowNewTradeModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-1.5 px-3 rounded-md text-sm flex items-center gap-1"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4v16m8-8H4"
                />
              </svg>
              New Trade
            </button>

            <button
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              className="w-9 h-9 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold text-base hover:bg-purple-700 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
              aria-label="Profile menu"
            >
              {userInitial}
            </button>
            {showProfileDropdown && (
              <div className="absolute top-full right-0 mt-2 w-48 bg-slate-800 rounded-md shadow-lg z-10">
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
          </div>
        </div>
      </div>

      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-3">
          {" "}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <DashboardCard
              title="Highest P&L"
              value={`₹${highestPnl.toLocaleString("en-IN")}`}
              valueColor={highestPnl >= 0 ? "text-green-400" : "text-red-400"}
              change="+"
            />
            <DashboardCard
              title="Win Rate"
              value={`${winRate.toFixed(1)}%`}
              valueColor="text-blue-400"
              change="+"
            />
            <DashboardCard
              title="Avg. Risk/Reward"
              value={avgRiskReward}
              valueColor="text-yellow-400"
              change="-"
            />
            <DashboardCard
              title="Trades This Month"
              value={tradesThisMonthCount}
              valueColor="text-purple-400"
              change="+"
            />
          </div>
          <div className="bg-slate-800 p-6 rounded-lg shadow-md mb-6">
            <h3 className="text-lg font-semibold text-gray-200 mb-4">
              Confidence Index
            </h3>
            <div className="relative h-3 bg-gray-700 rounded-full overflow-hidden mb-2">
              <div
                className="absolute h-full bg-blue-500 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${confidenceIndex * 100}%` }}
              ></div>
              <div
                className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-blue-500 rounded-full"
                style={{ left: `calc(${confidenceIndex * 100}% - 8px)` }}
              ></div>
            </div>
            <div className="flex justify-between text-sm text-gray-400">
              <span>Low</span>
              <span>
                Moderate Confidence - There's room to improve your consistency
                and mindset.
              </span>
              <span>High</span>
            </div>
          </div>
          <div className="flex md:flex-row flex-col gap-6">
            <div className=" w-3/4 bg-slate-800 p-6 rounded-lg shadow-md min-h-[400px] flex flex-col">
              <h3 className="text-lg font-semibold text-gray-200 mb-4">
                Cumulative P&L
              </h3>
              {cumulativePnlData.length > 0 ? (
                <>
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart
                      data={cumulativePnlData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" />
                      <XAxis
                        dataKey="name"
                        stroke="#cbd5e0"
                        angle={-45}
                        textAnchor="end"
                        height={60}
                        interval="preserveStartEnd"
                      />
                      <YAxis stroke="#cbd5e0" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#2d3748",
                          border: "1px solid #4a5568",
                          borderRadius: "4px",
                        }}
                        itemStyle={{ color: "#cbd5e0" }}
                        labelStyle={{ color: "#a0aec0" }}
                        formatter={(value) =>
                          `₹${value.toLocaleString("en-IN")}`
                        }
                      />
                      <Line
                        type="monotone"
                        dataKey="pnl"
                        stroke="#8884d8"
                        strokeWidth={2}
                        dot={false}
                        activeDot={{
                          r: 8,
                          fill: "#8884d8",
                          stroke: "#fff",
                          strokeWidth: 2,
                        }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                  <p className="text-xl font-bold mt-4 text-center">
                    Current Total:{" "}
                    <span
                      className={
                        cumulativePnlData[cumulativePnlData.length - 1].pnl >= 0
                          ? "text-green-400"
                          : "text-red-400"
                      }
                    >
                      ₹
                      {cumulativePnlData[
                        cumulativePnlData.length - 1
                      ].pnl.toLocaleString("en-IN")}
                    </span>
                  </p>
                </>
              ) : (
                <div className="flex-grow flex items-center justify-center text-gray-500">
                  <p>
                    No trade data available to generate cumulative P&L chart.
                  </p>
                </div>
              )}
            </div>

            {/* Start of the new Top Trades layout */}
            <div className="w-1/4 flex flex-col gap-6">
              <div className="bg-slate-800 p-6 rounded-lg shadow-md flex-1">
                <h3 className="text-lg font-semibold text-gray-200 mb-4 flex justify-between items-center">
                  Top 3 Profit Trades
                  <Link
                    href="/all-trades"
                    className="text-blue-400 hover:underline text-sm"
                  >
                    View All
                  </Link>
                </h3>
                <div className="space-y-3">
                  {topProfitTrades.length > 0 ? (
                    topProfitTrades.map((trade, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center text-sm"
                      >
                        <div>
                          <p className="text-gray-300 font-medium">
                            {trade.instrument}
                          </p>
                          <p className="text-gray-500 text-xs">
                            Entry: ₹{trade.entryPrice} Exit: ₹
                            {trade.exitPrice}
                          </p>
                        </div>
                        <p className="font-semibold text-green-400">
                          ₹{trade.pnlAmount.toLocaleString("en-IN")}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">
                      No profit trades this month.
                    </p>
                  )}
                </div>
              </div>

              <div className="bg-slate-800 p-6 rounded-lg shadow-md flex-1">
                <h3 className="text-lg font-semibold text-gray-200 mb-4 flex justify-between items-center">
                  Top 3 Losing Trades
                  <Link
                    href="/all-trades"
                    className="text-blue-400 hover:underline text-sm"
                  >
                    View All
                  </Link>
                </h3>
                <div className="space-y-3">
                  {topLosingTrades.length > 0 ? (
                    topLosingTrades.map((trade, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center text-sm"
                      >
                        <div>
                          <p className="text-gray-300 font-medium">
                            {trade.instrument}
                          </p>
                          <p className="text-gray-500 text-xs">
                            Entry: ₹{trade.entryPrice} Exit: ₹
                            {trade.exitPrice}
                          </p>
                        </div>
                        <p className="font-semibold text-red-400">
                          ₹{trade.pnlAmount.toLocaleString("en-IN")}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">
                      No losing trades this month.
                    </p>
                  )}
                </div>
              </div>
            </div>
            {/* End of the new Top Trades layout */}
          </div>
        </div>
      </div>

      {showNewTradeModal && (
        <Modal onClose={() => setShowNewTradeModal(false)}>
          <NewTradeEntryForm addTrade={addTrade} />
        </Modal>
      )}
    </div>
  );
};

const DashboardCard = ({ title, value, valueColor, change }) => (
  <div className="bg-slate-800 p-5 rounded-lg shadow-xl flex flex-col items-start justify-between relative overflow-hidden">
    <div className="absolute top-0 right-0 p-3">
      {title === "Highest P&L" && (
        <span className="text-green-500 text-2xl">📈</span>
      )}
      {title === "Win Rate" && (
        <span className="text-blue-500 text-2xl">🏆</span>
      )}
      {title === "Avg. Risk/Reward" && (
        <span className="text-yellow-500 text-2xl">⚖️</span>
      )}
      {title === "Trades This Month" && (
        <span className="text-purple-500 text-2xl">📊</span>
      )}
    </div>
    <p className="text-sm text-gray-400 font-medium mb-1">{title}</p>
    <p className={`text-3xl font-bold ${valueColor}`}>{value}</p>
    <p
      className={`text-xs ${
        change === "+" ? "text-green-400" : "text-red-400"
      } mt-2`}
    >
      {change}10% vs last month{" "}
    </p>
  </div>
);

export default DashboardPage;