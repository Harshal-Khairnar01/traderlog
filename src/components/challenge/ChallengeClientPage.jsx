
"use client";

import React, { useState } from "react";
import { Grid3x3 } from "lucide-react";
import ChallengeSummaryMetrics from "./ChallengeSummaryMetrics";
import PerformanceMetricsRow from "./PerformanceMetricsRow";
import TradingConfidenceIndex from "./TradingConfidenceIndex";
import TradeHistoryTable from "./TradeHistoryTable";
import SetChallengeModal from "./SetChallengeModal";
import { useChallengeMetrics } from "@/hooks/useChallengeMetrics";

const ChallengeClientPage = () => {
  const {
    challengeData,
    tradeHistory,
    loading,
    error,
    challengeSettings,
    handleSaveChallengeSettings,
  } = useChallengeMetrics();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-white">
        Loading challenge data...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        Error: {error}
      </div>
    );
  }

  if (!challengeData) {
    return (
      <div className="min-h-screen p-6 bg-gray-900 text-gray-400 font-sans flex flex-col items-center justify-center">
        <p className="text-xl mb-4">No challenge data available.</p>
        <button
          onClick={openModal}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg flex items-center space-x-2 text-lg"
        >
          <Grid3x3 className="w-6 h-6" />
          <span>Set Your First Challenge</span>
        </button>
        <SetChallengeModal
          isOpen={isModalOpen}
          onClose={closeModal}
          onSave={handleSaveChallengeSettings}
          initialSettings={challengeSettings}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gray-900 text-white font-sans">
      <div className="flex justify-end mb-6">
        <button
          onClick={openModal}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center space-x-2"
        >
          <Grid3x3 className="w-5 h-5" />
          <span>Set Challenge</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-1 gap-6 mb-6">
        <ChallengeSummaryMetrics summary={challengeData.summary} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <PerformanceMetricsRow
          performance={challengeData.performance}
          progressToTarget={challengeData.summary.progressToTarget}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 mb-8">
        <TradingConfidenceIndex
          confidenceLevel={challengeData.performance.tradingConfidenceLevel}
        />
      </div>

      <div className="grid grid-cols-1 gap-6">
        <TradeHistoryTable tradeHistory={tradeHistory} />
      </div>

      <SetChallengeModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSave={handleSaveChallengeSettings}
        initialSettings={challengeSettings}
      />
    </div>
  );
};

export default ChallengeClientPage;
