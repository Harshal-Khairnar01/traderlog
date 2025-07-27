
import React from 'react';
import { TrendingUp, Trophy, Scale, BarChart2 } from 'lucide-react'; 

const DashboardCard = ({ title, value, valueColor, change }) => (
  <div className="bg-slate-800 p-5 rounded-lg shadow-xl flex flex-col items-start justify-between relative overflow-hidden">
    <div className="absolute top-0 right-0 p-3">
      {title === "Highest P&L" && (
        <TrendingUp className="text-green-500 text-2xl" size={24} /> 
      )}
      {title === "Win Rate" && (
        <Trophy className="text-blue-500 text-2xl" size={24} /> 
      )}
      {title === "Avg. Risk/Reward" && (
        <Scale className="text-yellow-500 text-2xl" size={24} /> 
      )}
      {title === "Trades This Month" && (
        <BarChart2 className="text-purple-500 text-2xl" size={24} /> 
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
