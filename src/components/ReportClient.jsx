'use client'

import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchTrades } from '@/store/tradesSlice'
import PerformanceReport from './reports/PerformanceReport'
import PsychologyReport from './reports/PsychologyReport'
import RiskReport from './reports/RiskReport'
import JournalReport from './reports/JournalReport'
import Loader from './Loader'

const ReportClient = () => {
  const [activeTab, setActiveTab] = useState('performance')

  const dispatch = useDispatch()
  const { tradeHistory, loading, error } = useSelector((state) => state.trades)

  useEffect(() => {
    dispatch(fetchTrades())
  }, [dispatch])

  if (loading) {
    return <Loader message="Loading reports data..." />
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <p className="text-red-500 text-lg text-center">Error: {error}</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900 p-4 md:p-8">
      {' '}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-200 mb-4 sm:mb-0">
          {' '}
          Trading Reports
        </h2>
      </div>
      <div className="flex flex-col sm:flex-row border-b border-zinc-700 mb-6">
        <button
          className={`
            px-3 py-2 sm:px-4 sm:py-2 text-base sm:text-lg font-medium
            ${
              activeTab === 'performance'
                ? 'text-blue-500 border-b-2 border-blue-500'
                : 'text-gray-400 hover:text-gray-200'
            }
            focus:outline-none transition-colors duration-200
            w-full sm:w-auto text-left sm:text-center
          `}
          onClick={() => setActiveTab('performance')}
        >
          Performance
        </button>
        <button
          className={`
            mt-2 sm:mt-0 sm:ml-4 px-3 py-2 sm:px-4 sm:py-2 text-base sm:text-lg font-medium
            ${
              activeTab === 'psychology'
                ? 'text-blue-500 border-b-2 border-blue-500'
                : 'text-gray-400 hover:text-gray-200'
            }
            focus:outline-none transition-colors duration-200
            w-full sm:w-auto text-left sm:text-center
          `}
          onClick={() => setActiveTab('psychology')}
        >
          Psychology
        </button>
        <button
          className={`
            mt-2 sm:mt-0 sm:ml-4 px-3 py-2 sm:px-4 sm:py-2 text-base sm:text-lg font-medium
            ${
              activeTab === 'risk'
                ? 'text-blue-500 border-b-2 border-blue-500'
                : 'text-gray-400 hover:text-gray-200'
            }
            focus:outline-none transition-colors duration-200
            w-full sm:w-auto text-left sm:text-center
          `}
          onClick={() => setActiveTab('risk')}
        >
          Risk
        </button>
        <button
          className={`
            mt-2 sm:mt-0 sm:ml-4 px-3 py-2 sm:px-4 sm:py-2 text-base sm:text-lg font-medium
            ${
              activeTab === 'journal'
                ? 'text-blue-500 border-b-2 border-blue-500'
                : 'text-gray-400 hover:text-gray-200'
            }
            focus:outline-none transition-colors duration-200
            w-full sm:w-auto text-left sm:text-center
          `}
          onClick={() => setActiveTab('journal')}
        >
          Journal
        </button>
      </div>
      <div className="mt-6">
        {activeTab === 'performance' && (
          <PerformanceReport tradeHistory={tradeHistory} />
        )}
        {activeTab === 'psychology' && (
          <PsychologyReport tradeHistory={tradeHistory} />
        )}
        {activeTab === 'risk' && <RiskReport tradeHistory={tradeHistory} />}
        {activeTab === 'journal' && (
          <JournalReport tradeHistory={tradeHistory} />
        )}
      </div>
    </div>
  )
}

export default ReportClient
