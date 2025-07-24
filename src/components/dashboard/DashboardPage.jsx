"use client";

import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import NewTradeEntryForm from "../new-trade-entry-form/NewTradeEntryForm";
import Modal from "../Modal";

import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardCards from "@/components/dashboard/DashboardCards";
import PnlChart from "@/components/dashboard/PnlChart";
import TopTrades from "@/components/dashboard/TopTrades";

const DashboardPage = ({ session }) => {
  const [tradeHistory, setTradeHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showNewTradeModal, setShowNewTradeModal] = useState(false);

  const profileDropdownRef = useRef(null);

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
      console.warn(
        "Failed to load trade data from local storage, attempting API:",
        err
      );
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
        localStorage.setItem(
          "tradeJournalData",
          JSON.stringify(data.tradeHistory)
        );
      }
    } catch (err) {
      console.error("Failed to load dashboard data from API:", err);
      setError(err.message || "Failed to load data from API.");
      toast.error(err.message || "Failed to load data from API.");
    } finally {
      setIsLoading(false);
    }
  }, [session]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target)
      ) {
        setShowProfileDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const addTrade = useCallback(
    async (newTrade) => {
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
            localStorage.setItem(
              "tradeJournalData",
              JSON.stringify(updatedHistory)
            );
          }
          return updatedHistory;
        });
        setShowNewTradeModal(false);
        toast.success("Trade added successfully!");
        const res = await fetch("/api/v1/trades", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
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
        toast.error(err.message || "Failed to add new trade.");
        fetchDashboardData();
      }
    },
    [fetchDashboardData]
  );

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const monthlyTrades = useMemo(() => {
    return tradeHistory.filter((t) => {
      const tradeDate = new Date(t.date);
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
    const data = sortedTrades.map((trade) => {
      cumulativeSum += trade.pnlAmount;
      return {
        name: `${trade.date} ${trade.time}`,
        pnl: cumulativeSum,
      };
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
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <ToastContainer position="bottom-right" />
      <DashboardHeader
        userInitial={userInitial}
        showNewTradeModal={showNewTradeModal}
        setShowNewTradeModal={setShowNewTradeModal}
        showProfileDropdown={showProfileDropdown}
        setShowProfileDropdown={setShowProfileDropdown}
        profileDropdownRef={profileDropdownRef}
      />
      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-3">
          <DashboardCards
            highestPnl={highestPnl}
            winRate={winRate}
            avgRiskReward={avgRiskReward}
            tradesThisMonthCount={tradesThisMonthCount}
          />
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
          <div className="flex flex-col lg:flex-row gap-6">
            <PnlChart cumulativePnlData={cumulativePnlData} />
            <TopTrades
              topProfitTrades={topProfitTrades}
              topLosingTrades={topLosingTrades}
            />
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

export default DashboardPage;
