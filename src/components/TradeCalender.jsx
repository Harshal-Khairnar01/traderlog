'use client';

import React, { useState, useMemo } from 'react';

export default function TradeCalendar({ tradeHistory }) {
  // Add Sunday and Saturday for a full 7-day calendar week
  const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth(); // 0-indexed

  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedYear, setSelectedYear] = useState(currentYear);

  // Helper to parse date strings consistently as local dates (YYYY-MM-DD)
  const parseDateAsLocal = (dateString) => {
    if (!dateString) return null; // Handle cases where dateString might be undefined
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day); // Month is 0-indexed
  };

  // Helper to format a Date object into a YYYY-MM-DD string in local time
  const formatDateToYYYYMMDD = (date) => {
    if (!date) return '';
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Memoize grouped trades by date for efficient lookup
  const tradesByDate = useMemo(() => {
    const map = new Map();
    tradeHistory.forEach(trade => {
      const dateStr = trade.date; // Assuming trade.date is already YYYY-MM-DD
      if (dateStr) { // Ensure dateStr exists
        if (!map.has(dateStr)) {
          map.set(dateStr, []);
        }
        map.get(dateStr).push(trade);
      }
    });
    return map;
  }, [tradeHistory]);

  // Function to get all days for the calendar grid (including filler days)
  const getDaysInCalendarMonth = (year, month) => {
    const days = [];
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0); // Day 0 of next month is last day of current

    // Get the day of the week for the 1st of the month (0=Sunday, 1=Monday...)
    const startDayOfWeek = firstDayOfMonth.getDay();

    // Calculate how many days from the previous month to show (to start on Sunday)
    // If firstDayOfMonth is a Sunday (0), we still want to render 0 preceding days.
    const leadingFillerDays = startDayOfWeek === 0 ? 0 : startDayOfWeek;

    // Add leading filler days from the previous month
    for (let i = 0; i < leadingFillerDays; i++) {
      const date = new Date(firstDayOfMonth);
      date.setDate(firstDayOfMonth.getDate() - (leadingFillerDays - i));
      days.push({
        date: formatDateToYYYYMMDD(date),
        dayOfMonth: date.getDate(),
        isCurrentMonth: false,
      });
    }

    // Add days of the current month
    for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
      const date = new Date(year, month, i);
      days.push({
        date: formatDateToYYYYMMDD(date),
        dayOfMonth: i,
        isCurrentMonth: true,
      });
    }

    // Calculate how many trailing filler days are needed to complete the last week
    const totalDaysRendered = leadingFillerDays + lastDayOfMonth.getDate();
    const trailingFillerDays = (7 - (totalDaysRendered % 7)) % 7;

    // Add trailing filler days from the next month
    for (let i = 1; i <= trailingFillerDays; i++) {
      const date = new Date(lastDayOfMonth);
      date.setDate(lastDayOfMonth.getDate() + i);
      days.push({
        date: formatDateToYYYYMMDD(date),
        dayOfMonth: date.getDate(),
        isCurrentMonth: false,
      });
    }

    return days;
  };

  const daysInCalendar = useMemo(() => getDaysInCalendarMonth(selectedYear, selectedMonth), [selectedYear, selectedMonth]);

  // Monthly Summary Calculation
  const monthlyStats = useMemo(() => {
    let totalPnl = 0;
    let totalTrades = 0;
    let winningTrades = 0;

    daysInCalendar.forEach(day => {
      if (day.isCurrentMonth) { // Only count trades for the selected month
        const trades = tradesByDate.get(day.date) || [];
        trades.forEach(t => {
          const pnl = parseFloat(t.netPnl || 0); // Ensure P&L is a number
          totalPnl += pnl;
          totalTrades++;
          if (pnl > 0) {
            winningTrades++;
          }
        });
      }
    });

    const monthlyWinRate = totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0;
    
    let avgRR = "N/A";
    if (totalTrades > 0) {
        const positiveTrades = tradeHistory.filter(t => {
            const d = parseDateAsLocal(t.date);
            return d && d.getFullYear() === selectedYear && d.getMonth() === parseInt(selectedMonth) && parseFloat(t.netPnl || 0) > 0;
        });
        const negativeTrades = tradeHistory.filter(t => {
            const d = parseDateAsLocal(t.date);
            return d && d.getFullYear() === selectedYear && d.getMonth() === parseInt(selectedMonth) && parseFloat(t.netPnl || 0) < 0;
        });

        const avgWinPnl = positiveTrades.length > 0 ? positiveTrades.reduce((sum, t) => sum + parseFloat(t.netPnl || 0), 0) / positiveTrades.length : 0;
        const avgLossPnl = negativeTrades.length > 0 ? negativeTrades.reduce((sum, t) => sum + parseFloat(t.netPnl || 0), 0) / negativeTrades.length : 0;

        // Basic R:R calculation: Average Winning PnL vs. Absolute Average Losing PnL
        if (avgWinPnl > 0 && avgLossPnl < 0) {
            avgRR = `${(avgWinPnl / Math.abs(avgLossPnl)).toFixed(2)} : 1`;
        } else if (avgWinPnl > 0) {
            avgRR = "Wins Only";
        } else if (avgLossPnl < 0) {
            avgRR = "Losses Only";
        } else {
            avgRR = "0 : 0";
        }
    }

    return { totalPnl, totalTrades, monthlyWinRate, avgRR };
  }, [selectedYear, selectedMonth, tradesByDate, tradeHistory]); // Added tradeHistory as dependency

  const { totalPnl, totalTrades, monthlyWinRate, avgRR } = monthlyStats;


  // Calculate weekly P&L data
  const weeksData = useMemo(() => {
    const weeks = [];
    for (let i = 0; i < daysInCalendar.length; i += 7) {
        const weekDays = daysInCalendar.slice(i, i + 7);
        let weekPnl = 0;
        let weekTradesCount = 0;

        // Get the first and last date object from the 7 days in this week chunk for display range
        const startOfWeekDateObj = weekDays.length > 0 ? parseDateAsLocal(weekDays[0].date) : null;
        const endOfWeekDateObj = weekDays.length > 0 ? parseDateAsLocal(weekDays[weekDays.length - 1].date) : null;

        const weekStartDisplay = startOfWeekDateObj ? startOfWeekDateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '';
        const weekEndDisplay = endOfWeekDateObj ? endOfWeekDateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '';

        // Only sum P&L and trades for days that are part of the currently selected month
        weekDays.forEach(day => {
            if (day.isCurrentMonth) { // Only count if the day is in the selected month
                const tradesForDay = tradesByDate.get(day.date) || [];
                tradesForDay.forEach(trade => {
                    weekPnl += parseFloat(trade.netPnl || 0);
                    weekTradesCount++;
                });
            }
        });

        // Only add weeks that have at least one day from the current month or trades
        if (weekDays.some(d => d.isCurrentMonth || tradesByDate.has(d.date))) {
            weeks.push({
                id: `week-${i / 7}`, // Unique ID for key prop
                startDisplay: weekStartDisplay,
                endDisplay: weekEndDisplay,
                totalPnl: weekPnl,
                totalTrades: weekTradesCount
            });
        }
    }
    return weeks;
  }, [daysInCalendar, tradesByDate, parseDateAsLocal]);


  return (
    <div className="border p-5 rounded-xl bg-slate-900 shadow-lg max-w-7xl mx-auto space-y-6 text-white">
      {/* Top Summary Section */}
      <div className="flex justify-between items-center mb-6 px-4 py-3 bg-slate-800 rounded-lg">
        <h2 className="text-2xl font-bold text-gray-50">📅 Trade Calendar</h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <label htmlFor="month-select" className="sr-only">Select Month</label>
            <select
              id="month-select"
              className="border border-gray-600 bg-slate-700 text-white px-3 py-1 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i} value={i}>
                  {new Date(0, i).toLocaleString('default', { month: 'long' })}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="year-select" className="sr-only">Select Year</label>
            <select
              id="year-select"
              className="border border-gray-600 bg-slate-700 text-white px-3 py-1 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            >
              {[currentYear - 1, currentYear, currentYear + 1].map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Stats Row */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-slate-800 p-4 rounded-lg flex flex-col items-center">
          <p className="text-sm text-gray-400">TOTAL P&L</p>
          <p className={`text-xl font-bold ${totalPnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            ₹{totalPnl.toLocaleString('en-IN')}
          </p>
        </div>
        <div className="bg-slate-800 p-4 rounded-lg flex flex-col items-center">
          <p className="text-sm text-gray-400">WIN RATE</p>
          <p className="text-xl font-bold text-blue-400">{monthlyWinRate.toFixed(1)}%</p>
        </div>
        <div className="bg-slate-800 p-4 rounded-lg flex flex-col items-center">
          <p className="text-sm text-gray-400">TOTAL TRADES</p>
          <p className="text-xl font-bold text-purple-400">{totalTrades}</p>
        </div>
        <div className="bg-slate-800 p-4 rounded-lg flex flex-col items-center">
          <p className="text-sm text-gray-400">AVG. R:R</p>
          <p className="text-xl font-bold text-yellow-400">{avgRR}</p>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-slate-800 p-4 rounded-lg">
        <div className="grid grid-cols-7 gap-1 text-center font-semibold text-gray-300 mb-2">
          {weekdays.map(day => (
            <div key={day} className="py-2 text-sm">{day.substring(0, 3)}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {daysInCalendar.map((day, index) => {
            const tradesForDay = tradesByDate.get(day.date) || [];
            const netPnl = tradesForDay.reduce((acc, t) => acc + parseFloat(t.netPnl || 0), 0);
            const tradeCount = tradesForDay.length;

            let cellBgColor = 'bg-slate-700'; // Default for inactive days
            let pnlColor = 'text-gray-400';

            if (day.isCurrentMonth) {
              if (tradeCount > 0) {
                if (netPnl > 0) {
                  cellBgColor = 'bg-green-600/30 border border-green-700'; // Green tint for profit
                  pnlColor = 'text-green-400';
                } else if (netPnl < 0) {
                  cellBgColor = 'bg-red-600/30 border border-red-700'; // Red tint for loss
                  pnlColor = 'text-red-400';
                } else {
                  cellBgColor = 'bg-gray-600/30 border border-gray-700'; // Gray tint for zero P&L
                  pnlColor = 'text-gray-400';
                }
              } else {
                cellBgColor = 'bg-slate-700 border border-slate-600'; // Active month, no trades
              }
            } else {
                cellBgColor = 'bg-slate-700 opacity-40 border border-slate-600'; // Inactive month, filler days
                pnlColor = 'text-gray-500';
            }

            return (
              <div
                key={day.date} // Key by the actual date string
                className={`h-28 rounded-md flex flex-col p-2 text-sm relative ${cellBgColor}`}
              >
                <div className={`font-bold ${day.isCurrentMonth ? 'text-gray-200' : 'text-gray-500'}`}>
                  {day.dayOfMonth}
                </div>
                {day.isCurrentMonth && (
                  <div className="flex flex-col mt-auto text-xs">
                    {tradeCount > 0 ? (
                      <>
                        <span className={`font-semibold ${pnlColor}`}>
                          ₹{netPnl.toLocaleString('en-IN')}
                        </span>
                        <span className="text-gray-400">
                          {tradeCount} trade{tradeCount !== 1 ? 's' : ''}
                        </span>
                      </>
                    ) : (
                      <span className="text-gray-500">No trades</span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* New Section for Weekly P&L */}
      <div className="bg-slate-800 p-4 rounded-lg mt-6">
          <h3 className="text-xl font-bold text-gray-50 mb-4">Weekly Performance</h3>
          {weeksData.length === 0 && (
            <p className="text-center text-gray-500">No weekly data available for the selected month.</p>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {weeksData.map(week => (
                  <div key={week.id} className="bg-slate-700 p-3 rounded-md flex flex-col">
                      <p className="text-sm font-medium text-gray-300">{week.startDisplay} - {week.endDisplay}</p>
                      <p className={`text-lg font-bold ${week.totalPnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          ₹{week.totalPnl.toLocaleString('en-IN')}
                      </p>
                      <p className="text-xs text-gray-400">{week.totalTrades} trade{week.totalTrades !== 1 ? 's' : ''}</p>
                  </div>
              ))}
          </div>
      </div>
    </div>
  );
}