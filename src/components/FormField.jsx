// components/FormField.js
import React from 'react';

export default function FormField({ label, id, type = 'text', placeholder, options, rows, step, min, max, value, onChange, className, children }) {
  const inputClasses = "shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-400 leading-tight bg-zinc-700 border-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent";

  let inputElement;

  const controlledValue = value === undefined || value === null ? '' : value;

  switch (type) {
    case 'select':
      inputElement = (
        <select id={id} className={inputClasses} value={controlledValue} onChange={onChange}>
          {options && options.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      );
      break;
    case 'textarea':
      inputElement = (
        <textarea id={id} rows={rows} className={inputClasses} placeholder={placeholder} value={controlledValue} onChange={onChange}></textarea>
      );
      break;
    case 'radio-group':
      inputElement = (
        <div className="flex items-center space-x-4">
          {options && options.map(option => (
            <label key={option.value} className="inline-flex items-center">
              <input
                type="radio"
                name={id}
                value={option.value}
                className={`form-radio ${option.colorClass || 'text-blue-600'}`}
                checked={value === option.value}
                onChange={onChange}
              />
              <span className="ml-2 text-gray-400">{option.label}</span>
            </label>
          ))}
        </div>
      );
      break;
    case 'range':
      inputElement = (
        <>
          <input
            type="range"
            id={id}
            min={min}
            max={max}
            value={value === undefined || value === null || value === '' ? (min !== undefined ? String(min) : '0') : String(value)}
            onChange={onChange}
            className="w-full h-2 bg-zinc-600 rounded-lg appearance-none cursor-pointer range-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {children}
        </>
      );
      break;
    case 'file':
      inputElement = (
        <>
          <label htmlFor={id} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer">
            {label}
          </label>
          <input type="file" id={id} accept="image/*" className="hidden" onChange={onChange} />
        </>
      );
      return (
        <div className={className}>
          {inputElement}
        </div>
      );
    default:
      inputElement = (
        <input
          type={type}
          id={id}
          className={inputClasses}
          placeholder={placeholder}
          step={step}
          value={controlledValue}
          onChange={onChange}
        />
      );
  }

  return (
    <div className={className}>
      {label && type !== 'file' && type !== 'radio-group' && (
        <label htmlFor={id} className="block text-gray-400 text-sm font-bold mb-2">
          {label}
        </label>
      )}
      {label && type === 'radio-group' && (
        <label className="block text-gray-400 text-sm font-bold mb-2">
          {label}
        </label>
      )}
      {inputElement}
    </div>
  );
}