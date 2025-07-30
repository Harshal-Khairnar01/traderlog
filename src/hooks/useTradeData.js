// hooks/useTradeData.js
import { useState, useEffect, useCallback } from 'react'
import { toast } from 'react-toastify'

const parseResponseBody = async (response) => {
  const contentType = response.headers.get('content-type')
  return contentType?.includes('application/json')
    ? await response.json()
    : await response.text()
}

const calculateGrossPnl = (trade) => {
  if (trade.entryPrice && trade.exitPrice && trade.quantity) {
    if (trade.direction === 'Long') {
      return (trade.exitPrice - trade.entryPrice) * trade.quantity
    } else if (trade.direction === 'Short') {
      return (trade.entryPrice - trade.exitPrice) * trade.quantity
    }
  }
  return 0
}

const getTradeCharges = (trade) => {
  // This function seems to simply return trade.charges, which is fine if it's already a number
  // from the form. If it can be undefined/null from the server, ?? 0 is good.
  return trade.charges ?? 0
}

const processTradeData = (trades) => {
  return trades.map((trade) => ({
    ...trade, // These are derived fields that you want to calculate/add when data is loaded
    dateTime: new Date(`${trade.date}T${trade.time}`), // Ensure pnlAmount is correctly parsed as float, using the value from the form first
    pnlAmount: parseFloat(trade.pnlAmount ?? trade.netPnl ?? 0),
    grossPnl: calculateGrossPnl(trade),
    charges: getTradeCharges(trade), // Re-apply charges just in case it was a string or something
  }))
}

export const useTradeData = (session) => {
  const [tradeHistory, setTradeHistory] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchTradeHistory = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const storedData = localStorage.getItem('tradeJournalData')
        if (storedData) {
          const data = JSON.parse(storedData)
          setTradeHistory(processTradeData(data))
          setIsLoading(false)
          return
        }
      }
    } catch (err) {
      console.warn(
        'Failed to load trade data from local storage, attempting API:',
        err,
      )
    }

    if (!session?.user?.id) {
      setError('User not authenticated. Please log in again.')
      setIsLoading(false)
      return
    }

    try {
      const res = await fetch('/api/v1/trades')
      if (!res.ok) {
        const body = await parseResponseBody(res)
        const errorMessage =
          typeof body === 'object' && body.message
            ? body.message
            : body.toString()
        throw new Error(errorMessage || res.statusText)
      }
      const data = await res.json()
      setTradeHistory(processTradeData(data.tradeHistory))
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(
          'tradeJournalData',
          JSON.stringify(data.tradeHistory),
        )
      }
    } catch (err) {
      console.error('Failed to load dashboard data from API:', err)
      setError(err.message || 'Failed to load data from API.')
      toast.error(err.message || 'Failed to load data from API.')
    } finally {
      setIsLoading(false)
    }
  }, [session])

  useEffect(() => {
    fetchTradeHistory()
  }, [fetchTradeHistory])

  const addTrade = useCallback(
    async (newTrade) => {
      try {
      
        setTradeHistory((prev) => {
          const updatedHistory = [...prev, newTrade] // Use newTrade directly
          if (typeof window !== 'undefined' && window.localStorage) {
            localStorage.setItem(
              'tradeJournalData',
             
              JSON.stringify(
                updatedHistory.map((trade) => {
                  
                  const { dateTime, grossPnl, ...rest } = trade // Remove derived fields for storage
                  return rest
                }),
              ),
            )
          }
          return processTradeData(updatedHistory) // Process for immediate display in UI
        })
        toast.success('Trade added successfully!')

        // API call: Send the original newTrade data from the form
        const res = await fetch('/api/v1/trades', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newTrade), // Send the newTrade from the form
        })
        if (!res.ok) {
          const body = await parseResponseBody(res)
          const errorMessage =
            typeof body === 'object' && body.message
              ? body.message
              : body.toString()
          throw new Error(errorMessage || res.statusText)
        } // Re-fetch data to ensure server-side consistency and pick up any server-generated IDs/data
        fetchTradeHistory()
      } catch (err) {
        console.error('Failed to add new trade:', err)
        setError(err.message || 'Failed to add new trade.')
        toast.error(err.message || 'Failed to add new trade.') // If API call fails, revert local state or re-fetch to sync
        fetchTradeHistory()
      }
    },
    [fetchTradeHistory],
  )

  return { tradeHistory, isLoading, error, addTrade, fetchTradeHistory }
}
