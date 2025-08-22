'use client'

import React from 'react'
import {
  Heart,
  Scale,
  Lightbulb,
  TrendingUp,
  AlertCircle,
  DollarSign,
  TrendingDown,
} from 'lucide-react'

import MetricCard from '../MatricCard'
import { usePsychologyMetrics } from '@/hooks/usePsychologyMetrics'
import { formatCurrency, formatRR } from '@/utils/formatters'

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
  } = usePsychologyMetrics(tradeHistory)

  return (
    <div className="p-4 space-y-8 bg-gray-900 min-h-screen text-white">
      <h1 className="text-4xl font-extrabold text-center text-white mb-12">
        Trading Psychology Insights
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <MetricCard
          title="Emotional State (from Confidence)"
          icon={Heart}
          valueColorClass="text-purple-300"
          subValues={emotionalStates.map((state) => ({
            label: state.label,
            value: state.value,
          }))}
        />

        <MetricCard
          title="Avg R:R by Emotional State"
          icon={Scale}
          valueColorClass="text-teal-300"
          subValues={avgRRByEmotionalState.map((rr) => ({
            label: rr.label,
            value: formatRR(rr.value),
            valueColor: rr.value >= 1 ? 'text-green-400' : 'text-red-400',
          }))}
        />
        <MetricCard
          title="Avg P&L by Confidence Level"
          icon={Lightbulb}
          valueColorClass="text-orange-300"
          subValues={pnlByConfidenceLevel.map((item) => ({
            label: item.label,
            value: formatCurrency(item.value),
            valueColor:
              item.value > 0
                ? 'text-green-400'
                : item.value < 0
                ? 'text-red-400'
                : 'text-gray-400',
          }))}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <MetricCard
          title="Most Frequent Mistakes"
          icon={AlertCircle}
          valueColorClass="text-green-300"
          subValues={mistakeFrequency.slice(0, 5).map((item) => ({
            label: item.label,
            value: item.value,
          }))}
        />
        <MetricCard
          title="Win Rate by Emotion Before"
          icon={TrendingUp}
          valueColorClass="text-yellow-300"
          subValues={winRateByEmotionBefore.map((item) => ({
            label: item.label,
            value: `${item.value.toFixed(1)}%`,
            valueColor: item.value >= 50 ? 'text-green-400' : 'text-red-400',
          }))}
        />
        <MetricCard
          title="Avg R:R by Emotion Before"
          icon={Scale}
          valueColorClass="text-pink-300"
          subValues={avgRRByEmotionBefore.map((item) => ({
            label: item.label,
            value: formatRR(item.value),
            valueColor: item.value >= 1 ? 'text-green-400' : 'text-red-400',
          }))}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        <MetricCard
          title="Avg P&L Impact of Mistakes"
          icon={DollarSign}
          valueColorClass="text-indigo-300"
          subValues={avgPnlByMistake.map((item) => ({
            label: item.label,
            value: formatCurrency(item.value),
            valueColor:
              item.value > 0
                ? 'text-green-400'
                : item.value < 0
                ? 'text-red-400'
                : 'text-gray-400',
          }))}
        />
        <MetricCard
          title="Avg R:R Impact of Mistakes"
          icon={TrendingDown}
          valueColorClass="text-fuchsia-300"
          subValues={avgRRByMistake.map((item) => ({
            label: item.label,
            value: formatRR(item.value),
            valueColor: item.value < 1 ? 'text-red-400' : 'text-green-400',
          }))}
        />
      </div>
    </div>
  )
}

export default PsychologyReport
