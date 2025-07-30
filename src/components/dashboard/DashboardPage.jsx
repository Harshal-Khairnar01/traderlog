"use client";

import React, { useState, useEffect, useRef } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useTradeData } from "@/hooks/useTradeData";
import { useTradeCalculations } from "@/hooks/useTradeCalculations";

import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardCards from "@/components/dashboard/DashboardCards";
import PnlChart from "@/components/dashboard/PnlChart";
import TopTrades from "@/components/dashboard/TopTrades";
import TradingConfidenceIndex from "@/components/challenge/TradingConfidenceIndex";
import TradeEntryModal from "@/components/dashboard/TradeEntryModal";

const DashboardPage = ({ session }) => {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showNewTradeModal, setShowNewTradeModal] = useState(false);

  const profileDropdownRef = useRef(null);

  const userName = session?.user?.name || "Guest";
  const userInitial = userName.charAt(0).toUpperCase();

  const { tradeHistory, isLoading, error, addTrade } = useTradeData(session);
  console.log(tradeHistory, isLoading, error,"hshshh");

  const {
    highestPnl,
    winRate,
    avgRiskReward,
    tradesThisMonthCount,
    cumulativePnlData,
    topProfitTrades,
    topLosingTrades,
    averageConfidenceLevel,
  } = useTradeCalculations(tradeHistory);

  console.log(  highestPnl,
    winRate,
    avgRiskReward,
    tradesThisMonthCount,
    cumulativePnlData,
    topProfitTrades,
    topLosingTrades,
    averageConfidenceLevel,"pppppppp")

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

  const displayConfidenceLevel =
    tradeHistory.length > 0 ? averageConfidenceLevel : 0.5;

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
          <div className="mb-4">
            <TradingConfidenceIndex confidenceLevel={displayConfidenceLevel} />
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

      <TradeEntryModal
        show={showNewTradeModal}
        onClose={() => setShowNewTradeModal(false)}
        onAddTrade={addTrade}
      />
    </div>
  );
};

export default DashboardPage;
