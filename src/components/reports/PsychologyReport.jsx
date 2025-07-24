// components/PsychologyReport.jsx
"use client";

import React from "react";
import {
  Heart,
  Scale,
  Lightbulb,
  TrendingUp,
  AlertCircle,
  DollarSign,
  TrendingDown,
} from "lucide-react";

import MetricCard from "@/components/MatricCard";
import { usePsychologyMetrics } from "@/hooks/usePsychologyMetrics";
import { formatRR } from "@/utils/formatters";
import { formatCurrency } from "@/utils/formatters";

const PsychologyReport = ({ tradeHistory }) => {
  const {
    emotionalStates,
    avgRRByEmotionalState,
    pnlByConfidenceLevel,
    winRateByEmotionBefore,
    avgRRByEmotionBefore,
    mistakeFrequency,
    avgPnlByMistake,
    avgRRByMistake,
  } = usePsychologyMetrics(tradeHistory);

  return (
    <div className="p-4 space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <MetricCard
          title="Emotional State (from Confidence)"
          icon={Heart}
          subValues={emotionalStates.map((state) => ({
            label: state.label,
            value: state.value,
          }))}
        />

        <MetricCard
          title="Avg R:R by Emotional State"
          icon={Scale}
          subValues={avgRRByEmotionalState.map((rr) => ({
            label: rr.label,
            value: formatRR(rr.value),
            valueColor: rr.value >= 1 ? "text-green-500" : "text-red-500",
          }))}
        />
        <MetricCard
          title="Avg P&L by Confidence Level"
          icon={Lightbulb}
          subValues={pnlByConfidenceLevel.map((item) => ({
            label: item.label,
            value: formatCurrency(item.value),
            valueColor:
              item.value > 0
                ? "text-green-500"
                : item.value < 0
                ? "text-red-500"
                : "text-gray-400",
          }))}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        <MetricCard
          title="Win Rate by Emotion Before"
          icon={TrendingUp}
          subValues={winRateByEmotionBefore.map((item) => ({
            label: item.label,
            value: `${item.value.toFixed(1)}%`,
            valueColor: item.value >= 50 ? "text-green-500" : "text-red-500",
          }))}
        />
        <MetricCard
          title="Avg R:R by Emotion Before"
          icon={Scale}
          subValues={avgRRByEmotionBefore.map((item) => ({
            label: item.label,
            value: formatRR(item.value),
            valueColor: item.value >= 1 ? "text-green-500" : "text-red-500",
          }))}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <MetricCard
          title="Most Frequent Mistakes"
          icon={AlertCircle}
          subValues={mistakeFrequency.slice(0, 5).map((item) => ({
            label: item.label,
            value: item.value,
          }))}
        />
        <MetricCard
          title="Avg P&L Impact of Mistakes"
          icon={DollarSign}
          subValues={avgPnlByMistake.map((item) => ({
            label: item.label,
            value: formatCurrency(item.value),
            valueColor:
              item.value > 0
                ? "text-green-500"
                : item.value < 0
                ? "text-red-500"
                : "text-gray-400",
          }))}
        />
        <MetricCard
          title="Avg R:R Impact of Mistakes"
          icon={TrendingDown}
          subValues={avgRRByMistake.map((item) => ({
            label: item.label,
            value: formatRR(item.value),
            valueColor: item.value < 1 ? "text-red-500" : "text-green-500",
          }))}
        />
      </div>
    </div>
  );
};

export default PsychologyReport;