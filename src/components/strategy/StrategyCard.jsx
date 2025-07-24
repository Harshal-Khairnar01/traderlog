
import React from 'react';

export default function StrategyCard({ strategyName, usage, profitFactor, totalProfit, winRate, riskPerTrade, onViewDetailsClick }) {
  const isProfitPositive = totalProfit >= 0;
  const profitColorClass = isProfitPositive ? 'text-green-500' : 'text-red-500';
  const winRateColorClass = winRate >= 50 ? 'text-green-400' : 'text-red-400';
  const profitFactorColorClass = profitFactor >= 1 ? 'text-green-400' : (profitFactor < 0 ? 'text-red-400' : 'text-yellow-400');
  const riskPerTradeColorClass = riskPerTrade <= 5 ? 'text-green-400' : (riskPerTrade <= 10 ? 'text-yellow-400' : 'text-red-400');


  return (
    <div className="bg-zinc-800 p-6 rounded-lg shadow-lg border border-zinc-700 hover:border-blue-500 transition-all duration-200">
      <h3 className="text-xl font-bold text-gray-100 mb-2 truncate">{strategyName}</h3>
      <p className="text-sm text-gray-400 mb-4">Strategy Usage: <span className="font-semibold text-gray-200">{usage.toFixed(1)}%</span></p>

      <div className="grid grid-cols-2 gap-y-3">
        <div>
          <p className="text-sm text-gray-400">Profit Factor</p>
          <p className={`text-lg font-semibold ${profitFactorColorClass}`}>
            {profitFactor.toFixed(2)}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-400">Risk/Trade</p>
          <p className={`text-lg font-semibold ${riskPerTradeColorClass}`}>
            {riskPerTrade.toFixed(2)}%
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-400">Total Profit</p>
          <p className={`text-lg font-semibold ${profitColorClass}`}>
            {totalProfit >= 0 ? '+' : ''}{totalProfit.toFixed(2)}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-400">Win Rate</p>
          <p className={`text-lg font-semibold ${winRateColorClass}`}>
            {winRate.toFixed(1)}%
          </p>
        </div>
      </div>

      <button
        onClick={() => onViewDetailsClick(strategyName)} 
        className="mt-6 w-full bg-blue-600 text-white py-2 rounded-md font-semibold hover:bg-blue-700 transition-colors duration-200"
      >
        View Details
      </button>
    </div>
  );
}