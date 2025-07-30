import { useState, useEffect, useCallback } from 'react'
import { toast } from 'react-toastify'

// Define initial state with proper defaults for numbers (0 instead of "")
const initialFormData = {
  marketType: 'Indian',
  symbol: '',
  date: '',
  time: '',
  entryPrice: 0, // Changed to 0
  quantity: 0, // Changed to 0
  totalAmount: 0, // Changed to 0
  exitPrice: 0, // Changed to 0
  pnlAmount: 0, // Changed to 0
  pnlPercentage: 0, // Changed to 0
  direction: 'Long',
  optionType: '',
  stopLoss: 0, // Changed to 0
  target: 0, // Changed to 0
  riskReward: 0, // Changed to 0
  strategy: 'Select Strategy',
  outcomeSummary: 'Select Outcome Summary',
  tradeAnalysis: '',
  emotionsBefore: 'Calm',
  emotionsAfter: 'Satisfied',
  tradeNotes: '',
  mistakes: '',
  mistakeChecklist: [],
  whatDidWell: '',
  tags: '',
  screenshotUpload: null,
  charges: 0, // Changed to 0
  confidenceLevel: '5',
}

// IMPORTANT CHANGE HERE: addTrade, updateTrade, onClose are now arguments to the hook
export const useTradeFormLogic = (
  tradeToEdit,
  addTrade,
  updateTrade,
  onClose,
) => {
  const [formData, setFormData] = useState(initialFormData)

  // Effect to populate form data when tradeToEdit changes (for editing)
  useEffect(() => {
    if (tradeToEdit) {
      setFormData({
        marketType: tradeToEdit.marketType || 'Indian',
        symbol: tradeToEdit.symbol || '',
        date: tradeToEdit.date || '',
        time: tradeToEdit.time || '',
        entryPrice: tradeToEdit.entryPrice ?? 0, // Use nullish coalescing for numbers
        quantity: tradeToEdit.quantity ?? 0,
        totalAmount: tradeToEdit.totalAmount ?? 0,
        exitPrice: tradeToEdit.exitPrice ?? 0,
        pnlAmount: tradeToEdit.pnlAmount ?? 0,
        pnlPercentage: tradeToEdit.pnlPercentage ?? 0,
        direction: tradeToEdit.direction || 'Long',
        optionType: tradeToEdit.optionType || '',
        stopLoss: tradeToEdit.stopLoss ?? 0,
        target: tradeToEdit.target ?? 0,
        riskReward: tradeToEdit.riskReward ?? 0,
        strategy: tradeToEdit.strategy || 'Select Strategy',
        outcomeSummary: tradeToEdit.outcomeSummary || 'Select Outcome Summary',
        tradeAnalysis: tradeToEdit.tradeAnalysis || '',
        emotionsBefore: tradeToEdit.emotionsBefore || 'Calm',
        emotionsAfter: tradeToEdit.emotionsAfter || 'Satisfied',
        tradeNotes: tradeToEdit.tradeNotes || '',
        mistakes: tradeToEdit.mistakeChecklist || [],
        whatDidWell: tradeToEdit.whatDidWell || '',
        tags: tradeToEdit.tags || '',
        screenshotUpload: null, // Always reset file input, as you can't pre-fill it with a file object directly
        charges: tradeToEdit.charges ?? 0,
        confidenceLevel: tradeToEdit.confidenceLevel || '5',
      })
    } else {
      // Ensure initialFormData is always used for new trades
      setFormData(initialFormData)
    }
  }, [tradeToEdit])

  // Effect to calculate Total Amount
  useEffect(() => {
    const entry = parseFloat(formData.entryPrice)
    const qty = parseFloat(formData.quantity)
    let calculatedTotalAmount = 0 // Default to 0

    if (!isNaN(entry) && !isNaN(qty) && qty > 0) {
      calculatedTotalAmount = entry * qty
    }
    // Only update if there's a significant change to prevent unnecessary re-renders
    if (
      parseFloat(formData.totalAmount).toFixed(2) !==
      calculatedTotalAmount.toFixed(2)
    ) {
      setFormData((prev) => ({
        ...prev,
        totalAmount: calculatedTotalAmount.toFixed(2),
      }))
    }
  }, [formData.entryPrice, formData.quantity, formData.totalAmount])

  // Effect to calculate P&L Amount and Percentage
  useEffect(() => {
    const entry = parseFloat(formData.entryPrice)
    const exit = parseFloat(formData.exitPrice)
    const qty = parseFloat(formData.quantity)
    const totalAmt = parseFloat(formData.totalAmount) // Use the calculated totalAmount
    const charges = parseFloat(formData.charges) || 0 // Ensure charges is a number, defaulting to 0

    let grossPnl = 0
    let netPnl = 0
    let calculatedPnlPercentage = 0

    // Calculate gross P&L if entry, exit, and quantity are valid
    if (!isNaN(entry) && !isNaN(exit) && !isNaN(qty) && qty > 0) {
      if (formData.direction === 'Long') {
        grossPnl = (exit - entry) * qty
      } else {
        // Short
        grossPnl = (entry - exit) * qty
      }
    }

    // Calculate net P&L after charges
    netPnl = grossPnl - charges

    // Calculate P&L Percentage if total amount is valid and non-zero
    if (!isNaN(totalAmt) && totalAmt !== 0) {
      calculatedPnlPercentage = (netPnl / totalAmt) * 100
    }

    // Update formData for pnlAmount
    const newPnlAmount = netPnl.toFixed(2)
    if (parseFloat(formData.pnlAmount).toFixed(2) !== newPnlAmount) {
      setFormData((prev) => ({ ...prev, pnlAmount: newPnlAmount }))
    }

    // Update formData for pnlPercentage
    const newPnlPercentage = calculatedPnlPercentage.toFixed(2)
    if (parseFloat(formData.pnlPercentage).toFixed(2) !== newPnlPercentage) {
      setFormData((prev) => ({ ...prev, pnlPercentage: newPnlPercentage }))
    }
  }, [
    formData.entryPrice,
    formData.exitPrice,
    formData.direction,
    formData.quantity,
    formData.totalAmount,
    formData.charges,
  ])

  // Effect to calculate R:R Ratio
  useEffect(() => {
    const entry = parseFloat(formData.entryPrice)
    const stopLoss = parseFloat(formData.stopLoss)
    const target = parseFloat(formData.target)
    let calculatedRiskReward = 0 // Default to 0

    if (!isNaN(entry) && !isNaN(stopLoss) && !isNaN(target)) {
      let risk, reward
      if (formData.direction === 'Long') {
        risk = entry - stopLoss
        reward = target - entry
      } else {
        // Short
        risk = stopLoss - entry
        reward = entry - target
      }

      // Ensure risk and reward are positive and risk is not zero to avoid division by zero
      if (risk > 0 && reward > 0) {
        calculatedRiskReward = reward / risk
      }
    }

    const newRiskReward = calculatedRiskReward.toFixed(2)
    if (parseFloat(formData.riskReward).toFixed(2) !== newRiskReward) {
      setFormData((prev) => ({ ...prev, riskReward: newRiskReward }))
    }
  }, [
    formData.entryPrice,
    formData.stopLoss,
    formData.target,
    formData.direction,
    formData.riskReward,
  ])

  // General handleChange for all input types
  const handleChange = useCallback((e) => {
    const { id, value, type, name } = e.target

    setFormData((prevData) => {
      let newValue = value
      // Convert number inputs to actual numbers or 0 if empty/invalid for direct numerical use
      if (type === 'number') {
        newValue = value === '' ? 0 : parseFloat(value)
        if (isNaN(newValue)) newValue = 0 // Fallback for invalid number input
      } else if (type === 'radio') {
        return { ...prevData, [name]: value } // Radio buttons use 'name' for grouping
      } else if (type === 'file') {
        return { ...prevData, [id]: e.target.files[0] }
      }
      return { ...prevData, [id]: newValue }
    })
  }, []) // Empty dependency array means this function is memoized once

  // Handler for checkboxes (specific to mistakeChecklist)
  const handleCheckboxChange = useCallback((e) => {
    const { value, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      mistakeChecklist: checked
        ? [...prev.mistakeChecklist, value]
        : prev.mistakeChecklist.filter((item) => item !== value),
    }))
  }, []) // Empty dependency array means this function is memoized once

  // Submission handler
  // Removed addTrade, updateTrade, onClose as arguments to handleSubmit,
  // because they are now part of the hook's arguments and thus its scope.
  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault()

      const requiredFields = [
        'date',
        'time',
        'symbol',
        'quantity',
        'entryPrice',
      ]
      for (let field of requiredFields) {
        if (
          typeof formData[field] === 'number' &&
          formData[field] === 0 &&
          field !== 'quantity' && // quantity can legitimately be 0 if not yet entered
          field !== 'entryPrice' // entryPrice can legitimately be 0 if not yet entered
        ) {
          // This block currently allows 0 for quantity and entryPrice in validation.
          // If 0 quantity/entryPrice is NOT acceptable, adjust this logic.
          // For other number fields, if 0 is considered "not filled", you might need more specific validation.
        } else if (
          (typeof formData[field] === 'string' &&
            formData[field].trim() === '') ||
          formData[field] === null ||
          formData[field] === undefined
        ) {
          toast.error(`Please fill in all required trade details: ${field}`)
          return
        }
      }

      // Prepare data for saving, ensuring all numbers are actual numbers
      const tradeDataToSave = {
        ...formData,
        quantity: Number(formData.quantity) || 0, // Ensure numeric, defaults to 0
        entryPrice: Number(formData.entryPrice) || 0,
        exitPrice: Number(formData.exitPrice) || 0,
        totalAmount: Number(formData.totalAmount) || 0,
        pnlAmount: Number(formData.pnlAmount) || 0,
        pnlPercentage: Number(formData.pnlPercentage) || 0,
        stopLoss: Number(formData.stopLoss) || 0,
        target: Number(formData.target) || 0,
        charges: Number(formData.charges) || 0, // Crucial fix: ensure 0 if empty
        riskReward: Number(formData.riskReward) || 0,
        screenshotUpload: formData.screenshotUpload
          ? formData.screenshotUpload.name
          : tradeToEdit?.screenshotUpload || null,
        confidenceLevel: Number(formData.confidenceLevel),
      }

      console.log('Saving Trade Data:', tradeDataToSave) // For debugging: check what's being saved

      if (tradeToEdit) {
        updateTrade({ ...tradeDataToSave, id: tradeToEdit.id })
        toast.success('Trade updated successfully!')
      } else {
        addTrade(tradeDataToSave)
        toast.success('Trade submitted and added to history!')
      }

      // Reset form only for new trade entries
      if (!tradeToEdit) {
        setFormData(initialFormData)
      }
      if (onClose) {
        onClose()
      }
    },
    // IMPORTANT: Now add addTrade, updateTrade, and onClose to the dependency array
    // along with formData and tradeToEdit.
    [formData, tradeToEdit, addTrade, updateTrade, onClose],
  )

  // Reset handler
  const handleReset = useCallback(() => {
    if (tradeToEdit) {
      // Reset to original tradeToEdit values (or their defaults)
      setFormData({
        marketType: tradeToEdit.marketType || 'Indian',
        symbol: tradeToEdit.symbol || '',
        date: tradeToEdit.date || '',
        time: tradeToEdit.time || '',
        entryPrice: tradeToEdit.entryPrice ?? 0,
        quantity: tradeToEdit.quantity ?? 0,
        totalAmount: tradeToEdit.totalAmount ?? 0,
        exitPrice: tradeToEdit.exitPrice ?? 0,
        pnlAmount: tradeToEdit.pnlAmount ?? 0,
        pnlPercentage: tradeToEdit.pnlPercentage ?? 0,
        direction: tradeToEdit.direction || 'Long',
        optionType: tradeToEdit.optionType || '',
        stopLoss: tradeToEdit.stopLoss ?? 0,
        target: tradeToEdit.target ?? 0,
        riskReward: tradeToEdit.riskReward ?? 0,
        strategy: tradeToEdit.strategy || 'Select Strategy',
        outcomeSummary: tradeToEdit.outcomeSummary || 'Select Outcome Summary',
        tradeAnalysis: tradeToEdit.tradeAnalysis || '',
        emotionsBefore: tradeToEdit.emotionsBefore || 'Calm',
        emotionsAfter: tradeToEdit.emotionsAfter || 'Satisfied',
        tradeNotes: tradeToEdit.tradeNotes || '',
        mistakes: tradeToEdit.mistakeChecklist || [],
        whatDidWell: tradeToEdit.whatDidWell || '',
        tags: tradeToEdit.tags || '',
        screenshotUpload: null,
        charges: tradeToEdit.charges ?? 0,
        confidenceLevel: tradeToEdit.confidenceLevel || '5',
      })
      toast.info('Form reset to original values!')
    } else {
      // Reset to initial blank form for new entries
      setFormData(initialFormData)
      toast.info('Form reset!')
    }
  }, [tradeToEdit])

  return {
    formData,
    handleChange,
    handleCheckboxChange,
    handleSubmit,
    handleReset,
  }
}
