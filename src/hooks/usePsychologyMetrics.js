import { useState, useEffect, useCallback } from 'react'

const getEmotionalStateFromConfidence = (level) => {
  if (level === null || level === undefined) return 'Unknown'
  if (level >= 9) return 'Overconfident'
  if (level >= 7) return 'Calm'
  if (level >= 5) return 'Impatient'
  if (level >= 3) return 'Anxious'
  return 'Frustrated'
}

export const usePsychologyMetrics = (tradeHistory) => {
  const [psychologyMetrics, setPsychologyMetrics] = useState({
    emotionalStates: [],
    avgRRByEmotionalState: [],
    pnlByConfidenceLevel: [],
    winRateByEmotionBefore: [],
    avgRRByEmotionBefore: [],
    mistakeFrequency: [],
    avgPnlByMistake: [],
    avgRRByMistake: [],
  })

  const calculatePsychologyMetrics = useCallback(() => {
    if (!tradeHistory || tradeHistory.length === 0) {
      setPsychologyMetrics({
        emotionalStates: [],
        avgRRByEmotionalState: [],
        pnlByConfidenceLevel: [],
        winRateByEmotionBefore: [],
        avgRRByEmotionBefore: [],
        mistakeFrequency: [],
        avgPnlByMistake: [],
        avgRRByMistake: [],
      })
      return
    }

    const totalEntries = tradeHistory.length
    const emotionalStateCounts = {}
    const emotionalStateRRSum = {}
    const emotionalStateRRCount = {}

    const confidenceLevelPnl = {
      'High (8-10)': { sum: 0, count: 0 },
      'Medium (5-7)': { sum: 0, count: 0 },
      'Low (1-4)': { sum: 0, count: 0 },
      Unknown: { sum: 0, count: 0 },
    }

    const emotionsBeforeStats = {}
    const mistakeCounts = {}
    const mistakePnlRR = {}

    tradeHistory.forEach((trade) => {
      const pnl = trade.netPnl || 0 // Use netPnl as per data example
      const psychology = trade.psychology || {} // Access psychology object
      const confidenceLevel = psychology.confidenceLevel
      const emotionsBefore = psychology.emotionsBefore || 'Unknown'
      const riskReward = trade.riskReward // riskReward is directly on trade object
      const mistakes = psychology.mistakeChecklist || []

      const emotionalState = getEmotionalStateFromConfidence(confidenceLevel)
      emotionalStateCounts[emotionalState] =
        (emotionalStateCounts[emotionalState] || 0) + 1

      let rValue = 0
      if (typeof riskReward === 'number' && !isNaN(riskReward)) {
        rValue = riskReward
        emotionalStateRRSum[emotionalState] =
          (emotionalStateRRSum[emotionalState] || 0) + rValue
        emotionalStateRRCount[emotionalState] =
          (emotionalStateRRCount[emotionalState] || 0) + 1
      }

      if (confidenceLevel !== null && confidenceLevel !== undefined) {
        let confidenceCategory
        if (confidenceLevel >= 8) confidenceCategory = 'High (8-10)'
        else if (confidenceLevel >= 5) confidenceCategory = 'Medium (5-7)'
        else if (confidenceLevel >= 1) confidenceCategory = 'Low (1-4)'
        else confidenceCategory = 'Unknown'

        confidenceLevelPnl[confidenceCategory].sum += pnl
        confidenceLevelPnl[confidenceCategory].count++
      } else {
        confidenceLevelPnl['Unknown'].sum += pnl
        confidenceLevelPnl['Unknown'].count++
      }

      if (!emotionsBeforeStats[emotionsBefore]) {
        emotionsBeforeStats[emotionsBefore] = {
          wins: 0,
          losses: 0,
          totalRR: 0,
          rrCount: 0,
          totalPnl: 0,
          pnlCount: 0,
        }
      }
      if (pnl > 0) emotionsBeforeStats[emotionsBefore].wins++
      else if (pnl < 0) emotionsBeforeStats[emotionsBefore].losses++
      emotionsBeforeStats[emotionsBefore].totalPnl += pnl
      emotionsBeforeStats[emotionsBefore].pnlCount++
      if (rValue !== 0) {
        emotionsBeforeStats[emotionsBefore].totalRR += rValue
        emotionsBeforeStats[emotionsBefore].rrCount++
      }

      mistakes.forEach((mistake) => {
        mistakeCounts[mistake] = (mistakeCounts[mistake] || 0) + 1

        if (!mistakePnlRR[mistake]) {
          mistakePnlRR[mistake] = { sumPnl: 0, count: 0, sumRR: 0, rrCount: 0 }
        }
        mistakePnlRR[mistake].sumPnl += pnl
        mistakePnlRR[mistake].count++
        if (rValue !== 0) {
          mistakePnlRR[mistake].sumRR += rValue
          mistakePnlRR[mistake].rrCount++
        }
      })
    })

    const calculatedEmotionalStates = Object.entries(emotionalStateCounts)
      .map(([state, count]) => ({
        label: state,
        value: `${((count / totalEntries) * 100).toFixed(0)}%`,
      }))
      .sort((a, b) => parseFloat(b.value) - parseFloat(a.value))

    const calculatedAvgRRByEmotionalState = Object.entries(emotionalStateRRSum)
      .map(([state, totalRR]) => {
        const count = emotionalStateRRCount[state] || 0
        const avgRR = count > 0 ? totalRR / count : 0
        return {
          label: `When ${state}`,
          value: avgRR,
        }
      })
      .sort((a, b) => b.value - a.value)

    const calculatedPnlByConfidenceLevel = Object.entries(confidenceLevelPnl)
      .map(([level, data]) => ({
        label: `Avg P&L ${level}`,
        value: data.count > 0 ? data.sum / data.count : null,
      }))
      .filter((item) => item.value !== null)
      .sort((a, b) => b.value - a.value)

    const calculatedWinRateByEmotionBefore = Object.entries(emotionsBeforeStats)
      .map(([emotion, data]) => ({
        label: `${emotion} Win Rate`,
        value:
          data.wins + data.losses > 0
            ? (data.wins / (data.wins + data.losses)) * 100
            : null,
      }))
      .filter((item) => item.value !== null)
      .sort((a, b) => b.value - a.value)

    const calculatedAvgRRByEmotionBefore = Object.entries(emotionsBeforeStats)
      .map(([emotion, data]) => ({
        label: `${emotion} Avg R:R`,
        value: data.rrCount > 0 ? data.totalRR / data.rrCount : null,
      }))
      .filter((item) => item.value !== null)
      .sort((a, b) => b.value - a.value)

    const calculatedMistakeFrequency = Object.entries(mistakeCounts)
      .map(([mistake, count]) => ({
        label: mistake,
        value: `${((count / totalEntries) * 100).toFixed(0)}%`,
        count: count,
      }))
      .sort((a, b) => b.count - a.count)

    const calculatedAvgPnlByMistake = Object.entries(mistakePnlRR)
      .map(([mistake, data]) => ({
        label: `Avg P&L for '${mistake}'`,
        value: data.count > 0 ? data.sumPnl / data.count : null,
      }))
      .filter((item) => item.value !== null)
      .sort((a, b) => a.value - b.value)

    const calculatedAvgRRByMistake = Object.entries(mistakePnlRR)
      .map(([mistake, data]) => ({
        label: `Avg R:R for '${mistake}'`,
        value: data.rrCount > 0 ? data.sumRR / data.rrCount : null,
      }))
      .filter((item) => item.value !== null)
      .sort((a, b) => a.value - b.value)

    setPsychologyMetrics({
      emotionalStates: calculatedEmotionalStates,
      avgRRByEmotionalState: calculatedAvgRRByEmotionalState,
      pnlByConfidenceLevel: calculatedPnlByConfidenceLevel,
      winRateByEmotionBefore: calculatedWinRateByEmotionBefore,
      avgRRByEmotionBefore: calculatedAvgRRByEmotionBefore,
      mistakeFrequency: calculatedMistakeFrequency,
      avgPnlByMistake: calculatedAvgPnlByMistake,
      avgRRByMistake: calculatedAvgRRByMistake,
    })
  }, [tradeHistory])

  useEffect(() => {
    calculatePsychologyMetrics()
  }, [tradeHistory, calculatePsychologyMetrics])

  return psychologyMetrics
}
