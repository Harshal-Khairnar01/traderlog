// src/components/challenge/SetChallengeModal.jsx
"use client";

import React, { useState, useEffect } from 'react';
import FormField from '@/components/FormField';

// Helper function to format a Date object into 'YYYY-MM-DD' string
const formatDateToYYYYMMDD = (date) => {
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    return '';
  }
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export default function SetChallengeModal({ isOpen, onClose, onSave, initialData }) {
  const [startingCapital, setStartingCapital] = useState('');
  const [targetCapital, setTargetCapital] = useState('');
  const [targetDate, setTargetDate] = useState('');

  useEffect(() => {
    if (initialData) {
      setStartingCapital(initialData.startingCapital || '');
      setTargetCapital(initialData.targetCapital || '');
      const dateForInput = initialData.targetDate instanceof Date ? initialData.targetDate : new Date(initialData.targetDate);

      if (dateForInput instanceof Date && !isNaN(dateForInput.getTime())) {
        setTargetDate(formatDateToYYYYMMDD(dateForInput));
      } else {
        setTargetDate('');
      }
    } else {
      setStartingCapital('');
      setTargetCapital('');
      setTargetDate('');
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formattedTargetDate = targetDate ? new Date(targetDate) : null;

    if (parseFloat(startingCapital) <= 0 || parseFloat(targetCapital) <= 0 || !formattedTargetDate || isNaN(formattedTargetDate.getTime())) {
      alert("Please fill in all fields with valid numbers and select a target date.");
      return;
    }

    onSave({
      startingCapital: parseFloat(startingCapital),
      targetCapital: parseFloat(targetCapital),
      targetDate: formattedTargetDate,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-zinc-800 rounded-lg p-8 w-full max-w-md shadow-xl border border-zinc-700">
        <h2 className="text-2xl font-bold text-gray-100 mb-6">{initialData ? 'Edit Challenge' : 'Set New Challenge'}</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <FormField
            label="Starting Capital (₹)"
            id="startingCapital"
            type="number"
            value={startingCapital}
            onChange={(e) => setStartingCapital(e.target.value)}
            placeholder="e.g., 30000"
            step="0.01"
            min="0"
          />
          <FormField
            label="Target Capital (₹)"
            id="targetCapital"
            type="number"
            value={targetCapital}
            onChange={(e) => setTargetCapital(e.target.value)}
            placeholder="e.g., 40000"
            step="0.01"
            min="0"
          />
          <FormField
            label="Target Date"
            id="targetDate"
            type="date"
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
            min={formatDateToYYYYMMDD(new Date())}
          />

          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-md text-zinc-300 border border-zinc-600 hover:bg-zinc-700 hover:text-white transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors duration-200"
            >
              {initialData ? 'Save Changes' : 'Set Challenge'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}