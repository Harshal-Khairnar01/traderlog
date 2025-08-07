import { useMemo } from 'react'
import { parseISO, isValid, subDays, isWithinInterval } from 'date-fns'

export const useTradeCalculations = (
  tradeHistory,
  timeRange,
  initialCapital,
) => {
  const currentInterval = useMemo(() => {
    if (timeRange === 'alltime') {
      return null
    }
    const now = new Date()
    let start = now
    if (timeRange === '7days') {
      start = subDays(now, 7)
    } else {
      start = subDays(now, 30)
    }
    return { start, end: now }
  }, [timeRange])

  const currentPeriodTrades = useMemo(() => {
    if (timeRange === 'alltime') {
      return tradeHistory
    }

    return tradeHistory.filter((trade) => {
      const tradeDate = parseISO(trade.date)
      return isValid(tradeDate) && isWithinInterval(tradeDate, currentInterval)
    })
  }, [tradeHistory, currentInterval, timeRange])

  const tradesCount = currentPeriodTrades.length

  const highestPnl = useMemo(() => {
    if (currentPeriodTrades.length === 0) return 0
    const allPnls = currentPeriodTrades.map((t) => t.netPnl)
    return Math.max(...allPnls)
  }, [currentPeriodTrades])

  const winRate = useMemo(() => {
    if (currentPeriodTrades.length === 0) return 0
    const winningTrades = currentPeriodTrades.filter((t) => t.netPnl > 0).length
    return (winningTrades / currentPeriodTrades.length) * 100
  }, [currentPeriodTrades])

  const avgRiskReward = useMemo(() => {
    if (currentPeriodTrades.length === 0) return 'N/A'
    const positiveTrades = currentPeriodTrades.filter((t) => t.netPnl > 0)
    const negativeTrades = currentPeriodTrades.filter((t) => t.netPnl < 0)
    const avgWinPnl =
      positiveTrades.length > 0
        ? positiveTrades.reduce((sum, t) => sum + t.netPnl, 0) /
          positiveTrades.length
        : 0
    const avgLossPnl =
      negativeTrades.length > 0
        ? negativeTrades.reduce((sum, t) => sum + t.netPnl, 0) /
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
  }, [currentPeriodTrades])

  const totalCharges = useMemo(() => {
    return currentPeriodTrades.reduce(
      (sum, trade) => sum + (trade.charges || 0),
      0,
    )
  }, [currentPeriodTrades])

  const currentCapital = useMemo(() => {
    if (tradeHistory.length === 0) return initialCapital
    const totalPnl = tradeHistory.reduce(
      (sum, trade) => sum + (trade.netPnl || 0),
      0,
    )
    return initialCapital + totalPnl
  }, [tradeHistory, initialCapital])

  const maxDrawdown = useMemo(() => {
    if (currentPeriodTrades.length === 0) return 0

    let peakCapital = initialCapital
    let maxDD = 0
    let currentCapitalValue = initialCapital

    const sortedTrades = [...currentPeriodTrades].sort((a, b) => {
      const dateTimeA = parseISO(`${a.date.split('T')[0]}T${a.time}:00.000Z`)
      const dateTimeB = parseISO(`${b.date.split('T')[0]}T${b.time}:00.000Z`)
      if (!isValid(dateTimeA) && !isValid(dateTimeB)) return 0
      if (!isValid(dateTimeA)) return 1
      if (!isValid(dateTimeB)) return -1
      return dateTimeA.getTime() - dateTimeB.getTime()
    })

    sortedTrades.forEach((trade) => {
      currentCapitalValue += trade.netPnl || 0
      if (currentCapitalValue > peakCapital) {
        peakCapital = currentCapitalValue
      }
      const drawdown = peakCapital - currentCapitalValue
      if (drawdown > maxDD) {
        maxDD = drawdown
      }
    })

    return maxDD
  }, [currentPeriodTrades, initialCapital])

  const cumulativePnlData = useMemo(() => {
    if (currentPeriodTrades.length === 0) return []
    const sortedTrades = [...currentPeriodTrades].sort((a, b) => {
      const dateTimeA = parseISO(`${a.date.split('T')[0]}T${a.time}:00.000Z`)
      const dateTimeB = parseISO(`${b.date.split('T')[0]}T${b.time}:00.000Z`)
      if (!isValid(dateTimeA) && !isValid(dateTimeB)) return 0
      if (!isValid(dateTimeA)) return 1
      if (!isValid(dateTimeB)) return -1
      return dateTimeA.getTime() - dateTimeB.getTime()
    })
    let cumulativeSum = 0
    const data = sortedTrades.map((trade) => {
      cumulativeSum += trade.netPnl
      return {
        name: `${trade.date.split('T')[0]} ${trade.time}`,
        pnl: cumulativeSum,
      }
    })
    return data
  }, [currentPeriodTrades])

  const topProfitTrades = useMemo(() => {
    return [...currentPeriodTrades]
      .filter((trade) => trade.netPnl > 0)
      .sort((a, b) => b.netPnl - a.netPnl)
      .slice(0, 3)
  }, [currentPeriodTrades])

  const topLosingTrades = useMemo(() => {
    return [...currentPeriodTrades]
      .filter((trade) => trade.netPnl < 0)
      .sort((a, b) => a.netPnl - b.netPnl)
      .slice(0, 3)
  }, [currentPeriodTrades])

  const averageConfidenceLevel = useMemo(() => {
    if (currentPeriodTrades.length === 0) return 0
    const totalConfidence = currentPeriodTrades.reduce((sum, trade) => {
      return (
        sum +
        (typeof trade.psychology?.confidenceLevel === 'number'
          ? trade.psychology.confidenceLevel
          : 0)
      )
    }, 0)
    const average = totalConfidence / currentPeriodTrades.length
    return average * 10
  }, [currentPeriodTrades])

  return {
    highestPnl,
    tradesCount,
    winRate,
    avgRiskReward,
    cumulativePnlData,
    topProfitTrades,
    topLosingTrades,
    averageConfidenceLevel,
    initialCapital,
    currentCapital,
    totalCharges,
    maxDrawdown,
  }
}
