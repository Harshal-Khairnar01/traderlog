
import React from 'react';

export default function CalendarHeader({
  selectedMonth,
  setSelectedMonth,
  selectedYear,
  setSelectedYear,
  currentYear,
}) {
  return (
    <div className="flex justify-between items-center mb-4 px-4 py-3 bg-slate-800 rounded-lg shadow-md">
      <h2 className="text-lg md:text-2xl font-bold text-gray-50">📅 Trade Calendar</h2>
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
  );
}