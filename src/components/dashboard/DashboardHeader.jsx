import React from 'react'
import Link from 'next/link'
import { signOut } from 'next-auth/react'

const DashboardHeader = ({
  userInitial,
  showNewTradeModal,
  setShowNewTradeModal,
  showProfileDropdown,
  setShowProfileDropdown,
  profileDropdownRef,
  timeRange,
  setTimeRange,
}) => {
  return (
    <div className="w-full max-w-7xl flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
      <div className="w-full sm:w-auto flex justify-between items-center">
        <select
          className="bg-slate-800 border border-slate-700 rounded px-3 py-1 text-sm text-gray-200"
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
        >
          <option value="alltime">All Time</option>
          <option value="30days">Last 30 Days</option>
          <option value="7days">Last 7 Days</option>
        </select>
      </div>
      <div
        ref={profileDropdownRef}
        className="w-full sm:w-auto flex items-center gap-5 justify-end relative"
      >
        <button
          onClick={() => setShowNewTradeModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-1.5 px-3 rounded-md text-sm flex items-center gap-1"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4v16m8-8H4"
            />
          </svg>
          New Trade
        </button>
        <button
          onClick={() => setShowProfileDropdown(!showProfileDropdown)}
          className="w-9 h-9 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold text-base hover:bg-purple-700 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
          aria-label="Profile menu"
        >
          {userInitial}
        </button>
        {showProfileDropdown && (
          <div className="absolute top-full right-0 mt-2 w-48 bg-slate-800 rounded-md shadow-lg z-10">
            <Link
              href="/profile"
              className="block px-4 py-2 text-gray-200 hover:bg-slate-700 rounded-t-md"
              onClick={() => setShowProfileDropdown(false)}
            >
              View Profile
            </Link>
            <button
              onClick={() => {
                signOut()
                setShowProfileDropdown(false)
              }}
              className="block w-full text-left cursor-pointer px-4 py-2 text-gray-200 hover:bg-slate-700 rounded-b-md"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default DashboardHeader
