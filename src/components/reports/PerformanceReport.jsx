
"use client";

import React from 'react';
import {
  Trophy, CalendarDays, BarChart2, Clock, Award, Target, Activity, PieChart, LineChart, Wallet, Scale,
} from 'lucide-react';

import MetricCard from '@/components/MatricCard';
import { usePerformanceMetrics } from '@/hooks/usePerformanceMetrics';
import { formatCurrency, formatRR } from '@/utils/formatters';

export default function PerformanceReport({ tradeHistory }) {
  const metrics = usePerformanceMetrics(tradeHistory);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 p-4">
      <MetricCard
        title="Trade Performance"
        icon={Trophy}
        mainValue={`${metrics.winningTrades} / ${metrics.losingTrades} / ${metrics.breakEvenTrades}`}
        footerText="Win / Loss / Break Even"
        valueColorClass="text-gray-200"
        subValues={[
          { label: 'Avg Win', value: formatCurrency(metrics.avgWin), valueColorClass: 'text-green-500' },
          { label: 'Avg Loss', value: formatCurrency(metrics.avgLoss), valueColorClass: 'text-red-500' },
          { label: 'Win Rate', value: `${metrics.winRate.toFixed(2)}%` },
          { label: 'Expectancy', value: metrics.expectancy.toFixed(2) },
        ]}
      />

      <MetricCard
        title="Daily Performance"
        icon={CalendarDays}
        mainValue={`${metrics.dailyWinDays} / ${metrics.dailyLossDays} / ${metrics.dailyBreakEvenDays}`}
        footerText="Win / Loss / Break Even Days"
        valueColorClass="text-gray-200"
        subValues={[
          { label: 'Best Day', value: `${metrics.mostProfitableDay.date} ${formatCurrency(metrics.mostProfitableDay.pnl)}`, valueColorClass: 'text-green-500' },
          { label: 'Worst Day', value: `${metrics.leastProfitableDay.date} ${formatCurrency(metrics.leastProfitableDay.pnl)}`, valueColorClass: 'text-red-500' },
          { label: 'Avg Win Day', value: formatCurrency(metrics.avgWinPerDay) },
          { label: 'Avg Loss Day', value: formatCurrency(metrics.avgLossPerDay) },
        ]}
      />

      <MetricCard
        title="Trade Execution"
        icon={BarChart2}
        subValues={[
          { label: 'Total Trades', value: metrics.totalTrades },
          { label: 'Avg Capital Used', value: formatCurrency(metrics.avgCapitalUsedPerTrade) },
          { label: 'Most Profitable Strategy', value: metrics.mostProfitableStrategy.strategy },
          { label: 'Consecutive Wins', value: metrics.consecutiveWins },
          { label: 'Consecutive Losses', value: metrics.consecutiveLosses },
        ]}
      />

      <MetricCard
        title="Time Metrics"
        icon={Clock}
        subValues={[
          { label: 'Trading Days', value: metrics.tradingDays },
          { label: 'Consecutive Win Days', value: metrics.consecutiveWinDays },
          { label: 'Consecutive Loss Days', value: metrics.consecutiveLossDays },
          { label: 'Most Profitable Day (Date)', value: metrics.mostProfitableDay.date },
          { label: 'Least Profitable Day (Date)', value: metrics.leastProfitableDay.date },
        ]}
      />

      <MetricCard
        title="Setup Effectiveness"
        icon={Target}
        subValues={Object.entries(metrics.setupEffectiveness).map(([strategy, data]) => ({
          label: strategy,
          value: `${data.winRate.toFixed(1)}% win rate (${data.totalTrades} trades)`,
        }))}
      />

      <MetricCard
        title="Symbol Frequency"
        icon={PieChart}
        subValues={[
          { label: 'Most Traded Symbol', value: `${metrics.mostTradedSymbol.symbol} (${metrics.mostTradedSymbol.count} trades)` },
          { label: 'Most Profitable Symbol', value: `${metrics.mostProfitableSymbol.symbol} ${formatCurrency(metrics.mostProfitableSymbol.pnl)}` },
          { label: 'Least Profitable Symbol', value: `${metrics.leastProfitableSymbol.symbol} ${formatCurrency(metrics.leastProfitableSymbol.pnl)}` },
        ]}
      />

      <MetricCard
        title="Capital Usage"
        icon={Wallet}
        subValues={[
          { label: 'Maximum Capital Used', value: formatCurrency(metrics.maxCapitalUsed) },
          { label: 'Minimum Capital Used', value: formatCurrency(metrics.minCapitalUsed) },
          { label: 'Average Capital Used', value: formatCurrency(metrics.avgCapitalUsed) },
          { label: 'P&L at Max Capital', value: formatCurrency(metrics.pnlAtMaxCapital), valueColorClass: metrics.pnlAtMaxCapital >= 0 ? 'text-green-500' : 'text-red-500' },
          { label: 'P&L at Min Capital', value: formatCurrency(metrics.pnlAtMinCapital), valueColorClass: metrics.pnlAtMinCapital >= 0 ? 'text-green-500' : 'text-red-500' },
        ]}
      />

      <MetricCard
        title="Quantity Analysis"
        icon={Scale}
        subValues={[
          { label: 'Maximum Quantity', value: metrics.maxQuantity },
          { label: 'Minimum Quantity', value: metrics.minQuantity },
          { label: 'Average Quantity', value: metrics.avgQuantity.toFixed(2) },
          { label: 'P&L at Max Quantity', value: formatCurrency(metrics.pnlAtMaxQuantity), valueColorClass: metrics.pnlAtMaxQuantity >= 0 ? 'text-green-500' : 'text-red-500' },
          { label: 'P&L at Min Quantity', value: formatCurrency(metrics.pnlAtMinQuantity), valueColorClass: metrics.pnlAtMinQuantity >= 0 ? 'text-green-500' : 'text-red-500' },
        ]}
      />

      <MetricCard
        title="Weekday Avg R:R"
        icon={LineChart}
        subValues={Object.entries(metrics.weekdayMetrics).map(([day, data]) => ({
          label: day,
          value: formatRR(data.avgRR),
        }))}
      />

      <MetricCard
        title="Weekday Win Rate"
        icon={Award}
        subValues={Object.entries(metrics.weekdayMetrics).map(([day, data]) => ({
          label: day,
          value: `${typeof data.winRate === 'number' ? data.winRate.toFixed(1) : 'N/A'}%`,
        }))}
      />

      <MetricCard
        title="Daily Trade Activity"
        icon={Activity}
        subValues={[
          { label: 'Avg Trades Per Day', value: metrics.avgTradesPerDay.toFixed(1) },
          { label: 'Max Trades in a Day', value: metrics.maxTradesInADay },
          { label: 'Days With Only 1 Trade', value: metrics.daysWithOnly1Trade },
          { label: 'Overtrading Days (>7 trades)', value: metrics.overtradingDays },
        ]}
      />
    </div>
  );
}