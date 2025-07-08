"use client";

import React, { useState } from "react";

// Modal Component (You can put this in a separate file, e.g., components/TradeDetailModal.jsx)
const TradeDetailModal = ({ isOpen, onClose, title, content }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-lg w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-semibold"
          >
            &times;
          </button>
        </div>
        <div className="max-h-96 overflow-y-auto mb-4">
          <p className="text-gray-700 whitespace-pre-wrap">{content}</p>
        </div>
        <div className="text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// AllTradesTable Component
export default function AllTradesTable({ groupedTrades }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: "", content: "" });

  const openModal = (title, content) => {
    setModalContent({ title, content });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalContent({ title: "", content: "" }); // Clear content on close
  };

  return (
    <div className="bg-blue-50 p-6 rounded-lg shadow-inner overflow-x-auto">
      {Object.keys(groupedTrades).length > 0 ? (
        <table className="min-w-full divide-y divide-gray-200 rounded-lg overflow-hidden">
          <thead className="bg-gray-50">
            <tr>
              {[
                "Date",
                "Time",
                "Symbol",
                "Type",
                "Direction",
                "Qty",
                "Entry Price",
                "Exit Price",
                "SL",
                "Target",
                "Exit Reason",
                "Gross P&L",
                "Net P&L",
                "Charges",
                "Strategy",
                "Setup Name",
                "Indicators",
                "Confidence",
                "Emotions Before",
                "Emotions After",
                "Notes",
                "Mistakes",
                "Did Well",
                "Tags",
              ].map((header) => (
                <th
                  key={header}
                  className="px-9 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {Object.values(groupedTrades).map((group, groupIdx) => (
              <React.Fragment key={groupIdx}>
                {group.trades &&
                  group.trades.map((trade) => (
                    <tr key={trade.id} className={`${group.color}`}>
                      <td className="px-4 py-1.5 text-sm text-gray-900 font-medium">
                        {trade.date}
                      </td>
                      <td className="px-4 py-1.5 text-sm text-gray-500">
                        {trade.time}
                      </td>
                      <td className="px-4 py-1.5 text-sm text-gray-500">
                        {trade.instrument}
                      </td>
                      <td className="px-4 py-1.5 text-sm text-gray-500">
                        {trade.tradeType}
                      </td>
                      <td
                        className={`px-4 py-1.5 text-sm font-semibold ${
                          trade.direction === "Buy"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {trade.direction}
                      </td>
                      <td className="px-4 py-1.5 text-sm text-gray-500">
                        {trade.quantity}
                      </td>
                      <td className="px-4 py-1.5 text-sm text-gray-500">
                        {trade.entryPrice}
                      </td>
                      <td className="px-4 py-1.5 text-sm text-gray-500">
                        {trade.exitPrice}
                      </td>
                      <td className="px-4 py-1.5 text-sm text-gray-500">
                        {trade.stopLoss}
                      </td>
                      <td className="px-4 py-1.5 text-sm text-gray-500">
                        {trade.target}
                      </td>
                      <td className="px-4 py-1.5 text-sm text-gray-500">
                        {trade.exitReason}
                      </td>
                      <td
                        className={`px-4 py-1.5 text-sm font-bold ${
                          trade.grossPnl >= 0
                            ? "text-green-700"
                            : "text-red-700"
                        }`}
                      >
                        {trade.grossPnl >= 0 ? "+" : ""}
                        {trade.grossPnl}
                      </td>
                      <td
                        className={`px-4 py-1.5 text-sm font-bold ${
                          trade.netPnl >= 0 ? "text-green-700" : "text-red-700"
                        }`}
                      >
                        {trade.netPnl >= 0 ? "+" : ""}
                        {trade.netPnl}
                      </td>
                      <td className="px-4 py-1.5 text-sm text-gray-500">
                        {trade.charges}
                      </td>
                      <td className="px-4 py-1.5 text-sm text-gray-500">
                        {trade.strategyUsed}
                      </td>
                      <td className="px-4 py-1.5 text-sm text-gray-500">
                        {trade.setupName}
                      </td>
                      <td className="px-4 py-1.5 text-sm text-gray-500">
                        {trade.confirmationIndicators}
                      </td>
                      <td className="px-4 py-1.5 text-sm text-gray-500">
                        {trade.confidenceLevel}
                      </td>
                      <td className="px-4 py-1.5 text-sm text-gray-500">
                        {trade.emotionsBefore}
                      </td>
                      <td className="px-4 py-1.5 text-sm text-gray-500">
                        {trade.emotionsAfter}
                      </td>

                      {/* Notes (Clickable for modal) */}
                      <td
                        className="px-4 py-1.5 text-sm text-gray-500 w-24 max-w-[6rem] cursor-pointer hover:text-blue-600 hover:underline"
                        onClick={() =>
                          openModal("Trade Notes", trade.tradeNotes || "N/A")
                        }
                      >
                        <div className="truncate">
                          {trade.tradeNotes || "N/A"}
                        </div>
                      </td>

                      {/* Mistakes (Clickable for modal) */}
                      <td
                        className="px-4 py-1.5 text-sm text-gray-500 w-24 max-w-[6rem] cursor-pointer hover:text-blue-600 hover:underline"
                        onClick={() =>
                          openModal("Mistakes Made", trade.mistakes || "N/A")
                        }
                      >
                        <div className="truncate">
                          {trade.mistakes || "N/A"}
                        </div>
                      </td>

                      {/* Did Well (Clickable for modal) */}
                      <td
                        className="px-4 py-1.5 text-sm text-gray-500 w-24 max-w-[6rem] cursor-pointer hover:text-blue-600 hover:underline"
                        onClick={() =>
                          openModal("What Went Well", trade.whatDidWell || "N/A")
                        }
                      >
                        <div className="truncate">
                          {trade.whatDidWell || "N/A"}
                        </div>
                      </td>

                      <td className="px-4 py-1.5 text-sm text-gray-500">
                        {trade.tags}
                      </td>
                    </tr>
                  ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-600 text-center py-4">
          No trade history available.
        </p>
      )}

      {/* Render the Modal Component */}
      <TradeDetailModal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={modalContent.title}
        content={modalContent.content}
      />
    </div>
  );
}