'use client'

import React, { useState, useEffect } from 'react'
import { Grid3x3, XCircle } from 'lucide-react'
import ChallengeSummaryMetrics from './ChallengeSummaryMetrics'
import PerformanceMetricsRow from './PerformanceMetricsRow'
import TradingConfidenceIndex from './TradingConfidenceIndex'
import AllTradesTable from '../all-trades/AllTradesTable'
import SetChallengeModal from './SetChallengeModal'
import { useChallengeMetrics } from '@/hooks/useChallengeMetrics'
import Loader from '../Loader'
import { toast } from 'react-toastify'
import ConfirmationModal from '../all-trades/ConfirmationModal'
import { useSession } from 'next-auth/react' 

const ChallengeClientPage = () => {
  const { data: session } = useSession()
  const {
    challengeData,
    tradeHistory,
    loading,
    error,
    challengeSettings,
    handleSaveChallengeSettings,
    refreshChallengeData,
  } = useChallengeMetrics()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeactivateModalOpen, setIsDeactivateModalOpen] = useState(false)
  const [hasActiveChallenge, setHasActiveChallenge] = useState(false)
  const [modalInitialSettings, setModalInitialSettings] = useState(null) 

  useEffect(() => {
    if (challengeSettings?.targetCapital > 0) {
      setHasActiveChallenge(true)
    } else {
      setHasActiveChallenge(false)
    }
  }, [challengeSettings])

  const openModal = () => {
   
    setModalInitialSettings({
      ...challengeSettings,
      startingCapital: session?.user?.initialCapital ?? 0,
    })
    setIsModalOpen(true)
  }
  const closeModal = () => {
    setIsModalOpen(false)
    setModalInitialSettings(null) 
  }

  const openDeactivateModal = () => setIsDeactivateModalOpen(true)
  const closeDeactivateModal = () => setIsDeactivateModalOpen(false)

  const confirmDeactivate = async () => {
    try {
      const res = await fetch('/api/challenge', {
        method: 'DELETE',
      })

      if (res.ok) {
        toast.success('Challenge deactivated successfully!')
        closeDeactivateModal()
        refreshChallengeData()
      } else {
        const errorData = await res.json()
        toast.error(errorData.message || 'Failed to deactivate challenge.')
        closeDeactivateModal()
      }
    } catch (err) {
      console.error('Error deactivating challenge:', err)
      toast.error('Failed to deactivate challenge.')
      closeDeactivateModal()
    }
  }

  if (loading) {
    return <Loader message=" Loading challenge data..." />
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        Error: {error}
      </div>
    )
  }

  return (
    <div className="min-h-screen p-6 bg-gray-900 text-white font-sans">
      <div className="flex justify-end mb-6">
        {hasActiveChallenge ? (
          <button
            onClick={openDeactivateModal}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center space-x-2"
          >
            <XCircle className="w-5 h-5" />
            <span>Deactivate Challenge</span>
          </button>
        ) : (
          <button
            onClick={openModal}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center space-x-2"
          >
            <Grid3x3 className="w-5 h-5" />
            <span>Set Challenge</span>
          </button>
        )}
      </div>

      {!hasActiveChallenge ? (
        <div className="flex flex-col items-center justify-center p-10 bg-gray-800 rounded-lg shadow-inner">
          <p className="text-xl mb-4 text-gray-300">
            You do not have an active challenge.
          </p>
          <button
            onClick={openModal}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg flex items-center space-x-2 text-lg"
          >
            <Grid3x3 className="w-6 h-6" />
            <span>Set Your First Challenge</span>
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-1 gap-6 mb-6">
            <ChallengeSummaryMetrics summary={challengeData.summary} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <PerformanceMetricsRow
              performance={challengeData.performance}
              progressToTarget={challengeData.summary.progressToTarget}
            />
          </div>
          <div className="grid grid-cols-1 gap-6 mb-8">
            <TradingConfidenceIndex
              confidenceLevel={challengeData.performance.tradingConfidenceLevel}
            />
          </div>
          <div className="grid grid-cols-1 gap-6">
            <AllTradesTable
              trades={tradeHistory}
              showActions={false}
              onDeleteTrade={() => {}}
              onEditTrade={() => {}}
            />
          </div>
        </>
      )}

      <SetChallengeModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSave={handleSaveChallengeSettings}
        initialSettings={modalInitialSettings} 
      />

      <ConfirmationModal
        isOpen={isDeactivateModalOpen}
        onClose={closeDeactivateModal}
        onConfirm={confirmDeactivate}
        title="Deactivate Challenge"
        message="Are you sure you want to deactivate your current challenge? This action cannot be undone."
        confirmButtonText="Deactivate"
      />
    </div>
  )
}

export default ChallengeClientPage
