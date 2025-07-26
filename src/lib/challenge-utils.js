// src/lib/challenge-utils.js

/**
 * Calculates derived metrics for a trading challenge.
 * @param {object} challengeConfig - The configuration of the challenge.
 * Expected structure: { startingCapital: number, targetCapital: number, startDate: Date, targetDate: Date }
 * @param {Array<object>} tradeHistory - An array of trade objects relevant to the challenge.
 * Each trade should at least have: { pnl: number, rr?: number, date: Date }
 * @returns {object} Calculated metrics including currentCapital, progress, winRate, etc.
 */
export const calculateChallengeMetrics = (challengeConfig, tradeHistory) => {
  const { startingCapital, targetCapital, startDate, targetDate } = challengeConfig;

  // Ensure dates are proper Date objects for calculations
  const effectiveStartDate = startDate instanceof Date ? startDate : new Date(startDate);
  const effectiveTargetDate = targetDate instanceof Date ? targetDate : new Date(targetDate);


  // 1. Current Capital & Total PnL
  let currentCapital = parseFloat(startingCapital) || 0;
  let totalProfitLoss = 0;
  tradeHistory.forEach(trade => {
    totalProfitLoss += parseFloat(trade.pnl) || 0;
  });
  currentCapital = currentCapital + totalProfitLoss;

  // 2. Progress to Target
  const totalGrowthNeeded = (parseFloat(targetCapital) || 0) - (parseFloat(startingCapital) || 0);
  const growthAchieved = currentCapital - (parseFloat(startingCapital) || 0);
  let progressPercentage = 0;
  if (totalGrowthNeeded > 0) {
    progressPercentage = (growthAchieved / totalGrowthNeeded) * 100;
  }
  progressPercentage = Math.max(0, Math.min(100, progressPercentage)); // Cap between 0 and 100

  // 3. Days Remaining & Projected Date
  const today = new Date();
  today.setHours(0,0,0,0); // Normalize today to start of day for consistent day counting

  let daysRemaining = 0;
  if (effectiveTargetDate && effectiveTargetDate.getTime() > today.getTime()) {
    const diffTime = effectiveTargetDate.getTime() - today.getTime();
    daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  } else if (effectiveTargetDate && effectiveTargetDate.getTime() <= today.getTime()) {
      daysRemaining = 0; // Target date has passed or is today
  } else {
      daysRemaining = Infinity; // No valid target date set
  }
  daysRemaining = Math.max(0, daysRemaining); // Ensure non-negative

  // Format projected date (targetDate)
  const formattedProjectedDate = effectiveTargetDate ? effectiveTargetDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: '2-digit' }) : 'N/A';


  // 4. Daily Target
  let dailyTargetAmount = 0;
  // Calculate daily target only if target is not met and days remain
  if (daysRemaining > 0 && growthAchieved < totalGrowthNeeded) {
    dailyTargetAmount = (totalGrowthNeeded - growthAchieved) / daysRemaining;
  }

  // 5. Win Rate
  const totalTrades = tradeHistory.length;
  const winningTrades = tradeHistory.filter(trade => (parseFloat(trade.pnl) || 0) > 0).length;
  const winRate = totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0;

  // 6. Average Risk:Reward
  const totalRR = tradeHistory.reduce((sum, trade) => sum + (parseFloat(trade.rr) || 0), 0);
  const avgRiskReward = totalTrades > 0 ? (totalRR / totalTrades).toFixed(2) : 'N/A';

  // 7. Highest Profit Day
  let highestProfitDay = 0;
  const dailyPnL = {}; // Aggregates PnL per day: { 'YYYY-MM-DD': total_pnl_for_day }
  tradeHistory.forEach(trade => {
    const tradeDate = trade.date instanceof Date ? trade.date : new Date(trade.date); // Ensure it's a Date object
    if (tradeDate && !isNaN(tradeDate.getTime())) { // Check for valid date
      const dateString = tradeDate.toISOString().split('T')[0]; // YYYY-MM-DD
      dailyPnL[dateString] = (dailyPnL[dateString] || 0) + (parseFloat(trade.pnl) || 0);
    }
  });
  if (Object.keys(dailyPnL).length > 0) {
    highestProfitDay = Math.max(0, ...Object.values(dailyPnL)); // Ensure it's not negative if all days were losses
  }

  // 8. Max Drawdown (Simplified calculation based on PnL sequence)
  // This is a simplified equity curve drawdown calculation.
  let maxDrawdownPercentage = 0;
  let peakEquity = startingCapital;
  let currentEquityForDrawdown = startingCapital;

  tradeHistory.forEach(trade => {
    currentEquityForDrawdown += parseFloat(trade.pnl) || 0;
    if (currentEquityForDrawdown > peakEquity) {
      peakEquity = currentEquityForDrawdown;
    } else {
      // Calculate drawdown from the current peak
      if (peakEquity > 0) { // Avoid division by zero
        const drawdown = ((peakEquity - currentEquityForDrawdown) / peakEquity) * 100;
        maxDrawdownPercentage = Math.max(maxDrawdownPercentage, drawdown);
      }
    }
  });
  maxDrawdownPercentage = Math.max(0, maxDrawdownPercentage); // Ensure non-negative

  // 9. Trading Confidence Index
  const confidenceLevel = getConfidenceLevel(tradeHistory);

  return {
    currentCapital,
    totalProfitLoss,
    progressPercentage,
    daysRemaining,
    projectedDate: formattedProjectedDate,
    dailyTargetAmount,
    winRate,
    avgRiskReward,
    highestProfitDay,
    maxDrawdown: maxDrawdownPercentage, // Max drawdown as a percentage
    confidenceLevel,
  };
};

/**
 * Derives a confidence level based on recent trade performance.
 * This is a simplified example; real confidence might involve more complex logic
 * like consistency, adherence to risk rules, streak analysis, etc.
 *
 * @param {Array<object>} tradeHistory - Trade objects (must have `pnl` property).
 * @returns {string} 'Low Confidence', 'Medium Confidence', 'High Confidence', or 'N/A (Insufficient Data)'.
 */
export const getConfidenceLevel = (tradeHistory) => {
  if (!tradeHistory || tradeHistory.length < 5) {
    return 'N/A (Insufficient Data)';
  }

  const recentTrades = tradeHistory.slice(-10); // Look at last 10 trades
  if (recentTrades.length === 0) {
      return 'N/A (No Recent Trades)';
  }

  const recentWinningTrades = recentTrades.filter(trade => (parseFloat(trade.pnl) || 0) > 0).length;
  const recentWinRate = (recentWinningTrades / recentTrades.length) * 100;

  const totalRecentPnL = recentTrades.reduce((sum, trade) => sum + (parseFloat(trade.pnl) || 0), 0);
  const avgRecentPnL = totalRecentPnL / recentTrades.length;

  // Simple thresholds for confidence
  if (recentWinRate >= 65 && avgRecentPnL > 0) {
    return 'High Confidence';
  } else if (recentWinRate >= 45 && avgRecentPnL >= 0) {
    return 'Medium Confidence';
  } else {
    return 'Low Confidence';
  }
};