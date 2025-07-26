// src/components/challenge/ChallengeTradeHistory.jsx
import React from 'react';

export default function ChallengeTradeHistory({ trades, onEdit, onDelete }) {

  if (!trades || trades.length === 0) {
    return (
      <div className="bg-zinc-800 p-6 rounded-lg shadow-lg mb-8 border border-zinc-700 text-center text-gray-400">
        <p>No trade history available for this challenge yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-zinc-800 p-6 rounded-lg shadow-lg mb-8 border border-zinc-700">
      <h3 className="text-xl font-semibold text-gray-100 mb-4">Trade History</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm whitespace-nowrap">
          <thead>
            <tr className="border-b border-zinc-700 text-gray-400">
              <th scope="col" className="px-3 py-3 font-medium">DATE</th>
              <th scope="col" className="px-3 py-3 font-medium">SYMBOL</th>
              <th scope="col" className="px-3 py-3 font-medium">TYPE</th>
              <th scope="col" className="px-3 py-3 font-medium">ENTRY</th>
              <th scope="col" className="px-3 py-3 font-medium">EXIT</th>
              <th scope="col" className="px-3 py-3 font-medium">QTY</th>
              <th scope="col" className="px-3 py-3 font-medium">P&L</th>
              <th scope="col" className="px-3 py-3 font-medium">R:R</th>
              <th scope="col" className="px-3 py-3 font-medium">NOTES</th>
              <th scope="col" className="px-3 py-3 font-medium">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {trades.map((trade, index) => (
              <tr key={trade.id || index} className="border-b border-zinc-700 last:border-b-0">
                <td className="px-3 py-3 text-gray-200">
                  {trade.date ? new Date(trade.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' }) : 'N/A'}
                </td>
                <td className="px-3 py-3 text-gray-200">{trade.symbol || 'N/A'}</td>
                <td className="px-3 py-3 text-gray-200">{trade.direction || trade.type || 'N/A'}</td>
                <td className="px-3 py-3 text-gray-200">₹{(typeof trade.entryPrice === 'number' ? trade.entryPrice : 0).toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                <td className="px-3 py-3 text-gray-200">₹{(typeof trade.exitPrice === 'number' ? trade.exitPrice : 0).toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                <td className="px-3 py-3 text-gray-200">{(typeof trade.quantity === 'number' ? trade.quantity : 0).toLocaleString('en-IN')}</td>
                <td className={`px-3 py-3 ${trade.pnlAmount >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  ₹{(typeof trade.pnlAmount === 'number' ? trade.pnlAmount : 0).toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                </td>
                <td className="px-3 py-3 text-gray-200">{(typeof trade.riskReward === 'number' ? trade.riskReward : 'N/A')}</td>
                <td className="px-3 py-3 text-gray-200">{trade.tradeNotes || trade.notes || ''}</td>
                <td className="px-3 py-3">
                    {onEdit && (
                        <button
                            onClick={() => onEdit(trade)}
                            className="text-blue-500 hover:text-blue-700 mr-2"
                            title="Edit Trade"
                        >
                            Edit
                        </button>
                    )}
                    {onDelete && (
                        <button
                            onClick={() => onDelete(trade.id)}
                            className="text-red-500 hover:text-red-700"
                            title="Delete Trade"
                        >
                            Delete
                        </button>
                    )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}