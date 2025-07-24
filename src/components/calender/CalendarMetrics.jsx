
import React from 'react';

export default function CalendarMetrics({ stats, isClient }) {
  const { totalPnl, totalTrades, monthlyWinRate, avgRR } = stats;

  const cards = [
    { title: 'TOTAL P&L', value: `₹${isClient ? totalPnl.toLocaleString('en-IN') : '...'}` , color: totalPnl >= 0 ? 'text-green-500' : 'text-red-500' },
    { title: 'WIN RATE', value: `${isClient ? monthlyWinRate.toFixed(1) + '%' : '...'}` , color: 'text-blue-400' },
    { title: 'TOTAL TRADES', value: `${isClient ? totalTrades : '...'}` , color: 'text-purple-400' },
    { title: 'AVG. R:R', value: `${isClient ? avgRR : '...'}` , color: 'text-yellow-400' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
      {cards.map((card) => (
        <div key={card.title} className="bg-slate-800 p-4 rounded-lg flex flex-col items-center shadow-md">
          <p className="text-sm text-gray-400 font-semibold">{card.title}</p>
          <p className={`text-xl font-bold ${card.color}`}>{card.value}</p>
        </div>
      ))}
    </div>
  );
}