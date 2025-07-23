"use client";

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { redirect, usePathname } from 'next/navigation';
import LeftSidebar from './LeftSidebar';

const AppLayout = ({ children }) => {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-zinc-800 p-4 flex items-center justify-center">
        <div className="text-gray-200 text-lg">Loading session...</div>
      </div>
    );
  }

  if (!session && pathname !== '/sign-in') {
    redirect('/sign-in');
    return null;
  }

  return (
    <div className="min-h-screen bg-zinc-900 text-white">
      {session && (
        <div
          className={`
            fixed inset-y-0 left-0 z-50 w-64
            transform
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            transition-transform duration-300 ease-in-out
            lg:translate-x-0
          `}
        >
          <LeftSidebar setSidebarOpen={setSidebarOpen} />
        </div>
      )}

      {session && sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
        ></div>
      )}

      <main className="flex-1  overflow-auto lg:ml-64">
        {session && (
          <button
            className="lg:hidden  rounded-md bg-slate-800 text-gray-200 mb-4"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle sidebar"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        )}
        {children}
      </main>
    </div>
  );
};

export default AppLayout;