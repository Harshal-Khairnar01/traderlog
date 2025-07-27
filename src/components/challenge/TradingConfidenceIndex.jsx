


import React from 'react';
import { CheckCircle, AlertTriangle, XCircle } from "lucide-react";

const TradingConfidenceIndex = ({ confidenceLevel }) => {
  const safeConfidenceLevel =
    typeof confidenceLevel === "number" && !isNaN(confidenceLevel)
      ? Math.min(100, Math.max(0, confidenceLevel))
      : 0;

  let color = "";
  let icon = null;
  let label = "";

  if (safeConfidenceLevel < 40) {
    color = "bg-red-500";
    icon = <XCircle className="text-red-400" size={24} />;
    label = "Low Confidence";
  } else if (safeConfidenceLevel >= 40 && safeConfidenceLevel < 75) {
    color = "bg-yellow-500";
    icon = <AlertTriangle className="text-yellow-400" size={24} />;
    label = "Moderate Confidence";
  } else {
    color = "bg-green-500";
    icon = <CheckCircle className="text-green-400" size={24} />;
    label = "High Confidence";
  }

  return (
    <div className="bg-gray-800 p-6 rounded-2xl shadow-lg mx-auto text-white w-full">
      <h2 className="text-2xl font-bold mb-4">Trading Confidence Index</h2>

      <div className="flex gap-3 mb-4 px-5 items-center">
        {icon}
        <p className="text-lg font-semibold">{label}</p>
      </div>

      <div className="relative w-full h-4 rounded-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 overflow-hidden">
        <div
          className="absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2 w-5 h-5 bg-white rounded-full border-2 border-gray-900 shadow-md transition-all duration-700"
          style={{ left: `${safeConfidenceLevel}%` }}
        ></div>
      </div>

      <div className="flex justify-between text-sm mt-2 text-gray-400">
        <span>Low</span>
        <span>Medium</span>
        <span>High</span>
      </div>

      <div className="text-center mt-6">
        <p className="text-lg font-semibold">
          Current Confidence:{" "}
          <span className={`${color} text-white px-2 py-1 rounded-md`}>
            {safeConfidenceLevel.toFixed(0)}%
          </span>
        </p>
        <p className="text-sm text-gray-400 mt-1">
          Based on recent trade accuracy, P&L consistency, and risk management
        </p>
      </div>
    </div>
  );
};

export default TradingConfidenceIndex;
