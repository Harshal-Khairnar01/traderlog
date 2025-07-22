"use client";

import React, { useEffect, useState } from "react";

const CapitalTargetTracker = () => {
  const [initialCapital, setInitialCapital] = useState(0);
  const [targetAmount, setTargetAmount] = useState(100000);
  const [profitPerDay, setProfitPerDay] = useState(1000);
  const [daysPerWeek, setDaysPerWeek] = useState(3);
  const [requiredDays, setRequiredDays] = useState(0);
  const [requiredWeeks, setRequiredWeeks] = useState(0);

  useEffect(() => {
    // Fetching from localStorage only once on mount
    const storedTrades = JSON.parse(localStorage.getItem("trades")) || [];
    const totalPnl = storedTrades.reduce(
      (acc, trade) => acc + Number(trade.netPnl || 0),
      0
    );
    setInitialCapital(totalPnl);
  }, []);

  useEffect(() => {
    const remaining = targetAmount - initialCapital;

    if (remaining <= 0) {
      setRequiredDays(0);
      setRequiredWeeks(0);
      return;
    }

    if (profitPerDay > 0 && daysPerWeek > 0) {
      const days = Math.ceil(remaining / profitPerDay);
      const weeks = Math.ceil(days / daysPerWeek);
      setRequiredDays(days);
      setRequiredWeeks(weeks);
    } else {
      setRequiredDays(0);
      setRequiredWeeks(0);
    }
  }, [initialCapital, targetAmount, profitPerDay, daysPerWeek]);

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow-lg space-y-6 text-gray-800">
      <h2 className="text-2xl font-bold text-center text-indigo-600">
        📊 Capital Target Tracker
      </h2>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="font-semibold">Initial Capital:</span>
          <span className="text-green-600 font-bold">
            ₹{initialCapital.toFixed(2)}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <label className="font-semibold">🎯 Target Amount:</label>
          <input
            type="number"
            value={targetAmount}
            onChange={(e) => setTargetAmount(Number(e.target.value))}
            className="border px-3 py-1 rounded-md w-32 text-right"
          />
        </div>

        <div className="flex justify-between items-center">
          <label className="font-semibold">📈 Profit per Day:</label>
          <input
            type="number"
            value={profitPerDay}
            onChange={(e) => setProfitPerDay(Number(e.target.value))}
            className="border px-3 py-1 rounded-md w-32 text-right"
          />
        </div>

        <div className="flex justify-between items-center">
          <label className="font-semibold">📅 Trading Days per Week:</label>
          <input
            type="number"
            value={daysPerWeek}
            onChange={(e) => setDaysPerWeek(Number(e.target.value))}
            className="border px-3 py-1 rounded-md w-32 text-right"
          />
        </div>
      </div>

      <div className="mt-6 p-4 rounded-lg bg-gray-100 text-center">
        <p className="text-lg font-medium text-gray-700">
          ⏳ You need{" "}
          <span className="text-indigo-600 font-bold">{requiredDays}</span>{" "}
          trading days
        </p>
        <p className="text-lg font-medium text-gray-700">
          🗓️ That’s about{" "}
          <span className="text-indigo-600 font-bold">{requiredWeeks}</span>{" "}
          weeks
        </p>
      </div>
    </div>
  );
};

export default CapitalTargetTracker;
