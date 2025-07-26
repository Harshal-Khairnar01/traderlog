// src/components/challenge/common/MetricCard.jsx
import React from 'react';

export default function MetricCard({ title, value, subText, icon, valueColor = 'text-gray-200' }) {
  return (
    <div className="bg-zinc-800 rounded-lg p-5 flex flex-col items-center justify-center text-center shadow-md border border-zinc-700">
      <div className="mb-3">
        {icon}
      </div>
      <p className="text-gray-400 text-sm font-medium mb-1">{title}</p>
      <p className={`text-2xl font-bold ${valueColor} mb-1`}>{value}</p>
      {subText && <p className="text-xs text-gray-500">{subText}</p>}
    </div>
  );
}