import { useMemo } from 'react'

export const useTradeCalculations = (tradeHistory) => {
  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()

  const monthlyTrades = useMemo(() => {
    return tradeHistory.filter((t) => {
      const tradeDate = new Date(t.date)
      return (
        tradeDate.getMonth() === currentMonth &&
        tradeDate.getFullYear() === currentYear
      )
    })
  }, [tradeHistory, currentMonth, currentYear])

  const highestPnl = useMemo(() => {
    if (tradeHistory.length === 0) return 0
    const allPnls = tradeHistory.map((t) => t.pnlAmount)
    return Math.max(...allPnls)
  }, [tradeHistory])

  const tradesThisMonthCount = monthlyTrades.length

  const winRate = useMemo(() => {
    if (monthlyTrades.length === 0) return 0
    const winningTrades = monthlyTrades.filter((t) => t.pnlAmount > 0).length
    return (winningTrades / monthlyTrades.length) * 100
  }, [monthlyTrades])

  const avgRiskReward = useMemo(() => {
    if (monthlyTrades.length === 0) return 'N/A'
    const positiveTrades = monthlyTrades.filter((t) => t.pnlAmount > 0)
    const negativeTrades = monthlyTrades.filter((t) => t.pnlAmount < 0)
    const avgWinPnl =
      positiveTrades.length > 0
        ? positiveTrades.reduce((sum, t) => sum + t.pnlAmount, 0) /
          positiveTrades.length
        : 0
    const avgLossPnl =
      negativeTrades.length > 0
        ? negativeTrades.reduce((sum, t) => sum + t.pnlAmount, 0) /
          negativeTrades.length
        : 0
    if (avgWinPnl > 0 && avgLossPnl < 0) {
      return `${(avgWinPnl / Math.abs(avgLossPnl)).toFixed(2)}:1`
    } else if (avgWinPnl > 0) {
      return 'Wins Only'
    } else if (avgLossPnl < 0) {
      return 'Losses Only'
    } else {
      return '0:0'
    }
  }, [monthlyTrades])

  const cumulativePnlData = useMemo(() => {
    if (tradeHistory.length === 0) return []
    const sortedTrades = [...tradeHistory].sort(
      (a, b) => a.dateTime.getTime() - b.dateTime.getTime(),
    )
    let cumulativeSum = 0
    const data = sortedTrades.map((trade) => {
      cumulativeSum += trade.pnlAmount
      return {
        name: `${trade.date} ${trade.time}`,
        pnl: cumulativeSum,
      }
    })
    return data
  }, [tradeHistory])

  const topProfitTrades = useMemo(() => {
    return [...monthlyTrades]
      .filter((trade) => trade.pnlAmount > 0)
      .sort((a, b) => b.pnlAmount - a.pnlAmount)
      .slice(0, 3)
  }, [monthlyTrades])

  const topLosingTrades = useMemo(() => {
    return [...monthlyTrades]
      .filter((trade) => trade.pnlAmount < 0)
      .sort((a, b) => a.pnlAmount - b.pnlAmount)
      .slice(0, 3)
  }, [monthlyTrades])

  const averageConfidenceLevel = useMemo(() => {
    if (tradeHistory.length === 0) return 0
    const totalConfidence = tradeHistory.reduce((sum, trade) => {
      return (
        sum +
        (typeof trade.psychology.confidenceLevel === 'number'
          ? trade.psychology.confidenceLevel
          : 0)
      )
    }, 0)
    const average = totalConfidence / tradeHistory.length
    const scaledAverage = average * 10
    return Math.min(100, Math.max(0, scaledAverage))
  }, [tradeHistory])

  return {
    monthlyTrades,
    highestPnl,
    tradesThisMonthCount,
    winRate,
    avgRiskReward,
    cumulativePnlData,
    topProfitTrades,
    topLosingTrades,
    averageConfidenceLevel,
  }
}
