// components/AllTradesTable.jsx
"use client";

import React, { useState } from "react";
import TradeDetailModal from "./TradeDetailModal";
import ConfirmationModal from "./ConfirmationModal"; // Import the new confirmation modal
import { Eye, Edit, Trash2 } from "lucide-react";

export default function AllTradesTable({ groupedTrades, onDeleteTrade, onEditTrade }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [isSimpleTextModal, setIsSimpleTextModal] = useState(false);

  // New state for the confirmation modal
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [tradeToDelete, setTradeToDelete] = useState(null); // To store the trade info for deletion

  const openDetailedModal = (trade) => {
    setModalContent(trade);
    setIsSimpleTextModal(false);
    setIsModalOpen(true);
  };

  const openTruncatedContentModal = (title, content) => {
    setModalContent({ title: title, content: content });
    setIsSimpleTextModal(true);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalContent(null);
    setIsSimpleTextModal(false);
  };

  // Modified handleDeleteClick to open confirmation modal
  const handleDeleteClick = (tradeId, symbol) => {
    setTradeToDelete({ id: tradeId, symbol: symbol });
    setIsConfirmModalOpen(true);
  };

  // New function to handle actual deletion after confirmation
  const confirmDelete = () => {
    if (tradeToDelete) {
      onDeleteTrade(tradeToDelete.id);
      setTradeToDelete(null); // Clear the trade to delete
    }
    setIsConfirmModalOpen(false); // Close the confirmation modal
  };

  const cancelDelete = () => {
    setTradeToDelete(null); // Clear the trade to delete
    setIsConfirmModalOpen(false); // Close the confirmation modal
  };

  const handleEditClick = (trade) => {
    onEditTrade(trade);
  };

  const getSlTargetColorClass = (trade, type) => {
    const { direction, entryPrice, exitPrice, stopLoss, target, exitType } = trade;

    const entry = parseFloat(entryPrice);
    const exit = parseFloat(exitPrice);
    const sl = parseFloat(stopLoss);
    const tg = parseFloat(target);

    let colorClass = "text-gray-200";

    switch (exitType) {
      case "Manual_Exit":
        return "text-yellow-400";
      case "Time_Based_Exit":
        return "text-blue-400";
      case "SL_Hit":
        if (type === "SL") {
          return "text-red-500";
        }
        break;
      case "Target_Hit":
        if (type === "Target") {
          return "text-green-500";
        }
        break;
      default:
        if (!isNaN(entry) && !isNaN(exit) && !isNaN(sl) && !isNaN(tg)) {
          if (type === "SL") {
            if (direction === "Long") {
              colorClass = exit <= sl ? "text-red-500" : "text-gray-200";
            } else if (direction === "Short") {
              colorClass = exit >= sl ? "text-red-500" : "text-gray-200";
            }
          } else if (type === "Target") {
            if (direction === "Long") {
              colorClass = exit >= tg ? "text-green-500" : "text-gray-200";
            } else if (direction === "Short") {
              colorClass = exit <= tg ? "text-green-500" : "text-gray-200";
            }
          }
        }
        break;
    }

    return colorClass;
  };

  const getRowClass = (index) => {
    return index % 2 === 0 ? "bg-zinc-800" : "bg-zinc-700";
  };

  return (
    <div className="bg-zinc-900 p-4 rounded-lg shadow-inner">
      {Object.keys(groupedTrades).length > 0 ? (
        <div className="max-h-[85vh] overflow-y-auto overflow-x-auto custom-scrollbar">
          <table className="min-w-full divide-y divide-zinc-700">
            <thead className="bg-zinc-700 sticky top-0 z-10">
              <tr>
                {[
                  "Date",
                  "Symbol",
                  "Type",
                  "Direction",
                  "Qty",
                  "Entry/Exit",
                  "P/L (%)",
                  "Charges",
                  "Risk/Reward",
                  "Strategy",
                  "Outcome",
                  "Details",
                  "Actions",
                ].map((header) => (
                  <th
                    key={header}
                    className="px-4 py-3 text-left text-xs font-medium text-gray-300 whitespace-nowrap"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-zinc-700">
              {Object.values(groupedTrades).map((group, groupIdx) => (
                <React.Fragment key={groupIdx}>
                  {group.trades?.map((trade, tradeIdx) => (
                    <tr
                      key={trade.id || `${trade.date}-${trade.time}-${trade.symbol}`}
                      className={`${getRowClass(tradeIdx)} hover:bg-zinc-600 transition-colors duration-150`}
                    >
                      <td className="px-4 py-3 text-sm text-gray-200 whitespace-nowrap">
                        {trade.date}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-200 whitespace-nowrap">
                        {trade.symbol || trade.instrument}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-200 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="text-gray-200 font-medium">{trade.marketType || "N/A"}</span>
                          <span className="text-gray-400 text-xs">{trade.optionType || "N/A"}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm whitespace-nowrap">
                        <span
                          className={`inline-flex items-center justify-center px-2 py-0.5 rounded-sm font-semibold ${
                            trade.direction === "Long"
                              ? "bg-green-700 text-white"
                              : "bg-red-700 text-white"
                          }`}
                        >
                          {trade.direction}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-200 whitespace-nowrap">
                        {trade.quantity || "N/A"}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-200 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span>{trade.entryPrice || "N/A"}</span>
                          <span className="text-gray-400 text-xs">{trade.exitPrice || "N/A"}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className={`${(trade.pnlAmount || trade.netPnl || 0) >= 0 ? "text-green-500" : "text-red-500"} font-semibold`}>
                            {(trade.pnlAmount || trade.netPnl || 0) >= 0 ? "+" : ""}
                            {(trade.pnlAmount || trade.netPnl || 0)?.toFixed(2) || "0.00"}
                          </span>
                          <span className={`${(trade.pnlPercentage || 0) >= 0 ? "text-green-500" : "text-red-500"} text-xs`}>
                            {(trade.pnlPercentage || 0) >= 0 ? "+" : ""}
                            {(trade.pnlPercentage || 0)?.toFixed(2) || "0.00"}%
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-200 whitespace-nowrap">
                        {trade.charges?.toFixed(2) || "0.00"}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-200 whitespace-nowrap">
                        {trade.riskReward || "N/A"}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-200 max-w-[8rem] truncate cursor-pointer hover:underline"
                        onClick={() => openTruncatedContentModal("Strategy", trade.strategy || "N/A")}>
                        {trade.strategy || "-"}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-200 max-w-[8rem] truncate cursor-pointer hover:underline"
                        onClick={() => openTruncatedContentModal("Outcome Summary", trade.outcomeSummary || "N/A")}>
                        {trade.outcomeSummary || "-"}
                      </td>
                      <td className="px-4 py-3 text-sm whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className={getSlTargetColorClass(trade, "SL")}>SL: {trade.stopLoss || "N/A"}</span>
                          <span className={getSlTargetColorClass(trade, "Target")}>Target: {trade.target || "N/A"}</span>
                          <span className="text-gray-200">Total Amt: {trade.totalAmount || "N/A"}</span>
                          <span className="text-gray-400 text-xs">Conf: {trade.confidenceLevel || "N/A"}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-200 whitespace-nowrap">
                        <div className="flex space-x-2">
                          <button
                            className="text-blue-500 hover:text-blue-400 transition-colors duration-150"
                            title="View All Details"
                            onClick={() => openDetailedModal(trade)}
                          >
                            <Eye className="h-5 w-5" />
                          </button>

                          <button
                            className="text-blue-500 hover:text-blue-400 transition-colors duration-150"
                            title="Edit"
                            onClick={() => handleEditClick(trade)}
                          >
                            <Edit className="h-5 w-5" />
                          </button>
                          <button
                            className="text-red-500 hover:text-red-400 transition-colors duration-150"
                            title="Delete"
                            onClick={() => handleDeleteClick(trade.id, trade.symbol || trade.instrument)}
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-400 text-center py-4">
          No trade history available.
        </p>
      )}

      {/* Existing TradeDetailModal */}
      <TradeDetailModal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={isSimpleTextModal ? modalContent?.title : "Trade Details"}
        content={isSimpleTextModal ? modalContent?.content : null}
        tradeData={isSimpleTextModal ? null : modalContent}
        isSimpleText={isSimpleTextModal}
      />

      {/* New ConfirmationModal for deletion */}
      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        title="Confirm Deletion"
        message={`Are you sure you want to delete the trade for ${tradeToDelete?.symbol || 'this instrument'}? This action cannot be undone.`}
      />
    </div>
  );
}