import React from 'react'
import DashboardCard from '@/components/dashboard/DashboardCard'

const PerformanceCards = ({
  highestPnl,
  winRate,
  avgRiskReward,
  tradesCount,
  timeRange,
}) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <DashboardCard
        title="Highest P&L"
        value={`₹${highestPnl.toLocaleString('en-IN')}`}
        valueColor={highestPnl >= 0 ? 'text-green-400' : 'text-red-400'}
      />
      <DashboardCard
        title="Win Rate"
        value={`${winRate.toFixed(1)}%`}
        valueColor="text-blue-400"
      />
      <DashboardCard
        title="Avg. Risk/Reward"
        value={avgRiskReward}
        valueColor="text-yellow-400"
      />
      <DashboardCard
        title={
          timeRange === '7days'
            ? 'Trades Last 7 Days'
            : timeRange === '30days'
            ? 'Trades Last 30 Days'
            : 'Trades (All Time)'
        }
        value={tradesCount}
        valueColor="text-purple-400"
      />
    </div>
  )
}

const CapitalAndChargesCards = ({
  initialCapital,
  currentCapital,
  totalCharges,
  maxDrawdown,
}) => {
  const pnl = currentCapital - initialCapital
  const pnlColor = pnl >= 0 ? 'text-green-400' : 'text-red-400'

  return (
    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <DashboardCard
        title="Initial Capital"
        value={`₹${initialCapital.toLocaleString('en-IN')}`}
        valueColor="text-cyan-400"
      />
      <DashboardCard
        title="Current Capital"
        value={`₹${currentCapital.toLocaleString('en-IN')}`}
        valueColor={pnlColor}
      />
      <DashboardCard
        title="Total Charges"
        value={`₹${totalCharges.toLocaleString('en-IN')}`}
        valueColor="text-gray-400"
      />
      <DashboardCard
        title="Max Drawdown"
        value={`₹${maxDrawdown.toLocaleString('en-IN')}`}
        valueColor="text-orange-400"
      />
    </div>
  )
}

export { PerformanceCards, CapitalAndChargesCards }
