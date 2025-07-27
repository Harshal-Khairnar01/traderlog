// hooks/useTradeCalculations.js
import { useMemo } from "react";

export const useTradeCalculations = (tradeHistory) => {
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const monthlyTrades = useMemo(() => {
    return tradeHistory.filter((t) => {
      const tradeDate = new Date(t.date); // Assuming t.date is a string 'YYYY-MM-DD'
      return (
        tradeDate.getMonth() === currentMonth &&
        tradeDate.getFullYear() === currentYear
      );
    });
  }, [tradeHistory, currentMonth, currentYear]);

  const highestPnl = useMemo(() => {
    if (tradeHistory.length === 0) return 0;
    const allPnls = tradeHistory.map((t) => t.pnlAmount);
    return Math.max(...allPnls);
  }, [tradeHistory]);

  const tradesThisMonthCount = monthlyTrades.length;

  const winRate = useMemo(() => {
    if (monthlyTrades.length === 0) return 0;
    const winningTrades = monthlyTrades.filter((t) => t.pnlAmount > 0).length;
    return (winningTrades / monthlyTrades.length) * 100;
  }, [monthlyTrades]);

  const avgRiskReward = useMemo(() => {
    if (monthlyTrades.length === 0) return "N/A";
    const positiveTrades = monthlyTrades.filter((t) => t.pnlAmount > 0);
    const negativeTrades = monthlyTrades.filter((t) => t.pnlAmount < 0);
    const avgWinPnl =
      positiveTrades.length > 0
        ? positiveTrades.reduce((sum, t) => sum + t.pnlAmount, 0) /
          positiveTrades.length
        : 0;
    const avgLossPnl =
      negativeTrades.length > 0
        ? negativeTrades.reduce((sum, t) => sum + t.pnlAmount, 0) /
          negativeTrades.length
        : 0;
    if (avgWinPnl > 0 && avgLossPnl < 0) {
      return `${(avgWinPnl / Math.abs(avgLossPnl)).toFixed(2)}:1`;
    } else if (avgWinPnl > 0) {
      return "Wins Only";
    } else if (avgLossPnl < 0) {
      return "Losses Only";
    } else {
      return "0:0";
    }
  }, [monthlyTrades]);

  const cumulativePnlData = useMemo(() => {
    if (tradeHistory.length === 0) return [];
    const sortedTrades = [...tradeHistory].sort(
      (a, b) => a.dateTime.getTime() - b.dateTime.getTime()
    );
    let cumulativeSum = 0;
    const data = sortedTrades.map((trade) => {
      cumulativeSum += trade.pnlAmount;
      return {
        name: `${trade.date} ${trade.time}`,
        pnl: cumulativeSum,
      };
    });
    return data;
  }, [tradeHistory]);

  const topProfitTrades = useMemo(() => {
    return [...monthlyTrades]
      .filter((trade) => trade.pnlAmount > 0)
      .sort((a, b) => b.pnlAmount - a.pnlAmount)
      .slice(0, 3);
  }, [monthlyTrades]);

  const topLosingTrades = useMemo(() => {
    return [...monthlyTrades]
      .filter((trade) => trade.pnlAmount < 0)
      .sort((a, b) => a.pnlAmount - b.pnlAmount)
      .slice(0, 3);
  }, [monthlyTrades]);

  // Logic for calculating the average confidence level from trade history
  const averageConfidenceLevel = useMemo(() => {
    // If there are no trades, return 0 (or a default value that 'TradingConfidenceIndex' can handle)
    if (tradeHistory.length === 0) {
      return 0;
    }

    // Sum up all 'confidenceLevel' values from the trade history
    const totalConfidence = tradeHistory.reduce((sum, trade) => {
      // Ensure 'confidenceLevel' is a valid number.
      // If it's missing or not a number, treat it as 0 for the sum.
      return sum + (typeof trade.confidenceLevel === 'number' ? trade.confidenceLevel : 0);
    }, 0);

    // Calculate the raw average confidence level (e.g., if levels are 1-10, average will also be 1-10)
    const average = totalConfidence / tradeHistory.length;

    // Scale the average to a 0-100 range.
    // Since your confidenceLevel is 1-10, multiplying by 10 will scale it to 10-100.
    // For example, an average of 6 would become 60 (for 60%).
    const scaledAverage = average * 10;

    // Ensure the value is within the 0-100 range in case of edge cases or future changes in input.
    return Math.min(100, Math.max(0, scaledAverage));
  }, [tradeHistory]);

  return {
    monthlyTrades,
    highestPnl,
    tradesThisMonthCount,
    winRate,
    avgRiskReward,
    cumulativePnlData,
    topProfitTrades,
    topLosingTrades,
    averageConfidenceLevel, // Export the calculated value
  };
};