import { useState, useEffect, useCallback } from 'react'
import { toast } from 'react-toastify'

const initialFormData = {
  marketType: 'Indian',
  symbol: '',
  date: '',
  time: '',
  entryPrice: '',
  exitPrice: '',
  quantity: '',
  totalAmount: '',
  stopLoss: '',
  target: '',
  tradeType: 'Select Trade Type',
  direction: 'Long',
  optionType: '',
  grossPnl: '',
  netPnl: '',
  pnlPercentage: '',
  riskReward: '',
  charges: '',
  strategyUsed: 'Select Strategy',
  outcomeSummary: 'Select Outcome Summary',
  tradeAnalysis: '',
  confidenceLevel: '5',
  emotionsBefore: 'Calm',
  emotionsAfter: 'Satisfied',
  notes: '',
  mistakes: '',
  mistakeChecklist: [],
  whatIDidWell: '',
  tags: '',
  screenshotUpload: null,
}

export const useTradeFormLogic = (
  tradeToEdit,
  addTrade,
  updateTrade,
  onClose,
) => {
  const [formData, setFormData] = useState(initialFormData)

  const calculateMetrics = useCallback(() => {
    setFormData((prevData) => {
      const newData = { ...prevData }
      const entry = parseFloat(newData.entryPrice)
      const qty = parseFloat(newData.quantity)
      const exit = parseFloat(newData.exitPrice)
      const stopLoss = parseFloat(newData.stopLoss)
      const target = parseFloat(newData.target)
      const charges = parseFloat(newData.charges) || 0

      let totalAmt = 0
      let grossPnl = 0
      let netPnl = 0
      let risk = 0
      let reward = 0
      let pnlPercentage = 0

      if (!isNaN(entry) && !isNaN(qty) && qty > 0) {
        totalAmt = entry * qty
      }
      newData.totalAmount = totalAmt.toFixed(2)

      if (!isNaN(entry) && !isNaN(exit) && !isNaN(qty) && qty > 0) {
        grossPnl =
          newData.direction === 'Long'
            ? (exit - entry) * qty
            : (entry - exit) * qty
      }
      netPnl = grossPnl - charges

      if (!isNaN(totalAmt) && totalAmt !== 0) {
        pnlPercentage = (netPnl / totalAmt) * 100
      }
      newData.grossPnl = grossPnl.toFixed(2)
      newData.netPnl = netPnl.toFixed(2)
      newData.pnlPercentage = pnlPercentage.toFixed(2)

      if (!isNaN(entry) && !isNaN(stopLoss) && !isNaN(target)) {
        if (newData.direction === 'Long') {
          risk = entry - stopLoss
          reward = target - entry
        } else {
          risk = stopLoss - entry
          reward = entry - target
        }
        newData.riskReward =
          risk > 0 && reward > 0 ? (reward / risk).toFixed(2) : ''
      } else {
        newData.riskReward = ''
      }

      return newData
    })
  }, [])

  useEffect(() => {
    if (tradeToEdit) {
      const formattedDate = tradeToEdit.date
        ? new Date(tradeToEdit.date).toISOString().split('T')[0]
        : ''
      setFormData({
        ...initialFormData,
        ...tradeToEdit,
        date: formattedDate,
        confidenceLevel: tradeToEdit.psychology?.confidenceLevel || '5',
        emotionsBefore: tradeToEdit.psychology?.emotionsBefore || 'Calm',
        emotionsAfter: tradeToEdit.psychology?.emotionsAfter || 'Satisfied',
        notes: tradeToEdit.psychology?.notes || '',
        mistakes: tradeToEdit.psychology?.mistakes || '',
        mistakeChecklist: tradeToEdit.psychology?.mistakeChecklist || [],
        whatIDidWell: tradeToEdit.psychology?.whatIDidWell || '',
        tags: Array.isArray(tradeToEdit.tags)
          ? tradeToEdit.tags.join(', ')
          : tradeToEdit.tags || '',
        screenshotUpload: null, // Don't preload file objects into state
      })
    } else {
      setFormData(initialFormData)
    }
  }, [tradeToEdit])

  useEffect(() => {
    calculateMetrics()
  }, [
    formData.entryPrice,
    formData.quantity,
    formData.exitPrice,
    formData.stopLoss,
    formData.target,
    formData.charges,
    formData.direction,
    calculateMetrics,
  ])

  const handleChange = useCallback((e) => {
    const { id, value, type, name, files } = e.target
    setFormData((prevData) => {
      if (type === 'radio') return { ...prevData, [name]: value }
      if (type === 'file') return { ...prevData, [id]: files[0] }
      if (type === 'number')
        return { ...prevData, [id]: value === '' ? '' : parseFloat(value) }
      return { ...prevData, [id]: value }
    })
  }, [])

  const handleCheckboxChange = useCallback((e) => {
    const { value, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      mistakeChecklist: checked
        ? [...prev.mistakeChecklist, value]
        : prev.mistakeChecklist.filter((item) => item !== value),
    }))
  }, [])

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault()

      const requiredFields = [
        'date',
        'symbol',
        'quantity',
        'entryPrice',
        'tradeType',
      ]
      for (let field of requiredFields) {
        if (
          !formData[field] ||
          (typeof formData[field] === 'string' &&
            (formData[field].trim() === '' ||
              formData[field] === 'Select Trade Type' ||
              formData[field] === 'Select Strategy' ||
              formData[field] === 'Select Outcome Summary'))
        ) {
          toast.error(`Please fill in the required field: ${field}`)
          return
        }
      }

      const tradeDataToSave = {
        ...formData,
        date:
          typeof formData.date === 'string'
            ? formData.date
            : new Date(formData.date).toISOString().split('T')[0],
        entryPrice: Number(formData.entryPrice) || 0,
        exitPrice: Number(formData.exitPrice) || 0,
        quantity: Number(formData.quantity) || 0,
        totalAmount: Number(formData.totalAmount) || 0,
        stopLoss: Number(formData.stopLoss) || 0,
        target: Number(formData.target) || 0,
        grossPnl: Number(formData.grossPnl) || 0,
        netPnl: Number(formData.netPnl) || 0,
        pnlPercentage: Number(formData.pnlPercentage) || 0,
        riskReward: Number(formData.riskReward) || 0,
        charges: Number(formData.charges) || 0,
        confidenceLevel: Number(formData.confidenceLevel) || 0,
        tags: Array.isArray(formData.tags)
          ? formData.tags.map((t) => t.trim())
          : formData.tags
          ? formData.tags.split(',').map((t) => t.trim())
          : [],
        screenshotUpload: formData.screenshotUpload
          ? formData.screenshotUpload.name
          : tradeToEdit?.screenshotUpload || null,
        strategyUsed: formData.strategyUsed,
        notes: formData.notes,
        whatIDidWell: formData.whatIDidWell,
      }

      try {
        if (tradeToEdit) {
          await updateTrade(tradeToEdit.id, tradeDataToSave)
        } else {
          await addTrade(tradeDataToSave)
        }

        if (!tradeToEdit) setFormData(initialFormData)
        if (onClose) onClose()
      } catch (error) {
        console.error('Failed to submit form:', error)
        toast.error('Failed to save trade. Please try again.')
      }
    },
    [formData, tradeToEdit, addTrade, updateTrade, onClose],
  )

  const handleReset = useCallback(() => {
    if (tradeToEdit) {
      setFormData(initialFormData)
      toast.info('Form reset to original values!')
    } else {
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
