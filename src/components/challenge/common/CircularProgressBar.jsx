// src/components/challenge/common/CircularProgressBar.jsx
import React from 'react';

export default function CircularProgressBar({ progress, size = 180, strokeWidth = 12, className = '' }){
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className={`relative flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      <svg className="absolute top-0 left-0" width={size} height={size}>
        <circle
          stroke="#4A5568" // Dark gray for the background path
          fill="transparent"
          strokeWidth={strokeWidth}
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          stroke="#3B82F6" // Blue for the progress path
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference + ' ' + circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          r={radius}
          cx={size / 2}
          cy={size / 2}
          className="transition-all duration-500 ease-in-out"
        />
      </svg>
      <span className="text-4xl font-bold text-gray-100">{progress.toFixed(2)}%</span>
      <span className="absolute bottom-6 text-sm text-gray-400">Progress to target</span>
    </div>
  );
};