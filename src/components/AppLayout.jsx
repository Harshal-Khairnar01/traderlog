'use client'

import React, { useState } from 'react'
import { useSession } from 'next-auth/react'
import { redirect, usePathname } from 'next/navigation'
import LeftSidebar from '@/components/LeftSideBar'
import Loader from './Loader'
import { Menu } from 'lucide-react'

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
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 z-50 w-64 bg-slate-950 border-r border-slate-800 shadow-lg lg:hidden">
            <LeftSidebar setSidebarOpen={setSidebarOpen} />
          </div>
        </>
      )}

      <div className="flex-1 flex flex-col w-full">
        {session && (
          <div className="lg:hidden p-2">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-gray-200 rounded bg-slate-800 p-2"
              aria-label="Open sidebar"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        )}

        <main className="flex-1  w-full">{children}</main>
      </div>
    </div>
  )
}

export default AppLayout
