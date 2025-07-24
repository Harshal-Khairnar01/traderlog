import React from "react";

export default function StrategyTradesModal({ strategyName, trades, onClose }) {
  if (!trades || trades.length === 0) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-zinc-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
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

        <div className="p-4 overflow-y-auto flex-grow custom-scrollbar">
          {trades.length === 0 ? (
            <p className="text-gray-400 text-center">
              No trades found for this strategy.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm text-gray-300">
                <thead className="text-xs text-gray-400 uppercase bg-zinc-700 sticky top-0">
                  <tr>
                    <th scope="col" className="px-6 py-3">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Symbol
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Dir.
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Entry/Exit
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Qty
                    </th>
                    <th scope="col" className="px-6 py-3">
                      P&L
                    </th>
                    <th scope="col" className="px-6 py-3">
                      SL/Target
                    </th>
                    <th scope="col" className="px-6 py-3">
                      R:R
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Conf.
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Notes
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {trades.map((trade) => (
                    <tr
                      key={trade.id}
                      className="bg-zinc-800 border-b border-zinc-700 hover:bg-zinc-700 transition-colors duration-150"
                    >
                      <td className="px-6 py-3 whitespace-nowrap">
                        {trade.date}
                      </td>
                      <td className="px-6 py-3 whitespace-nowrap">
                        {trade.symbol}
                      </td>
                      <td
                        className={`px-6 py-3 whitespace-nowrap ${
                          trade.direction === "Long"
                            ? "text-green-400"
                            : "text-red-400"
                        }`}
                      >
                        {trade.direction}
                      </td>
                      <td className="px-6 py-3 whitespace-nowrap">
                        {trade.entryPrice?.toFixed(2)} /{" "}
                        {trade.exitPrice?.toFixed(2)}
                      </td>
                      <td className="px-6 py-3 whitespace-nowrap">
                        {trade.quantity}
                      </td>
                      <td
                        className={`px-6 py-3 whitespace-nowrap ${
                          trade.pnlAmount >= 0
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      >
                        {trade.pnlAmount?.toFixed(2)}
                      </td>
                      <td className="px-6 py-3 whitespace-nowrap">
                        {trade.stopLoss?.toFixed(2) || "-"} /{" "}
                        {trade.target?.toFixed(2) || "-"}
                      </td>
                      <td className="px-6 py-3 whitespace-nowrap">
                        {trade.riskReward || "-"}
                      </td>
                      <td className="px-6 py-3 whitespace-nowrap">
                        {trade.confidenceLevel || "-"}
                      </td>
                      <td
                        className="px-6 py-3 max-w-xs truncate"
                        title={trade.tradNotes}
                      >
                        {trade.tradeNotes || "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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
  );
}
