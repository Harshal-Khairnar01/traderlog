
import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'

const SetChallengeModal = ({ isOpen, onClose, onSave, initialSettings }) => {
  const [settings, setSettings] = useState({
    targetCapital: '',
    challengeStartDate: '',
    challengeStartTime: '',
    challengeEndDate: '',
  })

  useEffect(() => {
    if (initialSettings) {
      setSettings((prev) => ({
        ...prev,
        targetCapital: initialSettings.targetCapital || '',
        challengeStartDate: initialSettings.challengeStartDate || '',
        challengeStartTime: initialSettings.challengeStartTime || '',
        challengeEndDate: initialSettings.challengeEndDate || '',
      }))
    }
  }, [initialSettings])

  if (!isOpen) return null

  const handleChange = (e) => {
    const { id, value } = e.target
    setSettings((prev) => ({ ...prev, [id]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const parsedTargetCapital = parseFloat(settings.targetCapital)
    const challengeStartDate = settings.challengeStartDate
    const challengeStartTime = settings.challengeStartTime
    const challengeEndDate = settings.challengeEndDate

    const currentStartingCapital = initialSettings?.startingCapital

    if (isNaN(parsedTargetCapital) || parsedTargetCapital <= 0) {
      toast.error('Please enter a valid Target Capital.')
      return
    }
    if (!challengeStartDate) {
      toast.error('Please select a Challenge Start Date.')
      return
    }
    if (!challengeStartTime) {
      toast.error('Please select a Challenge Start Time.')
      return
    }
    if (!challengeEndDate) {
      toast.error('Please select a Challenge End Date.')
      return
    }

    const startDateTime = new Date(
      `${challengeStartDate}T${challengeStartTime}:00`,
    )
    const endDateTime = new Date(`${challengeEndDate}T23:59:59`)

    if (startDateTime > new Date()) {
      toast.error('Challenge Start Date and Time cannot be in the future.')
      return
    }
    if (endDateTime <= startDateTime) {
      toast.error('Challenge End Date must be after the Start Date.')
      return
    }

    const newSettings = {
      targetCapital: parsedTargetCapital,
      challengeStartDate: challengeStartDate,
      challengeStartTime: challengeStartTime,
      challengeEndDate: challengeEndDate,
    }

    onSave(newSettings)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-gray-900/90 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-md border border-gray-700">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          Set Your Capital Growth Challenge
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-300 text-sm font-bold mb-2">
              Starting Capital (₹)
            </label>
            <p className="shadow appearance-none border border-gray-700 rounded w-full py-2 px-3 bg-gray-700 text-white leading-tight">
              ₹{initialSettings?.startingCapital?.toLocaleString() || 'N/A'}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              This is your calculated starting capital for the challenge,
              including P&L before the challenge start.
            </p>
          </div>

          <div className="mb-4">
            <label
              htmlFor="targetCapital"
              className="block text-gray-300 text-sm font-bold mb-2"
            >
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

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label
                htmlFor="challengeStartDate"
                className="block text-gray-300 text-sm font-bold mb-2"
              >
                Challenge Start Date
              </label>
              <input
                type="date"
                id="challengeStartDate"
                className="shadow appearance-none border border-gray-700 rounded w-full py-2 px-3 bg-gray-700 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={settings.challengeStartDate}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label
                htmlFor="challengeStartTime"
                className="block text-gray-300 text-sm font-bold mb-2"
              >
                Challenge Start Time
              </label>
              <input
                type="time"
                id="challengeStartTime"
                className="shadow appearance-none border border-gray-700 rounded w-full py-2 px-3 bg-gray-700 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={settings.challengeStartTime}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="mb-6">
            <label
              htmlFor="challengeEndDate"
              className="block text-gray-300 text-sm font-bold mb-2"
            >
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
  )
}

export default SetChallengeModal
