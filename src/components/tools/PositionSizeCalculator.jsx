"use client";

import React, { useState, useEffect } from 'react';
import FormField from '@/components/FormField';

export default function PositionSizeCalculator() {
  const [accountCapital, setAccountCapital] = useState('');
  const [riskPercentage, setRiskPercentage] = useState('');
  const [entryPrice, setEntryPrice] = useState('');
  const [stopLoss, setStopLoss] = useState('');
  const [direction, setDirection] = useState('Long');

  const [maxRiskAmount, setMaxRiskAmount] = useState('');
  const [riskPerShare, setRiskPerShare] = useState('');
  const [positionSize, setPositionSize] = useState('');

  useEffect(() => {
    const capital = parseFloat(accountCapital);
    const riskPct = parseFloat(riskPercentage);
    const ep = parseFloat(entryPrice);
    const sl = parseFloat(stopLoss);

    if (isNaN(capital) || isNaN(riskPct) || capital <= 0 || riskPct <= 0) {
      setMaxRiskAmount('');
      setRiskPerShare('');
      setPositionSize('');
      return;
    }

    const calculatedMaxRiskAmount = (capital * (riskPct / 100)).toFixed(2);
    setMaxRiskAmount(calculatedMaxRiskAmount);

    if (!isNaN(ep) && !isNaN(sl)) {
      let calculatedRiskPerShare = 0;
      if (direction === 'Long') {
        calculatedRiskPerShare = ep - sl;
      } else {
        calculatedRiskPerShare = sl - ep;
      }

      setRiskPerShare(calculatedRiskPerShare.toFixed(2));

      if (calculatedRiskPerShare > 0) {
        const calculatedPositionSize = calculatedMaxRiskAmount / calculatedRiskPerShare;
        setPositionSize(Math.floor(calculatedPositionSize));
      } else {
        setPositionSize('N/A (Invalid SL)');
      }
    } else {
      setRiskPerShare('');
      setPositionSize('');
    }

  }, [accountCapital, riskPercentage, entryPrice, stopLoss, direction]);

  const resetCalculator = () => {
    setAccountCapital('');
    setRiskPercentage('');
    setEntryPrice('');
    setStopLoss('');
    setDirection('Long');
    setMaxRiskAmount('');
    setRiskPerShare('');
    setPositionSize('');
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label="Total Account Capital (₹)"
          id="accountCapital"
          type="number"
          value={accountCapital}
          onChange={(e) => setAccountCapital(e.target.value)}
          placeholder="e.g., 10000"
          step="0.01"
        />
        <FormField
          label="Risk Per Trade (%)"
          id="riskPercentage"
          type="number"
          value={riskPercentage}
          onChange={(e) => setRiskPercentage(e.target.value)}
          placeholder="e.g., 1 (for 1%)"
          step="0.1"
        />
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
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Trade Direction</label>
          <div className="flex gap-4">
            <button
              type="button"
              className={`px-4 py-2 rounded-md font-semibold text-sm transition-colors duration-200 w-1/2 ${direction === "Long" ? "bg-green-600 text-white" : "bg-zinc-700 text-gray-300 hover:bg-zinc-600"}`}
              onClick={() => setDirection("Long")}
            >
              Long (Buy)
            </button>
            <button
              type="button"
              className={`px-4 py-2 rounded-md font-semibold text-sm w-1/2 transition-colors duration-200 ${direction === "Short" ? "bg-red-600 text-white" : "bg-zinc-700 text-gray-300 hover:bg-zinc-600"}`}
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
            <p className="text-gray-300 text-sm">Max Risk Amount</p>
            <p className="text-lg font-bold text-red-400">{maxRiskAmount ? `₹${maxRiskAmount}` : '-'}</p>
          </div>
          <div>
            <p className="text-gray-300 text-sm">Risk Per Share</p>
            <p className="text-lg font-bold text-yellow-400">{riskPerShare ? `₹${riskPerShare}` : '-'}</p>
          </div>
          <div>
            <p className="text-gray-300 text-sm">Position Size (Shares/Units)</p>
            <p className="text-lg font-bold text-blue-400">{positionSize !== '' ? positionSize : '-'}</p>
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