"use client";

import React, { useState, useEffect } from "react";
import FormField from "./FormField";

export default function NewTradeEntryForm({ addTrade }) {
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    instrument: "",
    tradeType: "Intraday",
    direction: "Buy",
    quantity: "",
    riskReward: "",
    targetPoints: "",
    stopLossPoints: "",
    exitReason: "Target Hit",
    grossPnl: "",
    netPnl: "",
    charges: "",
    strategyUsed: "Breakout",
    setupName: "",
    confirmationIndicators: "",
    confidenceLevel: "5",
    emotionsBefore: "Calm",
    emotionsAfter: "Satisfied",
    tradeNotes: "",
    mistakes: "",
    whatDidWell: "",
    tags: "",
  });

  // Auto-calculate net P&L
  useEffect(() => {
    const gross = parseFloat(formData.grossPnl);
    const charge = parseFloat(formData.charges);
    if (!isNaN(gross) && !isNaN(charge)) {
      setFormData((prev) => ({
        ...prev,
        netPnl: (gross - charge).toFixed(2),
      }));
    }
  }, [formData.grossPnl, formData.charges]);

  const handleChange = (e) => {
    const { id, value, type, name } = e.target;
    if (type === "radio") {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    } else if (type === "file") {
      console.log("File selected:", e.target.files[0]?.name);
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [id]: value,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const requiredFields = ["date", "instrument", "quantity"];
    for (let field of requiredFields) {
      if (!formData[field]) {
        console.error("Please fill in all required trade details.");
        return;
      }
    }

    const tradeEntry = {
      ...formData,
      quantity: Number(formData.quantity),
      riskReward: Number(formData.riskReward),
      targetPoints: Number(formData.targetPoints),
      stopLossPoints: Number(formData.stopLossPoints),
      grossPnl: formData.grossPnl ? Number(formData.grossPnl) : null,
      netPnl: !isNaN(Number(formData.netPnl))
        ? Number(formData.netPnl)
        : Number(formData.grossPnl || 0) - Number(formData.charges || 0),
      charges: formData.charges ? Number(formData.charges) : null,
      confidenceLevel: Number(formData.confidenceLevel),
    };

    addTrade(tradeEntry);

    // Reset form
    setFormData({
      date: "",
      time: "",
      instrument: "",
      tradeType: "Intraday",
      direction: "Buy",
      quantity: "",
      riskReward: "",
      targetPoints: "",
      stopLossPoints: "",
      exitReason: "Target Hit",
      grossPnl: "",
      netPnl: "",
      charges: "",
      strategyUsed: "Breakout",
      setupName: "",
      confirmationIndicators: "",
      confidenceLevel: "5",
      emotionsBefore: "Calm",
      emotionsAfter: "Satisfied",
      tradeNotes: "",
      mistakes: "",
      whatDidWell: "",
      tags: "",
    });

    console.log(`Trade submitted and added to history!`);
  };

  return (
    <div className="bg-zinc-100 p-6 rounded-lg shadow-inner">
      <h3 className="text-2xl font-semibold text-gray-700 mb-6">
        Enter New Trade Details
      </h3>
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <FormField
            label="Date"
            id="date"
            type="date"
            value={formData.date}
            onChange={handleChange}
          />
          <FormField
            label="Time"
            id="time"
            type="time"
            value={formData.time}
            onChange={handleChange}
          />
          <FormField
            label="Symbol / Asset Name"
            id="instrument"
            type="text"
            placeholder="e.g., NIFTY"
            value={formData.instrument}
            onChange={handleChange}
          />
          <FormField
            label="Type of Trade"
            id="tradeType"
            type="select"
            options={["Intraday", "Swing", "Positional", "Scalping"]}
            value={formData.tradeType}
            onChange={handleChange}
          />
          <FormField
            label="Direction"
            id="direction"
            type="radio-group"
            className="col-span-1 md:col-span-2"
            options={[
              { label: "Buy", value: "Buy" },
              { label: "Sell", value: "Sell" },
            ]}
            value={formData.direction}
            onChange={handleChange}
          />
          <FormField
            label="Quantity"
            id="quantity"
            type="number"
            placeholder="e.g., 50"
            value={formData.quantity}
            onChange={handleChange}
          />
          <FormField
            label="Risk to Reward"
            id="riskReward"
            type="number"
            placeholder="e.g., 2.5"
            value={formData.riskReward}
            onChange={handleChange}
          />
          <FormField
            label="Target Points"
            id="targetPoints"
            type="number"
            placeholder="e.g., 25"
            value={formData.targetPoints}
            onChange={handleChange}
          />
          <FormField
            label="Stop Loss (Points)"
            id="stopLossPoints"
            type="number"
            placeholder="e.g., 10"
            value={formData.stopLossPoints}
            onChange={handleChange}
          />
          <FormField
            label="Exit Reason"
            id="exitReason"
            type="select"
            options={[
              "Target Hit",
              "SL Hit",
              "Manual Exit",
              "Time-based Exit",
              "Other",
            ]}
            value={formData.exitReason}
            onChange={handleChange}
          />
        </div>

        <h4 className="text-xl font-semibold text-gray-700 mt-6 mb-4">
          Profit & Loss
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            label="Gross P&L (₹)"
            id="grossPnl"
            type="number"
            step="0.01"
            placeholder="e.g., 2500.00"
            value={formData.grossPnl}
            onChange={handleChange}
          />
          <FormField
            label="Net P&L (₹, after charges)"
            id="netPnl"
            type="number"
            step="0.01"
            value={formData.netPnl}
            onChange={() => {}}
          />
          <FormField
            label="Charges (₹, Optional)"
            id="charges"
            type="number"
            step="0.01"
            placeholder="e.g., 50.00"
            value={formData.charges}
            onChange={handleChange}
          />
        </div>

        <h4 className="text-xl font-semibold text-gray-700 mt-6 mb-4">
          Strategy & Setup
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Strategy Used"
            id="strategyUsed"
            type="select"
            options={[
              "Breakout",
              "Reversal",
              "Moving Average",
              "Price Action",
              "Gap Up/Down",
              "Trendline",
              "Self Setup",
              "Support",
              "Resistance",
              "Other",
            ]}
            value={formData.strategyUsed}
            onChange={handleChange}
          />
          <FormField
            label="Setup Name (If predefined)"
            id="setupName"
            type="text"
            placeholder="e.g., Flag Pattern"
            value={formData.setupName}
            onChange={handleChange}
          />
          <FormField
            label="Confirmation Indicators Used"
            id="confirmationIndicators"
            type="text"
            className="col-span-1 md:col-span-2"
            placeholder="e.g., RSI, MACD, VWAP"
            value={formData.confirmationIndicators}
            onChange={handleChange}
          />
        </div>

        <h4 className="text-xl font-semibold text-gray-700 mt-6 mb-4">
          Psychology & Mindset
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <FormField
            label="Confidence Level (1-10)"
            id="confidenceLevel"
            type="range"
            min="1"
            max="10"
            value={formData.confidenceLevel}
            onChange={handleChange}
          >
            <div className="flex justify-between text-xs text-zinc-600 mt-1">
              <span>1 (Low)</span>
              <span className="text-zinc-800 font-bold">
                {formData.confidenceLevel}
              </span>
              <span>10 (High)</span>
            </div>
          </FormField>
          <FormField
            label="Emotions Before Trade"
            id="emotionsBefore"
            type="select"
            options={[
              "Calm",
              "Greedy",
              "Fearful",
              "Overconfident",
              "Anxious",
              "Excited",
              "Neutral",
            ]}
            value={formData.emotionsBefore}
            onChange={handleChange}
          />
          <FormField
            label="Emotions After Trade"
            id="emotionsAfter"
            type="select"
            options={[
              "Calm",
              "Satisfied",
              "Frustrated",
              "Regretful",
              "Happy",
              "Angry",
              "Neutral",
            ]}
            value={formData.emotionsAfter}
            onChange={handleChange}
          />
        </div>

        <h4 className="text-xl font-semibold text-gray-700 mt-6 mb-4">
          Notes / Learnings
        </h4>
        <div className="space-y-4">
          <FormField
            label="Trade Notes / Journal Entry"
            id="tradeNotes"
            type="textarea"
            rows="4"
            placeholder="Detailed notes about the trade"
            value={formData.tradeNotes}
            onChange={handleChange}
          />
          <FormField
            label="Mistakes (if any)"
            id="mistakes"
            type="textarea"
            rows="3"
            placeholder="What went wrong?"
            value={formData.mistakes}
            onChange={handleChange}
          />
          <FormField
            label="What I Did Well?"
            id="whatDidWell"
            type="textarea"
            rows="3"
            placeholder="What positive actions did I take?"
            value={formData.whatDidWell}
            onChange={handleChange}
          />
        </div>

        <h4 className="text-xl font-semibold text-gray-700 mt-6 mb-4">
          Extras (Optional)
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Screenshot Upload (Entry/Exit chart)"
            id="screenshotUpload"
            type="file"
            onChange={handleChange}
          />
          <FormField
            label="Tags"
            id="tags"
            type="text"
            placeholder="e.g., Overtrading, Perfect Setup"
            value={formData.tags}
            onChange={handleChange}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-zinc-700 hover:bg-zinc-800 text-white font-bold py-3 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-[1.01] mt-8"
        >
          Save New Trade Entry
        </button>
      </form>
    </div>
  );
}
