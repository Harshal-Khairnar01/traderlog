"use client";

import React, { useState, useEffect } from "react";
import FormField from "@/components/FormField";

export default function CompoundingCalculator() {
  const [initialCapital, setInitialCapital] = useState("");
  const [returnRate, setReturnRate] = useState("");
  const [periods, setPeriods] = useState("");
  const [periodType, setPeriodType] = useState("Years");
  const [futureValue, setFutureValue] = useState("");
  const [totalProfit, setTotalProfit] = useState("");

  useEffect(() => {
    const principal = parseFloat(initialCapital);
    let rate = parseFloat(returnRate);
    let nPeriods = parseFloat(periods);

    if (
      !isNaN(principal) &&
      !isNaN(rate) &&
      !isNaN(nPeriods) &&
      principal > 0 &&
      nPeriods > 0
    ) {
      let adjustedRate = rate / 100;
      let adjustedNPeriods = nPeriods;

      if (periodType === "Months") {
        adjustedRate = rate / 100 / 12;
      } else if (periodType === "Quarters") {
        adjustedRate = rate / 100 / 4;
      }

      const fv = principal * Math.pow(1 + adjustedRate, adjustedNPeriods);
      setFutureValue(fv.toFixed(2));
      setTotalProfit((fv - principal).toFixed(2));
    } else {
      setFutureValue("");
      setTotalProfit("");
    }
  }, [initialCapital, returnRate, periods, periodType]);

  const resetCalculator = () => {
    setInitialCapital("");
    setReturnRate("");
    setPeriods("");
    setPeriodType("Years");
    setFutureValue("");
    setTotalProfit("");
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label="Initial Capital (₹)"
          id="initialCapital"
          type="number"
          value={initialCapital}
          onChange={(e) => setInitialCapital(e.target.value)}
          placeholder="e.g., 10000"
          step="0.01"
        />
        <FormField
          label="Average Return Rate (%)"
          id="returnRate"
          type="number"
          value={returnRate}
          onChange={(e) => setReturnRate(e.target.value)}
          placeholder="e.g., 10 (for 10% annually)"
          step="0.1"
        />
        <FormField
          label={`Number of ${periodType}`}
          id="periods"
          type="number"
          value={periods}
          onChange={(e) => setPeriods(e.target.value)}
          placeholder="e.g., 5"
        />
        <FormField
          label="Period Type"
          id="periodType"
          type="select"
          options={["Years", "Months", "Quarters"]}
          value={periodType}
          onChange={(e) => setPeriodType(e.target.value)}
        />
      
      </div>

      <div className="mt-8 p-4 bg-zinc-700 rounded-md">
        <h3 className="text-xl font-semibold text-gray-100 mb-4">Results</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
          <div>
            <p className="text-gray-300 text-sm">Projected Future Value</p>
            <p className="text-lg font-bold text-green-400">
              {futureValue ? `₹${futureValue}` : "-"} 
            </p>
          </div>
          <div>
            <p className="text-gray-300 text-sm">Total Profit Generated</p>
            <p className="text-lg font-bold text-blue-400">
              {totalProfit ? `₹${totalProfit}` : "-"}
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