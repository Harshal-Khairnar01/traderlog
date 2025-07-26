// src/components/tools/TradingPlanChecklist.jsx
"use client";

import React, { useState } from 'react';

/**
 * TradingPlanChecklist component provides a simple checklist for traders
 * to review their adherence to a trading plan.
 */
export default function TradingPlanChecklist() {
  const defaultChecklistItems = [
    "Have I identified the trend?",
    "Is my risk-reward ratio favorable?",
    "Do I have a clear entry point?",
    "Do I have a clear stop loss?",
    "Do I have a clear target price?",
    "Have I checked the news calendar?",
    "Am I emotionally calm and ready?",
    "Does this trade align with my overall strategy?",
    "Am I risking only my predefined percentage of capital?"
  ];

  // State to manage the checked status of each checklist item
  const [checklistItems, setChecklistItems] = useState(
    defaultChecklistItems.map(item => ({ text: item, checked: false }))
  );

  // Toggle the checked status of an item
  const handleToggle = (index) => {
    setChecklistItems(prevItems =>
      prevItems.map((item, i) =>
        i === index ? { ...item, checked: !item.checked } : item
      )
    );
  };

  // Reset all checklist items to unchecked
  const handleReset = () => {
    setChecklistItems(defaultChecklistItems.map(item => ({ text: item, checked: false })));
  };

  return (
    <div className="space-y-6">
      <p className="text-gray-300">
        Use this checklist before and after your trades to ensure discipline and adherence to your trading plan.
      </p>

      <div className="bg-zinc-700 rounded-md p-4 space-y-3">
        {checklistItems.map((item, index) => (
          <label key={index} className="flex items-center space-x-3 text-lg text-gray-200 cursor-pointer">
            <input
              type="checkbox"
              checked={item.checked}
              onChange={() => handleToggle(index)}
              className="form-checkbox h-5 w-5 text-blue-500 bg-zinc-600 border-zinc-500 rounded focus:ring-blue-400"
            />
            <span className={`${item.checked ? 'line-through text-gray-400' : ''}`}>{item.text}</span>
          </label>
        ))}
      </div>

      <div className="flex justify-end mt-6">
        <button
          onClick={handleReset}
          className="px-6 py-2 rounded-md text-zinc-300 border border-zinc-600 hover:bg-zinc-700 hover:text-white transition-colors duration-200"
        >
          Reset Checklist
        </button>
      </div>
    </div>
  );
}