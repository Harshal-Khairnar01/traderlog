'use client'

import React from 'react'
import {
  Trophy,
  CalendarDays,
  BarChart2,
  Clock,
  Award,
  Target,
  Activity,
  PieChart,
  LineChart,
  Wallet,
  Scale,
} from 'lucide-react'

import MetricCard from '@/components/MatricCard'
import { usePerformanceMetrics } from '@/hooks/usePerformanceMetrics'
import { formatCurrency, formatRR } from '@/utils/formatters'

export default function PerformanceReport({ tradeHistory }) {
  const metrics = usePerformanceMetrics(tradeHistory)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 p-4">
      <MetricCard
        title="Trade Performance"
        icon={Trophy}
        mainValue={`${metrics.winningTrades} / ${metrics.losingTrades} / ${metrics.breakEvenTrades}`}
        footerText="Win / Loss / Break Even"
        valueColorClass="text-purple-300"
        subValues={[
          {
            label: 'Avg Win',
            value: formatCurrency(metrics.avgWin),
            valueColor: 'text-green-400',
          },
          {
            label: 'Avg Loss',
            value: formatCurrency(metrics.avgLoss),
            valueColor: 'text-red-400',
          },
          { label: 'Win Rate', value: `${metrics.winRate.toFixed(2)}%` },
          { label: 'Expectancy', value: metrics.expectancy.toFixed(2) },
        ]}
      />

      <MetricCard
        title="Daily Performance"
        icon={CalendarDays}
        mainValue={`${metrics.dailyWinDays} / ${metrics.dailyLossDays} / ${metrics.dailyBreakEvenDays}`}
        footerText="Win / Loss / Break Even Days"
        valueColorClass="text-teal-300"
        subValues={[
          {
            label: 'Best Day',
            value: `${metrics.mostProfitableDay.date} ${formatCurrency(
              metrics.mostProfitableDay.pnl,
            )}`,
            valueColor: 'text-green-400',
          },
          {
            label: 'Worst Day',
            value: `${metrics.leastProfitableDay.date} ${formatCurrency(
              metrics.leastProfitableDay.pnl,
            )}`,
            valueColor: 'text-red-400',
          },
          { label: 'Avg Win Day', value: formatCurrency(metrics.avgWinPerDay) },
          {
            label: 'Avg Loss Day',
            value: formatCurrency(metrics.avgLossPerDay),
          },
        ]}
      />

      <MetricCard
        title="Trade Execution"
        icon={BarChart2}
        valueColorClass="text-orange-300"
        subValues={[
          { label: 'Total Trades', value: metrics.totalTrades },
          {
            label: 'Avg Capital Used',
            value: formatCurrency(metrics.avgCapitalUsedPerTrade),
          },
          {
            label: 'Most Profitable Strategy',
            value: metrics.mostProfitableStrategy.strategy,
          },
          { label: 'Consecutive Wins', value: metrics.consecutiveWins },
          { label: 'Consecutive Losses', value: metrics.consecutiveLosses },
        ]}
      />

      <MetricCard
        title="Time Metrics"
        icon={Clock}
        valueColorClass="text-yellow-300"
        subValues={[
          { label: 'Trading Days', value: metrics.tradingDays },
          { label: 'Consecutive Win Days', value: metrics.consecutiveWinDays },
          {
            label: 'Consecutive Loss Days',
            value: metrics.consecutiveLossDays,
          },
          {
            label: 'Most Profitable Day (Date)',
            value: metrics.mostProfitableDay.date,
          },
          {
            label: 'Least Profitable Day (Date)',
            value: metrics.leastProfitableDay.date,
          },
        ]}
      />

      <MetricCard
        title="Setup Effectiveness"
        icon={Target}
        valueColorClass="text-pink-300"
        subValues={Object.entries(metrics.setupEffectiveness).map(
          ([strategy, data]) => ({
            label: strategy,
            value: `${data.winRate.toFixed(1)}% win rate (${
              data.totalTrades
            } trades)`,
          }),
        )}
      />

      <MetricCard
        title="Symbol Frequency"
        icon={PieChart}
        valueColorClass="text-green-300"
        subValues={[
          {
            label: 'Most Traded Symbol',
            value: `${metrics.mostTradedSymbol.symbol} (${metrics.mostTradedSymbol.count} trades)`,
          },
          {
            label: 'Most Profitable Symbol',
            value: `${metrics.mostProfitableSymbol.symbol} ${formatCurrency(
              metrics.mostProfitableSymbol.pnl,
            )}`,
          },
          {
            label: 'Least Profitable Symbol',
            value: `${metrics.leastProfitableSymbol.symbol} ${formatCurrency(
              metrics.leastProfitableSymbol.pnl,
            )}`,
          },
        ]}
      />

      <MetricCard
        title="Capital Usage"
        icon={Wallet}
        valueColorClass="text-indigo-300"
        subValues={[
          {
            label: 'Maximum Capital Used',
            value: formatCurrency(metrics.maxCapitalUsed),
          },
          {
            label: 'Minimum Capital Used',
            value: formatCurrency(metrics.minCapitalUsed),
          },
          {
            label: 'Average Capital Used',
            value: formatCurrency(metrics.avgCapitalUsed),
          },
          {
            label: 'P&L at Max Capital',
            value: formatCurrency(metrics.pnlAtMaxCapital),
            valueColor:
              metrics.pnlAtMaxCapital >= 0 ? 'text-green-400' : 'text-red-400',
          },
          {
            label: 'P&L at Min Capital',
            value: formatCurrency(metrics.pnlAtMinCapital),
            valueColor:
              metrics.pnlAtMinCapital >= 0 ? 'text-green-400' : 'text-red-400',
          },
        ]}
      />

      <MetricCard
        title="Quantity Analysis"
        icon={Scale}
        valueColorClass="text-fuchsia-300"
        subValues={[
          { label: 'Maximum Quantity', value: metrics.maxQuantity },
          { label: 'Minimum Quantity', value: metrics.minQuantity },
          { label: 'Average Quantity', value: metrics.avgQuantity.toFixed(2) },
          {
            label: 'P&L at Max Quantity',
            value: formatCurrency(metrics.pnlAtMaxQuantity),
            valueColor:
              metrics.pnlAtMaxQuantity >= 0 ? 'text-green-400' : 'text-red-400',
          },
          {
            label: 'P&L at Min Quantity',
            value: formatCurrency(metrics.pnlAtMinQuantity),
            valueColor:
              metrics.pnlAtMinQuantity >= 0 ? 'text-green-400' : 'text-red-400',
          },
        ]}
      />

      <MetricCard
        title="Weekday Avg R:R"
        icon={LineChart}
        valueColorClass="text-cyan-300"
        subValues={Object.entries(metrics.weekdayMetrics).map(
          ([day, data]) => ({
            label: day,
            value: formatRR(data.avgRR),
          }),
        )}
      />

      <MetricCard
        title="Weekday Win Rate"
        icon={Award}
        valueColorClass="text-lime-300"
        subValues={Object.entries(metrics.weekdayMetrics).map(
          ([day, data]) => ({
            label: day,
            value: `${
              typeof data.winRate === 'number' ? data.winRate.toFixed(1) : 'N/A'
            }%`,
          }),
        )}
      />

      <MetricCard
        title="Daily Trade Activity"
        icon={Activity}
        valueColorClass="text-rose-300"
        subValues={[
          {
            label: 'Avg Trades Per Day',
            value: metrics.avgTradesPerDay.toFixed(1),
          },
          { label: 'Max Trades in a Day', value: metrics.maxTradesInADay },
          {
            label: 'Days With Only 1 Trade',
            value: metrics.daysWithOnly1Trade,
          },
          {
            label: 'Overtrading Days (>7 trades)',
            value: metrics.overtradingDays,
          },
        ]}
      />
    </div>
  )
}
