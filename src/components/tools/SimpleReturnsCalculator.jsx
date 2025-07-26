"use client";

import React, { useState, useEffect } from "react";
import FormField from "@/components/FormField";

export default function SimpleReturnsCalculator() {
  const [entryPrice, setEntryPrice] = useState("");
  const [exitPrice, setExitPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [charges, setCharges] = useState("");
  const [direction, setDirection] = useState("Long");

  const [grossPnL, setGrossPnL] = useState("");
  const [netPnLAmount, setNetPnLAmount] = useState("");
  const [netPnLPercentage, setNetPnLPercentage] = useState("");
  const [initialInvestment, setInitialInvestment] = useState("");

  useEffect(() => {
    const ep = parseFloat(entryPrice);
    const exp = parseFloat(exitPrice);
    const qty = parseFloat(quantity);
    const chg = parseFloat(charges) || 0;

    if (!isNaN(ep) && !isNaN(exp) && !isNaN(qty) && qty > 0) {
      const calculatedInitialInvestment = (ep * qty).toFixed(2);
      setInitialInvestment(calculatedInitialInvestment);

      let calculatedGrossPnL = 0;
      if (direction === "Long") {
        calculatedGrossPnL = (exp - ep) * qty;
      } else {
        // Short
        calculatedGrossPnL = (ep - exp) * qty;
      }
      setGrossPnL(calculatedGrossPnL.toFixed(2));

      const calculatedNetPnLAmount = (calculatedGrossPnL - chg).toFixed(2);
      setNetPnLAmount(calculatedNetPnLAmount);

      if (parseFloat(calculatedInitialInvestment) > 0) {
        const calculatedNetPnLPercentage = (
          (calculatedNetPnLAmount / parseFloat(calculatedInitialInvestment)) *
          100
        ).toFixed(2);
        setNetPnLPercentage(calculatedNetPnLPercentage);
      } else {
        setNetPnLPercentage("N/A");
      }
    } else {
      setGrossPnL("");
      setNetPnLAmount("");
      setNetPnLPercentage("");
      setInitialInvestment("");
    }
  }, [entryPrice, exitPrice, quantity, charges, direction]);

  const resetCalculator = () => {
    setEntryPrice("");
    setExitPrice("");
    setQuantity("");
    setCharges("");
    setDirection("Long");
    setGrossPnL("");
    setNetPnLAmount("");
    setNetPnLPercentage("");
    setInitialInvestment("");
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
          label="Exit Price"
          id="exitPrice"
          type="number"
          value={exitPrice}
          onChange={(e) => setExitPrice(e.target.value)}
          placeholder="e.g., 103.00"
          step="0.01"
        />
        <FormField
          label="Quantity"
          id="quantity"
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          placeholder="e.g., 100"
        />
        <FormField
          label="Charges/Brokerage (₹)"
          id="charges"
          type="number"
          value={charges}
          onChange={(e) => setCharges(e.target.value)}
          placeholder="e.g., 25.00"
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-gray-300 text-sm">Initial Investment</p>
            <p className="text-lg font-bold text-gray-200">
              {initialInvestment ? `₹${initialInvestment}` : "-"}
            </p>{" "}
            {/* Changed $ to ₹ */}
          </div>
          <div>
            <p className="text-gray-300 text-sm">Gross P&L</p>
            <p
              className={`text-lg font-bold ${
                grossPnL > 0
                  ? "text-green-400"
                  : grossPnL < 0
                  ? "text-red-400"
                  : "text-gray-200"
              }`}
            >
              {grossPnL ? `₹${grossPnL}` : "-"} {/* Changed $ to ₹ */}
            </p>
          </div>
          <div>
            <p className="text-gray-300 text-sm">Net P&L (Amount)</p>
            <p
              className={`text-lg font-bold ${
                netPnLAmount > 0
                  ? "text-green-400"
                  : netPnLAmount < 0
                  ? "text-red-400"
                  : "text-gray-200"
              }`}
            >
              {netPnLAmount ? `₹${netPnLAmount}` : "-"} {/* Changed $ to ₹ */}
            </p>
          </div>
          <div>
            <p className="text-gray-300 text-sm">Net P&L (%)</p>
            <p
              className={`text-lg font-bold ${
                netPnLPercentage > 0
                  ? "text-green-400"
                  : netPnLPercentage < 0
                  ? "text-red-400"
                  : "text-gray-200"
              }`}
            >
              {netPnLPercentage ? `${netPnLPercentage}%` : "-"}
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
