

import React from 'react'
import AllTradesTable from '@/components/all-trades/AllTradesTable'

export default function StrategyTradesModal({ strategyName, trades, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/80 bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-zinc-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col border border-gray-600">
        <div className="flex justify-between items-center p-4 border-b border-zinc-700">
          <h3 className="text-2xl font-bold text-gray-100">
            Trades for "{strategyName}"
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-200 text-3xl leading-none font-semibold"
          >
            &times;
          </button>
        </div>

        <div className=" overflow-y-auto flex-grow custom-scrollbar">
          {trades.length === 0 ? (
            <p className="text-gray-400 text-center">
              No trades found for this strategy.
            </p>
          ) : (
            <AllTradesTable
              trades={trades}
              showActions={false}
              onDeleteTrade={() => {}}
              onEditTrade={() => {}}
            />
          )}
        </div>

        <div className="p-4 border-t border-zinc-700 text-right">
          <button
            onClick={onClose}
            className="bg-blue-600 text-white px-6 py-2 rounded-md font-semibold hover:bg-blue-700 transition-colors duration-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
