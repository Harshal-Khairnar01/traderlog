
import { useState, useEffect, useCallback } from 'react'

export const useJournalMetrics = (tradeHistory) => {
  const [journalMetrics, setJournalMetrics] = useState({
    mostFrequentMistakes: [],
    mostFrequentSuccesses: [],
    pnlByMistake: [],
    pnlBySuccess: [],
    mostUsedSetup: { setup: 'N/A', count: 0 },
    setupPerformance: [],
    overallSentiment: [],
  })

  const calculateJournalMetrics = useCallback(() => {
    if (!tradeHistory || tradeHistory.length === 0) {
      setJournalMetrics({
        mostFrequentMistakes: [],
        mostFrequentSuccesses: [],
        pnlByMistake: [],
        pnlBySuccess: [],
        mostUsedSetup: { setup: 'N/A', count: 0 },
        setupPerformance: [],
        overallSentiment: [],
      })
      return
    }

    const mistakeCounts = {}
    const successCounts = {}
    const setupCounts = {}
    const pnlByMistake = {}
    const pnlBySuccess = {}
    const pnlBySetup = {}
    const overallSentimentCounts = {}

    tradeHistory.forEach((trade) => {
      const pnl = trade.netPnl || 0
      const psychologyData = trade.psychology || {}
      const mistakes = psychologyData.mistakeChecklist || []

      
      const successes = (psychologyData.tags || []).filter(
        (tag) => tag === 'perfect',
      )

      const setup = trade.strategyUsed || 'Unknown'
      const emotionsBefore = psychologyData.emotionsBefore
      const emotionsAfter = psychologyData.emotionsAfter

     
      mistakes.forEach((mistake) => {
        mistakeCounts[mistake] = (mistakeCounts[mistake] || 0) + 1
        pnlByMistake[mistake] = pnlByMistake[mistake] || { sum: 0, count: 0 }
        pnlByMistake[mistake].sum += pnl
        pnlByMistake[mistake].count++
      })

     
      successes.forEach((success) => {
        successCounts[success] = (successCounts[success] || 0) + 1
        pnlBySuccess[success] = pnlBySuccess[success] || { sum: 0, count: 0 }
        pnlBySuccess[success].sum += pnl
        pnlBySuccess[success].count++
      })

      
      setupCounts[setup] = (setupCounts[setup] || 0) + 1
      pnlBySetup[setup] = pnlBySetup[setup] || {
        sum: 0,
        count: 0,
        wins: 0,
        losses: 0,
      }
      pnlBySetup[setup].sum += pnl
      pnlBySetup[setup].count++
      if (pnl > 0) pnlBySetup[setup].wins++
      if (pnl < 0) pnlBySetup[setup].losses++

     
      if (emotionsBefore) {
        overallSentimentCounts[emotionsBefore] =
          (overallSentimentCounts[emotionsBefore] || 0) + 1
      }
      if (emotionsAfter) {
        overallSentimentCounts[emotionsAfter] =
          (overallSentimentCounts[emotionsAfter] || 0) + 1
      }
    })

    const totalTrades = tradeHistory.length
    const totalSentimentEntries = tradeHistory.reduce(
      (acc, trade) =>
        acc +
        (trade.psychology?.emotionsBefore ? 1 : 0) +
        (trade.psychology?.emotionsAfter ? 1 : 0),
      0,
    )

    const mostFrequentMistakes = Object.entries(mistakeCounts)
      .map(([label, count]) => ({
        label,
        value: `${((count / totalTrades) * 100).toFixed(0)}%`,
        count,
      }))
      .sort((a, b) => b.count - a.count)

    const mostFrequentSuccesses = Object.entries(successCounts)
      .map(([label, count]) => ({
        label,
        value: `${((count / totalTrades) * 100).toFixed(0)}%`,
        count,
      }))
      .sort((a, b) => b.count - a.count)

    const calculatedPnlByMistake = Object.entries(pnlByMistake)
      .map(([label, data]) => ({
        label,
        value: data.count > 0 ? data.sum / data.count : 0,
      }))
      .sort((a, b) => a.value - b.value)

    const calculatedPnlBySuccess = Object.entries(pnlBySuccess)
      .map(([label, data]) => ({
        label,
        value: data.count > 0 ? data.sum / data.count : 0,
      }))
      .sort((a, b) => b.value - a.value)

    const mostUsedSetup = Object.entries(setupCounts).reduce(
      (max, [setup, count]) => (count > max.count ? { setup, count } : max),
      { setup: 'N/A', count: 0 },
    )

    const setupPerformance = Object.entries(pnlBySetup)
      .map(([label, data]) => ({
        label: label,
        avgPnl: data.count > 0 ? data.sum / data.count : 0,
        winRate:
          data.wins + data.losses > 0
            ? (data.wins / (data.wins + data.losses)) * 100
            : 0,
      }))
      .sort((a, b) => b.avgPnl - a.avgPnl)

    const overallSentiment = Object.entries(overallSentimentCounts)
      .map(([label, count]) => ({
        label,
        value: `${((count / totalSentimentEntries) * 100).toFixed(0)}%`,
      }))
      .sort((a, b) => parseInt(b.value) - parseInt(a.value))

    setJournalMetrics({
      mostFrequentMistakes: mostFrequentMistakes.slice(0, 5),
      mostFrequentSuccesses: mostFrequentSuccesses.slice(0, 5),
      pnlByMistake: calculatedPnlByMistake.slice(0, 5),
      pnlBySuccess: calculatedPnlBySuccess.slice(0, 5),
      mostUsedSetup,
      setupPerformance,
      overallSentiment,
    })
  }, [tradeHistory])

  useEffect(() => {
    calculateJournalMetrics()
  }, [tradeHistory, calculateJournalMetrics])

  return journalMetrics
}
