import { useState, useEffect, useCallback } from 'react'
import { toast } from 'react-toastify'
import axios from 'axios'
import { useSession } from 'next-auth/react'

const calculateGrossPnl = (trade) => {
  if (trade.entryPrice && trade.exitPrice && trade.quantity) {
    const entry = parseFloat(trade.entryPrice)
    const exit = parseFloat(trade.exitPrice)
    const qty = parseFloat(trade.quantity)
    return trade.direction === 'Long'
      ? (exit - entry) * qty
      : (entry - exit) * qty
  }
  return 0
}

const getTradeCharges = (trade) => parseFloat(trade.charges) ?? 0

const processTradeData = (trades) => {
  return trades.map((trade) => ({
    ...trade,
    dateTime:
      trade.date && trade.time
        ? new Date(`${trade.date}T${trade.time}`)
        : new Date(trade.date),
    pnlAmount: parseFloat(trade.netPnl ?? trade.pnlAmount ?? 0),
    grossPnl: calculateGrossPnl(trade),
    charges: getTradeCharges(trade),
  }))
}

const buildPayload = (formData) => {
  const dateOnly = new Date(formData.date).toISOString().split('T')[0]
  const timeOnly = new Date(`2000-01-01T${formData.time}`).toLocaleTimeString(
    'en-US',
    {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
    },
  )

  return {
    marketType: formData.marketType,
    symbol: formData.symbol,
    date: dateOnly,
    time: timeOnly,
    entryPrice: formData.entryPrice,
    exitPrice: formData.exitPrice,
    quantity: formData.quantity,
    totalAmount: formData.totalAmount,
    stopLoss: formData.stopLoss,
    target: formData.target,
    tradeType: formData.tradeType,
    direction: formData.direction,
    optionType: formData.optionType,
    grossPnl: calculateGrossPnl(formData),
    netPnl: parseFloat(formData.netPnl),
    pnlPercentage: formData.pnlPercentage,
    riskReward: formData.riskReward,
    charges: parseFloat(formData.charges),
    strategyUsed: formData.strategyUsed,
    outcomeSummary: formData.outcomeSummary,
    tradeAnalysis: formData.tradeAnalysis,
    confidenceLevel: formData.confidenceLevel,
    emotionsBefore: formData.emotionsBefore,
    emotionsAfter: formData.emotionsAfter,
    notes: formData.notes,
    mistakes: formData.mistakes,
    mistakeChecklist: formData.mistakeChecklist,
    whatIDidWell: formData.whatIDidWell,
    tags: formData.tags,
    screenshotUpload: formData.screenshotUpload,
    dateTime: formData.dateTime,
  }
}

export const useTrades = () => {
  const { data: session, status } = useSession()
  const [tradeHistory, setTradeHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchTradeHistory = useCallback(async () => {
    if (status !== 'authenticated') {
      setLoading(false)
      if (status === 'unauthenticated') {
        setError('User not authenticated.')
      }
      return
    }

    setLoading(true)
    setError(null)

    try {
      const res = await axios.get('/api/v1/trades')
      setTradeHistory(processTradeData(res.data.tradeHistory || []))
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        'Failed to load trade data.'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [status])

  useEffect(() => {
    fetchTradeHistory()
  }, [fetchTradeHistory])

  const addTrade = useCallback(
    async (formData) => {
      const payload = buildPayload(formData)

      try {
        toast.info('Adding trade...')
        await axios.post('/api/v1/trades', payload)
        toast.success('Trade added successfully!')
        fetchTradeHistory()
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || err.message || 'Failed to add trade.'
        setError(errorMessage)
        toast.error(errorMessage)
      }
    },
    [fetchTradeHistory],
  )

  const updateTrade = useCallback(
    async (tradeId, formData) => {
      if (!tradeId) {
        toast.error('Trade ID is required.')
        return
      }

      const payload = buildPayload(formData)

      try {
        toast.info('Updating trade...')
        await axios.put(`/api/v1/trades/${tradeId}`, payload)
        toast.success('Trade updated successfully!')
        fetchTradeHistory()
      } catch (err) {
        const errorMessage =
          err.response?.data?.message ||
          err.message ||
          'Failed to update trade.'
        setError(errorMessage)
        toast.error(errorMessage)
      }
    },
    [fetchTradeHistory],
  )

  const deleteTrade = useCallback(
    async (tradeId) => {
      if (!tradeId) {
        toast.error('Trade ID is required.')
        return
      }

      try {
        toast.info('Deleting trade...')
        await axios.delete(`/api/v1/trades/${tradeId}`)
        toast.success('Trade deleted successfully!')
        fetchTradeHistory()
      } catch (err) {
        const errorMessage =
          err.response?.data?.message ||
          err.message ||
          'Failed to delete trade.'
        setError(errorMessage)
        toast.error(errorMessage)
      }
    },
    [fetchTradeHistory],
  )

  return {
    tradeHistory,
    loading,
    error,
    addTrade,
    updateTrade,
    deleteTrade,
    fetchTradeHistory,
  }
}
