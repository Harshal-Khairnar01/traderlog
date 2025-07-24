import { useState, useEffect, useCallback } from 'react';

export const usePerformanceMetrics = (tradeHistory) => {
  const [metrics, setMetrics] = useState({
    winningTrades: 0,
    losingTrades: 0,
    breakEvenTrades: 0,
    avgWin: 0,
    avgLoss: 0,
    winRate: 0,
    expectancy: 0,
    totalTrades: 0,
    dailyWinDays: 0,
    dailyLossDays: 0,
    dailyBreakEvenDays: 0,
    mostProfitableDay: { date: 'N/A', pnl: 0 },
    leastProfitableDay: { date: 'N/A', pnl: 0 },
    avgWinPerDay: 0,
    avgLossPerDay: 0,
    avgCapitalUsedPerTrade: 0,
    mostProfitableStrategy: { strategy: 'N/A', pnl: 0 },
    consecutiveWins: 0,
    consecutiveLosses: 0,
    tradingDays: 0,
    consecutiveWinDays: 0,
    consecutiveLossDays: 0,
    setupEffectiveness: {},
    mostTradedSymbol: { symbol: 'N/A', count: 0 },
    mostProfitableSymbol: { symbol: 'N/A', pnl: 0 },
    leastProfitableSymbol: { symbol: 'N/A', pnl: 0 },
    maxCapitalUsed: 0,
    minCapitalUsed: 0,
    avgCapitalUsed: 0,
    pnlAtMaxCapital: 0,
    pnlAtMinCapital: 0,
    maxQuantity: 0,
    minQuantity: 0,
    avgQuantity: 0,
    pnlAtMaxQuantity: 0,
    pnlAtMinQuantity: 0,
    weekdayMetrics: {
      Monday: { totalRR: 0, count: 0, wins: 0, losses: 0, avgRR: 0, winRate: 0 },
      Tuesday: { totalRR: 0, count: 0, wins: 0, losses: 0, avgRR: 0, winRate: 0 },
      Wednesday: { totalRR: 0, count: 0, wins: 0, losses: 0, avgRR: 0, winRate: 0 },
      Thursday: { totalRR: 0, count: 0, wins: 0, losses: 0, avgRR: 0, winRate: 0 },
      Friday: { totalRR: 0, count: 0, wins: 0, losses: 0, avgRR: 0, winRate: 0 },
    },
    avgTradesPerDay: 0,
    maxTradesInADay: 0,
    daysWithOnly1Trade: 0,
    overtradingDays: 0,
    plannedRiskRewardRatio: 0,
    realizedRiskRewardRatio: 0,
    maxDrawdown: 0,
    expectancyPerR: 0,
  });

  const calculateMetrics = useCallback(() => {
    if (!tradeHistory || tradeHistory.length === 0) {
      setMetrics((prev) => ({
        ...prev,
        totalTrades: 0,
        plannedRiskRewardRatio: 0,
        realizedRiskRewardRatio: 0,
        maxDrawdown: 0,
        expectancyPerR: 0,
        avgLoss: 0,
      }));
      return;
    }

    let winningTrades = 0;
    let losingTrades = 0;
    let breakEvenTrades = 0;
    let totalWinAmount = 0;
    let totalLossAmount = 0;
    let totalRiskRewardSum = 0;
    let riskRewardCount = 0;
    let totalCapitalUsed = 0;
    let capitalUsedCount = 0;
    const pnlByDate = {};
    const tradesByDate = {};
    const strategyPerformance = {};
    const symbolPerformance = {};
    const weekdayTrades = {};
    let currentConsecutiveWins = 0;
    let maxConsecutiveWins = 0;
    let currentConsecutiveLosses = 0;
    let maxConsecutiveLosses = 0;
    let maxCapital = -Infinity;
    let minCapital = Infinity;
    let pnlAtMaxCapital = 0;
    let pnlAtMinCapital = 0;
    let maxQty = -Infinity;
    let minQty = Infinity;
    let pnlAtMaxQuantity = 0;
    let pnlAtMinQuantity = 0;
    let totalQuantity = 0;
    let quantityCount = 0;
    let totalPlannedRisk = 0;
    let totalPlannedReward = 0;
    let plannedRRCount = 0;
    let cumulativePnl = 0;
    let peakPnl = 0;
    let maxDrawdown = 0;

    tradeHistory.forEach((trade) => {
      const pnl = trade.pnlAmount || 0;
      const capitalUsed = trade.totalAmount || 0;
      const quantity = trade.quantity || 0;
      const strategy = trade.strategy || 'Unknown';
      const symbol = trade.symbol || 'Unknown';
      const tradeDate = trade.date;
      cumulativePnl += pnl;
      peakPnl = Math.max(peakPnl, cumulativePnl);
      maxDrawdown = Math.max(maxDrawdown, peakPnl - cumulativePnl);

      if (pnl > 0) {
        winningTrades++;
        totalWinAmount += pnl;
      } else if (pnl < 0) {
        losingTrades++;
        totalLossAmount += pnl;
      } else {
        breakEvenTrades++;
      }

      if (trade.riskReward && typeof trade.riskReward === 'string' && trade.riskReward.includes(':')) {
        const [riskStr, rewardStr] = trade.riskReward.split(':');
        const risk = parseFloat(riskStr);
        const reward = parseFloat(rewardStr);
        if (!isNaN(risk) && !isNaN(reward) && risk !== 0) {
          totalRiskRewardSum += (reward / risk);
          riskRewardCount++;
        }
      }

      const entry = trade.entryPrice;
      const stopLoss = trade.stopLoss;
      const target = trade.target;
      const direction = trade.direction;
      if (!isNaN(entry) && !isNaN(stopLoss) && !isNaN(target) && entry !== stopLoss) {
        let plannedRisk = 0;
        let plannedReward = 0;
        if (direction === 'Long') {
          plannedRisk = Math.abs(entry - stopLoss);
          plannedReward = Math.abs(target - entry);
        } else if (direction === 'Short') {
          plannedRisk = Math.abs(stopLoss - entry);
          plannedReward = Math.abs(entry - target);
        }
        if (plannedRisk > 0) {
          totalPlannedRisk += plannedRisk;
          totalPlannedReward += plannedReward;
          plannedRRCount++;
        }
      }

      totalCapitalUsed += capitalUsed;
      capitalUsedCount++;

      if (capitalUsed > maxCapital) {
        maxCapital = capitalUsed;
        pnlAtMaxCapital = pnl;
      }
      if (capitalUsed < minCapital) {
        minCapital = capitalUsed;
        pnlAtMinCapital = pnl;
      }

      totalQuantity += quantity;
      quantityCount++;

      if (quantity > maxQty) {
        maxQty = quantity;
        pnlAtMaxQuantity = pnl;
      }
      if (quantity < minQty) {
        minQty = quantity;
        pnlAtMinQuantity = pnl;
      }

      pnlByDate[tradeDate] = (pnlByDate[tradeDate] || 0) + pnl;
      tradesByDate[tradeDate] = (tradesByDate[tradeDate] || 0) + 1;

      if (!strategyPerformance[strategy]) {
        strategyPerformance[strategy] = { wins: 0, losses: 0, totalTrades: 0, pnl: 0 };
      }
      if (pnl > 0) strategyPerformance[strategy].wins++;
      else if (pnl < 0) strategyPerformance[strategy].losses++;
      strategyPerformance[strategy].totalTrades++;
      strategyPerformance[strategy].pnl += pnl;

      if (!symbolPerformance[symbol]) {
        symbolPerformance[symbol] = { count: 0, pnl: 0 };
      }
      symbolPerformance[symbol].count++;
      symbolPerformance[symbol].pnl += pnl;

      if (pnl > 0) {
        currentConsecutiveWins++;
        maxConsecutiveWins = Math.max(maxConsecutiveWins, currentConsecutiveWins);
        currentConsecutiveLosses = 0;
      } else if (pnl < 0) {
        currentConsecutiveLosses++;
        maxConsecutiveLosses = Math.max(maxConsecutiveLosses, currentConsecutiveLosses);
        currentConsecutiveWins = 0;
      } else {
        currentConsecutiveWins = 0;
        currentConsecutiveLosses = 0;
      }

      const dateObj = new Date(tradeDate);
      const dayOfWeek = dateObj.toLocaleString('en-US', { weekday: 'long' });
      const weekdayMap = {
        'Monday': 0, 'Tuesday': 1, 'Wednesday': 2, 'Thursday': 3, 'Friday': 4,
        'Saturday': 5, 'Sunday': 6
      };
      const dayIndex = weekdayMap[dayOfWeek];

      if (dayIndex >= 0 && dayIndex <= 4) {
        if (!weekdayTrades[dayOfWeek]) {
          weekdayTrades[dayOfWeek] = { totalRR: 0, count: 0, wins: 0, losses: 0 };
        }
        if (trade.riskReward && typeof trade.riskReward === 'string' && trade.riskReward.includes(':')) {
          const [riskVal, rewardVal] = trade.riskReward.split(':').map(parseFloat);
          if (!isNaN(riskVal) && !isNaN(rewardVal) && riskVal !== 0) {
            weekdayTrades[dayOfWeek].totalRR += (rewardVal / riskVal);
            weekdayTrades[dayOfWeek].count++;
          }
        }
        if (pnl > 0) weekdayTrades[dayOfWeek].wins++;
        else if (pnl < 0) weekdayTrades[dayOfWeek].losses++;
      }
    });

    const totalTrades = tradeHistory.length;
    const avgWin = winningTrades > 0 ? totalWinAmount / winningTrades : 0;
    const avgLoss = losingTrades > 0 ? totalLossAmount / losingTrades : 0;
    const winRate = totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0;
    const expectancy = (winRate / 100) * avgWin + ((100 - winRate) / 100) * avgLoss;

    let dailyWinDays = 0;
    let dailyLossDays = 0;
    let dailyBreakEvenDays = 0;
    let mostProfitableDay = { date: 'N/A', pnl: -Infinity };
    let leastProfitableDay = { date: 'N/A', pnl: Infinity };
    let totalDailyWinPnl = 0;
    let totalDailyLossPnl = 0;
    let tradingDays = Object.keys(pnlByDate).length;
    let maxTradesInADay = 0;
    let daysWithOnly1Trade = 0;
    let overtradingDays = 0;
    let sortedDates = Object.keys(pnlByDate).sort();
    let currentConsecutiveWinDays = 0;
    let maxConsecutiveWinDays = 0;
    let currentConsecutiveLossDays = 0;
    let maxConsecutiveLossDays = 0;

    for (let i = 0; i < sortedDates.length; i++) {
      const date = sortedDates[i];
      const pnl = pnlByDate[date];
      const tradesCount = tradesByDate[date];
      if (pnl > 0) {
        dailyWinDays++;
        totalDailyWinPnl += pnl;
        currentConsecutiveWinDays++;
        maxConsecutiveWinDays = Math.max(maxConsecutiveWinDays, currentConsecutiveWinDays);
        currentConsecutiveLossDays = 0;
      } else if (pnl < 0) {
        dailyLossDays++;
        totalDailyLossPnl += pnl;
        currentConsecutiveLossDays++;
        maxConsecutiveLossDays = Math.max(maxConsecutiveLossDays, currentConsecutiveLossDays);
        currentConsecutiveWinDays = 0;
      } else {
        dailyBreakEvenDays++;
        currentConsecutiveWinDays = 0;
        currentConsecutiveLossDays = 0;
      }
      if (pnl > mostProfitableDay.pnl) {
        mostProfitableDay = { date, pnl };
      }
      if (pnl < leastProfitableDay.pnl) {
        leastProfitableDay = { date, pnl };
      }
      maxTradesInADay = Math.max(maxTradesInADay, tradesCount);
      if (tradesCount === 1) daysWithOnly1Trade++;
      if (tradesCount > 7) overtradingDays++;
    }

    const avgWinPerDay = dailyWinDays > 0 ? totalDailyWinPnl / dailyWinDays : 0;
    const avgLossPerDay = dailyLossDays > 0 ? totalDailyLossPnl / dailyLossDays : 0;
    const avgTradesPerDay = tradingDays > 0 ? totalTrades / tradingDays : 0;
    const mostProfitableStrategy = Object.entries(strategyPerformance)
      .reduce((max, [strategy, data]) => (data.pnl > max.pnl ? { strategy, pnl: data.pnl } : max), { strategy: 'N/A', pnl: -Infinity });
    const mostTradedSymbol = Object.entries(symbolPerformance)
      .reduce((max, [symbol, data]) => (data.count > max.count ? { symbol, count: data.count } : max), { symbol: 'N/A', count: 0 });
    const mostProfitableSymbol = Object.entries(symbolPerformance)
      .reduce((max, [symbol, data]) => (data.pnl > max.pnl ? { symbol, pnl: data.pnl } : max), { symbol: 'N/A', pnl: -Infinity });
    const leastProfitableSymbol = Object.entries(symbolPerformance)
      .reduce((min, [symbol, data]) => (data.pnl < min.pnl ? { symbol, pnl: data.pnl } : min), { symbol: 'N/A', pnl: Infinity });
    const setupEffectiveness = Object.fromEntries(
      Object.entries(strategyPerformance).map(([strategy, data]) => [
        strategy,
        {
          totalTrades: data.totalTrades,
          winRate: data.totalTrades > 0 ? (data.wins / data.totalTrades) * 100 : 0,
        },
      ])
    );
    const calculatedWeekdayMetrics = {};
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    days.forEach(day => {
      const data = weekdayTrades[day] || { totalRR: 0, count: 0, wins: 0, losses: 0 };
      const avgRR = data.count > 0 ? data.totalRR / data.count : 0;
      const winRate = (data.wins + data.losses) > 0 ? (data.wins / (data.wins + data.losses)) * 100 : 0;
      calculatedWeekdayMetrics[day] = { ...data, avgRR, winRate };
    });
    const plannedRiskRewardRatio = plannedRRCount > 0 && totalPlannedRisk > 0 ? (totalPlannedReward / totalPlannedRisk) : 0;
    const realizedRiskRewardRatio = totalLossAmount !== 0 ? Math.abs(avgWin / avgLoss) : 0;
    const expectancyPerR = (avgLoss !== 0) ? expectancy / Math.abs(avgLoss) : 0;

    setMetrics({
      winningTrades,
      losingTrades,
      breakEvenTrades,
      avgWin: avgWin,
      avgLoss: avgLoss,
      winRate: winRate,
      expectancy: expectancy,
      totalTrades,
      dailyWinDays,
      dailyLossDays,
      dailyBreakEvenDays,
      mostProfitableDay: mostProfitableDay.pnl !== -Infinity ? mostProfitableDay : { date: 'N/A', pnl: 0 },
      leastProfitableDay: leastProfitableDay.pnl !== Infinity ? leastProfitableDay : { date: 'N/A', pnl: 0 },
      avgWinPerDay,
      avgLossPerDay,
      avgCapitalUsedPerTrade: capitalUsedCount > 0 ? totalCapitalUsed / capitalUsedCount : 0,
      mostProfitableStrategy,
      consecutiveWins: maxConsecutiveWins,
      consecutiveLosses: maxConsecutiveLosses,
      tradingDays,
      consecutiveWinDays: maxConsecutiveWinDays,
      consecutiveLossDays: maxConsecutiveLossDays,
      setupEffectiveness,
      mostTradedSymbol,
      mostProfitableSymbol: mostProfitableSymbol.pnl !== -Infinity ? mostProfitableSymbol : { symbol: 'N/A', pnl: 0 },
      leastProfitableSymbol: leastProfitableSymbol.pnl !== Infinity ? leastProfitableSymbol : { symbol: 'N/A', pnl: 0 },
      maxCapitalUsed: maxCapital !== -Infinity ? maxCapital : 0,
      minCapitalUsed: minCapital !== Infinity ? minCapital : 0,
      avgCapitalUsed: capitalUsedCount > 0 ? totalCapitalUsed / capitalUsedCount : 0,
      pnlAtMaxCapital: pnlAtMaxCapital,
      pnlAtMinCapital: pnlAtMinCapital,
      maxQuantity: maxQty !== -Infinity ? maxQty : 0,
      minQuantity: minQty !== Infinity ? minQty : 0,
      avgQuantity: quantityCount > 0 ? totalQuantity / quantityCount : 0,
      pnlAtMaxQuantity: pnlAtMaxQuantity,
      pnlAtMinQuantity: pnlAtMinQuantity,
      weekdayMetrics: calculatedWeekdayMetrics,
      avgTradesPerDay,
      maxTradesInADay,
      daysWithOnly1Trade,
      overtradingDays,
      plannedRiskRewardRatio,
      realizedRiskRewardRatio,
      maxDrawdown,
      expectancyPerR,
    });
  }, [tradeHistory]);

  useEffect(() => {
    calculateMetrics();
  }, [tradeHistory, calculateMetrics]);

  return metrics;
};