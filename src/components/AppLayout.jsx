'use client'

import React, { useState } from 'react'
import { useSession } from 'next-auth/react'
import { redirect, usePathname } from 'next/navigation'
import LeftSidebar from '@/components/LeftSideBar'
import Loader from './Loader'

const AppLayout = ({ children }) => {
  const { data: session, status } = useSession()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  if (status === 'loading') {
    return <Loader message="loading session.." />
  }

  if (!session && pathname !== '/sign-in') {
    redirect('/sign-in')
    return null
  }

  return (
    <div className="min-h-screen bg-zinc-900 text-white flex">
      <div className="hidden lg:block w-64 border-r border-slate-800 bg-slate-950">
        <LeftSidebar />
      </div>

      {sidebarOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 z-50 w-64 bg-slate-950 border-r border-slate-800 shadow-lg lg:hidden">
            <LeftSidebar setSidebarOpen={setSidebarOpen} />
          </div>
        </>
      )}

      <div className="flex-1 flex flex-col">
        {session && (
          <div className="lg:hidden p-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-gray-200 rounded bg-slate-800 p-2"
              aria-label="Open sidebar"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        )}

        <main className="flex-1  overflow-auto">{children}</main>
      </div>
    </div>
  )
}

export default AppLayout
