'use client'

import React from 'react'

const MetricCard = ({
  title,
  icon: Icon,
  mainValue,
  footerText,
  valueColorClass = 'text-blue-300',
  subValues = [],
}) => {
  return (
    <div
      className="
        relative flex flex-col p-6 rounded-2xl shadow-xl overflow-hidden
        bg-gradient-to-br from-gray-800 to-zinc-900 border border-gray-700
        hover:shadow-2xl hover:border-blue-500 transform hover:-translate-y-1 transition-all duration-300 ease-in-out
      "
    >
     
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-blue-900/10 to-transparent opacity-20 hover:opacity-30 transition-opacity duration-300"></div>

      <div className="relative z-10 flex items-start justify-between mb-5">
        <h3 className="text-2xl font-extrabold text-white pr-4 leading-tight">
          {title}
        </h3>
        {Icon && (
          <div className="p-2 bg-blue-600/20 rounded-full">
            <Icon className="w-7 h-7 text-blue-400 flex-shrink-0" />
          </div>
        )}
      </div>

      {mainValue && (
        <p
          className={`relative z-10 text-5xl font-bold mb-4 ${valueColorClass}`}
        >
          {mainValue}
        </p>
      )}

      {footerText && (
        <p className="relative z-10 text-sm text-gray-400 mb-6 flex-grow">
          {footerText}
        </p>
      )}

      {subValues.length > 0 && (
        <div className="relative z-10 mt-auto space-y-3 pt-4 border-t border-gray-700/70">
          {subValues.map((item, index) => (
            <div
              key={index}
              className="flex justify-between items-center text-base"
            >
              <span className="text-gray-300 font-medium">{item.label}:</span>
              <span
                className={item.valueColor || 'text-gray-200 font-semibold'}
              >
                {item.value}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MetricCard
