"use client";

import React, { useState, useEffect } from "react";
import FormField from "./FormField";
import { toast } from "react-toastify";

export default function NewTradeEntryForm({ addTrade, updateTrade, onClose, tradeToEdit }) {
  const [activeTab, setActiveTab] = useState("General");
  const [formData, setFormData] = useState({
    marketType: "Indian",
    symbol: "",
    date: "",
    time: "",
    entryPrice: "",
    quantity: "",
    totalAmount: "",
    exitPrice: "",
    pnlAmount: "",
    pnlPercentage: "",
    direction: "Long", // Existing
    optionType: "", // New: To store 'Call' or 'Put'
    stopLoss: "",
    target: "",
    strategy: "Select Strategy",
    outcomeSummary: "Select Outcome Summary",
    tradeAnalysis: "",
    emotionsBefore: "Calm",
    emotionsAfter: "Satisfied",
    tradeNotes: "",
    mistakes: "",
    mistakeChecklist: [],
    whatDidWell: "",
    tags: "",
    screenshotUpload: null,
    charges: "",
    // Add confidenceLevel with a default if it's a new trade or not present in tradeToEdit
    confidenceLevel: "5",
  });

  // Effect to populate form when tradeToEdit changes (for edit functionality)
  useEffect(() => {
    if (tradeToEdit) {
      setFormData({
        marketType: tradeToEdit.marketType || "Indian",
        symbol: tradeToEdit.symbol || "",
        date: tradeToEdit.date || "",
        time: tradeToEdit.time || "",
        entryPrice: tradeToEdit.entryPrice || "",
        quantity: tradeToEdit.quantity || "",
        totalAmount: tradeToEdit.totalAmount || "",
        exitPrice: tradeToEdit.exitPrice || "",
        pnlAmount: tradeToEdit.pnlAmount || "",
        pnlPercentage: tradeToEdit.pnlPercentage || "",
        direction: tradeToEdit.direction || "Long",
        optionType: tradeToEdit.optionType || "",
        stopLoss: tradeToEdit.stopLoss || "",
        target: tradeToEdit.target || "",
        strategy: tradeToEdit.strategy || "Select Strategy",
        outcomeSummary: tradeToEdit.outcomeSummary || "Select Outcome Summary",
        tradeAnalysis: tradeToEdit.tradeAnalysis || "",
        emotionsBefore: tradeToEdit.emotionsBefore || "Calm",
        emotionsAfter: tradeToEdit.emotionsAfter || "Satisfied",
        tradeNotes: tradeToEdit.tradeNotes || "",
        mistakes: tradeToEdit.mistakes || "",
        mistakeChecklist: tradeToEdit.mistakeChecklist || [],
        whatDidWell: tradeToEdit.whatDidWell || "",
        tags: tradeToEdit.tags || "",
        // Note: screenshotUpload won't be pre-filled for security reasons with file inputs.
        // You'd typically display the existing filename or a preview.
        screenshotUpload: null,
        charges: tradeToEdit.charges || "",
        confidenceLevel: tradeToEdit.confidenceLevel || "5",
      });
    }
  }, [tradeToEdit]);

  // Effect to calculate Total Amount
  useEffect(() => {
    const entry = parseFloat(formData.entryPrice);
    const qty = parseFloat(formData.quantity);

    let calculatedTotalAmount = "";

    if (!isNaN(entry) && !isNaN(qty) && qty > 0) {
      calculatedTotalAmount = (entry * qty).toFixed(2);
    }

    // Only update if the calculated value is different to avoid unnecessary re-renders
    if (formData.totalAmount !== calculatedTotalAmount) {
      setFormData((prev) => ({
        ...prev,
        totalAmount: calculatedTotalAmount,
      }));
    }
  }, [formData.entryPrice, formData.quantity, formData.totalAmount]);

  // Effect to calculate P&L Amount and Percentage
  useEffect(() => {
    const entry = parseFloat(formData.entryPrice);
    const exit = parseFloat(formData.exitPrice);
    const pnlAmtManual = parseFloat(formData.pnlAmount); // This might be used if P&L is manually entered
    const totalAmt = parseFloat(formData.totalAmount);
    const charges = parseFloat(formData.charges) || 0; // Get charges, default to 0 if not a number

    let calculatedPnlAmount = "";
    let calculatedPnlPercentage = "";

    // Calculate gross P&L first if entry, exit prices, and quantity are available
    if (!isNaN(entry) && !isNaN(exit) && !isNaN(parseFloat(formData.quantity)) && parseFloat(formData.quantity) > 0) {
      const qty = parseFloat(formData.quantity);
      let grossPnl;
      if (formData.direction === "Long") {
        grossPnl = (exit - entry) * qty;
      } else { // Short
        grossPnl = (entry - exit) * qty;
      }

      // Subtract charges for net P&L
      const netPnl = grossPnl - charges;
      calculatedPnlAmount = netPnl.toFixed(2);

      // Calculate P&L percentage based on net P&L
      if (!isNaN(totalAmt) && totalAmt !== 0) {
        calculatedPnlPercentage = ((netPnl / totalAmt) * 100).toFixed(2);
      }
    } else if (!isNaN(pnlAmtManual) && !isNaN(totalAmt) && totalAmt !== 0) {
      // If manual P&L amount is entered, calculate net P&L from it and then percentage
      const netPnl = pnlAmtManual - charges;
      calculatedPnlAmount = netPnl.toFixed(2);
      calculatedPnlPercentage = ((netPnl / totalAmt) * 100).toFixed(2);
    } else {
      // If no valid calculation, reset values
      calculatedPnlAmount = "";
      calculatedPnlPercentage = "";
    }

    // Update pnlAmount only if it changes
    // Check if the current formData.pnlAmount is already a number to prevent overriding
    // a manually entered (and thus likely desired) value with an empty string
    if (formData.pnlAmount !== calculatedPnlAmount) {
      setFormData((prev) => ({
        ...prev,
        pnlAmount: calculatedPnlAmount,
      }));
    }

    // Update pnlPercentage only if it changes
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
    formData.quantity,
    formData.pnlAmount, // Dependency for manual P&L calculation path
    formData.totalAmount,
    formData.pnlPercentage,
    formData.charges,
  ]);

  const handleChange = (e) => {
    const { id, value, type, name } = e.target; // 'name' is important for radio buttons

    // Handle radio button groups using the 'name' attribute
    if (type === "radio") {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value, // Use 'name' to update the correct state property (e.g., 'direction', 'optionType')
      }));
    } else if (type === "file") {
      setFormData((prevData) => ({
        ...prevData,
        [id]: e.target.files[0],
      }));
    } else {
      // For all other input types, use 'id' to update the state
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

    const requiredFields = ["date", "time", "symbol", "quantity", "entryPrice"];
    for (let field of requiredFields) {
      if (!formData[field]) {
        console.error(`Please fill in all required trade details: ${field}`);
        toast.error(`Please fill in all required trade details: ${field}`);
        return;
      }
    }

    const tradeDataToSave = {
      ...formData,
      quantity: Number(formData.quantity),
      entryPrice: Number(formData.entryPrice),
      exitPrice: formData.exitPrice ? Number(formData.exitPrice) : null,
      totalAmount: formData.totalAmount ? Number(formData.totalAmount) : null,
      pnlAmount: formData.pnlAmount ? Number(formData.pnlAmount) : null, // This is now net P&L
      pnlPercentage: formData.pnlPercentage
        ? Number(formData.pnlPercentage)
        : null,
      stopLoss: formData.stopLoss ? Number(formData.stopLoss) : null,
      target: formData.target ? Number(formData.target) : null,
      charges: formData.charges ? Number(formData.charges) : null, // Store charges as a number
      screenshotUpload: formData.screenshotUpload
        ? formData.screenshotUpload.name
        : (tradeToEdit?.screenshotUpload || null), // Retain existing screenshot name if no new file is uploaded
      confidenceLevel: Number(formData.confidenceLevel), // Ensure it's a number
    };

    if (tradeToEdit) {
      // If tradeToEdit exists, it's an edit operation
      updateTrade({ ...tradeDataToSave, id: tradeToEdit.id }); // Pass the ID for updating
      toast.success("Trade updated successfully!");
    } else {
      // Otherwise, it's a new trade operation
      addTrade(tradeDataToSave);
      toast.success("Trade submitted and added to history!");
    }

    // Reset form after submission (only for new trades, or if you want to clear after edit)
    // For edit, you might want to close the form instead of resetting.
    if (!tradeToEdit) { // Only reset if it was a new trade
      setFormData({
        marketType: "Indian",
        symbol: "",
        date: "",
        time: "",
        entryPrice: "",
        quantity: "",
        totalAmount: "",
        exitPrice: "",
        pnlAmount: "",
        pnlPercentage: "",
        direction: "Long",
        optionType: "", // Reset optionType
        stopLoss: "",
        target: "",
        strategy: "Select Strategy",
        outcomeSummary: "Select Outcome Summary",
        tradeAnalysis: "",
        emotionsBefore: "Calm",
        emotionsAfter: "Satisfied",
        tradeNotes: "",
        mistakes: "",
        mistakeChecklist: [],
        whatDidWell: "",
        tags: "",
        screenshotUpload: null,
        charges: "",
        confidenceLevel: "5",
      });
    }

    if (onClose) {
      onClose();
    }
  };

  const handleReset = () => {
    // If editing, reset to original tradeToEdit values, otherwise to empty
    if (tradeToEdit) {
      setFormData({
        marketType: tradeToEdit.marketType || "Indian",
        symbol: tradeToEdit.symbol || "",
        date: tradeToEdit.date || "",
        time: tradeToEdit.time || "",
        entryPrice: tradeToEdit.entryPrice || "",
        quantity: tradeToEdit.quantity || "",
        totalAmount: tradeToEdit.totalAmount || "",
        exitPrice: tradeToEdit.exitPrice || "",
        pnlAmount: tradeToEdit.pnlAmount || "",
        pnlPercentage: tradeToEdit.pnlPercentage || "",
        direction: tradeToEdit.direction || "Long",
        optionType: tradeToEdit.optionType || "",
        stopLoss: tradeToEdit.stopLoss || "",
        target: tradeToEdit.target || "",
        strategy: tradeToEdit.strategy || "Select Strategy",
        outcomeSummary: tradeToEdit.outcomeSummary || "Select Outcome Summary",
        tradeAnalysis: tradeToEdit.tradeAnalysis || "",
        emotionsBefore: tradeToEdit.emotionsBefore || "Calm",
        emotionsAfter: tradeToEdit.emotionsAfter || "Satisfied",
        tradeNotes: tradeToEdit.tradeNotes || "",
        mistakes: tradeToEdit.mistakes || "",
        mistakeChecklist: tradeToEdit.mistakeChecklist || [],
        whatDidWell: tradeToEdit.whatDidWell || "",
        tags: tradeToEdit.tags || "",
        screenshotUpload: null, // Cannot reset file input to previous file
        charges: tradeToEdit.charges || "",
        confidenceLevel: tradeToEdit.confidenceLevel || "5",
      });
      toast.info("Form reset to original values!");
    } else {
      setFormData({
        marketType: "Indian",
        symbol: "",
        date: "",
        time: "",
        entryPrice: "",
        quantity: "",
        totalAmount: "",
        exitPrice: "",
        pnlAmount: "",
        pnlPercentage: "",
        direction: "Long",
        optionType: "", // Reset optionType
        stopLoss: "",
        target: "",
        strategy: "Select Strategy",
        outcomeSummary: "Select Outcome Summary",
        tradeAnalysis: "",
        emotionsBefore: "Calm",
        emotionsAfter: "Satisfied",
        tradeNotes: "",
        mistakes: "",
        mistakeChecklist: [],
        whatDidWell: "",
        tags: "",
        screenshotUpload: null,
        charges: "",
        confidenceLevel: "5",
      });
      toast.info("Form reset!");
    }
  };

  return (
    <div className="bg-zinc-800 rounded-lg shadow-xl text-white w-full h-[calc(100vh-80px)] flex flex-col">
      <div className="flex justify-between items-center px-6 py-3 border-b border-zinc-700">
        <h2 className="text-xl font-semibold text-gray-100">
          {tradeToEdit ? "Edit Trade" : "Add New Trade"}
        </h2>
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
            <FormField
              label="Time"
              id="time"
              type="time"
              placeholder="HH:MM"
              value={formData.time}
              onChange={handleChange}
            />
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
                  type="text" // Made text as it's read-only and formatted
                  placeholder="Amount"
                  value={formData.totalAmount}
                  readOnly // Keep it read-only
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

            <div className="col-span-full grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4">
              <div className="flex gap-2">
                <FormField
                  label="P&L Amount (Net)"
                  id="pnlAmount"
                  type="text" // Made text as it's auto-calculated
                  step="0.01"
                  placeholder="Net P&L"
                  value={formData.pnlAmount}
                  readOnly // Make it read-only
                />
                <FormField
                  label="P&L (%) (Net)"
                  id="pnlPercentage"
                  type="text" // Made text as it's auto-calculated
                  placeholder="% Change"
                  value={formData.pnlPercentage}
                  readOnly
                />
              </div>

              {/* Combined Direction and Option Type Section */}
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Trade Type
                </label>
                <div className="flex gap-4 w-full"> {/* Use flex-col to stack groups */}
                  <div className="flex gap-1 items-center w-1/2 "> {/* Long/Short group */}
                    <button
                      type="button"
                      className={`px-1 py-2 rounded-md font-semibold text-sm transition-colors duration-200 w-1/2 ${
                        formData.direction === "Long"
                          ? "bg-green-600 text-white"
                          : "bg-zinc-700 text-gray-300 hover:bg-zinc-600"
                      }`}
                      onClick={() =>
                        handleChange({
                          target: {
                            id: "direction", // Still using id for consistent formField naming
                            value: "Long",
                            type: "radio",
                            name: "direction", // Crucial for radio groups
                          },
                        })
                      }
                    >
                      <span className="">↑</span> Long
                    </button>
                    <button
                      type="button"
                      className={`px-1 py-2 rounded-md font-semibold text-sm w-1/2 transition-colors duration-200 ${
                        formData.direction === "Short"
                          ? "bg-red-600 text-white"
                          : "bg-zinc-700 text-gray-300 hover:bg-zinc-600"
                      }`}
                      onClick={() =>
                        handleChange({
                          target: {
                            id: "direction", // Still using id
                            value: "Short",
                            type: "radio",
                            name: "direction", // Crucial for radio groups
                          },
                        })
                      }
                    >
                      <span className="">↓</span> Short
                    </button>
                  </div>

                  {/* Call/Put Group (Visible only if a direction is selected, or always if you prefer) */}
                  {/* You might add a condition here if Call/Put is only for specific Market Types */}
                  <div className="flex gap-1 items-center w-1/2 "> {/* Call/Put group, added mt-2 for spacing */}
                    <button
                      type="button"
                      className={`px-4 py-2 rounded-md font-semibold text-sm transition-colors duration-200 w-1/2 ${
                        formData.optionType === "Call"
                          ? "bg-blue-600 text-white"
                          : "bg-zinc-700 text-gray-300 hover:bg-zinc-600"
                      }`}
                      onClick={() =>
                        handleChange({
                          target: {
                            id: "optionType", // Use optionType for this state
                            value: "Call",
                            type: "radio",
                            name: "optionType", // New name for this radio group
                          },
                        })
                      }
                    >
                      Call
                    </button>
                    <button
                      type="button"
                      className={`px-4 py-2 rounded-md font-semibold text-sm w-1/2 transition-colors duration-200 ${
                        formData.optionType === "Put"
                          ? "bg-purple-600 text-white"
                          : "bg-zinc-700 text-gray-300 hover:bg-zinc-600"
                      }`}
                      onClick={() =>
                        handleChange({
                          target: {
                            id: "optionType", // Use optionType for this state
                            value: "Put",
                            type: "radio",
                            name: "optionType", // New name for this radio group
                          },
                        })
                      }
                    >
                      Put
                    </button>
                  </div>
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

            {/* New FormField for Charges */}
            <FormField
              label="Charges/Brokerage"
              id="charges"
              type="number"
              step="0.01"
              placeholder="e.g., 25.50"
              value={formData.charges}
              onChange={handleChange}
            />

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
              {tradeToEdit && tradeToEdit.screenshotUpload && (
                <div className="text-sm text-gray-400">
                  Current Screenshot: {tradeToEdit.screenshotUpload}
                </div>
              )}
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
          {tradeToEdit ? "Update Trade" : "Save Trade"}
        </button>
      </div>
    </div>
  );
}