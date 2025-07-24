// src/app/dashboard/components/DashboardCards.jsx
import React from 'react';
import DashboardCard from '@/components/dashboard/DashboardCard';

const DashboardCards = ({ highestPnl, winRate, avgRiskReward, tradesThisMonthCount }) => {
  return (
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
  );
};

export default DashboardCards;