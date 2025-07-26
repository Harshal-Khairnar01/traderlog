// components/FormField.js
import React from "react";

export default function FormField({
  label,
  id,
  type = "text",
  placeholder,
  options,
  rows,
  step,
  min,
  max,
  value,
  onChange,
  className,
  children,
  ...props
}) {
  const inputClasses =
    "appearance-none   w-full py-2 px-3 text-gray-400 leading-tight  outline-none   border-b border-zinc-400  focus:border-blue-500  transition-all duration-300 delay-200";

  let inputElement;

  const controlledValue = value === undefined || value === null ? "" : value;

  switch (type) {
    case "select":
      inputElement = (
        <select
          id={id}
          className={inputClasses}
          value={controlledValue}
          onChange={onChange}
          {...props}
        >
          {options &&
            options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
        </select>
      );
      break;

    case "textarea":
      inputElement = (
        <textarea
          id={id}
          rows={rows}
          className={inputClasses}
          placeholder={placeholder}
          value={controlledValue}
          onChange={onChange}
          {...props}
        ></textarea>
      );
      break;

    case "radio-group":
      inputElement = (
        <div className="flex items-center space-x-4">
          {options &&
            options.map((option) => (
              <label key={option.value} className="inline-flex items-center">
                <input
                  type="radio"
                  name={id}
                  value={option.value}
                  className={`form-radio ${
                    option.colorClass || "text-blue-600"
                  }`}
                  checked={controlledValue === option.value}
                  onChange={onChange}
                  {...props}
                />
                <span className="ml-2 text-gray-400">{option.label}</span>
              </label>
            ))}
        </div>
      );
      break;

    case "range":
      inputElement = (
        <>
          <input
            type="range"
            id={id}
            min={min}
            max={max}
            value={
              controlledValue === ""
                ? min !== undefined
                  ? String(min)
                  : "0"
                : String(controlledValue)
            }
            onChange={onChange}
            className="w-full h-2 bg-zinc-600 rounded-lg appearance-none cursor-pointer range-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            {...props}
          />
          {children}
        </>
      );
      break;

    case "file":
      inputElement = (
        <>
          <label
            htmlFor={id}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
          >
            {label || "Choose File"}
          </label>
          <input
            type="file"
            id={id}
            accept="image/*"
            className="hidden"
            onChange={onChange}
            {...props}
          />
        </>
      );
      return <div className={className}>{inputElement}</div>;

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
          {...props}
        />
      );
  }

  return (
    <div className={className}>
      {label && type !== "file" && type !== "radio-group" && (
        <label
          htmlFor={id}
          className="block text-gray-400 text-sm font-bold mb-2"
        >
          {label}
        </label>
      )}
      {label && type === "radio-group" && (
        <label className="block text-gray-400 text-sm font-bold mb-2">
          {label}
        </label>
      )}
      {inputElement}
    </div>
  );
}
