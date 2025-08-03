import React from 'react'
import { Eye, Edit, Trash2 } from 'lucide-react'
import { getSlTargetColorClass } from '@/utils/tradeTableHelpers'

const formatTo12HourTime = (timeStr) => {
  if (!timeStr) return 'N/A'
  const [hour, minute] = timeStr.split(':').map(Number)
  const period = hour >= 12 ? 'PM' : 'AM'
  const formattedHour = hour % 12 === 0 ? 12 : hour % 12
  const formattedMinute = minute.toString().padStart(2, '0')
  return `${formattedHour}:${formattedMinute} ${period}`
}

const getOptionTypeColorClass = (optionType, direction) => {
  if (!optionType) {
    return 'text-gray-400'
  }
  const normalizedType = optionType.toLowerCase()
  const normalizedDirection = direction ? direction.toLowerCase() : null

  if (normalizedDirection === 'long') {
    if (normalizedType === 'call') {
      return 'text-green-500 font-semibold'
    }
    if (normalizedType === 'put') {
      return 'text-red-500 font-semibold'
    }
  }

  if (normalizedDirection === 'short') {
    if (normalizedType === 'call') {
      return 'text-red-500 font-semibold'
    }
    if (normalizedType === 'put') {
      return 'text-green-500 font-semibold'
    }
  }

  return 'text-gray-400'
}

export default function TradesTableBody({
  trades,
  openDetailedModal,
  handleEditClick,
  handleDeleteClick,
  showActions = true,
}) {
  return (
    <tbody className="divide-y divide-zinc-700">
      {trades?.map((trade, tradeIdx) => (
        <tr
          key={trade.id || `${trade.date}-${trade.time}-${trade.symbol}`}
          className={`${
            tradeIdx % 2 === 0 ? 'bg-zinc-950' : 'bg-slate-950'
          } transition-colors duration-150`}
        >
          <td className="px-4 py-3 text-sm text-gray-200 whitespace-nowrap">
            <div className="flex flex-col">
              <span>
                {new Date(trade.date).toLocaleDateString('en-GB', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                })}
              </span>
              <span className="text-gray-400 text-xs">
                {formatTo12HourTime(trade.time)}
              </span>
            </div>
          </td>
          <td className="px-4 py-3 text-sm text-gray-200 whitespace-nowrap">
            {trade.symbol || trade.instrument}
          </td>
          <td className="px-4 py-3 text-sm text-gray-200 whitespace-nowrap">
            <div className="flex flex-col">
              <span className="text-gray-200 font-medium">
                {trade.marketType || 'N/A'}
              </span>
              <span
                className={`text-xs ${getOptionTypeColorClass(
                  trade.optionType,
                  trade.direction,
                )}`}
              >
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
                className={`${
                  (trade.netPnl || 0) >= 0 ? 'text-green-500' : 'text-red-500'
                } font-semibold`}
              >
                {(trade.netPnl || 0) >= 0 ? '+' : ''}
                {(trade.netPnl || 0)?.toFixed(2) || '0.00'}
              </span>
              <span
                className={`${
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

          {showActions && (
            <td className="px-4 py-3 text-sm text-gray-200 whitespace-nowrap">
              <div className="flex space-x-2">
                <button
                  className="text-green-500 hover:text-green-400 transition-colors duration-150 cursor-pointer"
                  title="View All Details"
                  onClick={() => openDetailedModal(trade)}
                >
                  <Eye className="h-5 w-5" />
                </button>
                <button
                  className="text-yellow-500 hover:text-yellow-400 transition-colors duration-150 cursor-pointer"
                  title="Edit"
                  onClick={() => handleEditClick(trade)}
                >
                  <Edit className="h-5 w-5" />
                </button>
                <button
                  className="text-red-500 hover:text-red-400 transition-colors duration-150 cursor-pointer"
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
          )}
        </tr>
      ))}
    </tbody>
  )
}
