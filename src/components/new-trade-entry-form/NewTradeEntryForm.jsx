'use client'

import React, { useState } from 'react'
import GeneralTabContent from './GeneralTabContent'
import PsychologyTabContent from './PsychologyTabContent'
import { useTradeFormLogic } from '@/hooks/useTradeFormLogic'
import { toast } from 'react-toastify'

export default function NewTradeEntryForm({
  addTrade,
  updateTrade,
  onClose,
  tradeToEdit,
}) {
  const [step, setStep] = useState(1)

  const {
    formData,
    handleChange,
    handleCheckboxChange,
    handleSubmit,
    resetGeneral,
    resetPsychology,
  } = useTradeFormLogic(tradeToEdit, addTrade, updateTrade, onClose)

  const handleNext = (e) => {
    e.preventDefault()
    if (
      formData.marketType &&
      formData.symbol &&
      formData.date &&
      formData.time &&
      formData.entryPrice &&
      formData.quantity &&
      formData.exitPrice &&
      formData.tradeType &&
      formData.direction
    ) {
      setStep(2)
    } else {
      toast.error('Please fill in all required fields in the General tab.')
    }
  }

  const handleBack = () => {
    setStep(1)
  }

  const onSubmit = (e) => handleSubmit(e)

  return (
    <div className=" bg-[#23122d] rounded-lg shadow-xl text-white w-full h-[calc(100vh-80px)] flex flex-col">
      <div className="flex justify-between items-center px-6 py-3 border-b border-zinc-700">
        <h2 className=" font-semibold text-gray-100 text-2xl">
          {tradeToEdit ? 'Edit Trade' : 'Add New Trade'}
        </h2>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-100 text-4xl cursor-pointer"
            aria-label="Close form"
          >
            &times;
          </button>
        )}
      </div>

      <div className=" w-full px-5 py-2 font-bold text-xl md:text-3xl my-1 text-gray-200 border-b-2 border-gray-500">
        {step === 1 ? 'General ' : 'Psychology & Mindset '} Content
      </div>

      <form
        className="flex-grow space-y-6 px-6 py-2 overflow-y-auto scrollbar scrollbar-thumb-zinc-600 scrollbar-track-zinc-700 scrollbar-w-2"
        onSubmit={onSubmit}
      >
        {step === 1 && (
          <GeneralTabContent formData={formData} handleChange={handleChange} />
        )}

        {step === 2 && (
          <PsychologyTabContent
            formData={formData}
            handleChange={handleChange}
            handleCheckboxChange={handleCheckboxChange}
            tradeToEdit={tradeToEdit}
          />
        )}
      </form>

      <div className="flex justify-between space-x-4 pt-6 pb-4 px-6 border-t border-gray-500 bg-[#381648]">
        {step === 2 && (
          <button
            type="button"
            onClick={handleBack}
            className="px-6 py-2 rounded-md text-zinc-300 border border-zinc-600 hover:bg-zinc-700 hover:text-white transition-colors duration-200"
          >
            Back
          </button>
        )}
        <div className="flex justify-end flex-grow space-x-4">
          <button
            type="button"
            onClick={step === 1 ? resetGeneral : resetPsychology}
            className="px-6 py-2 rounded-md text-zinc-300 border border-zinc-600 hover:bg-zinc-700 hover:text-white transition-colors duration-200"
          >
            Reset
          </button>
          {step === 1 && (
            <button
              type="button"
              onClick={handleNext}
              className="px-6 py-2 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors duration-200"
            >
              Next
            </button>
          )}
          {step === 2 && (
            <button
              type="submit"
              onClick={onSubmit}
              className="px-6 py-2 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors duration-200"
            >
              {tradeToEdit ? 'Update Trade' : 'Save Trade'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
