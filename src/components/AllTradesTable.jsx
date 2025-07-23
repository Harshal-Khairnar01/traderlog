"use client";

import React, { useState } from "react";

// Modal Component
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
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default function AllTradesTable({ groupedTrades }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: "", content: "" });

  const openModal = (title, content) => {
    setModalContent({ title, content });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalContent({ title: "", content: "" });
  };

  return (
    <div className="bg-blue-50 p-6 rounded-lg shadow-inner overflow-x-auto">
      {Object.keys(groupedTrades).length > 0 ? (
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              {[
                "Date",
                "Time",
                "Symbol", // Changed from "Instrument" to "Symbol"
                // "Type", // Removed 'Type' as it's not in the new data structure
                "Direction",
                "Qty",
                // "Risk:Reward", // Removed 'Risk:Reward' - calculate or ensure it exists
                // "Target Points", // Removed 'Target Points' - use 'target'
                // "SL Points", // Removed 'SL Points' - use 'stopLoss'
                "Outcome Summary", // Changed from "Exit Reason"
                "Gross P&L",
                "P&L Amount", // Changed from "Net P&L" to "P&L Amount"
                "Charges",
                "Strategy", // Changed from "Strategy"
                // "Setup", // Removed 'Setup' as it's not directly in your sample
                // "Indicators", // Removed 'Indicators' as it's not in your sample
                "Confidence", // Changed from "Confidence"
                "Emotions Before",
                "Emotions After",
                "Trade Analysis", // New field added
                "Trade Notes", // Changed from "Notes"
                "Mistakes",
                "What Did Well", // Changed from "Did Well"
                "Tags",
              ].map((header) => (
                <th
                  key={header}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {Object.values(groupedTrades).map((group, idx) => (
              <React.Fragment key={idx}>
                {group.trades?.map((trade) => (
                  <tr key={trade.id || `${trade.date}-${trade.time}-${trade.symbol}`} className={group.color}>
                    <td className="px-4 py-2 text-sm text-gray-900">{trade.date}</td>
                    <td className="px-4 py-2 text-sm text-gray-500">{trade.time || "N/A"}</td> {/* time can be null */}
                    <td className="px-4 py-2 text-sm text-gray-500">{trade.symbol || trade.instrument}</td> {/* Use symbol, fallback to instrument */}
                    {/* <td className="px-4 py-2 text-sm text-gray-500">{trade.tradeType}</td> */} {/* Removed */}
                    <td
                      className={`px-4 py-2 text-sm font-semibold ${
                        trade.direction === "Long" ? "text-green-600" : "text-red-600" // Changed "Buy" to "Long"
                      }`}
                    >
                      {trade.direction}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-500">{trade.quantity}</td>
                    {/* <td className="px-4 py-2 text-sm text-gray-500">{trade.riskReward}</td> */} {/* Removed */}
                    {/* <td className="px-4 py-2 text-sm text-gray-500">{trade.targetPoints}</td> */} {/* Removed */}
                    {/* <td className="px-4 py-2 text-sm text-gray-500">{trade.stopLossPoints}</td> */} {/* Removed */}
                    <td className="px-4 py-2 text-sm text-gray-500">{trade.outcomeSummary}</td> {/* New field */}
                    <td
                      className={`px-4 py-2 text-sm font-bold ${
                        trade.grossPnl >= 0 ? "text-green-700" : "text-red-700"
                      }`}
                    >
                      {trade.grossPnl >= 0 ? "+" : ""}
                      {trade.grossPnl}
                    </td>
                    <td
                      className={`px-4 py-2 text-sm font-bold ${
                        // Use pnlAmount for Net P&L display and color logic
                        (trade.pnlAmount || trade.netPnl || 0) >= 0 ? "text-green-700" : "text-red-700"
                      }`}
                    >
                      {(trade.pnlAmount || trade.netPnl || 0) >= 0 ? "+" : ""}
                      {/* Display pnlAmount, fallback to netPnl, then 0 */}
                      {trade.pnlAmount || trade.netPnl || 0}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-500">{trade.charges}</td>
                    <td className="px-4 py-2 text-sm text-gray-500">{trade.strategy}</td> {/* Changed from strategyUsed */}
                    {/* <td className="px-4 py-2 text-sm text-gray-500">{trade.setupName}</td> */} {/* Removed */}
                    {/* <td className="px-4 py-2 text-sm text-gray-500">{trade.confirmationIndicators}</td> */} {/* Removed */}
                    <td className="px-4 py-2 text-sm text-gray-500">{trade.confidenceLevel}</td>
                    <td className="px-4 py-2 text-sm text-gray-500">{trade.emotionsBefore}</td>
                    <td className="px-4 py-2 text-sm text-gray-500">{trade.emotionsAfter}</td>

                    {/* New Trade Analysis column */}
                    <td
                      className="px-4 py-2 text-sm text-gray-500 max-w-[6rem] cursor-pointer hover:text-blue-600 hover:underline"
                      onClick={() => openModal("Trade Analysis", trade.tradeAnalysis || "N/A")}
                    >
                      <div className="truncate">{trade.tradeAnalysis || "N/A"}</div>
                    </td>

                    <td
                      className="px-4 py-2 text-sm text-gray-500 max-w-[6rem] cursor-pointer hover:text-blue-600 hover:underline"
                      onClick={() => openModal("Trade Notes", trade.tradeNotes || "N/A")}
                    >
                      <div className="truncate">{trade.tradeNotes || "N/A"}</div>
                    </td>
                    <td
                      className="px-4 py-2 text-sm text-gray-500 max-w-[6rem] cursor-pointer hover:text-blue-600 hover:underline"
                      onClick={() => openModal("Mistakes", trade.mistakes || "N/A")}
                    >
                      <div className="truncate">{trade.mistakes || "N/A"}</div>
                    </td>
                    <td
                      className="px-4 py-2 text-sm text-gray-500 max-w-[6rem] cursor-pointer hover:text-blue-600 hover:underline"
                      onClick={() => openModal("What Did Well", trade.whatDidWell || "N/A")}
                    >
                      <div className="truncate">{trade.whatDidWell || "N/A"}</div>
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-500">{trade.tags}</td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-600 text-center py-4">No trade history available.</p>
      )}

      {/* Modal */}
      <TradeDetailModal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={modalContent.title}
        content={modalContent.content}
      />
    </div>
  );
}