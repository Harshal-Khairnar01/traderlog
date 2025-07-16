'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import NewTradeEntryForm from '../../components/NewTradeEntryForm';
import JournalTradeHistoryTable from '../../components/JournalTradeHistoryTable';
import TradePerformanceCharts from '../../components/TradePerformanceCharts';

export default function JournalPage() {
  const [journalTab, setJournalTab] = useState('nt');

  const [tradeHistory, setTradeHistory] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedTrades = localStorage.getItem('tradeJournalData');
      return savedTrades ? JSON.parse(savedTrades) : [];
    }
    return [];
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('tradeJournalData', JSON.stringify(tradeHistory));
    }
  }, [tradeHistory]);

  const addTrade = (newTrade) => {
    const newId = tradeHistory.length > 0 ? Math.max(...tradeHistory.map(trade => trade.id || 0)) + 1 : 1;
    setTradeHistory(prevHistory => [...prevHistory, { id: newId, ...newTrade }]);
  };

  const initialCapital = 31000;
  let currentCapital = initialCapital;
  tradeHistory.forEach(trade => {
    currentCapital += trade.netPnl ?? 0; // Use netPnl instead of pnl
  });

  return (
    <div className="min-h-screen bg-zinc-800 p-5 lg:p-10">
      <div className="bg-zinc-300 p-4 md:p-6 lg:p-8 rounded-xl shadow-lg w-full  mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Trade Journal</h2>
          <Link
            href="/"
            className=" bg-slate-600 hover:bg-slate-800 text-gray-300 font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out"
          >
            Back to Dashboard
          </Link>
        </div>

        <div className="flex flex-wrap border-b border-gray-200 mb-6">
          <button
            onClick={() => setJournalTab('nt')}
            className={`py-3 px-4 md:px-6 text-base md:text-lg font-medium ${
              journalTab === 'nt'
                ? 'border-b-4 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            } focus:outline-none transition duration-300`}
          >
            New Trade Entry
          </button>
          <button
            onClick={() => setJournalTab('pd')}
            className={`py-3 px-4 md:px-6 text-base md:text-lg font-medium ${
              journalTab === 'pd'
                ? 'border-b-4 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            } focus:outline-none transition duration-300`}
          >
            Previous Data (History)
          </button>
          <button
            onClick={() => setJournalTab('charts')}
            className={`py-3 px-4 md:px-6 text-base md:text-lg font-medium ${
              journalTab === 'charts'
                ? 'border-b-4 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            } focus:outline-none transition duration-300`}
          >
            Charts
          </button>
        </div>

        {journalTab === 'nt' ? (
          <NewTradeEntryForm addTrade={addTrade} />
        ) : journalTab === 'pd' ? (
          <JournalTradeHistoryTable
            initialCapital={initialCapital}
            currentCapital={currentCapital}
            tradeHistory={tradeHistory}
          />
        ) : (
          <>
            <h3 className="text-xl md:text-2xl font-bold text-gray-800 mt-8 mb-6">
              Trade Performance Analysis Charts
            </h3>
            <TradePerformanceCharts tradeHistory={tradeHistory} />
          </>
        )}
      </div>
    </div>
  );
}
