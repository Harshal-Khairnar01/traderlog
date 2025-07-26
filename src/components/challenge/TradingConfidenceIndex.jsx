// src/components/challenge/TradingConfidenceIndex.jsx
import React, { useMemo } from 'react';

export default function TradingConfidenceIndex({ tradeHistory }) {
  // Calculate confidence based on trade history
  const { confidenceLevel, confidencePercentage } = useMemo(() => {
    if (!tradeHistory || tradeHistory.length === 0) {
      return { confidenceLevel: 'Low', confidencePercentage: 10 };
    }

    // Example simple logic:
    // More positive P&L implies higher confidence
    const totalPnl = tradeHistory.reduce((sum, trade) => sum + trade.pnl, 0);
    const winningTrades = tradeHistory.filter(trade => trade.pnl > 0).length;
    const totalTrades = tradeHistory.length;
    const winRate = totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0;

    let level = 'Low';
    let percentage = 10; // Start low

    if (totalPnl > 5000 && winRate > 60) {
        level = 'High';
        percentage = 90;
    } else if (totalPnl > 0 && winRate > 40) {
        level = 'Medium';
        percentage = 50;
    }

    return { confidenceLevel: level, confidencePercentage: percentage };

  }, [tradeHistory]);


  // Determine bar color based on confidence level
  const barFillColor = confidenceLevel === 'High' ? 'bg-green-500' : confidenceLevel === 'Medium' ? 'bg-yellow-500' : 'bg-red-500';

  return (
    <div className="bg-zinc-800 p-6 rounded-lg shadow-lg mb-8 border border-zinc-700">
      <h3 className="text-xl font-semibold text-gray-100 mb-4">Trading Confidence Index</h3>
      <div className="relative w-full h-3 bg-zinc-700 rounded-full mb-4">
        {/* Background gradient (optional, for visual fidelity) */}
        <div className="absolute left-0 top-0 h-full w-full rounded-full"
            style={{
                background: 'linear-gradient(to right, #EF4444, #F59E0B, #10B981)' // Red -> Yellow -> Green
            }}
        ></div>
        {/* The actual confidence marker/thumb */}
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
  );
}