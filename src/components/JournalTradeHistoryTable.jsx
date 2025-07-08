import React from 'react';

export default function JournalTradeHistoryTable({ initialCapital, currentCapital, tradeHistory }) {
  return (
    <div className="bg-green-50 p-6 rounded-lg shadow-inner overflow-x-auto">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-2xl font-semibold text-gray-700">Trade History (Journal View)</h3>
        <div className="flex space-x-4">
          <p className="text-xl font-bold text-gray-800">Initial Capital: <span className="text-blue-700">₹{initialCapital.toLocaleString()}</span></p>
          <p className="text-xl font-bold text-gray-800">Current Capital: <span className={`${currentCapital >= initialCapital ? 'text-green-700' : 'text-red-700'}`}>₹{currentCapital.toLocaleString()}</span></p>
        </div>
      </div>
      {tradeHistory.length > 0 ? (
        <table className="min-w-full divide-y divide-gray-200 rounded-lg overflow-hidden">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Instrument
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Quantity
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                P&L
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {tradeHistory.map((trade) => (
              <tr key={trade.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{trade.date}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{trade.instrument}</td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${trade.direction === 'Buy' ? 'text-green-600' : 'text-red-600'}`}>
                  {trade.direction}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{trade.quantity}</td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm font-bold ${trade.netPnl >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                  {trade.netPnl >= 0 ? '+' : ''}{trade.netPnl}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-600 text-center py-4">No trade history available.</p>
      )}
    </div>
  );
}