import { useState, useEffect, useCallback } from 'react'
import { toast } from 'react-toastify'
import { useSelector, useDispatch } from 'react-redux'
import { useSession } from 'next-auth/react'
import { fetchTrades } from '@/store/tradesSlice'

const DEFAULT_CHALLENGE_SETTINGS = {
  startingCapital: 0,
  targetCapital: 0,
  challengeStartDate: '',
  challengeStartTime: '',
  challengeEndDate: '',
}

export const useChallengeMetrics = () => {
  const { data: session, status } = useSession()
  const dispatch = useDispatch()

  const allTradeHistory = useSelector((state) => state.trades.tradeHistory)
  const loadingTradesFromRedux = useSelector((state) => state.trades.loading)
  const errorTradesFromRedux = useSelector((state) => state.trades.error)

  const [challengeData, setChallengeData] = useState(null)
  const [challengeSettings, setChallengeSettings] = useState(
    DEFAULT_CHALLENGE_SETTINGS,
  )
  const [challengeTradeHistory, setChallengeTradeHistory] = useState([])

  const loading = loadingTradesFromRedux
  const error = errorTradesFromRedux

  const parseTradeDateTime = useCallback((trade) => {
    const datePart = new Date(trade.date).toISOString().split('T')[0]
    const timePart = (trade.time || '00:00').padStart(5, '0')
    return new Date(`${datePart}T${timePart}:00`)
  }, [])

  const calculateAdjustedStartingCapital = useCallback(
    (initialUserCapital, trades, challengeStartDateTime) => {
      if (
        initialUserCapital === undefined ||
        !trades ||
        !challengeStartDateTime
      ) {
        return initialUserCapital || 0
      }

      let preChallengePnl = 0
      trades.forEach((trade) => {
        const tradeDateTime = parseTradeDateTime(trade)
        if (tradeDateTime < challengeStartDateTime) {
          preChallengePnl += trade.netPnl || 0
        }
      })
      return initialUserCapital + preChallengePnl
    },
    [parseTradeDateTime],
  )

  const calculateMetrics = useCallback(
    (tradesForChallenge, settings, initialUserCapital) => {
      const { targetCapital, challengeStartDate, challengeEndDate } = settings
      const challengeStartDateTime =
        challengeStartDate && settings.challengeStartTime
          ? new Date(`${challengeStartDate}T${settings.challengeStartTime}:00`)
          : null
      const challengeEndDateTime = challengeEndDate
        ? new Date(challengeEndDate)
        : null

      const actualChallengeStartingCapital = calculateAdjustedStartingCapital(
        initialUserCapital,
        allTradeHistory,
        challengeStartDateTime,
      )

      if (
        !tradesForChallenge ||
        tradesForChallenge.length === 0 ||
        !challengeEndDateTime ||
        !targetCapital ||
        !challengeStartDateTime
      ) {
        const now = new Date()
        const effectiveChallengeEnd = challengeEndDateTime || now
        const timeRemainingMs = effectiveChallengeEnd.getTime() - now.getTime()
        const daysRemaining = Math.max(
          0,
          Math.ceil(timeRemainingMs / (1000 * 60 * 60 * 24)),
        )
        const potentialDailyTarget =
          daysRemaining > 0 &&
          targetCapital &&
          actualChallengeStartingCapital !== undefined
            ? (targetCapital - actualChallengeStartingCapital) / daysRemaining
            : 0

        return {
          summary: {
            startingCapital: actualChallengeStartingCapital,
            currentCapital: actualChallengeStartingCapital,
            targetCapital: targetCapital || 0,
            dailyTarget: potentialDailyTarget,
            dailyActual: 0,
            daysRemaining: daysRemaining,
            projectedDate: challengeEndDate
              ? new Date(challengeEndDate).toLocaleDateString('en-US', {
                  day: '2-digit',
                  month: 'short',
                  year: '2-digit',
                })
              : 'N/A',
            winRate: 0,
            progressToTarget: 0,
          },
          performance: {
            avgRiskReward: null,
            highestProfitDay: 0,
            highestProfitDayDate: 'N/A',
            maxDrawdown: 0,
            tradingConfidenceLevel: 0,
          },
        }
      }

      const sortedTradesForCalculations = [...tradesForChallenge].sort(
        (a, b) =>
          parseTradeDateTime(a).getTime() - parseTradeDateTime(b).getTime(),
      )

      let totalPNL = 0
      let profitableTrades = 0
      let totalTrades = 0
      let highestProfit = 0
      let highestProfitDate = 'N/A'
      let equityCurve = [actualChallengeStartingCapital]
      let maxEquity = actualChallengeStartingCapital
      let maxDrawdown = 0
      let totalConfidenceLevel = 0
      let tradesWithConfidence = 0

      const tradesWithPnL = sortedTradesForCalculations.filter(
        (trade) => trade.netPnl !== null && !isNaN(trade.netPnl),
      )

      tradesWithPnL.forEach((trade) => {
        totalPNL += trade.netPnl
        totalTrades++
        if (trade.netPnl > 0) {
          profitableTrades++
        }

        if (
          typeof trade.confidenceLevel === 'number' &&
          !isNaN(trade.confidenceLevel)
        ) {
          totalConfidenceLevel += trade.confidenceLevel
          tradesWithConfidence++
        }

        if (trade.netPnl > highestProfit) {
          highestProfit = trade.netPnl
          highestProfitDate = new Date(trade.date).toLocaleDateString('en-US', {
            day: '2-digit',
            month: 'short',
            year: '2-digit',
          })
        }

        const currentEquity = equityCurve[equityCurve.length - 1] + trade.netPnl
        equityCurve.push(currentEquity)

        if (currentEquity > maxEquity) {
          maxEquity = currentEquity
        }
        const currentDrawdown = ((maxEquity - currentEquity) / maxEquity) * 100
        if (currentDrawdown > maxDrawdown) {
          maxDrawdown = currentDrawdown
        }
      })

      const currentCapital = actualChallengeStartingCapital + totalPNL
      const progressToTarget = Math.min(
        1,
        Math.max(
          0,
          (currentCapital - actualChallengeStartingCapital) /
            (targetCapital - actualChallengeStartingCapital),
        ),
      )
      const winRate = totalTrades > 0 ? profitableTrades / totalTrades : 0

      const now = new Date()
      const timeRemainingMs = challengeEndDateTime.getTime() - now.getTime()
      const daysRemaining = Math.max(
        0,
        Math.ceil(timeRemainingMs / (1000 * 60 * 60 * 24)),
      )
      const remainingToTarget = targetCapital - currentCapital
      const dailyTarget =
        daysRemaining > 0 ? remainingToTarget / daysRemaining : 0

      let dailyPnlSum = 0
      const today = now.toISOString().split('T')[0]
      tradesWithPnL.forEach((trade) => {
        if (new Date(trade.date).toISOString().split('T')[0] === today) {
          dailyPnlSum += trade.netPnl
        }
      })

      let tradingConfidenceLevel = 0
      const winRatePercentage = winRate * 100

      const averageTradeConfidencePercentage =
        tradesWithConfidence > 0
          ? (totalConfidenceLevel / tradesWithConfidence) * 10
          : 0

      if (totalTrades > 0 || tradesWithConfidence > 0) {
        tradingConfidenceLevel =
          (winRatePercentage + averageTradeConfidencePercentage) / 2
      }
      tradingConfidenceLevel = Math.min(
        100,
        Math.max(0, tradingConfidenceLevel),
      )

      const calculatedAvgRR = tradesWithPnL
        .filter(
          (t) =>
            t.riskReward !== null && !isNaN(t.riskReward) && t.riskReward > 0,
        )
        .reduce((acc, t) => acc + t.riskReward, 0)
      const avgRiskReward =
        tradesWithPnL.filter(
          (t) =>
            t.riskReward !== null && !isNaN(t.riskReward) && t.riskReward > 0,
        ).length > 0
          ? calculatedAvgRR /
            tradesWithPnL.filter(
              (t) =>
                t.riskReward !== null &&
                !isNaN(t.riskReward) &&
                t.riskReward > 0,
            ).length
          : null

      return {
        summary: {
          startingCapital: actualChallengeStartingCapital,
          currentCapital: currentCapital,
          targetCapital: targetCapital,
          dailyTarget: dailyTarget,
          dailyActual: dailyPnlSum,
          daysRemaining: daysRemaining,
          projectedDate: challengeEndDateTime.toLocaleDateString('en-US', {
            day: '2-digit',
            month: 'short',
            year: '2-digit',
          }),
          winRate: winRate,
          progressToTarget: progressToTarget,
        },
        performance: {
          avgRiskReward: avgRiskReward,
          highestProfitDay: highestProfit,
          highestProfitDayDate: highestProfitDate,
          maxDrawdown: maxDrawdown,
          tradingConfidenceLevel: tradingConfidenceLevel,
        },
      }
    },
    [calculateAdjustedStartingCapital, parseTradeDateTime, allTradeHistory],
  )

  const applySettingsAndCalculate = useCallback(
    (settings, trades) => {
      if (
        status === 'authenticated' &&
        session?.user?.initialCapital !== undefined
      ) {
        const { challengeStartDate, challengeStartTime, challengeEndDate } =
          settings

        const challengeStartDateTime = challengeStartDate
          ? new Date(`${challengeStartDate}T${challengeStartTime}:00`)
          : null
        const challengeEndDateTime = challengeEndDate
          ? new Date(challengeEndDate)
          : null

        let filteredTrades = trades.filter((trade) => {
          const tradeDateTime = parseTradeDateTime(trade)
          return (
            challengeStartDateTime &&
            tradeDateTime >= challengeStartDateTime &&
            challengeEndDateTime &&
            tradeDateTime <= challengeEndDateTime
          )
        })

        filteredTrades = filteredTrades.sort((a, b) => {
          const dateTimeA = parseTradeDateTime(a)
          const dateTimeB = parseTradeDateTime(b)
          return dateTimeB.getTime() - dateTimeA.getTime()
        })

        setChallengeTradeHistory(filteredTrades)

        setChallengeData(
          calculateMetrics(
            filteredTrades,
            settings,
            session.user.initialCapital,
          ),
        )
      } else {
        setChallengeData(null)
        setChallengeTradeHistory([])
      }
    },
    [
      status,
      session?.user?.initialCapital,
      parseTradeDateTime,
      calculateMetrics,
    ],
  )

  const fetchChallenge = useCallback(async () => {
    try {
      const res = await fetch('/api/challenge')
      if (res.ok) {
        const data = await res.json()
        if (data) {
          const mappedSettings = {
            ...data,
            challengeStartDate: data.challengeStartDate.split('T')[0],
            challengeStartTime: data.challengeStartTime,
            challengeEndDate: data.challengeEndDate.split('T')[0],
          }
          setChallengeSettings(mappedSettings)
        } else {
          setChallengeSettings(DEFAULT_CHALLENGE_SETTINGS)
        }
      } else {
        setChallengeSettings(DEFAULT_CHALLENGE_SETTINGS)
      }
    } catch (err) {
      console.error('Failed to fetch challenge from API:', err)
      toast.error('Failed to fetch challenge settings.')
    }
  }, [])

  useEffect(() => {
    if (status === 'authenticated') {
      fetchChallenge()
      dispatch(fetchTrades())
    } else if (status === 'unauthenticated') {
      setChallengeSettings(DEFAULT_CHALLENGE_SETTINGS)
      setChallengeData(null)
      setChallengeTradeHistory([])
    }
  }, [status, dispatch, fetchChallenge])

  useEffect(() => {
    if (!loadingTradesFromRedux && !errorTradesFromRedux) {
      applySettingsAndCalculate(challengeSettings, allTradeHistory)
    }
  }, [
    loadingTradesFromRedux,
    errorTradesFromRedux,
    challengeSettings,
    allTradeHistory,
    applySettingsAndCalculate,
  ])

  useEffect(() => {
    if (challengeSettings.challengeEndDate) {
      const challengeEnd = new Date(
        `${challengeSettings.challengeEndDate}T23:59:59`,
      )
      const now = new Date()
      if (challengeEnd < now) {
        toast.info('Your challenge has ended! Setting up for a new one.')
        setChallengeSettings({
          ...DEFAULT_CHALLENGE_SETTINGS,
          startingCapital: session?.user?.initialCapital ?? 0,
        })
        setChallengeData(null)
        setChallengeTradeHistory([])
      }
    }
  }, [challengeSettings.challengeEndDate, session?.user?.initialCapital])

  const handleSaveChallengeSettings = useCallback(
    async (newSettings) => {
      try {
        const initialUserCapital = session?.user?.initialCapital ?? 0
        const newChallengeStartDateTime =
          newSettings.challengeStartDate && newSettings.challengeStartTime
            ? new Date(
                `${newSettings.challengeStartDate}T${newSettings.challengeStartTime}:00`,
              )
            : null

        const adjustedStartingCapital = calculateAdjustedStartingCapital(
          initialUserCapital,
          allTradeHistory,
          newChallengeStartDateTime,
        )

        const settingsToSave = {
          ...newSettings,
          startingCapital: adjustedStartingCapital,
        }

        let res
        let method
        let url = '/api/challenge'

        if (challengeSettings.id) {
          method = 'PUT'
          url = `${url}/${challengeSettings.id}`
          res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(settingsToSave),
          })
        } else {
          method = 'POST'
          res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(settingsToSave),
          })
        }

        if (res.ok) {
          const data = await res.json()
          const mappedData = {
            ...data.challenge,
            challengeStartDate: data.challenge.challengeStartDate.split('T')[0],
            challengeStartTime: data.challenge.challengeStartTime,
            challengeEndDate: data.challenge.challengeEndDate.split('T')[0],
          }
          setChallengeSettings(mappedData)
          toast.success('Challenge settings saved!')
        } else {
          const errorData = await res.json()
          toast.error(errorData.message || 'Failed to save challenge settings.')
        }
      } catch (err) {
        console.error('Error saving challenge settings:', err)
        toast.error('Failed to save challenge settings.')
      }
    },
    [
      session?.user?.initialCapital,
      allTradeHistory,
      calculateAdjustedStartingCapital,
      challengeSettings.id,
    ],
  )

  return {
    challengeData,
    tradeHistory: challengeTradeHistory,
    loading,
    error,
    challengeSettings,
    handleSaveChallengeSettings,
    refreshChallengeData: fetchChallenge,
  }
}
