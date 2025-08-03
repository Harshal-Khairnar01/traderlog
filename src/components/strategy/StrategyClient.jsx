'use client'

import React, { useState, useCallback } from 'react'
import StrategyCard from '@/components/strategy/StrategyCard'
import StrategyTradesModal from '@/components/strategy/StrategyTradesModal'
import { useStrategyMetrics } from '@/hooks/useStrategyMetrics'

const StrategyClient = () => {
  const { tradeHistory, loading, error, strategyMetrics } = useStrategyMetrics()

  const [showModal, setShowModal] = useState(false)
  const [modalStrategyName, setModalStrategyName] = useState('')
  const [modalTrades, setModalTrades] = useState([])

  const handleViewDetails = useCallback(
    (strategyName) => {
      const filteredTrades = tradeHistory.filter(
        (trade) => (trade.strategyUsed || 'Uncategorized') === strategyName,
      )

      const sortedTrades = [...filteredTrades].sort((a, b) => {
        const parseDateTime = (trade) => {
          const datePart = new Date(trade.date).toISOString().split('T')[0]
          const timePart = trade.time.padStart(5, '0')
          return new Date(`${datePart}T${timePart}:00`)
        }

        return parseDateTime(b) - parseDateTime(a)
      })

      setModalStrategyName(strategyName)
      setModalTrades(sortedTrades)
      setShowModal(true)
    },
    [tradeHistory],
  )

  const handleCloseModal = useCallback(() => {
    setShowModal(false)
    setModalStrategyName('')
    setModalTrades([])
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <p className="text-gray-300 text-lg">Loading strategies data...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    )
  }

  const hasStrategies = Object.keys(strategyMetrics).length > 0

  return (
    <div className="min-h-screen bg-slate-900 relative p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-200">
          Trading Strategies Overview
        </h2>
      </div>

      {hasStrategies ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Object.entries(strategyMetrics).map(([strategyName, metrics]) => (
            <StrategyCard
              key={strategyName}
              strategyName={strategyName}
              usage={metrics.usage}
              profitFactor={metrics.profitFactor}
              totalProfit={metrics.totalProfit}
              winRate={metrics.winRate}
              riskPerTrade={metrics.riskPerTrade}
              onViewDetailsClick={handleViewDetails}
            />
          ))}
        </div>
      ) : (
        <p className="text-gray-400 text-center py-8">
          No trade data available to analyze strategies. Please add some trades.
        </p>
      )}

      {showModal && (
        <StrategyTradesModal
          strategyName={modalStrategyName}
          trades={modalTrades}
          onClose={handleCloseModal}
        />
      )}
    </div>
  )
}

export default StrategyClient
