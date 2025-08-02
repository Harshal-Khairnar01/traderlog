import React from 'react'
import { Eye, Edit, Trash2 } from 'lucide-react'
import { getSlTargetColorClass, getRowClass } from '@/utils/tradeTableHelpers'

export default function TradesTableBody({
  groupedTrades,
  openDetailedModal,
  handleEditClick,
  handleDeleteClick,
}) {
  return (
    <tbody className="divide-y divide-zinc-700">
      {Object.values(groupedTrades).map((group, groupIdx) => (
        <React.Fragment key={groupIdx}>
          {group.trades?.map((trade, tradeIdx) => (
            <tr
              key={trade.id || `${trade.date}-${trade.time}-${trade.symbol}`}
              className={`${getRowClass(
                tradeIdx,
              )}  transition-colors duration-150`}
            >
              <td className="px-4 py-3 text-sm text-gray-200 whitespace-nowrap">
                {new Date(trade.date).toLocaleDateString('en-GB', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                })}
              </td>
              <td className="px-4 py-3 text-sm text-gray-200 whitespace-nowrap">
                {trade.symbol || trade.instrument}
              </td>
              <td className="px-4 py-3 text-sm text-gray-200 whitespace-nowrap">
                <div className="flex flex-col">
                  <span className="text-gray-200 font-medium">
                    {trade.marketType || 'N/A'}
                  </span>
                  <span className="text-gray-400 text-xs">
                    {trade.optionType || 'N/A'}
                  </span>
                </div>
              </td>
              <td className="px-4 py-3 text-sm whitespace-nowrap">
                <span
                  className={`inline-flex items-center justify-center px-2 py-0.5 rounded-sm font-semibold ${
                    trade.direction === 'Long'
                      ? 'bg-green-700 text-white'
                      : 'bg-red-700 text-white'
                  }`}
                >
                  {trade.direction}
                </span>
              </td>
              <td className="px-4 py-3 text-sm text-gray-200 whitespace-nowrap">
                {trade.quantity || 'N/A'}
              </td>
              <td className="px-4 py-3 text-sm text-gray-200 whitespace-nowrap">
                <div className="flex flex-col">
                  <span>{trade.entryPrice || 'N/A'}</span>
                  <span className="text-gray-400 text-xs">
                    {trade.exitPrice || 'N/A'}
                  </span>
                </div>
              </td>
              <td className="px-4 py-3 text-sm whitespace-nowrap">
                <div className="flex flex-col">
                  <span
                    className={`$${
                      (trade.pnlAmount || trade.netPnl || 0) >= 0
                        ? 'text-green-500'
                        : 'text-red-500'
                    } font-semibold`}
                  >
                    {(trade.pnlAmount || trade.netPnl || 0) >= 0 ? '+' : ''}
                    {(trade.pnlAmount || trade.netPnl || 0)?.toFixed(2) ||
                      '0.00'}
                  </span>
                  <span
                    className={`$${
                      (trade.pnlPercentage || 0) >= 0
                        ? 'text-green-500'
                        : 'text-red-500'
                    } text-xs`}
                  >
                    {(trade.pnlPercentage || 0) >= 0 ? '+' : ''}
                    {(trade.pnlPercentage || 0)?.toFixed(2) || '0.00'}%
                  </span>
                </div>
              </td>
              <td className="px-4 py-3 text-sm text-gray-200 whitespace-nowrap">
                {trade.charges?.toFixed(2) || '0.00'}
              </td>
              <td className="px-4 py-3 text-sm text-gray-200 whitespace-nowrap">
                {trade.riskReward || 'N/A'}
              </td>
              <td className="px-4 py-3 text-sm text-gray-200 max-w-[8rem] ">
                {trade.strategyUsed || '-'}
              </td>
              <td className="px-4 py-3 text-sm text-gray-200 max-w-[8rem] ">
                {trade.outcomeSummary || '-'}
              </td>
              <td className="px-4 py-3 text-sm whitespace-nowrap">
                <div className="flex flex-col">
                  <span className={getSlTargetColorClass(trade, 'SL')}>
                    SL: {trade.stopLoss || 'N/A'}
                  </span>
                  <span className={getSlTargetColorClass(trade, 'Target')}>
                    Target: {trade.target || 'N/A'}
                  </span>
                  <span className="text-gray-200">
                    Total Amt: {trade.totalAmount || 'N/A'}
                  </span>
                  <span className="text-gray-400 text-xs">
                    Conf: {trade.psychology.confidenceLevel || 'N/A'}
                  </span>
                </div>
              </td>
              <td className="px-4 py-3 text-sm text-gray-200 whitespace-nowrap">
                <div className="flex space-x-2">
                  <button
                    className="text-green-500 hover:text-green-400 transition-colors duration-150  cursor-pointer"
                    title="View All Details"
                    onClick={() => openDetailedModal(trade)}
                  >
                    <Eye className="h-5 w-5" />
                  </button>
                  <button
                    className="text-yellow-500 hover:text-yellow-400 transition-colors duration-150  cursor-pointer"
                    title="Edit"
                    onClick={() => handleEditClick(trade)}
                  >
                    <Edit className="h-5 w-5" />
                  </button>
                  <button
                    className="text-red-500 hover:text-red-400 transition-colors duration-150  cursor-pointer"
                    title="Delete"
                    onClick={() =>
                      handleDeleteClick(
                        trade.id,
                        trade.symbol || trade.instrument,
                      )
                    }
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
  )
}
