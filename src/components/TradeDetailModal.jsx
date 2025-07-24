// components/TradeDetailModal.jsx
"use client";

import React from "react";

const DetailItem = ({ label, value, isMonetary = false, isPercentage = false, isArray = false }) => {
  if ((value === null || value === undefined || value === "") && value !== 0) {
    return null;
  }

  let displayValue = value;

  if (isMonetary && typeof value === 'number') {
    displayValue = value.toFixed(2);
  } else if (isPercentage && typeof value === 'number') {
    displayValue = `${value.toFixed(2)}%`;
  } else if (isArray && Array.isArray(value)) {
    displayValue = value.length > 0 ? value.join(", ") : "N/A";
  }

  return (
    <div className="mb-2">
      <dt className="text-gray-400 text-sm font-semibold">{label}:</dt>
      <dd className="text-gray-200 text-base ml-4 whitespace-pre-wrap">{displayValue}</dd>
    </div>
  );
};

const TradeDetailModal = ({ isOpen, onClose, title, tradeData, content, isSimpleText = false }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
      <div className="bg-zinc-800 p-6 rounded-lg shadow-xl max-w-2xl w-full mx-4 border border-zinc-700">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-100">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-100 text-2xl font-semibold"
          >
            &times;
          </button>
        </div>

        <div className="max-h-[70vh] overflow-y-auto mb-4 custom-scrollbar pr-2">
          {isSimpleText ? (
            <p className="text-gray-300 whitespace-pre-wrap">{content}</p>
          ) : (
            tradeData && (
              <>
                <h3 className="text-lg font-semibold text-gray-100 mb-3 border-b border-zinc-700 pb-2">Trade Overview</h3>
                <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-2 mb-6">
                  <DetailItem label="Date" value={tradeData.date} />
                  <DetailItem label="Time" value={tradeData.time} />
                  <DetailItem label="Market Type" value={tradeData.marketType} />
                  <DetailItem label="Symbol" value={tradeData.symbol || tradeData.instrument} />
                  <DetailItem label="Direction" value={tradeData.direction} />
                  <DetailItem label="Option Type" value={tradeData.optionType} />
                  <DetailItem label="Quantity" value={tradeData.quantity} />
                  <DetailItem label="Entry Price" value={tradeData.entryPrice} isMonetary />
                  <DetailItem label="Exit Price" value={tradeData.exitPrice} isMonetary />
                  <DetailItem label="Total Amount" value={tradeData.totalAmount} isMonetary />
                </dl>

                <h3 className="text-lg font-semibold text-gray-100 mb-3 border-b border-zinc-700 pb-2">Financials</h3>
                <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-2 mb-6">
                  <DetailItem label="Gross P&L" value={tradeData.grossPnl} isMonetary />
                  <DetailItem label="Net P&L (Amount)" value={tradeData.pnlAmount || tradeData.netPnl} isMonetary />
                  <DetailItem label="Net P&L (%)" value={tradeData.pnlPercentage} isPercentage />
                  <DetailItem label="Charges" value={tradeData.charges} isMonetary />
                  <DetailItem label="Stop Loss" value={tradeData.stopLoss} isMonetary />
                  <DetailItem label="Target" value={tradeData.target} isMonetary />
                  <DetailItem label="Risk/Reward" value={tradeData.riskReward} />
                </dl>

                <h3 className="text-lg font-semibold text-gray-100 mb-3 border-b border-zinc-700 pb-2">Analysis & Psychology</h3>
                <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-2 mb-6">
                  <DetailItem label="Strategy" value={tradeData.strategy} />
                  <DetailItem label="Outcome Summary" value={tradeData.outcomeSummary} />
                  <DetailItem label="Confidence Level" value={tradeData.confidenceLevel} />
                  <DetailItem label="Emotions Before" value={tradeData.emotionsBefore} />
                  <DetailItem label="Emotions After" value={tradeData.emotionsAfter} />
                  <DetailItem label="Tags" value={tradeData.tags} />
                  <DetailItem label="Screenshot Uploaded" value={tradeData.screenshotUpload ? "Yes" : "No"} />
                  <DetailItem label="Mistake Checklist" value={tradeData.mistakeChecklist} isArray />
                </dl>

                {tradeData.tradeAnalysis && (
                  <div className="mb-4">
                    <dt className="text-gray-400 text-sm font-semibold">Trade Analysis:</dt>
                    <dd className="text-gray-200 text-base ml-4 whitespace-pre-wrap border border-zinc-700 p-3 rounded-md bg-zinc-700/30">{tradeData.tradeAnalysis}</dd>
                  </div>
                )}
                {tradeData.tradeNotes && (
                  <div className="mb-4">
                    <dt className="text-gray-400 text-sm font-semibold">Trade Notes:</dt>
                    <dd className="text-gray-200 text-base ml-4 whitespace-pre-wrap border border-zinc-700 p-3 rounded-md bg-zinc-700/30">{tradeData.tradeNotes}</dd>
                  </div>
                )}
                {tradeData.mistakes && (
                  <div className="mb-4">
                    <dt className="text-gray-400 text-sm font-semibold">Mistakes Made:</dt>
                    <dd className="text-gray-200 text-base ml-4 whitespace-pre-wrap border border-zinc-700 p-3 rounded-md bg-zinc-700/30">{tradeData.mistakes}</dd>
                  </div>
                )}
                {tradeData.whatDidWell && (
                  <div className="mb-4">
                    <dt className="text-gray-400 text-sm font-semibold">What Did Well:</dt>
                    <dd className="text-gray-200 text-base ml-4 whitespace-pre-wrap border border-zinc-700 p-3 rounded-md bg-zinc-700/30">{tradeData.whatDidWell}</dd>
                  </div>
                )}
              </>
            )
          )}
        </div>
        <div className="text-right mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none transition-colors duration-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default TradeDetailModal;