// src/app/dashboard/components/DashboardCard.jsx
import React from 'react';

const DashboardCard = ({ title, value, valueColor, change }) => (
  <div className="bg-slate-800 p-5 rounded-lg shadow-xl flex flex-col items-start justify-between relative overflow-hidden">
    <div className="absolute top-0 right-0 p-3">
      {title === "Highest P&L" && (
        <span className="text-green-500 text-2xl">📈</span>
      )}
      {title === "Win Rate" && (
        <span className="text-blue-500 text-2xl">🏆</span>
      )}
      {title === "Avg. Risk/Reward" && (
        <span className="text-yellow-500 text-2xl">⚖️</span>
      )}
      {title === "Trades This Month" && (
        <span className="text-purple-500 text-2xl">📊</span>
      )}
    </div>
    <p className="text-sm text-gray-400 font-medium mb-1">{title}</p>
    <p className={`text-3xl font-bold ${valueColor}`}>{value}</p>
    <p
      className={`text-xs ${
        change === "+" ? "text-green-400" : "text-red-400"
      } mt-2`}
    >
      {change}10% vs last month{" "}
    </p>
  </div>
);

export default DashboardCard;