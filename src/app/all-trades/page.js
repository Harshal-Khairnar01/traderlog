// app/all-trades/page.js
'use client'; // This page uses client-side state, so mark it as a Client Component

import React, { useState, useEffect } from 'react'; // Import useState and useEffect
import Link from 'next/link';
// import { tradeHistory } from '../../lib/data'; // REMOVED: No longer importing dummy data
import AllTradesTable from '../../components/AllTradesTable';

export default function AllTradesPage() {
  // Initialize tradeHistory from localStorage or as an empty array
  const [tradeHistory, setTradeHistory] = useState(() => {
    if (typeof window !== 'undefined') { // Ensure localStorage is available (client-side)
      const savedTrades = localStorage.getItem('tradeJournalData');
      return savedTrades ? JSON.parse(savedTrades) : [];
    }
    return [];
  });

  // Sort tradeHistory by date to ensure correct grouping
  const sortedTradeHistory = [...tradeHistory].sort((a, b) => new Date(a.date) - new Date(b.date));

  const groupedTrades = {};
  const colors = ['bg-blue-50', 'bg-green-50', 'bg-yellow-50', 'bg-red-50', 'bg-purple-50'];

  if (sortedTradeHistory.length > 0) {
    const firstDate = new Date(sortedTradeHistory[0].date);

    sortedTradeHistory.forEach(trade => {
      const tradeDate = new Date(trade.date);
      const diffTime = Math.abs(tradeDate.getTime() - firstDate.getTime());
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      const groupIndex = Math.floor(diffDays / 3);
      const groupKey = `group-${groupIndex}`;

      if (!groupedTrades[groupKey]) {
        groupedTrades[groupKey] = {
          color: colors[groupIndex % colors.length],
          trades: []
        };
      }
      groupedTrades[groupKey].trades.push(trade);
    });
  }

  return (
    <div className="min-h-screen bg-zinc-800 p-4 lg:p-10 relative">
      <div className="bg-zinc-400 p-8 rounded-xl shadow-lg w-full  mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">All Trade Data</h2>
          <Link
            href="/"
            className="bg-gray-700 hover:bg-gray-950 text-zinc-200 font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out"
          >
            Back to Dashboard
          </Link>
        </div>

        <AllTradesTable groupedTrades={groupedTrades} />
      </div>
    </div>
  );
}
