// src/app/dashboard/components/TopTrades.jsx
import React from 'react';
import Link from 'next/link';

const TradeList = ({ title, trades, isProfit }) => (
  <div className="bg-slate-800 p-6 rounded-lg shadow-md flex-1">
    <h3 className="text-lg font-semibold text-gray-200 mb-4 flex justify-between items-center">
      {title}
      <Link
        href="/all-trades"
        className="text-blue-400 hover:underline text-sm"
      >
        View All
      </Link>
    </h3>
    <div className="space-y-3">
      {trades.length > 0 ? (
        trades.map((trade, index) => (
          <div
            key={index}
            className="flex justify-between items-center text-sm"
          >
            <div>
              <p className="text-gray-300 font-medium">{trade.instrument}</p>
              <p className="text-gray-500 text-xs">
                Entry: ₹{trade.entryPrice} Exit: ₹{trade.exitPrice}
              </p>
            </div>
            <p className={`font-semibold ${isProfit ? "text-green-400" : "text-red-400"}`}>
              ₹{trade.pnlAmount.toLocaleString("en-IN")}
            </p>
          </div>
        ))
      ) : (
        <p className="text-gray-500 text-sm">
          No {isProfit ? "profit" : "losing"} trades this month.
        </p>
      )}
    </div>
  </div>
);

const TopTrades = ({ topProfitTrades, topLosingTrades }) => {
  return (
    <div className="w-full lg:w-1/4 flex flex-col gap-6">
      <TradeList title="Top 3 Profit Trades" trades={topProfitTrades} isProfit={true} />
      <TradeList title="Top 3 Losing Trades" trades={topLosingTrades} isProfit={false} />
    </div>
  );
};

export default TopTrades;