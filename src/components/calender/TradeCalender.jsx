'use client'

import React, { useState, useMemo, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import CalendarHeader from '@/components/calender/CalenderHeader'
import CalendarMetrics from '@/components/calender/CalendarMetrics'
import CalendarGrid from '@/components/calender/CalendarGrid'
import WeeklyPerformance from '@/components/calender/WeeklyPerformance'
import Loader from '@/components/Loader'
import { fetchTrades } from '@/store/tradesSlice'

export default function TradeCalendar() {
  const dispatch = useDispatch()
  const { tradeHistory, loading, error } = useSelector((state) => state.trades)

  const currentYear = new Date().getFullYear()
  const currentMonth = new Date().getMonth()

  const [selectedMonth, setSelectedMonth] = useState(currentMonth)
  const [selectedYear, setSelectedYear] = useState(currentYear)

  useEffect(() => {
    dispatch(fetchTrades())
  }, [dispatch])

  const parseDateAsLocal = (dateString) => {
    if (!dateString) return null
    return new Date(dateString)
  }

  const formatDateToYYYYMMDD = (date) => {
    if (!date) return ''
    const year = date.getFullYear()
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const day = date.getDate().toString().padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const tradesByDate = useMemo(() => {
    const map = new Map()
    tradeHistory.forEach((trade) => {
      const date = parseDateAsLocal(trade.date)
      if (date) {
        const dateStr = formatDateToYYYYMMDD(date)
        if (!map.has(dateStr)) {
          map.set(dateStr, [])
        }
        map.get(dateStr).push(trade)
      }
    })
    return map
  }, [tradeHistory])

  const getDaysInCalendarMonth = (year, month) => {
    const days = []
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startDayOfWeek = firstDay.getDay()

    const leadingFillerDays = startDayOfWeek
    for (let i = 0; i < leadingFillerDays; i++) {
      const date = new Date(firstDay)
      date.setDate(firstDay.getDate() - (leadingFillerDays - i))
      days.push({
        date: formatDateToYYYYMMDD(date),
        dayOfMonth: date.getDate(),
        isCurrentMonth: false,
      })
    }

    for (let i = 1; i <= lastDay.getDate(); i++) {
      const date = new Date(year, month, i)
      days.push({
        date: formatDateToYYYYMMDD(date),
        dayOfMonth: i,
        isCurrentMonth: true,
      })
    }

    const totalRendered = days.length
    const trailingFillerDays = (7 - (totalRendered % 7)) % 7
    for (let i = 1; i <= trailingFillerDays; i++) {
      const date = new Date(lastDay)
      date.setDate(lastDay.getDate() + i)
      days.push({
        date: formatDateToYYYYMMDD(date),
        dayOfMonth: date.getDate(),
        isCurrentMonth: false,
      })
    }

    return days
  }

  const daysInCalendar = useMemo(
    () => getDaysInCalendarMonth(selectedYear, selectedMonth),
    [selectedYear, selectedMonth],
  )

  const monthlyStats = useMemo(() => {
    let totalPnl = 0
    let totalTrades = 0
    let winningTrades = 0

    tradeHistory.forEach((t) => {
      const d = parseDateAsLocal(t.date)
      if (
        d &&
        d.getFullYear() === selectedYear &&
        d.getMonth() === selectedMonth
      ) {
        const pnl = parseFloat(t.pnlAmount || 0)
        totalPnl += pnl
        totalTrades++
        if (pnl > 0) winningTrades++
      }
    })

    const monthlyWinRate =
      totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0

    let avgRR = 'N/A'
    if (totalTrades > 0) {
      const positiveTrades = tradeHistory.filter((t) => {
        const d = parseDateAsLocal(t.date)
        return (
          d &&
          d.getFullYear() === selectedYear &&
          d.getMonth() === selectedMonth &&
          parseFloat(t.pnlAmount || 0) > 0
        )
      })

      const negativeTrades = tradeHistory.filter((t) => {
        const d = parseDateAsLocal(t.date)
        return (
          d &&
          d.getFullYear() === selectedYear &&
          d.getMonth() === selectedMonth &&
          parseFloat(t.pnlAmount || 0) < 0
        )
      })

      const avgWinPnl =
        positiveTrades.length > 0
          ? positiveTrades.reduce(
              (sum, t) => sum + parseFloat(t.pnlAmount || 0),
              0,
            ) / positiveTrades.length
          : 0
      const avgLossPnl =
        negativeTrades.length > 0
          ? negativeTrades.reduce(
              (sum, t) => sum + parseFloat(t.pnlAmount || 0),
              0,
            ) / negativeTrades.length
          : 0

      if (avgWinPnl > 0 && avgLossPnl < 0) {
        avgRR = `${(avgWinPnl / Math.abs(avgLossPnl)).toFixed(2)} : 1`
      } else if (avgWinPnl > 0) {
        avgRR = 'Wins Only'
      } else if (avgLossPnl < 0) {
        avgRR = 'Losses Only'
      } else {
        avgRR = '0 : 0'
      }
    }

    return { totalPnl, totalTrades, monthlyWinRate, avgRR }
  }, [selectedYear, selectedMonth, tradeHistory])

  const weeksData = useMemo(() => {
    const weeks = []
    for (let i = 0; i < daysInCalendar.length; i += 7) {
      const weekDays = daysInCalendar.slice(i, i + 7)
      let weekPnl = 0
      let weekTrades = 0

      weekDays.forEach((day) => {
        if (day.isCurrentMonth) {
          const trades = tradesByDate.get(day.date) || []
          trades.forEach((t) => {
            weekPnl += parseFloat(t.pnlAmount || 0)
            weekTrades++
          })
        }
      })

      const firstDayInWeek = weekDays[0]
      const lastDayInWeek = weekDays[weekDays.length - 1]

      const startDisplay = parseDateAsLocal(
        firstDayInWeek.date,
      ).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      const endDisplay = parseDateAsLocal(
        lastDayInWeek.date,
      ).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

      weeks.push({
        id: `week-${i / 7}`,
        startDisplay,
        endDisplay,
        totalPnl: weekPnl,
        totalTrades: weekTrades,
      })
    }
    return weeks
  }, [daysInCalendar, tradesByDate])

  if (loading) {
    return <Loader message="Loading calendar data..." />
  }

  if (error) {
    return <div className="text-red-500 text-center p-4">Error: {error}</div>
  }

  return (
    <div className="w-full mx-auto p-4 sm:p-6 lg:p-8 bg-slate-900 min-h-screen text-white">
      <div className="max-w-7xl mx-auto space-y-6">
        <CalendarHeader
          selectedMonth={selectedMonth}
          setSelectedMonth={setSelectedMonth}
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
          currentYear={currentYear}
        />
        <CalendarMetrics stats={monthlyStats} isClient={true} />
        <CalendarGrid
          daysInCalendar={daysInCalendar}
          tradesByDate={tradesByDate}
          isClient={true}
        />
        <WeeklyPerformance weeksData={weeksData} isClient={true} />
      </div>
    </div>
  )
}
