'use client';

import React, { useState } from 'react';

export default function TradeCalendar({ tradeHistory }) {
  const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedYear, setSelectedYear] = useState(currentYear);

  const getWeekStart = (date) => {
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(date.setDate(diff));
  };

  const getWeeksOfYear = () => {
    const weeks = [];
    let current = new Date(selectedYear, 0, 1);

    while (current.getFullYear() === selectedYear) {
      const start = getWeekStart(new Date(current));
      const weekKey = start.toISOString().split('T')[0];

      if (!weeks.find(w => w.key === weekKey)) {
        weeks.push({ key: weekKey, start: new Date(start) });
      }

      current.setDate(current.getDate() + 7);
    }

    return weeks;
  };

  const weeks = getWeeksOfYear();

  const grouped = weeks.map(({ key, start }) => {
    const weekTrades = tradeHistory.filter(t => {
      const tDate = new Date(t.date);
      const end = new Date(start);
      end.setDate(start.getDate() + 5);
      return tDate >= start && tDate <= end;
    });

    const dayMap = weekdays.reduce((acc, day, i) => {
      const targetDate = new Date(start);
      targetDate.setDate(start.getDate() + i);
      const dateStr = targetDate.toISOString().split('T')[0];
      const trades = weekTrades.filter(t => t.date.startsWith(dateStr));
      acc[day] = {
        trades,
        net: trades.reduce((acc, t) => acc + (t.netPnl || 0), 0),
        count: trades.length,
        date: dateStr,
        month: targetDate.getMonth()
      };
      return acc;
    }, {});

    return {
      weekLabel: key,
      weekTrades,
      dayMap,
      weekMonth: start.getMonth()
    };
  }).filter(w => w.weekMonth === parseInt(selectedMonth));

  const monthlyStats = tradeHistory.filter(t => {
    const d = new Date(t.date);
    return d.getFullYear() === selectedYear && d.getMonth() === parseInt(selectedMonth);
  });
  const monthlyTotalPnl = monthlyStats.reduce((acc, t) => acc + (t.netPnl || 0), 0);
  const monthlyWinRate = monthlyStats.length ? (monthlyStats.filter(t => t.netPnl > 0).length / monthlyStats.length) * 100 : 0;

  return (
    <div className="border p-5 rounded-xl bg-white shadow-lg max-w-5xl mx-auto space-y-6">
      <div className="sticky top-0 bg-white z-10 py-2 shadow-sm flex justify-between items-center">
        <h2 className="text-xl font-bold text-slate-800">📅 Monthly Trade Calendar</h2>
        <div className="flex gap-2">
          <select
            className="border px-2 py-1 rounded text-sm"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i} value={i}>{new Date(0, i).toLocaleString('default', { month: 'long' })}</option>
            ))}
          </select>

          <select
            className="border px-2 py-1 rounded text-sm"
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
          >
            {[currentYear - 1, currentYear, currentYear + 1].map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Monthly Summary */}
      <div className="text-center text-sm font-medium text-slate-700">
        <p>Total P&L: <span className={monthlyTotalPnl >= 0 ? 'text-green-600' : 'text-red-600'}>₹{monthlyTotalPnl.toFixed(2)}</span></p>
        <p>Total Trades: {monthlyStats.length}</p>
        <p>Win Rate: {monthlyWinRate.toFixed(1)}%</p>
      </div>

      {grouped.map((week, index) => {
        const totalPnl = week.weekTrades.reduce((acc, t) => acc + (t.netPnl || 0), 0);
        const color = totalPnl > 0 ? 'text-green-600' : totalPnl < 0 ? 'text-red-600' : 'text-gray-600';

        return (
          <div key={index} className="flex justify-between items-center gap-4 px-2">
            <div className="flex gap-2">
              {weekdays.map((day) => {
                const { trades = [], net = 0, count = 0, date } = week.dayMap[day] || {};

                let boxColor = 'bg-white border border-gray-300 text-gray-700';
                if (count > 0) {
                  boxColor =
                    net > 0
                      ? 'bg-green-500 text-white'
                      : net < 0
                      ? 'bg-red-500 text-white'
                      : 'bg-gray-400 text-white';
                }

                return (
                  <div
                    key={day}
                    className={`w-20 h-20 rounded-lg flex flex-col items-center justify-center text-[12px] font-semibold shadow hover:scale-105 hover:ring-2 hover:ring-yellow-400 transition-all duration-200 ${boxColor}`}
                    title={`${day} (${date})\nP&L: ₹${net.toFixed(2)}\nTrades: ${count}`}
                  >
                    <div>{day[0]}</div>
                    <div className="text-[11px]">₹{net.toFixed(0)}</div>
                    <div className="text-[10px]">{count}T</div>
                  </div>
                );
              })}
            </div>

            <div
              className={`w-32 rounded-lg text-center p-2 font-semibold border ${color} bg-slate-100 shadow-inner`}
            >
              <div className="text-xs font-medium">
                {week.weekLabel}<br />Week {index + 1}
              </div>
              <div>₹{totalPnl.toFixed(0)}</div>
              <div>{week.weekTrades.length} Trades</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
