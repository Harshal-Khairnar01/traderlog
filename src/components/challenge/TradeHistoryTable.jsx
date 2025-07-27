

import React from 'react';

const TradeHistoryTable = ({ tradeHistory }) => {

  const formatNumber = (value) => {
    if (typeof value === 'number' && !isNaN(value)) {
      return value.toFixed(2);
    }
    return '-';
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Trade History</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-700">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                DATE
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                SYMBOL
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                TYPE
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                ENTRY
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                EXIT
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                QTY
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                P&L
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                R:R
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                NOTES
              </th>
            </tr>
          </thead>
          <tbody className="bg-gray-800 divide-y divide-gray-700">
            {tradeHistory.length === 0 ? (
              <tr>
                <td colSpan="9" className="px-6 py-4 text-center text-gray-400">No trades recorded yet.</td>
              </tr>
            ) : (
              tradeHistory.map((trade, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                    {trade.date || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                    {trade.symbol || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                    {trade.direction || trade.type || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                    {trade.entryPrice !== null && !isNaN(trade.entryPrice) ? `₹${formatNumber(trade.entryPrice)}` : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                    {trade.exitPrice !== null && !isNaN(trade.exitPrice) ? `₹${formatNumber(trade.exitPrice)}` : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                    {trade.quantity !== null && !isNaN(trade.quantity) ? trade.quantity.toLocaleString() : '-'}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${trade.pnlAmount >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {trade.pnlAmount !== null && !isNaN(trade.pnlAmount)
                      ? (trade.pnlAmount >= 0
                        ? `₹${trade.pnlAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                        : `-₹${Math.abs(trade.pnlAmount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`)
                      : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                    {trade.riskReward !== null && !isNaN(trade.riskReward) ? formatNumber(trade.riskReward) : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                    {trade.tradeNotes || '-'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TradeHistoryTable;
