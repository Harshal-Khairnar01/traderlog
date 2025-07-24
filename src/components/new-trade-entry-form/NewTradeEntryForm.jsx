// src/components/new-trade-entry-form/NewTradeEntryForm.jsx
"use client";

import React, { useState } from "react";
import GeneralTabContent from "./GeneralTabContent";
import PsychologyTabContent from "./PsychologyTabContent";
import { useTradeFormLogic } from "@/hooks/useTradeFormLogic";

export default function NewTradeEntryForm({
  addTrade,
  updateTrade,
  onClose,
  tradeToEdit,
}) {
  const [activeTab, setActiveTab] = useState("General");

  const {
    formData,
    handleChange,
    handleCheckboxChange,
    handleSubmit,
    handleReset,
  } = useTradeFormLogic(tradeToEdit);

  const onSubmit = (e) => handleSubmit(e, addTrade, updateTrade, onClose);

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
        onSubmit={onSubmit}
      >
        {activeTab === "General" && (
          <GeneralTabContent formData={formData} handleChange={handleChange} />
        )}

        {activeTab === "Psychology" && (
          <PsychologyTabContent
            formData={formData}
            handleChange={handleChange}
            handleCheckboxChange={handleCheckboxChange}
            tradeToEdit={tradeToEdit}
          />
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
          onClick={onSubmit}
          className="px-6 py-2 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors duration-200"
        >
          {tradeToEdit ? "Update Trade" : "Save Trade"}
        </button>
      </div>
    </div>
  );
}
