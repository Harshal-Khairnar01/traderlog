// src/components/challenge/ChallengeClientPage.jsx
"use client";

import React, { useState, useCallback } from 'react';
import { useChallengeData } from '@/hooks/useChallengeData'; // Ensure this path is correct
import ChallengeOverview from './ChallengeOverview';
import ChallengeStats from './ChallengeStats';
import ChallengeTradeHistory from './ChallengeTradeHistory';
import SetChallengeModal from './SetChallengeModal';
import NewTradeEntryForm from '@/components/new-trade-entry-form/NewTradeEntryForm'; // Ensure this path is correct
import { toast } from 'react-toastify'; // Ensure react-toastify is installed and set up

export default function ChallengeClientPage({ userId = 'default_user' }) {
  // Destructure all values and functions from the custom hook
  const {
    challenge,
    calculatedMetrics,
    challengeTrades,
    loading,
    error,
    saveChallenge,        // Memoized in hook
    deactivateChallenge,  // Memoized in hook
    refreshChallengeData, // Memoized in hook
    addTrade,             // Memoized in hook
    updateTrade,          // Memoized in hook
    deleteTrade,          // Memoized in hook
  } = useChallengeData(userId);

  // Local state for modals/forms
  const [isTradeFormOpen, setIsTradeFormOpen] = useState(false); // State for NewTradeEntryForm modal
  const [tradeToEdit, setTradeToEdit] = useState(null);       // State to pass trade data for editing
  const [isChallengeModalOpen, setIsChallengeModalOpen] = useState(false); // State for SetChallengeModal

  // Handlers for NewTradeEntryForm modal (memoized)
  const handleEditTrade = useCallback((trade) => {
    setTradeToEdit(trade);
    setIsTradeFormOpen(true);
  }, []);

  const handleCloseTradeForm = useCallback(() => {
    setIsTradeFormOpen(false);
    setTradeToEdit(null); // Clear tradeToEdit when closing form
  }, []);

  const handleOpenAddForm = useCallback(() => {
    setTradeToEdit(null); // Ensure no trade is set for editing (for "Add New" mode)
    setIsTradeFormOpen(true);
  }, []);

  // Handlers for SetChallengeModal (memoized)
  const handleOpenChallengeModal = useCallback(() => {
    setIsChallengeModalOpen(true);
  }, []);

  const handleCloseChallengeModal = useCallback(() => {
    setIsChallengeModalOpen(false);
  }, []);

  // --- Render loading/error states for the page ---
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[500px] text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        <p className="ml-4 text-lg">Loading challenge data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center p-8 text-lg bg-zinc-800 rounded-lg shadow-lg">
        <p className="mb-4">Error: {error}</p>
        <button
          onClick={refreshChallengeData} // Call the memoized refresh function from hook
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
        >
          Retry
        </button>
      </div>
    );
  }

  // If no challenge is found (e.g., after deactivating or first load), prompt to set one
  if (!challenge) {
    return (
      <div className="min-h-screen bg-zinc-900 text-gray-100 p-8 flex flex-col items-center justify-center">
        <div className="text-center p-10 bg-zinc-800 rounded-lg shadow-lg border border-zinc-700">
          <p className="text-xl text-gray-300 mb-6">No active challenge found. Start your journey now!</p>
          <button
            onClick={handleOpenChallengeModal} // Use memoized handler to open challenge modal
            className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg text-lg transition duration-200"
          >
            Set Your First Challenge
          </button>
        </div>
        {/* Render SetChallengeModal if no challenge and its state is open */}
        {isChallengeModalOpen && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-75 flex justify-center items-center p-4">
            <div className="bg-zinc-800 rounded-lg shadow-xl text-white p-6 w-full max-w-md">
              <SetChallengeModal
                isOpen={isChallengeModalOpen}
                onClose={handleCloseChallengeModal} // Use memoized handler
                onSave={saveChallenge} // Directly use saveChallenge from the hook
                initialData={challenge} // Will be null for a new challenge
              />
            </div>
          </div>
        )}
      </div>
    );
  }

  // --- Main content render when challenge data is available ---
  return (
    <div className="min-h-screen bg-zinc-900 text-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Challenge Overview Section */}
        <ChallengeOverview
          challenge={challenge}
          calculatedMetrics={calculatedMetrics}
          saveChallenge={saveChallenge}       // Pass memoized function from hook
          deactivateChallenge={deactivateChallenge} // Pass memoized function from hook
        />

        {/* Action Button: Add New Trade */}
        <div className="flex justify-end mb-8">
            <button
                onClick={handleOpenAddForm} // Use memoized handler to open trade form
                className="px-6 py-3 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition-colors duration-200"
            >
                + Add New Trade
            </button>
        </div>

        {/* Challenge Statistics Section */}
        <ChallengeStats
          calculatedMetrics={calculatedMetrics}
          challengeTrades={challengeTrades}
        />

        {/* Challenge Trade History Section */}
        <ChallengeTradeHistory
          trades={challengeTrades}
          onEdit={handleEditTrade} // Use memoized handler
          onDelete={deleteTrade}   // Pass memoized function from hook
        />

      </div>

      {/* New Trade Entry Form Modal/Sidebar */}
      {isTradeFormOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-75 flex justify-end">
          <div className="bg-zinc-800 w-full md:w-1/2 lg:w-1/3 h-full overflow-y-auto">
            <NewTradeEntryForm
              addTrade={addTrade}       // Pass memoized function from hook
              updateTrade={updateTrade}   // Pass memoized function from hook
              onClose={handleCloseTradeForm} // Use memoized handler
              tradeToEdit={tradeToEdit}
              // No need for onSaveSuccess here, as addTrade/updateTrade already trigger refresh
            />
          </div>
        </div>
      )}
    </div>
  );
}