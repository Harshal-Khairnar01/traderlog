"use client";

import React, { useState, useEffect } from "react";
import FormField from "@/components/FormField";

export default function RiskRewardCalculator() {
  const [entryPrice, setEntryPrice] = useState("");
  const [stopLoss, setStopLoss] = useState("");
  const [targetPrice, setTargetPrice] = useState("");
  const [direction, setDirection] = useState("Long");

  const [risk, setRisk] = useState("");
  const [reward, setReward] = useState("");
  const [riskRewardRatio, setRiskRewardRatio] = useState("");

  useEffect(() => {
    const ep = parseFloat(entryPrice);
    const sl = parseFloat(stopLoss);
    const tp = parseFloat(targetPrice);

    if (!isNaN(ep) && !isNaN(sl) && !isNaN(tp)) {
      let calculatedRisk = 0;
      let calculatedReward = 0;

      if (direction === "Long") {
        calculatedRisk = ep - sl;
        calculatedReward = tp - ep;
      } else {
        calculatedRisk = sl - ep;
        calculatedReward = ep - tp;
      }

      setRisk(calculatedRisk.toFixed(2));
      setReward(calculatedReward.toFixed(2));

      if (calculatedRisk > 0 && calculatedReward > 0) {
        setRiskRewardRatio((calculatedReward / calculatedRisk).toFixed(2));
      } else {
        setRiskRewardRatio("N/A");
      }
    } else {
      setRisk("");
      setReward("");
      setRiskRewardRatio("");
    }
  }, [entryPrice, stopLoss, targetPrice, direction]);

  const resetCalculator = () => {
    setEntryPrice("");
    setStopLoss("");
    setTargetPrice("");
    setDirection("Long");
    setRisk("");
    setReward("");
    setRiskRewardRatio("");
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label="Entry Price"
          id="entryPrice"
          type="number"
          value={entryPrice}
          onChange={(e) => setEntryPrice(e.target.value)}
          placeholder="e.g., 100.50"
          step="0.01"
        />
        <FormField
          label="Stop Loss"
          id="stopLoss"
          type="number"
          value={stopLoss}
          onChange={(e) => setStopLoss(e.target.value)}
          placeholder="e.g., 99.00"
          step="0.01"
        />
        <FormField
          label="Target Price"
          id="targetPrice"
          type="number"
          value={targetPrice}
          onChange={(e) => setTargetPrice(e.target.value)}
          placeholder="e.g., 103.00"
          step="0.01"
        />
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Trade Direction
          </label>
          <div className="flex gap-4">
            <button
              type="button"
              className={`px-4 py-2 rounded-md font-semibold text-sm transition-colors duration-200 w-1/2 ${
                direction === "Long"
                  ? "bg-green-600 text-white"
                  : "bg-zinc-700 text-gray-300 hover:bg-zinc-600"
              }`}
              onClick={() => setDirection("Long")}
            >
              Long (Buy)
            </button>
            <button
              type="button"
              className={`px-4 py-2 rounded-md font-semibold text-sm w-1/2 transition-colors duration-200 ${
                direction === "Short"
                  ? "bg-red-600 text-white"
                  : "bg-zinc-700 text-gray-300 hover:bg-zinc-600"
              }`}
              onClick={() => setDirection("Short")}
            >
              Short (Sell)
            </button>
          </div>
        </div>
      </div>

      <div className="mt-8 p-4 bg-zinc-700 rounded-md">
        <h3 className="text-xl font-semibold text-gray-100 mb-4">Results</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-gray-300 text-sm">Potential Risk</p>
            <p className="text-lg font-bold text-red-400">
              {risk ? `₹${risk}` : "-"}
            </p>
          </div>
          <div>
            <p className="text-gray-300 text-sm">Potential Reward</p>
            <p className="text-lg font-bold text-green-400">
              {reward ? `₹${reward}` : "-"}
            </p>
          </div>
          <div>
            <p className="text-gray-300 text-sm">Risk:Reward Ratio</p>
            <p className="text-lg font-bold text-blue-400">
              {riskRewardRatio ? `1:${riskRewardRatio}` : "-"}
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-end mt-6">
        <button
          onClick={resetCalculator}
          className="px-6 py-2 rounded-md text-zinc-300 border border-zinc-600 hover:bg-zinc-700 hover:text-white transition-colors duration-200"
        >
          Reset
        </button>
      </div>
    </div>
  );
}