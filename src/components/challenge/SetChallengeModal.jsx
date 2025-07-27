// components/challenge/SetChallengeModal.jsx
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const SetChallengeModal = ({ isOpen, onClose, onSave, initialSettings }) => {
  const [settings, setSettings] = useState({
    startingCapital: '',
    targetCapital: '',
    challengeEndDate: '',
  });

  useEffect(() => {
    if (initialSettings) {
      setSettings({
        startingCapital: initialSettings.startingCapital || '',
        targetCapital: initialSettings.targetCapital || '',
        challengeEndDate: initialSettings.challengeEndDate || '',
      });
    }
  }, [initialSettings]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { id, value } = e.target;
    setSettings(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const parsedStartingCapital = parseFloat(settings.startingCapital);
    const parsedTargetCapital = parseFloat(settings.targetCapital);
    const challengeEndDate = settings.challengeEndDate;

    if (isNaN(parsedStartingCapital) || parsedStartingCapital <= 0) {
      toast.error("Please enter a valid Starting Capital.");
      return;
    }
    if (isNaN(parsedTargetCapital) || parsedTargetCapital <= 0) {
      toast.error("Please enter a valid Target Capital.");
      return;
    }
    if (!challengeEndDate) {
      toast.error("Please select a Challenge End Date.");
      return;
    }
    if (new Date(challengeEndDate) <= new Date()) {
      toast.error("Challenge End Date must be in the future.");
      return;
    }
    if (parsedTargetCapital <= parsedStartingCapital) {
      toast.error("Target Capital must be greater than Starting Capital.");
      return;
    }


    const newSettings = {
      startingCapital: parsedStartingCapital,
      targetCapital: parsedTargetCapital,
      challengeEndDate: challengeEndDate, // Store as YYYY-MM-DD string
    };

    onSave(newSettings);
    toast.success("Challenge settings saved!");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-900/90 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-md border border-gray-700">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">Set Your Capital Growth Challenge</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="startingCapital" className="block text-gray-300 text-sm font-bold mb-2">
              Starting Capital (₹)
            </label>
            <input
              type="number"
              id="startingCapital"
              className="shadow appearance-none border border-gray-700 rounded w-full py-2 px-3 bg-gray-700 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., 30000"
              value={settings.startingCapital}
              onChange={handleChange}
              min="1"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="targetCapital" className="block text-gray-300 text-sm font-bold mb-2">
              Target Capital (₹)
            </label>
            <input
              type="number"
              id="targetCapital"
              className="shadow appearance-none border border-gray-700 rounded w-full py-2 px-3 bg-gray-700 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., 40000"
              value={settings.targetCapital}
              onChange={handleChange}
              min="1"
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="challengeEndDate" className="block text-gray-300 text-sm font-bold mb-2">
              Challenge End Date
            </label>
            <input
              type="date"
              id="challengeEndDate"
              className="shadow appearance-none border border-gray-700 rounded w-full py-2 px-3 bg-gray-700 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={settings.challengeEndDate}
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-200"
            >
              Save Challenge
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-200"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SetChallengeModal;