'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useSession } from 'next-auth/react'

import { fetchTrades, addTrade } from '@/store/tradesSlice'
import { useTradeCalculations } from '@/hooks/useTradeCalculations'

import DashboardHeader from '@/components/dashboard/DashboardHeader'
import {
  PerformanceCards,
  CapitalAndChargesCards,
} from '@/components/dashboard/DashboardCards'
import PnlChart from '@/components/dashboard/PnlChart'
import TopTrades from '@/components/dashboard/TopTrades'
import TradingConfidenceIndex from '@/components/challenge/TradingConfidenceIndex'
import TradeEntryModal from '@/components/dashboard/TradeEntryModal'
import Loader from '../Loader'

const DashboardPage = () => {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false)
  const [showNewTradeModal, setShowNewTradeModal] = useState(false)
  const [timeRange, setTimeRange] = useState('alltime')

  const profileDropdownRef = useRef(null)
  const dispatch = useDispatch()

  const { data: session, status } = useSession()
  const userName = session?.user?.name || 'Guest'
  const userInitial = userName.charAt(0).toUpperCase()
  const initialCapital = session?.user?.initialCapital || 0

  const { tradeHistory, loading, error } = useSelector((state) => state.trades)

  useEffect(() => {
    dispatch(fetchTrades())
  }, [dispatch])

  const {
    highestPnl,
    winRate,
    avgRiskReward,
    tradesCount,
    cumulativePnlData,
    topProfitTrades,
    topLosingTrades,
    averageConfidenceLevel,
    totalCharges,
    currentCapital,
    maxDrawdown,
  } = useTradeCalculations(tradeHistory, timeRange, initialCapital)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target)
      ) {
        setShowProfileDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  if (status === 'loading') return <Loader message="Loading session..." />
  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen bg-slate-800 p-4 flex items-center justify-center">
        <div className="text-red-500 text-lg">
          You must be logged in to view this page.
        </div>
      </div>
    )
  }

  if (loading) return <Loader message="Loading your trade data..." />
  if (error) {
    return (
      <div className="min-h-screen bg-slate-800 p-4 flex items-center justify-center">
        <div className="text-red-500 text-lg">Error: {error}</div>
      </div>
    )
  }

  const displayConfidenceLevel = tradesCount > 0 ? averageConfidenceLevel : 0.5

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <DashboardHeader
        userInitial={userInitial}
        showNewTradeModal={showNewTradeModal}
        setShowNewTradeModal={setShowNewTradeModal}
        showProfileDropdown={showProfileDropdown}
        setShowProfileDropdown={setShowProfileDropdown}
        profileDropdownRef={profileDropdownRef}
        timeRange={timeRange}
        setTimeRange={setTimeRange}
      />
      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-3">
          <CapitalAndChargesCards
            initialCapital={initialCapital}
            currentCapital={currentCapital}
            totalCharges={totalCharges}
            maxDrawdown={maxDrawdown}
          />
          <PerformanceCards
            highestPnl={highestPnl}
            winRate={winRate}
            avgRiskReward={avgRiskReward}
            tradesCount={tradesCount}
            timeRange={timeRange}
          />
          <div className="mb-4">
            <TradingConfidenceIndex confidenceLevel={displayConfidenceLevel} />
          </div>
          <div className="flex flex-col lg:flex-row gap-6">
            <PnlChart cumulativePnlData={cumulativePnlData} />
            <TopTrades
              topProfitTrades={topProfitTrades}
              topLosingTrades={topLosingTrades}
            />
          </div>
        </div>
      </div>

      <TradeEntryModal
        show={showNewTradeModal}
        onClose={() => setShowNewTradeModal(false)}
        onAddTrade={async (trade) => {
          try {
            const resultAction = await dispatch(addTrade(trade))
            if (addTrade.fulfilled.match(resultAction)) {
              setShowNewTradeModal(false)
            } else {
              console.error('Failed to add trade:', resultAction.error)
            }
          } catch (err) {
            console.error('Error adding trade:', err)
          }
        }}
      />
    </div>
  )
}

export default DashboardPage
