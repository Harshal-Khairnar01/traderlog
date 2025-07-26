// src/components/challenge/ChallengeOverview.jsx
import React from 'react';
import { format } from 'date-fns/format'; // Direct import for format
import { enUS } from 'date-fns/locale'; // Explicitly import the locale
import SetChallengeModal from './SetChallengeModal'; // Import SetChallengeModal here for editing

export default function ChallengeOverview({ challenge, calculatedMetrics, saveChallenge, deactivateChallenge }) {
  const {
    startingCapital,
    targetCapital,
    targetDate,
    startDate,
  } = challenge;

  const {
    progressToTarget,
    currentCapital,
    dailyTargetAmount,
    dailyProfitToday,
  } = calculatedMetrics;

  const [isEditFormOpen, setIsEditFormOpen] = React.useState(false); // Use React.useState

  // Calculate days remaining
  const today = new Date();
  const targetDt = targetDate;
  const startDt = startDate;

  let daysRemaining = 0;
  if (targetDt instanceof Date && !isNaN(targetDt.getTime())) {
    const diffTime = targetDt.getTime() - today.getTime();
    daysRemaining = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  }

  // THIS IS THE LINE THAT NEEDS THE CHANGE
  const projectedDateDisplay = (targetDt instanceof Date && !isNaN(targetDt.getTime()))
    ? format(targetDt, 'dd MMM yy', { locale: enUS }) // <-- ADDED { locale: enUS } HERE
    : 'N/A';

  const handleOpenEditForm = () => {
    setIsEditFormOpen(true);
  };

  const handleCloseEditForm = () => {
    setIsEditFormOpen(false);
  };

  const handleSaveChallengeEdit = async (formData) => {
    await saveChallenge(formData); // Call the saveChallenge prop from ChallengeClientPage
    handleCloseEditForm();
  };

  const handleDeactivate = () => {
    if (window.confirm("Are you sure you want to deactivate the current challenge? This will clear all challenge and trade data.")) {
      deactivateChallenge();
    }
  };


  return (
    <div className="bg-zinc-800 p-6 rounded-lg shadow-lg mb-8 border border-zinc-700">
      <h2 className="text-2xl font-bold text-gray-100 mb-4">Capital Growth Challenge</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {/* Days Remaining */}
        <div className="bg-zinc-700 p-4 rounded-lg flex flex-col items-center">
          <p className="text-sm text-gray-400">Days Remaining</p>
          <p className="text-3xl font-bold text-blue-400 mt-1">{daysRemaining}</p>
        </div>

        {/* Projected Date */}
        <div className="bg-zinc-700 p-4 rounded-lg flex flex-col items-center">
          <p className="text-sm text-gray-400">Projected Date</p>
          <p className="text-2xl font-bold text-gray-200 mt-1">{projectedDateDisplay}</p>
        </div>

        {/* Progress to Target */}
        <div className="bg-zinc-700 p-4 rounded-lg">
          <p className="text-sm text-gray-400 text-center">Progress to Target</p>
          <div className="flex items-center mt-2">
            <div className="w-full bg-zinc-600 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full"
                style={{ width: `${progressToTarget}%` }}
              ></div>
            </div>
            <p className="ml-3 text-lg font-semibold text-gray-100">{progressToTarget.toFixed(2)}%</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Capital Details */}
        <div className="bg-zinc-700 p-4 rounded-lg">
          <h4 className="text-md font-semibold text-gray-100 mb-2">Capital</h4>
          <div className="space-y-1">
            <p className="flex justify-between text-gray-300 text-sm">
              <span>Starting Capital:</span>
              <span className="font-semibold">₹{startingCapital.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
            </p>
            <p className="flex justify-between text-gray-300 text-sm">
              <span>Current Capital:</span>
              <span className="font-semibold">₹{currentCapital.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
            </p>
            <p className="flex justify-between text-gray-300 text-sm">
              <span>Target Capital:</span>
              <span className="font-semibold">₹{targetCapital.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
            </p>
          </div>
        </div>

        {/* Daily Target & Profit Today */}
        <div className="bg-zinc-700 p-4 rounded-lg">
          <h4 className="text-md font-semibold text-gray-100 mb-2">Daily Goals</h4>
          <div className="space-y-1">
            <p className="flex justify-between text-gray-300 text-sm">
              <span>Daily Target Amount:</span>
              <span className="font-semibold">₹{dailyTargetAmount.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
            </p>
            <p className="flex justify-between text-gray-300 text-sm">
              <span>Today's Profit:</span>
              <span className={`font-semibold ${dailyProfitToday >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                ₹{dailyProfitToday.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})} today
              </span>
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-4 mt-6">
        <button
          onClick={handleOpenEditForm}
          className="px-6 py-2 rounded-md text-blue-300 border border-blue-600 hover:bg-blue-700 hover:text-white transition-colors duration-200"
        >
          Edit Challenge
        </button>
        <button
          onClick={handleDeactivate}
          className="px-6 py-2 rounded-md bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors duration-200"
        >
          Deactivate Challenge
        </button>
      </div>

      {/* Challenge Setup Form Modal for editing */}
      {isEditFormOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-75 flex justify-center items-center p-4">
          <div className="bg-zinc-800 rounded-lg shadow-xl text-white p-6 w-full max-w-md">
            <SetChallengeModal
              isOpen={isEditFormOpen} // Use isEditFormOpen for modal visibility
              onClose={handleCloseEditForm}
              onSave={handleSaveChallengeEdit}
              initialData={challenge} // Pass existing challenge data for pre-filling
            />
          </div>
        </div>
      )}
    </div>
  );
}