// src/components/challenge/ChallengeStats.jsx
import React, { useMemo } from 'react';
import { LineChart, DollarSign, ArrowUp, ArrowDown } from 'lucide-react'; // Lucide icons
import { getConfidenceLevel } from '@/hooks/useChallengeData'; // Assuming getConfidenceLevel is exported from useChallengeData or a utility

export default function ChallengeStats({ calculatedMetrics, challengeTrades }) {
  const {
    winRate,
    avgRiskReward,
    highestProfitDay,
    maxDrawdown,
  } = calculatedMetrics;

  // Calculate confidence level using a utility or directly here
  const { confidenceLevel, confidencePercentage } = useMemo(() => {
    if (!challengeTrades || challengeTrades.length === 0) {
      return { confidenceLevel: 'Low', confidencePercentage: 10 };
    }

    const totalPnl = challengeTrades.reduce((sum, trade) => sum + (typeof trade.pnlAmount === 'number' ? trade.pnlAmount : 0), 0);
    const winningTrades = challengeTrades.filter(trade => (typeof trade.pnlAmount === 'number' && trade.pnlAmount > 0)).length;
    const totalTrades = challengeTrades.length;
    const currentWinRate = totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0;

    let level = 'Low';
    let percentage = 10;

    // Example simple logic for confidence
    if (totalPnl > 5000 && currentWinRate > 60) {
        level = 'High';
        percentage = 90;
    } else if (totalPnl > 0 && currentWinRate > 40) {
        level = 'Medium';
        percentage = 50;
    }

    return { confidenceLevel: level, confidencePercentage: percentage };

  }, [challengeTrades]);


  return (
    <div className="bg-zinc-800 p-6 rounded-lg shadow-lg mb-8 border border-zinc-700">
      <h3 className="text-xl font-semibold text-gray-100 mb-4">Key Performance Indicators</h3>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Win Rate Card */}
        <div className="bg-zinc-700 p-5 rounded-lg flex flex-col items-center justify-center text-center shadow-md border border-zinc-600">
          <div className="mb-3">
            <LineChart className="text-blue-400 text-xl" />
          </div>
          <p className="text-gray-400 text-sm font-medium mb-1">Win Rate</p>
          <p className="text-2xl font-bold text-gray-100">{winRate.toFixed(2)}%</p>
        </div>

        {/* Avg Risk:Reward Card */}
        <div className="bg-zinc-700 p-5 rounded-lg flex flex-col items-center justify-center text-center shadow-md border border-zinc-600">
          <div className="mb-3">
            <DollarSign className="text-green-400 text-xl" />
          </div>
          <p className="text-gray-400 text-sm font-medium mb-1">Avg Risk:Reward</p>
          <p className="text-2xl font-bold text-gray-100">{avgRiskReward}</p>
        </div>

        {/* Highest Profit Day Card */}
        <div className="bg-zinc-700 p-5 rounded-lg flex flex-col items-center justify-center text-center shadow-md border border-zinc-600">
          <div className="mb-3">
            <ArrowUp className="text-emerald-400 text-xl" />
          </div>
          <p className="text-gray-400 text-sm font-medium mb-1">Highest Profit Day</p>
          <p className="text-2xl font-bold text-gray-100">₹{highestProfitDay.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
        </div>

        {/* Max Drawdown Card */}
        <div className="bg-zinc-700 p-5 rounded-lg flex flex-col items-center justify-center text-center shadow-md border border-zinc-600">
          <div className="mb-3">
            <ArrowDown className="text-red-400 text-xl" />
          </div>
          <p className="text-gray-400 text-sm font-medium mb-1">Max Drawdown</p>
          <p className="text-2xl font-bold text-gray-100">{maxDrawdown.toFixed(2)}%</p>
        </div>
      </div>

      {/* Trading Confidence Index */}
      <div className="mt-6 p-4 bg-zinc-700 rounded-lg shadow-md border border-zinc-600">
        <h3 className="text-xl font-semibold text-gray-100 mb-4 text-center">Trading Confidence Index</h3>
        <div className="relative w-full h-3 bg-zinc-600 rounded-full mb-4">
          <div className="absolute left-0 top-0 h-full w-full rounded-full"
              style={{
                  background: 'linear-gradient(to right, #EF4444, #F59E0B, #10B981)' // Red -> Yellow -> Green
              }}
          ></div>
          <div className="absolute h-full w-3 bg-white rounded-full -translate-x-1/2" style={{ left: `${confidencePercentage}%` }}></div>
        </div>
        <div className="flex justify-between text-sm text-gray-400 mb-4">
          <span>Low Confidence</span>
          <span>High Confidence</span>
        </div>
        <p className="text-center text-lg font-medium text-gray-200">
          Your current confidence level: <span className={`font-bold ${
              confidenceLevel === 'High' ? 'text-green-400' :
              confidenceLevel === 'Medium' ? 'text-yellow-400' : 'text-red-400'
          }`}>{confidenceLevel}</span>
        </p>
        <p className="text-center text-sm text-gray-400 mt-1">Based on your recent trading performance and consistency</p>
      </div>
    </div>
  );
}