
import React from 'react';

export default function WeeklyPerformance({ weeksData, isClient }) {
  return (
    <div className="bg-slate-800 p-4 rounded-lg shadow-md mt-6">
      <h3 className="text-xl font-bold text-gray-50 mb-4">Weekly Performance</h3>
      {!isClient ? (
        <p className="text-center text-gray-500">Loading weekly data...</p>
      ) : weeksData.length === 0 ? (
        <p className="text-center text-gray-500">No weekly data available for the selected month.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {weeksData.map(week => (
            <div key={week.id} className="bg-slate-700 p-3 rounded-md flex flex-col shadow-inner">
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
  );
}