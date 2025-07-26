
"use client";

import React, { useState } from "react";
import ToolCard from "./common/ToolCard";
import RiskRewardCalculator from "./RiskRewardCalculator";
import PositionSizeCalculator from "./PositionSizeCalculator";
import SimpleReturnsCalculator from "./SimpleReturnsCalculator";
import CompoundingCalculator from "./CompoundingCalculator";
import TradingPlanChecklist from "./TradingPlanChecklist"; // 

import {
  Calculator,
  Scale,
  LineChart,
  TrendingUp,
  Columns,
  ChevronLeft, 
} from "lucide-react";

const toolsConfig = [
  {
    id: "risk-reward",
    title: "Risk-Reward Calculator",
    description: "Calculate potential profit vs. loss for a trade.",
    icon: Scale,
    component: RiskRewardCalculator,
  },
  {
    id: "position-size",
    title: "Precision Sizer",
    description:
      "Calculate optimal position sizes with dynamic risk parameters and real-time volatility adjustments.",
    icon: Calculator,
    component: PositionSizeCalculator,
  },
  {
    id: "simple-returns",
    title: "Returns Calculator",
    description:
      "Analyze trade returns over time and visualize growth with compounding and reinvestment metrics.",
    icon: LineChart,
    component: SimpleReturnsCalculator,
  },
  {
    id: "compounding",
    title: "Compounding Calculator",
    description: "Project long-term growth of your capital.",
    icon: TrendingUp,
    component: CompoundingCalculator,
  },
  {
    id: "arbitrage", 
    title: "Arbitrage Calculator", 
    description:
      "Identify and calculate profit opportunities from price differences across markets.", 
    icon: Columns,
    component: TradingPlanChecklist, 
  },
];

export default function ToolsPage() {
  const [activeTool, setActiveTool] = useState(null);

  const ActiveToolComponent = activeTool
    ? toolsConfig.find((tool) => tool.id === activeTool)?.component
    : null;

  return (
    <div className="flex flex-col h-full bg-zinc-900 text-white p-6">
      <div className="flex justify-between items-center mb-6">
        {activeTool ? (
          <button
            onClick={() => setActiveTool(null)}
            className="text-blue-400 hover:text-blue-300 flex items-center transition-colors duration-200"
          >
            <span className="text-2xl mr-2"><ChevronLeft /></span>
            <span className="text-xl font-semibold">Back to Tools</span>
          </button>
        ) : (
          <h1 className="text-3xl font-bold text-gray-100">Trading Tools</h1>
        )}
      </div>

      {!activeTool && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {toolsConfig.map((tool) => (
            <ToolCard
              key={tool.id}
              title={tool.title}
              description={tool.description}
              icon={tool.icon}
              onClick={() => setActiveTool(tool.id)}
            />
          ))}
        </div>
      )}

      {activeTool && ActiveToolComponent && (
        <div className="bg-zinc-800 rounded-lg shadow-xl p-6 flex-grow overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-600 scrollbar-track-zinc-700">
          <h2 className="text-2xl font-semibold text-gray-100 mb-6">
            {toolsConfig.find((tool) => tool.id === activeTool)?.title}
          </h2>
          <ActiveToolComponent />
        </div>
      )}
    </div>
  );
}
