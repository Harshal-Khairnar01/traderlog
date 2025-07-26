// src/components/challenge/KeyMetricsCards.jsx
import React from 'react';
// Import icons from lucide-react
import { LineChart, DollarSign, ArrowUp, ArrowDown } from 'lucide-react';

export default function KeyMetricsCards({ metrics }) {
  const { progressToTarget, avgRiskReward, highestProfitDay, maxDrawdown } = metrics;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Progress to Target Card */}
      <div className="bg-zinc-800 p-5 rounded-lg shadow-lg border border-zinc-700 flex flex-col justify-between">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-md text-gray-300 font-medium">Progress to Target</h3>
          <LineChart className="text-blue-400 text-xl" /> {/* Changed icon */}
        </div>
        <p className="text-3xl font-bold text-gray-100">{progressToTarget?.toFixed(2)}%</p>
        <p className="text-sm text-gray-400 mt-2">Track your progress</p>
      </div>

      {/* Avg Risk:Reward Card */}
      <div className="bg-zinc-800 p-5 rounded-lg shadow-lg border border-zinc-700 flex flex-col justify-between">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-md text-gray-300 font-medium">Avg Risk:Reward</h3>
          <DollarSign className="text-green-400 text-xl" /> {/* Changed icon */}
        </div>
        <p className="text-3xl font-bold text-gray-100">{avgRiskReward || 'N/A'}</p>
        <p className="text-sm text-gray-400 mt-2">Start trading to see metrics</p>
      </div>

      {/* Highest Profit Day Card */}
      <div className="bg-zinc-800 p-5 rounded-lg shadow-lg border border-zinc-700 flex flex-col justify-between">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-md text-gray-300 font-medium">Highest Profit Day</h3>
          <ArrowUp className="text-emerald-400 text-xl" /> {/* Changed icon */}
        </div>
        <p className="text-3xl font-bold text-gray-100">₹{highestProfitDay?.toLocaleString('en-IN')}</p>
        <p className="text-sm text-gray-400 mt-2">
            {highestProfitDay > 0 ? new Date().toLocaleDateString('en-IN', {day: 'numeric', month: 'short', year: '2-digit'}) : 'No profitable day yet'}
        </p>
      </div>

      {/* Max Drawdown Card */}
      <div className="bg-zinc-800 p-5 rounded-lg shadow-lg border border-zinc-700 flex flex-col justify-between">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-md text-gray-300 font-medium">Max Drawdown</h3>
          <ArrowDown className="text-red-400 text-xl" /> {/* Changed icon */}
        </div>
        <p className="text-3xl font-bold text-gray-100">{maxDrawdown?.toFixed(2)}%</p>
        <p className="text-sm text-gray-400 mt-2">No drawdown data</p>
      </div>
    </div>
  );
}