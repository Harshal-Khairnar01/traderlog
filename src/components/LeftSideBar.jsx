// components/LeftSidebar.jsx
"use client"; // This component also needs to be a client component because it uses usePathname

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation'; // Import usePathname for active link styling

const LeftSidebar = () => {
  const pathname = usePathname(); // Get current path for active link

  // Define your navigation items
  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2 2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    )},
    { href: '/all-trades', label: 'Trades', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    )},
    { href: '/strategies', label: 'Strategies', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    )},
    { href: '/journal', label: 'Calendar', icon: ( // Renamed from Journal to Calendar for consistency with image
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    )},
    { href: '/tools', label: 'Tools', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
      </svg>
    )},
    { href: '/challenge', label: 'Challenge', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21H6.5a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.737 10H14zm0 0V5a2 2 0 012-2h2" />
      </svg>
    )},
    { href: '/reports', label: 'Reports', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 2v-6m2 2V6M9 20h6a2 2 0 002-2V6a2 2 0 00-2-2H9a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    )},
    { href: '/affiliate', label: 'Affiliate', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l.55-.55c.4-.4.89-.65 1.4-.78C15.42 5.54 16 6 16 7v10h1a2 2 0 002-2V9.5a.5.5 0 00-.5-.5h-2a.5.5 0 01-.5-.5v-1a2 2 0 00-2-2z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M11 17l-.55.55c-.4.4-.89.65-1.4.78C8.58 18.46 8 18 8 17V7H7a2 2 0 00-2 2v7.5a.5.5 0 00.5.5h2a.5.5 0 01.5.5v1a2 2 0 002 2z" />
      </svg>
    )},
    { href: '/tutorials', label: 'Tutorials', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5A2.25 2.25 0 005.25 7.25v2.5A2.25 2.25 0 007.5 12h7.5c1.246 0 2.25-.477 2.25-1.253v-2.5C17.25 5.477 15.668 5 14.5 5c-1.746 0-3.332.477-4.5 1.253z" />
      </svg>
    )},
  ];

  return (
    <aside className="w-64 bg-slate-950 p-4 flex flex-col border-r border-slate-800">
      <div className="mb-8 mt-4">
        <h2 className="text-2xl font-bold text-gray-50 flex items-center gap-2">
          <span className="text-blue-500 text-3xl">TD</span> Trade Diary
        </h2>
      </div>
      <nav className="flex-1 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
              pathname === item.href ? 'bg-slate-800 text-blue-400' : 'text-gray-300 hover:bg-slate-800'
            }`}
          >
            {item.icon}
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="mt-auto">
        <p className="text-gray-500 text-xs text-center">MORE VIDEOS</p>
      </div>
    </aside>
  );
};

export default LeftSidebar;