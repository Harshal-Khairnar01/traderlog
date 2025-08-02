import {
  parseISO,
  isValid,
  formatISO,
  setHours,
  setMinutes,
  setSeconds,
  parse,
} from 'date-fns'

export const calculateGrossPnl = (trade) => {
  if (trade.entryPrice && trade.exitPrice && trade.quantity) {
    const entry = parseFloat(trade.entryPrice)
    const exit = parseFloat(trade.exitPrice)
    const qty = parseFloat(trade.quantity)
    return trade.direction === 'Long'
      ? (exit - entry) * qty
      : (entry - exit) * qty
  }
  return 0
}

export const getTradeCharges = (trade) => parseFloat(trade.charges) ?? 0

export const processTradeData = (trades) => {
  return trades.map((trade) => {
    let combinedDateTime = null
    let baseDate = null
    if (trade.date) {
      const parsedIsoDate = parseISO(trade.date)
      if (isValid(parsedIsoDate)) {
        baseDate = parsedIsoDate
      }
    }
    if (baseDate && trade.time) {
      const timeParts = trade.time.split(':').map(Number)
      const hours = timeParts[0]
      const minutes = timeParts[1]
      const seconds = timeParts[2] || 0
      if (!isNaN(hours) && !isNaN(minutes) && !isNaN(seconds)) {
        let dateWithTime = setHours(baseDate, hours)
        dateWithTime = setMinutes(dateWithTime, minutes)
        dateWithTime = setSeconds(dateWithTime, seconds)
        combinedDateTime = formatISO(dateWithTime)
      } else {
        combinedDateTime = formatISO(baseDate)
      }
    } else if (baseDate) {
      combinedDateTime = formatISO(baseDate)
    }

    return {
      ...trade,
      dateTime: combinedDateTime,
      pnlAmount: parseFloat(trade.netPnl ?? trade.pnlAmount ?? 0),
      grossPnl: calculateGrossPnl(trade),
      charges: getTradeCharges(trade),
    }
  })
}

export const buildPayload = (formData) => {
  const dateOnly = formData.date
    ? new Date(formData.date).toISOString().split('T')[0]
    : ''

  const timeOnly = formData.time
    ? new Date(`2000-01-01T${formData.time}`).toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
      })
    : ''

  let payloadDateTime = null
  if (formData.date && formData.time) {
    let baseDate = parse(formData.date, 'yyyy-MM-dd', new Date())
    if (isValid(baseDate)) {
      const timeParts = formData.time.split(':').map(Number)
      const hours = timeParts[0]
      const minutes = timeParts[1]
      const seconds = timeParts[2] || 0
      if (!isNaN(hours) && !isNaN(minutes) && !isNaN(seconds)) {
        let dateWithTime = setHours(baseDate, hours)
        dateWithTime = setMinutes(dateWithTime, minutes)
        dateWithTime = setSeconds(dateWithTime, seconds)
        payloadDateTime = formatISO(dateWithTime)
      } else {
        payloadDateTime = formatISO(baseDate)
      }
    }
  } else if (formData.date) {
    const parsedDate = parse(formData.date, 'yyyy-MM-dd', new Date())
    if (isValid(parsedDate)) {
      payloadDateTime = formatISO(parsedDate)
    }
  }

  return {
    marketType: formData.marketType,
    symbol: formData.symbol,
    date: dateOnly,
    time: timeOnly,
    entryPrice: Number(formData.entryPrice) || 0,
    exitPrice: Number(formData.exitPrice) || 0,
    quantity: Number(formData.quantity) || 0,
    totalAmount: Number(formData.totalAmount) || 0,
    stopLoss: Number(formData.stopLoss) || 0,
    target: Number(formData.target) || 0,
    tradeType: formData.tradeType,
    direction: formData.direction,
    optionType: formData.optionType,
    grossPnl: calculateGrossPnl(formData),
    netPnl: Number(formData.netPnl) || 0,
    pnlPercentage: Number(formData.pnlPercentage) || 0,
    riskReward: Number(formData.riskReward) || 0,
    charges: Number(formData.charges) || 0,
    strategyUsed: formData.strategyUsed,
    outcomeSummary: formData.outcomeSummary,
    tradeAnalysis: formData.tradeAnalysis,
    confidenceLevel: Number(formData.confidenceLevel) || 0,
    emotionsBefore: formData.emotionsBefore,
    emotionsAfter: formData.emotionsAfter,
    notes: formData.notes,
    mistakes: formData.mistakes,
    mistakeChecklist: formData.mistakeChecklist,
    whatIDidWell: formData.whatIDidWell,
    tags: Array.isArray(formData.tags)
      ? formData.tags.map((t) => String(t).trim())
      : formData.tags
      ? String(formData.tags)
          .split(',')
          .map((t) => t.trim())
      : [],
    screenshotUpload: formData.screenshotUpload,
    dateTime: payloadDateTime,
  }
}
