
import React from 'react';
import {
  TrendingUp,
  TrendingDown,
  Info,
  BarChart,
  Percent,
  Trophy
} from 'lucide-react';

const MetricCard = ({ title, value, date, trend }) => {
  const valueColorClass = title === "Highest Profit Day" ? "text-green-500" : "text-white";
  const trendIcon =
    trend === 'up' ? <TrendingUp size={16} className="text-green-400" /> :
    trend === 'down' ? <TrendingDown size={16} className="text-red-400" /> :
    null;

  const getIcon = () => {
    switch (title) {
      case 'Progress to Target':
        return <Percent size={16} className="text-gray-400" />;
      case 'Avg Risk:Reward':
        return <BarChart size={16} className="text-gray-400" />;
      case 'Highest Profit Day':
        return <Trophy size={16} className="text-yellow-500" />;
      case 'Max Drawdown':
        return <TrendingDown size={16} className="text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-gray-800 p-5 rounded-lg shadow-md flex flex-col justify-between min-h-[100px]">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {getIcon()}
          <h3 className="text-gray-400 text-sm font-medium">{title}</h3>
          {title === "Avg Risk:Reward" && (
            <div className="relative group">
              <Info size={14} className="text-gray-500 cursor-pointer" />
              <div className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 w-48 p-2 text-xs text-white bg-gray-700 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                Start trading to see metrics
              </div>
            </div>
          )}
        </div>
        {trendIcon && <div>{trendIcon}</div>}
      </div>
      <p className={`text-2xl font-bold ${valueColorClass}`}>
        {typeof value === 'number' && title !== "Max Drawdown" && title !== "Progress to Target" ? `₹${value.toLocaleString()}` : value}
        {title === "Max Drawdown" && value !== null ? `%` : ''}
        {title === "Progress to Target" && value !== null ? `%` : ''}
      </p>
      {date && <p className="text-xs text-gray-500 mt-1">{date}</p>}
    </div>
  );
};

const PerformanceMetricsRow = ({ performance, progressToTarget }) => {
  const { avgRiskReward, highestProfitDay, highestProfitDayDate, maxDrawdown } = performance;

  return (
    <>
      <MetricCard title="Progress to Target" value={(progressToTarget * 100).toFixed(2)} />
      <MetricCard title="Avg Risk:Reward" value={avgRiskReward === null ? "N/A" : avgRiskReward.toFixed(2)} />
      <MetricCard title="Highest Profit Day" value={highestProfitDay} date={highestProfitDayDate} trend="up" />
      <MetricCard title="Max Drawdown" value={maxDrawdown.toFixed(2)} trend="down" />
    </>
  );
};

export default PerformanceMetricsRow;
