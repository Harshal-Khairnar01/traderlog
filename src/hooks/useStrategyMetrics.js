import { useState, useEffect, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchTrades } from '@/store/tradesSlice'

export const useStrategyMetrics = () => {
  const dispatch = useDispatch()
  const { tradeHistory, loading, error } = useSelector((state) => state.trades)
  const [strategyMetrics, setStrategyMetrics] = useState({})

  useEffect(() => {
    dispatch(fetchTrades())
  }, [dispatch])

  const parseTradeData = (trade) => {
    const parsedTrade = {
      ...trade,
      id: trade.id || crypto.randomUUID(),
      entryPrice: parseFloat(trade.entryPrice),
      exitPrice: parseFloat(trade.exitPrice),
      quantity: parseFloat(trade.quantity),
      stopLoss:
        trade.stopLoss !== null && trade.stopLoss !== undefined
          ? parseFloat(trade.stopLoss)
          : null,
      target:
        trade.target !== null && trade.target !== undefined
          ? parseFloat(trade.target)
          : null,
      charges: parseFloat(trade.charges) || 0,
      pnlAmount: parseFloat(trade.pnlAmount) || 0,
      pnlPercentage: parseFloat(trade.pnlPercentage) || 0,
      totalAmount: parseFloat(trade.totalAmount) || 0,
      confidenceLevel: parseFloat(trade.psychology?.confidenceLevel) || 5,
    }

    let riskReward = null
    const { entryPrice, stopLoss, target, direction } = parsedTrade

    if (entryPrice && stopLoss && target) {
      const risk =
        direction === 'Long' ? entryPrice - stopLoss : stopLoss - entryPrice

      const reward =
        direction === 'Long' ? target - entryPrice : entryPrice - target

      if (risk > 0) {
        const ratio = reward / risk
        riskReward = ratio > 0 ? ratio.toFixed(2) : '0'
      }
    }

    return { ...parsedTrade, riskReward }
  }

  const calculateStrategyMetrics = useCallback(() => {
    if (!tradeHistory || tradeHistory.length === 0) {
      setStrategyMetrics({})
      return
    }

    const metrics = {}
    const totalOverallTrades = tradeHistory.length

    tradeHistory.forEach((trade) => {
      const parsedTrade = parseTradeData(trade)
      const strategy = parsedTrade.strategyUsed || 'Uncategorized'

      if (!metrics[strategy]) {
        metrics[strategy] = {
          totalTrades: 0,
          winningTrades: 0,
          totalGrossProfit: 0,
          totalGrossLoss: 0,
          totalNetProfit: 0,
          totalInitialRiskAmount: 0,
          totalCapitalUsed: 0,
        }
      }

      const strategyData = metrics[strategy]
      strategyData.totalTrades++
      strategyData.totalNetProfit += parsedTrade.pnlAmount

      const grossPnl =
        parsedTrade.direction === 'Long'
          ? (parsedTrade.exitPrice - parsedTrade.entryPrice) *
            parsedTrade.quantity
          : (parsedTrade.entryPrice - parsedTrade.exitPrice) *
            parsedTrade.quantity

      if (grossPnl > 0) {
        strategyData.winningTrades++
        strategyData.totalGrossProfit += grossPnl
      } else if (grossPnl < 0) {
        strategyData.totalGrossLoss += Math.abs(grossPnl)
      }

      if (
        !isNaN(parsedTrade.entryPrice) &&
        parsedTrade.stopLoss !== null &&
        !isNaN(parsedTrade.quantity)
      ) {
        let potentialLoss = 0
        if (parsedTrade.direction === 'Long') {
          potentialLoss =
            Math.max(0, parsedTrade.entryPrice - parsedTrade.stopLoss) *
            parsedTrade.quantity
        } else if (parsedTrade.direction === 'Short') {
          potentialLoss =
            Math.max(0, parsedTrade.stopLoss - parsedTrade.entryPrice) *
            parsedTrade.quantity
        }
        strategyData.totalInitialRiskAmount += potentialLoss
      }

      if (!isNaN(parsedTrade.entryPrice) && !isNaN(parsedTrade.quantity)) {
        strategyData.totalCapitalUsed +=
          parsedTrade.entryPrice * parsedTrade.quantity
      }
    })

    const finalizedMetrics = {}
    Object.keys(metrics).forEach((strategy) => {
      const data = metrics[strategy]
      const profitFactorValue =
        data.totalGrossLoss === 0
          ? data.totalGrossProfit > 0
            ? data.totalGrossProfit
            : 0
          : data.totalGrossProfit / data.totalGrossLoss

      const riskPerTradeValue =
        data.totalCapitalUsed === 0
          ? 0
          : (data.totalInitialRiskAmount / data.totalCapitalUsed) * 100

      finalizedMetrics[strategy] = {
        usage: (data.totalTrades / totalOverallTrades) * 100,
        profitFactor: profitFactorValue,
        totalProfit: data.totalNetProfit,
        winRate: (data.winningTrades / data.totalTrades) * 100,
        riskPerTrade: riskPerTradeValue,
      }
    })

    setStrategyMetrics(finalizedMetrics)
  }, [tradeHistory])

  useEffect(() => {
    calculateStrategyMetrics()
  }, [tradeHistory, calculateStrategyMetrics])

  return { tradeHistory, loading, error, strategyMetrics }
}
