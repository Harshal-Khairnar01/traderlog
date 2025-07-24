// components/MetricCard.jsx
"use client";

import React from 'react';

const MetricCard = ({ title, icon: Icon, mainValue, footerText, valueColorClass = 'text-gray-200', subValues = [] }) => {
  return (
    <div className="
      bg-slate-700 rounded-xl shadow-lg p-6 border border-zinc-700
      hover:shadow-xl hover:border-blue-600 transition-all duration-300 ease-in-out
      flex flex-col
    ">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-100 pr-4">{title}</h3>
        {Icon && <Icon className="w-8 h-8 text-blue-500 flex-shrink-0" />}
      </div>

      {mainValue && (
        <p className={`text-4xl font-extrabold mb-4 ${valueColorClass}`}>
          {mainValue}
        </p>
      )}

      {footerText && (
        <p className="text-sm text-gray-400 mb-6 flex-grow">
          {footerText}
        </p>
      )}

      {subValues.length > 0 && (
        <div className="mt-auto space-y-3 pt-4 border-t border-zinc-700">
          {subValues.map((item, index) => (
            <div key={index} className="flex justify-between items-center text-base">
              <span className="text-gray-300 font-medium">{item.label}:</span>
              <span className={item.valueColor || 'text-gray-200 font-semibold'}>{item.value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MetricCard;