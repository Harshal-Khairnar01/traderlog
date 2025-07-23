// components/NewTradeEntryForm.js
"use client";

import React, { useState, useEffect } from "react";
import FormField from "./FormField"; // Assuming FormField is in the same directory
import { toast } from "react-toastify"; // Import toast

export default function NewTradeEntryForm({ addTrade, onClose }) {
  const [activeTab, setActiveTab] = useState("General");
  const [formData, setFormData] = useState({
    // General Tab Fields
    marketType: "Indian",
    symbol: "",
    date: "",
    time: "", // Added time field
    entryPrice: "",
    quantity: "",
    totalAmount: "",
    exitPrice: "",
    pnlAmount: "",
    pnlPercentage: "",
    direction: "Long",
    stopLoss: "",
    target: "",
    strategy: "Select Strategy",
    outcomeSummary: "Select Outcome Summary",
    tradeAnalysis: "",

    // Psychology Tab Fields
    confidenceLevel: "5",
    emotionsBefore: "Calm",
    emotionsAfter: "Satisfied",
    tradeNotes: "",
    mistakes: "",
    mistakeChecklist: [],
    whatDidWell: "",
    tags: "",
    screenshotUpload: null,
  });

  // Auto-calculate P&L Percentage
  useEffect(() => {
    const entry = parseFloat(formData.entryPrice);
    const exit = parseFloat(formData.exitPrice);
    const pnlAmt = parseFloat(formData.pnlAmount);
    const totalAmt = parseFloat(formData.totalAmount);

    let calculatedPnlPercentage = "";

    if (!isNaN(entry) && !isNaN(exit) && entry !== 0) {
      if (formData.direction === "Long") {
        calculatedPnlPercentage = (((exit - entry) / entry) * 100).toFixed(2);
      } else {
        calculatedPnlPercentage = (((entry - exit) / entry) * 100).toFixed(2);
      }
    } else if (!isNaN(pnlAmt) && !isNaN(totalAmt) && totalAmt !== 0) {
      calculatedPnlPercentage = ((pnlAmt / totalAmt) * 100).toFixed(2);
    }

    if (formData.pnlPercentage !== calculatedPnlPercentage) {
      setFormData((prev) => ({
        ...prev,
        pnlPercentage: calculatedPnlPercentage,
      }));
    }
  }, [
    formData.entryPrice,
    formData.exitPrice,
    formData.direction,
    formData.pnlAmount,
    formData.totalAmount,
    formData.pnlPercentage,
  ]);

  const handleChange = (e) => {
    const { id, value, type, name } = e.target;
    if (type === "radio") {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    } else if (type === "file") {
      setFormData((prevData) => ({
        ...prevData,
        [id]: e.target.files[0],
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [id]: value,
      }));
    }
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      mistakeChecklist: checked
        ? [...prev.mistakeChecklist, value]
        : prev.mistakeChecklist.filter((item) => item !== value),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const requiredFields = ["date", "time", "symbol", "quantity", "entryPrice"]; // Added 'time' to required fields
    for (let field of requiredFields) {
      if (!formData[field]) {
        console.error(`Please fill in all required trade details: ${field}`);
        toast.error(`Please fill in all required trade details: ${field}`); // Use toast.error
        return;
      }
    }

    const tradeEntry = {
      ...formData,
      quantity: Number(formData.quantity),
      entryPrice: Number(formData.entryPrice),
      exitPrice: formData.exitPrice ? Number(formData.exitPrice) : null,
      totalAmount: formData.totalAmount ? Number(formData.totalAmount) : null,
      pnlAmount: formData.pnlAmount ? Number(formData.pnlAmount) : null,
      pnlPercentage: formData.pnlPercentage
        ? Number(formData.pnlPercentage)
        : null,
      stopLoss: formData.stopLoss ? Number(formData.stopLoss) : null,
      target: formData.target ? Number(formData.target) : null,
      confidenceLevel: Number(formData.confidenceLevel),
      screenshotUpload: formData.screenshotUpload
        ? formData.screenshotUpload.name
        : null,
    };

    addTrade(tradeEntry);

    // Reset form
    setFormData({
      marketType: "Indian",
      symbol: "",
      date: "",
      time: "", // Reset time field
      entryPrice: "",
      quantity: "",
      totalAmount: "",
      exitPrice: "",
      pnlAmount: "",
      pnlPercentage: "",
      direction: "Long",
      stopLoss: "",
      target: "",
      strategy: "Select Strategy",
      outcomeSummary: "Select Outcome Summary",
      tradeAnalysis: "",
      confidenceLevel: "5",
      emotionsBefore: "Calm",
      emotionsAfter: "Satisfied",
      tradeNotes: "",
      mistakes: "",
      mistakeChecklist: [],
      whatDidWell: "",
      tags: "",
      screenshotUpload: null,
    });

    toast.success("Trade submitted and added to history!"); // Use toast.success
    if (onClose) {
      onClose();
    }
  };

  const handleReset = () => {
    setFormData({
      marketType: "Indian",
      symbol: "",
      date: "",
      time: "", // Reset time field
      entryPrice: "",
      quantity: "",
      totalAmount: "",
      exitPrice: "",
      pnlAmount: "",
      pnlPercentage: "",
      direction: "Long",
      stopLoss: "",
      target: "",
      strategy: "Select Strategy",
      outcomeSummary: "Select Outcome Summary",
      tradeAnalysis: "",
      confidenceLevel: "5",
      emotionsBefore: "Calm",
      emotionsAfter: "Satisfied",
      tradeNotes: "",
      mistakes: "",
      mistakeChecklist: [],
      whatDidWell: "",
      tags: "",
      screenshotUpload: null,
    });
    toast.info("Form reset!"); // Optional: Add a toast for reset
  };

  return (
    <div className="bg-zinc-800 rounded-lg shadow-xl text-white w-full h-[calc(100vh-80px)] flex flex-col">
      {/* Header (fixed at top of this component) */}
      <div className="flex justify-between items-center px-6 py-3 border-b border-zinc-700">
        <h2 className="text-xl font-semibold text-gray-100">Add New Trade</h2>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-100 text-4xl cursor-pointer"
            aria-label="Close form"
          >
            &times;
          </button>
        )}
      </div>

      {/* Tabs (fixed below header) */}
      <div className="flex border-b border-zinc-700 px-6 py-2">
        <button
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === "General"
              ? "border-b-2 border-blue-500 text-blue-400"
              : "text-gray-400 hover:text-gray-200"
          }`}
          onClick={() => setActiveTab("General")}
        >
          General
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === "Psychology"
              ? "border-b-2 border-blue-500 text-blue-400"
              : "text-gray-400 hover:text-gray-200"
          }`}
          onClick={() => setActiveTab("Psychology")}
        >
          Psychology
        </button>
      </div>

      {/* Scrollable Form Content */}
      <form
        className="flex-grow space-y-6 px-6 py-2 overflow-y-auto scrollbar scrollbar-thumb-zinc-600 scrollbar-track-zinc-700 scrollbar-w-2"
        onSubmit={handleSubmit}
      >
        {activeTab === "General" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <FormField
              label="Market Type"
              id="marketType"
              type="select"
              options={["Indian", "US", "Crypto", "Forex"]}
              value={formData.marketType}
              onChange={handleChange}
            />
            <FormField
              label="Symbol"
              id="symbol"
              type="text"
              placeholder="RELIANCE, NIFTY 50, etc."
              value={formData.symbol}
              onChange={handleChange}
            />
            <FormField
              label="Date"
              id="date"
              type="date"
              placeholder="dd-mm-yyyy"
              value={formData.date}
              onChange={handleChange}
            />
            {/* New Time Field */}
            <FormField
              label="Time"
              id="time"
              type="time" // Set type to "time"
              placeholder="HH:MM"
              value={formData.time}
              onChange={handleChange}
            />
            {/* Entry Price, Quantity, Total Amount, Exit Price in one row */}
            <div className="col-span-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <FormField
                label="Entry Price"
                id="entryPrice"
                type="number"
                step="0.01"
                placeholder="Entry Price"
                value={formData.entryPrice}
                onChange={handleChange}
              />
              <div className="flex w-full gap-2">
                <FormField
                  label="Quantity"
                  id="quantity"
                  type="number"
                  placeholder="Quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                />
                <FormField
                  label="Total Amount"
                  id="totalAmount"
                  type="number"
                  step="0.01"
                  placeholder="Amount"
                  value={formData.totalAmount}
                  onChange={handleChange}
                />
              </div>
              <FormField
                label="Exit Price"
                id="exitPrice"
                type="number"
                step="0.01"
                placeholder="Exit Price"
                value={formData.exitPrice}
                onChange={handleChange}
              />
            </div>

            {/* P&L Amount, P&L (%), Direction, Stop Loss, and Target in one row */}
            {/* Using col-span-full to ensure it spans the whole width of the outer grid */}
            <div className="col-span-full grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4">
              <div className="flex gap-2">
                <FormField
                  label="P&L Amount"
                  id="pnlAmount"
                  type="number"
                  step="0.01"
                  placeholder="Amount"
                  value={formData.pnlAmount}
                  onChange={handleChange}
                />
                <FormField
                  label="P&L (%)"
                  id="pnlPercentage"
                  type="text"
                  placeholder="% Change"
                  value={formData.pnlPercentage}
                  onChange={handleChange}
                />
              </div>
              {/* Direction buttons - we need to make this section behave like a single grid item */}
              <div className="col-span-1">
                {" "}
                {/* This div occupies one column in the parent grid */}
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Direction
                </label>
                <div className="flex space-x-2 sm:space-x-4">
                  {" "}
                  {/* Adjusted spacing for responsiveness */}
                  <button
                    type="button"
                    className={`px-4 py-2 rounded-md font-semibold text-sm transition-colors duration-200 w-1/2 ${
                      formData.direction === "Long"
                        ? "bg-green-600 text-white"
                        : "bg-zinc-700 text-gray-300 hover:bg-zinc-600"
                    }`}
                    onClick={() =>
                      handleChange({
                        target: {
                          id: "direction",
                          value: "Long",
                          type: "radio",
                          name: "direction",
                        },
                      })
                    }
                  >
                    <span className="mr-1">↑</span> Long
                  </button>
                  <button
                    type="button"
                    className={`px-4 py-2 rounded-md font-semibold text-sm w-1/2 transition-colors duration-200 ${
                      formData.direction === "Short"
                        ? "bg-red-600 text-white"
                        : "bg-zinc-700 text-gray-300 hover:bg-zinc-600"
                    }`}
                    onClick={() =>
                      handleChange({
                        target: {
                          id: "direction",
                          value: "Short",
                          type: "radio",
                          name: "direction",
                        },
                      })
                    }
                  >
                    <span className="mr-1">↓</span> Short
                  </button>
                </div>
              </div>
              <div className="flex gap-2">
                <FormField
                  label="Stop Loss"
                  id="stopLoss"
                  type="number"
                  step="0.01"
                  placeholder="Stop Loss"
                  value={formData.stopLoss}
                  onChange={handleChange}
                />
                <FormField
                  label="Target"
                  id="target"
                  type="number"
                  step="0.01"
                  placeholder="Target"
                  value={formData.target}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Strategy and Outcome Summary in one row */}
            <div className="col-span-full grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Strategy"
                id="strategy"
                type="select"
                options={[
                  "Select Strategy",
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
                value={formData.strategy}
                onChange={handleChange}
              />
              <FormField
                label="Outcome Summary"
                id="outcomeSummary"
                type="select"
                options={[
                  "Select Outcome Summary",
                  "Target Hit",
                  "SL Hit",
                  "Manual Exit",
                  "Time-based Exit",
                  "Other",
                ]}
                value={formData.outcomeSummary}
                onChange={handleChange}
              />
            </div>

            <div className="col-span-full">
              <FormField
                label="Trade Analysis"
                id="tradeAnalysis"
                type="textarea"
                rows="4"
                placeholder="Why did you take this trade? What was your analysis?"
                value={formData.tradeAnalysis}
                onChange={handleChange}
              />
            </div>
          </div>
        )}

        {activeTab === "Psychology" && (
          <div className="space-y-6">
            <h4 className="text-xl font-semibold text-gray-100">
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
                <div className="flex justify-between text-xs text-zinc-400 mt-1">
                  <span>1 (Low)</span>
                  <span className="text-zinc-100 font-bold">
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

            <h4 className="text-xl font-semibold text-gray-100 mt-6 mb-4">
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
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">
                  Common Mistakes (Select if any)
                </label>
                <div className="flex flex-wrap gap-4">
                  {[
                    "No SL",
                    "FOMO",
                    "Overtrade",
                    "Perfect",
                    "SL Slip",
                    "Ignore R:R",
                    "Greed",
                    "Fear",
                    "Not Follow SelfSetup",
                  ].map((mistake) => (
                    <label
                      key={mistake}
                      className="flex items-center space-x-2 text-sm text-gray-300"
                    >
                      <input
                        type="checkbox"
                        value={mistake}
                        checked={formData.mistakeChecklist.includes(mistake)}
                        onChange={handleCheckboxChange}
                        className="form-checkbox h-4 w-4 text-blue-600 bg-zinc-700 border-zinc-600 rounded focus:ring-blue-500"
                      />
                      <span>{mistake}</span>
                    </label>
                  ))}
                </div>
              </div>

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

            <h4 className="text-xl font-semibold text-gray-100 mt-6 mb-4">
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
          </div>
        )}
      </form>

      {/* Fixed Footer with Buttons */}
      <div className="flex justify-end space-x-4 pt-6 pb-4 px-6 border-t border-zinc-700 bg-zinc-800">
        <button
          type="button"
          onClick={handleReset}
          className="px-6 py-2 rounded-md text-zinc-300 border border-zinc-600 hover:bg-zinc-700 hover:text-white transition-colors duration-200"
        >
          Reset
        </button>
        <button
          type="submit"
          onClick={handleSubmit}
          className="px-6 py-2 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors duration-200"
        >
          Save Trade
        </button>
      </div>
    </div>
  );
}