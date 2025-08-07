'use client'

import React from 'react'

const DetailItem = ({
  label,
  value,
  isMonetary = false,
  isPercentage = false,
  isArray = false,
}) => {
  if ((value === null || value === undefined || value === '') && value !== 0)
    return null

  let displayValue = value
  if (isMonetary && typeof value === 'number')
    displayValue = `${value.toFixed(2)}`
  else if (isPercentage && typeof value === 'number')
    displayValue = `${value.toFixed(2)}%`
  else if (isArray && Array.isArray(value))
    displayValue = value.length > 0 ? value.join(', ') : 'N/A'

  return (
    <div className="mb-3">
      <dt className="text-sm font-medium text-gray-400">{label}</dt>
      <dd className="text-base text-gray-100 ml-4 whitespace-pre-wrap">
        {displayValue}
      </dd>
    </div>
  )
}

const TradeDetailModal = ({
  isOpen,
  onClose,
  title,
  tradeData,
  content,
  isSimpleText = false,
}) => {
  if (!isOpen) return null



  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4">
      <div className="bg-zinc-900 p-6 rounded-2xl shadow-2xl w-full max-w-4xl border border-zinc-700 overflow-hidden">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl font-bold"
          >
            &times;
          </button>
        </div>

        <div className="max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar space-y-8">
          {isSimpleText ? (
            <p className="text-gray-300 whitespace-pre-wrap">{content}</p>
          ) : (
            tradeData && (
              <>
                {/* Overview */}
                <section>
                  <h3 className="text-xl font-semibold text-white mb-4 border-b border-zinc-700 pb-2">
                    Trade Overview
                  </h3>
                  <dl className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                    <DetailItem
                      label="Date"
                      value={tradeData.date?.split('T')[0]}
                    />
                    <DetailItem label="Time" value={tradeData.time} />
                    <DetailItem
                      label="Market Type"
                      value={tradeData.marketType}
                    />
                    <DetailItem label="Symbol" value={tradeData.symbol} />
                    <DetailItem label="Direction" value={tradeData.direction} />
                    <DetailItem
                      label="Option Type"
                      value={tradeData.optionType}
                    />
                    <DetailItem label="Quantity" value={tradeData.quantity} />
                    <DetailItem
                      label="Entry Price"
                      value={tradeData.entryPrice}
                      isMonetary
                    />
                    <DetailItem
                      label="Exit Price"
                      value={tradeData.exitPrice}
                      isMonetary
                    />
                    <DetailItem
                      label="Total Amount"
                      value={tradeData.totalAmount}
                      isMonetary
                    />
                  </dl>
                </section>

                {/* Financials */}
                <section>
                  <h3 className="text-xl font-semibold text-white mb-4 border-b border-zinc-700 pb-2">
                    Financials
                  </h3>
                  <dl className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                    <DetailItem
                      label="Gross P&L"
                      value={tradeData.grossPnl}
                      isMonetary
                    />
                    <DetailItem
                      label="Net P&L (Amount)"
                      value={tradeData.pnlAmount || tradeData.netPnl}
                      isMonetary
                    />
                    <DetailItem
                      label="Net P&L (%)"
                      value={tradeData.pnlPercentage}
                      isPercentage
                    />
                    <DetailItem
                      label="Charges"
                      value={tradeData.charges}
                      isMonetary
                    />
                    <DetailItem
                      label="Stop Loss"
                      value={tradeData.stopLoss}
                      isMonetary
                    />
                    <DetailItem
                      label="Target"
                      value={tradeData.target}
                      isMonetary
                    />
                    <DetailItem
                      label="Risk/Reward"
                      value={tradeData.riskReward}
                    />
                  </dl>
                </section>

                {/* Analysis & Psychology */}
                <section>
                  <h3 className="text-xl font-semibold text-white mb-4 border-b border-zinc-700 pb-2">
                    Analysis & Psychology
                  </h3>
                  <dl className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    <DetailItem
                      label="Strategy"
                      value={tradeData.strategyUsed}
                    />
                    <DetailItem
                      label="Outcome Summary"
                      value={tradeData.outcomeSummary}
                    />
                    <DetailItem
                      label="Confidence Level"
                      value={tradeData.psychology?.confidenceLevel}
                    />
                    <DetailItem
                      label="Emotions Before"
                      value={tradeData.psychology?.emotionsBefore}
                    />
                    <DetailItem
                      label="Emotions After"
                      value={tradeData.psychology?.emotionsAfter}
                    />
                    <DetailItem label="Tags" value={tradeData.tags} isArray />
                    <DetailItem
                      label="Mistake Checklist"
                      value={tradeData.psychology.mistakeChecklist}
                      isArray
                    />
                  </dl>
                </section>

                {/* Notes Sections */}
                {tradeData.tradeAnalysis && (
                  <section>
                    <h4 className="text-gray-400 text-sm font-semibold mb-1">
                      Trade Analysis
                    </h4>
                    <p className="text-gray-100 p-3 bg-zinc-800 rounded-md whitespace-pre-wrap">
                      {tradeData.tradeAnalysis}
                    </p>
                  </section>
                )}
                {tradeData.psychology.notes && (
                  <section>
                    <h4 className="text-gray-400 text-sm font-semibold mb-1">
                      Trade Notes
                    </h4>
                    <p className="text-gray-100 p-3 bg-zinc-800 rounded-md whitespace-pre-wrap">
                      {tradeData.psychology.notes}
                    </p>
                  </section>
                )}
                {tradeData.psychology.mistakes && (
                  <section>
                    <h4 className="text-gray-400 text-sm font-semibold mb-1">
                      Mistakes Made
                    </h4>
                    <p className="text-gray-100 p-3 bg-zinc-800 rounded-md whitespace-pre-wrap">
                      {tradeData.psychology.mistakes}
                    </p>
                  </section>
                )}
                {tradeData.psychology.whatIDidWell && (
                  <section>
                    <h4 className="text-gray-400 text-sm font-semibold mb-1">
                      What I Did Well
                    </h4>
                    <p className="text-gray-100 p-3 bg-zinc-800 rounded-md whitespace-pre-wrap">
                      {tradeData.psychology.whatIDidWell}
                    </p>
                  </section>
                )}
              </>
            )
          )}
        </div>

        <div className="text-right mt-6">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors duration-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default TradeDetailModal
