// components/FormField.js
import React from 'react';

export default function FormField({
  label,
  id,
  type = 'text',
  placeholder,
  options,
  rows,
  step,
  min,
  max,
  value,
  onChange, // Crucial for controlled components
  className,
  children,
  ...props // Capture any additional props like 'name'
}) {
  const inputClasses = "shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-400 leading-tight bg-zinc-700 border-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent";

  let inputElement;

  // Ensure value is always a controlled string to prevent React warnings for null/undefined.
  // This helps maintain controlled component behavior consistently.
  const controlledValue = value === undefined || value === null ? '' : value;

  switch (type) {
    case 'select':
      inputElement = (
        <select
          id={id}
          className={inputClasses}
          value={controlledValue}
          onChange={onChange}
          {...props} // Pass through any extra props like 'name'
        >
          {options && options.map(option => (
            // Ensure key is unique, option value is used
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      );
      break;

    case 'textarea':
      inputElement = (
        <textarea
          id={id}
          rows={rows}
          className={inputClasses}
          placeholder={placeholder}
          value={controlledValue}
          onChange={onChange}
          {...props} // Pass through any extra props like 'name'
        ></textarea>
      );
      break;

    case 'radio-group':
      inputElement = (
        <div className="flex items-center space-x-4">
          {options && options.map(option => (
            <label key={option.value} className="inline-flex items-center">
              <input
                type="radio"
                name={id} // Radio buttons use 'name' to group them for mutual exclusion
                value={option.value}
                className={`form-radio ${option.colorClass || 'text-blue-600'}`}
                checked={controlledValue === option.value} // Compare current value with option's value
                onChange={onChange}
                {...props} // Pass through any extra props
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
            // Ensure value is a string. If controlledValue is empty, default to min if available.
            value={controlledValue === '' ? (min !== undefined ? String(min) : '0') : String(controlledValue)}
            onChange={onChange}
            className="w-full h-2 bg-zinc-600 rounded-lg appearance-none cursor-pointer range-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            {...props} // Pass through any extra props
          />
          {children} {/* For displaying the current range value, if used */}
        </>
      );
      break;

    case 'file':
      inputElement = (
        <>
          {/* Label acts as the visible button for the hidden file input */}
          <label htmlFor={id} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer">
            {/* Display the provided label or a sensible default */}
            {label || "Choose File"}
          </label>
          <input
            type="file"
            id={id}
            accept="image/*" // Good practice: specify accepted file types
            className="hidden" // Hides the default ugly file input
            onChange={onChange} // Correctly handles file selection
            {...props} // Pass through any extra props
          />
        </>
      );
      // Special return for 'file' type due to its unique structure
      return (
        <div className={className}>
          {inputElement}
        </div>
      );

    default: // Handles 'text', 'number', 'date', 'email', 'password', etc.
      inputElement = (
        <input
          type={type}
          id={id}
          className={inputClasses}
          placeholder={placeholder}
          step={step}
          value={controlledValue} // Correctly uses the controlled value
          onChange={onChange}     // **This is correctly present and crucial**
          {...props} // Pass through any extra props like 'name'
        />
      );
  }

  return (
    <div className={className}>
      {/* Conditionally render label based on input type for better UX */}
      {label && type !== 'file' && type !== 'radio-group' && (
        <label htmlFor={id} className="block text-gray-400 text-sm font-bold mb-2">
          {label}
        </label>
      )}
      {label && type === 'radio-group' && (
        // For radio groups, the label often describes the group, not a single input
        <label className="block text-gray-400 text-sm font-bold mb-2">
          {label}
        </label>
      )}
      {inputElement}
    </div>
  );
}