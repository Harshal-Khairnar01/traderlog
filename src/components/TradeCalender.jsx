'use client';

import React, { useState, useMemo, useEffect } from 'react';

export default function TradeCalendar() {
  const [tradeHistory, setTradeHistory] = useState([]);
  const [isClient, setIsClient] = useState(false);

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();

  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedYear, setSelectedYear] = useState(currentYear);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTrades = localStorage.getItem('tradeJournalData');
      if (savedTrades) {
        setTradeHistory(JSON.parse(savedTrades));
      }
      setIsClient(true);
    }
  }, []);

  useEffect(() => {
    if (isClient) {
      localStorage.setItem('tradeJournalData', JSON.stringify(tradeHistory));
    }
  }, [tradeHistory, isClient]);


  const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const parseDateAsLocal = (dateString) => {
    if (!dateString) return null;
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day);
  };

  const formatDateToYYYYMMDD = (date) => {
    if (!date) return '';
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const tradesByDate = useMemo(() => {
    const map = new Map();
    tradeHistory.forEach(trade => {
      const dateStr = trade.date;
      if (dateStr) {
        if (!map.has(dateStr)) {
          map.set(dateStr, []);
        }
        map.get(dateStr).push(trade);
      }
    });
    return map;
  }, [tradeHistory]);

  const getDaysInCalendarMonth = (year, month) => {
    const days = [];
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const startDayOfWeek = firstDay.getDay();
    const leadingFillerDays = startDayOfWeek === 0 ? 0 : startDayOfWeek;

    for (let i = 0; i < leadingFillerDays; i++) {
      const date = new Date(firstDay);
      date.setDate(firstDay.getDate() - (leadingFillerDays - i));
      days.push({
        date: formatDateToYYYYMMDD(date),
        dayOfMonth: date.getDate(),
        isCurrentMonth: false,
      });
    }

    for (let i = 1; i <= lastDay.getDate(); i++) {
      const date = new Date(year, month, i);
      days.push({
        date: formatDateToYYYYMMDD(date),
        dayOfMonth: i,
        isCurrentMonth: true,
      });
    }

    const totalRendered = leadingFillerDays + lastDay.getDate();
    const trailingFillerDays = (7 - (totalRendered % 7)) % 7;

    for (let i = 1; i <= trailingFillerDays; i++) {
      const date = new Date(lastDay);
      date.setDate(lastDay.getDate() + i);
      days.push({
        date: formatDateToYYYYMMDD(date),
        dayOfMonth: date.getDate(),
        isCurrentMonth: false,
      });
    }

    return days;
  };

  const daysInCalendar = useMemo(() => getDaysInCalendarMonth(selectedYear, selectedMonth), [selectedYear, selectedMonth]);

  const monthlyStats = useMemo(() => {
    let totalPnl = 0;
    let totalTrades = 0;
    let winningTrades = 0;

    daysInCalendar.forEach(day => {
      if (day.isCurrentMonth) {
        const trades = tradesByDate.get(day.date) || [];
        trades.forEach(t => {
          const pnl = parseFloat(t.pnlAmount || 0);
          totalPnl += pnl;
          totalTrades++;
          if (pnl > 0) winningTrades++;
        });
      }
    });

    const monthlyWinRate = totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0;

    let avgRR = "N/A";
    if (totalTrades > 0) {
      const positiveTrades = tradeHistory.filter(t => {
        const d = parseDateAsLocal(t.date);
        return d && d.getFullYear() === selectedYear && d.getMonth() === selectedMonth && parseFloat(t.pnlAmount || 0) > 0;
      });

      const negativeTrades = tradeHistory.filter(t => {
        const d = parseDateAsLocal(t.date);
        return d && d.getFullYear() === selectedYear && d.getMonth() === selectedMonth && parseFloat(t.pnlAmount || 0) < 0;
      });

      const avgWinPnl = positiveTrades.length > 0 ? positiveTrades.reduce((sum, t) => sum + parseFloat(t.pnlAmount || 0), 0) / positiveTrades.length : 0;
      const avgLossPnl = negativeTrades.length > 0 ? negativeTrades.reduce((sum, t) => sum + parseFloat(t.pnlAmount || 0), 0) / negativeTrades.length : 0;

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
  }, [selectedYear, selectedMonth, tradesByDate, tradeHistory]);

  const weeksData = useMemo(() => {
    const weeks = [];
    for (let i = 0; i < daysInCalendar.length; i += 7) {
      const weekDays = daysInCalendar.slice(i, i + 7);
      let weekPnl = 0;
      let weekTrades = 0;

      const start = parseDateAsLocal(weekDays[0]?.date);
      const end = parseDateAsLocal(weekDays[6]?.date);

      const startDisplay = start ? start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '';
      const endDisplay = end ? end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '';

      weekDays.forEach(day => {
        if (day.isCurrentMonth) {
          const trades = tradesByDate.get(day.date) || [];
          trades.forEach(t => {
            weekPnl += parseFloat(t.pnlAmount || 0);
            weekTrades++;
          });
        }
      });

      if (weekDays.some(d => d.isCurrentMonth || tradesByDate.has(d.date))) {
        weeks.push({
          id: `week-${i / 7}`,
          startDisplay,
          endDisplay,
          totalPnl: weekPnl,
          totalTrades: weekTrades
        });
      }
    }
    return weeks;
  }, [daysInCalendar, tradesByDate]);

  const { totalPnl, totalTrades, monthlyWinRate, avgRR } = monthlyStats;

  return (
    <div className=" w-full mx-auto">
      <div className="p-8  bg-slate-900 shadow-lg max-w-7xl mx-auto space-y-6 text-white ">
        <div className="flex justify-between items-center mb-4 px-4 py-3 bg-slate-800 rounded-lg">
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

        <div className="grid grid-cols-4 gap-4 mb-4">
          <div className="bg-slate-800 p-4 rounded-lg flex flex-col items-center">
            <p className="text-sm text-gray-400">TOTAL P&L</p>
            <p className={`text-xl font-bold ${totalPnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              ₹{isClient ? totalPnl.toLocaleString('en-IN') : 'Loading...'}
            </p>
          </div>
          <div className="bg-slate-800 p-4 rounded-lg flex flex-col items-center">
            <p className="text-sm text-gray-400">WIN RATE</p>
            <p className="text-xl font-bold text-blue-400">{isClient ? monthlyWinRate.toFixed(1) + '%' : 'Loading...'}</p>
          </div>
          <div className="bg-slate-800 p-4 rounded-lg flex flex-col items-center">
            <p className="text-sm text-gray-400">TOTAL TRADES</p>
            <p className="text-xl font-bold text-purple-400">{isClient ? totalTrades : 'Loading...'}</p>
          </div>
          <div className="bg-slate-800 p-4 rounded-lg flex flex-col items-center">
            <p className="text-sm text-gray-400">AVG. R:R</p>
            <p className="text-xl font-bold text-yellow-400">{isClient ? avgRR : 'Loading...'}</p>
          </div>
        </div>

        <div className="bg-slate-800 p-4 rounded-lg">
          <div className="grid grid-cols-7 gap-1 text-center font-semibold text-gray-300 mb-2">
            {weekdays.map(day => (
              <div key={day} className="py-2 text-sm">{day.substring(0, 3)}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {daysInCalendar.map((day, index) => {
              const tradesForDay = tradesByDate.get(day.date) || [];
              const netPnl = tradesForDay.reduce((acc, t) => acc + parseFloat(t.pnlAmount || 0), 0);
              const tradeCount = tradesForDay.length;

              let cellBgColor = 'bg-slate-700';
              let pnlColor = 'text-gray-400';

              if (day.isCurrentMonth) {
                if (tradeCount > 0) {
                  if (netPnl > 0) {
                    cellBgColor = 'bg-green-600/30 border border-green-700';
                    pnlColor = 'text-green-400';
                  } else if (netPnl < 0) {
                    cellBgColor = 'bg-red-600/30 border border-red-700';
                    pnlColor = 'text-red-400';
                  } else {
                    cellBgColor = 'bg-gray-600/30 border border-gray-700';
                    pnlColor = 'text-gray-400';
                  }
                } else {
                  cellBgColor = 'bg-slate-700 border border-slate-600';
                }
              } else {
                cellBgColor = 'bg-slate-700 opacity-40 border border-slate-600';
                pnlColor = 'text-gray-500';
              }

              return (
                <div
                  key={day.date}
                  className={` h-20 rounded-md flex flex-col p-2 text-sm relative ${cellBgColor}`}
                >
                  <div className={`font-bold ${day.isCurrentMonth ? 'text-gray-200' : 'text-gray-500'}`}>
                    {day.dayOfMonth}
                  </div>
                  {day.isCurrentMonth && (
                    <div className="flex flex-col mt-auto text-xs">
                      {tradeCount > 0 ? (
                        <>
                          <span className={`font-semibold ${pnlColor}`}>
                            ₹{isClient ? netPnl.toLocaleString('en-IN') : '-'}
                          </span>
                          <span className="text-gray-400">
                            {isClient ? `${tradeCount} trade${tradeCount !== 1 ? 's' : ''}` : '-'}
                          </span>
                        </>
                      ) : (
                        <span className="text-gray-500">{isClient ? 'No trades' : '-'}</span>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-slate-800 p-4 rounded-lg mt-6">
          <h3 className="text-xl font-bold text-gray-50 mb-4">Weekly Performance</h3>
          {!isClient ? (
            <p className="text-center text-gray-500">Loading weekly data...</p>
          ) : weeksData.length === 0 ? (
            <p className="text-center text-gray-500">No weekly data available for the selected month.</p>
          ) : (
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
          )}
        </div>
      </div>
    </div>
  );
}