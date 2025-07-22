"use client";

import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import CapitalTracker from "./CapitalTracker";

const COLORS = [
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff8042",
  "#f87171",
  "#60a5fa",
  "#facc15",
  "#34d399",
  "#c084fc",
];

export default function TradePieCharts({ tradeHistory }) {
  if (!Array.isArray(tradeHistory) || tradeHistory.length === 0) {
    return (
      <p className="text-center text-red-600 font-medium">
        No trade data available to display pie charts.
      </p>
    );
  }

  const mistakeChecklistData = () => {
    const map = {};
    tradeHistory.forEach((trade) => {
      if (Array.isArray(trade.mistakeChecklist)) {
        trade.mistakeChecklist.forEach((mistake) => {
          map[mistake] = (map[mistake] || 0) + 1;
        });
      }
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  };

  const assetDistributionData = () => {
    const map = {};
    tradeHistory.forEach((trade) => {
      const asset = trade.instrument || "Unknown";
      if (!map[asset]) map[asset] = { count: 0, profit: 0 };
      map[asset].count++;
      map[asset].profit += trade.netPnl;
    });
    return Object.entries(map).map(([name, { count, profit }]) => ({
      name,
      value: count,
      profit,
    }));
  };

  const exitReasonData = () => {
    const map = {};
    tradeHistory.forEach((trade) => {
      const reason = trade.exitReason || "Unknown";
      map[reason] = (map[reason] || 0) + 1;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  };

  const renderPieChart = (title, data) => (
    <div className="w-full sm:w-[32%] bg-zinc-50 rounded-lg shadow border border-zinc-200 p-4">
      <h3 className="text-lg font-semibold mb-4 text-slate-800 text-center">
        {title}
      </h3>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
            label={({ name, percent }) =>
              `${name} (${(percent * 100).toFixed(0)}%)`
            }
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              const entry = payload[0].payload;
              return (
                <div className="bg-zinc-800 text-white p-2 border border-zinc-600 rounded shadow text-sm">
                  <p className="font-semibold">{entry.name}</p>
                  <p>Count: {entry.value}</p>
                </div>
              );
            }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );

  const mistakeData = mistakeChecklistData();
  const assetData = assetDistributionData();
  const exitData = exitReasonData();

  return (
    <>
    
    
    <div className="flex flex-col sm:flex-row flex-wrap justify-between gap-6">
      {mistakeData.length > 0 &&
        renderPieChart("Mistake Tags Frequency", mistakeData)}

      {assetData.length > 0 &&
        renderPieChart("Asset Distribution", assetData)}

      {exitData.length > 0 &&
        renderPieChart("Exit Reason Distribution", exitData)}
    </div>
    <div>
      <CapitalTracker/>
    </div>
      </>
  );
}
