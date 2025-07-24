
import React from 'react';

export default function CalendarGrid({ daysInCalendar, tradesByDate, isClient }) {
  const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  return (
    <div className="bg-slate-800 p-4 rounded-lg shadow-md">
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

          let cellClass = `h-24 rounded-md flex flex-col p-2 text-sm relative transition-all duration-200 ease-in-out hover:shadow-lg hover:z-10`;
          let pnlClass = 'text-gray-400';

          if (day.isCurrentMonth) {
            cellClass += ' border border-slate-700 bg-slate-700';
            if (tradeCount > 0) {
              if (netPnl > 0) {
                cellClass = `h-24 rounded-md flex flex-col p-2 text-sm relative transition-all duration-200 ease-in-out hover:shadow-lg hover:z-10 bg-green-900/30 border border-green-700`;
                pnlClass = 'text-green-400';
              } else if (netPnl < 0) {
                cellClass = `h-24 rounded-md flex flex-col p-2 text-sm relative transition-all duration-200 ease-in-out hover:shadow-lg hover:z-10 bg-red-900/30 border border-red-700`;
                pnlClass = 'text-red-400';
              }
            }
          } else {
            cellClass += ' opacity-40 border-slate-700 bg-slate-700';
          }

          return (
            <div key={day.date} className={cellClass}>
              <div className={`font-bold ${day.isCurrentMonth ? 'text-gray-200' : 'text-gray-400'}`}>
                {day.dayOfMonth}
              </div>
              {day.isCurrentMonth && tradeCount > 0 && (
                <div className="flex flex-col mt-auto text-xs">
                  <span className={`font-semibold ${pnlClass}`}>
                    ₹{isClient ? netPnl.toLocaleString('en-IN') : '-'}
                  </span>
                  <span className="text-gray-400">
                    {isClient ? `${tradeCount} trade${tradeCount !== 1 ? 's' : ''}` : '-'}
                  </span>
                </div>
              )}
              {day.isCurrentMonth && tradeCount === 0 && (
                <div className="flex flex-col mt-auto text-xs">
                   <span className="text-gray-500">No trades</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}