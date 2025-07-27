// hooks/useChallengeMetrics.js
import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";

// Define a default challenge settings object
const DEFAULT_CHALLENGE_SETTINGS = {
  startingCapital: 30000,
  targetCapital: 40000,
  challengeEndDate: "2025-07-23", // YYYY-MM-DD (Default based on your screenshots, current date is July 26, 2025)
};

export const useChallengeMetrics = () => {
  const [challengeData, setChallengeData] = useState(null);
  const [tradeHistory, setTradeHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [challengeSettings, setChallengeSettings] = useState(DEFAULT_CHALLENGE_SETTINGS);

  // Function to calculate all dynamic metrics
  const calculateMetrics = useCallback((trades, settings) => {
    const { startingCapital, targetCapital, challengeEndDate } = settings;

    if (!trades || trades.length === 0) {
      const now = new Date();
      const challengeEnd = new Date(challengeEndDate);
      const timeRemainingMs = challengeEnd.getTime() - now.getTime();
      const daysRemaining = Math.max(0, Math.ceil(timeRemainingMs / (1000 * 60 * 60 * 24)));
      const potentialDailyTarget = daysRemaining > 0 ? (targetCapital - startingCapital) / daysRemaining : 0;

      return {
        summary: {
          startingCapital: startingCapital,
          currentCapital: startingCapital,
          targetCapital: targetCapital,
          dailyTarget: potentialDailyTarget,
          dailyActual: 0,
          daysRemaining: daysRemaining,
          projectedDate: new Date(challengeEndDate).toLocaleDateString("en-US", { day: '2-digit', month: 'short', year: '2-digit' }),
          winRate: 0,
          progressToTarget: 0,
        },
        performance: {
          avgRiskReward: null,
          highestProfitDay: 0,
          highestProfitDayDate: "N/A",
          maxDrawdown: 0,
          tradingConfidenceLevel: 0, // Default to 0 for numerical confidence
        },
      };
    }

    // Sort trades by date to ensure correct order for P&L and drawdown
    const sortedTrades = [...trades].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    let totalPNL = 0;
    let profitableTrades = 0;
    let totalTrades = 0;
    let highestProfit = 0;
    let highestProfitDate = "N/A";
    let equityCurve = [startingCapital]; // Start with initial capital from settings
    let maxEquity = startingCapital;
    let maxDrawdown = 0; // In percentage
    let totalConfidenceLevel = 0; // For summing up individual trade confidence levels
    let tradesWithConfidence = 0; // Count trades that have a valid confidence level

    // For win rate calculation: consider only trades with P&L
    const tradesWithPnL = sortedTrades.filter(trade => trade.pnlAmount !== null && !isNaN(trade.pnlAmount));

    tradesWithPnL.forEach(trade => {
      totalPNL += trade.pnlAmount;
      totalTrades++;
      if (trade.pnlAmount > 0) {
        profitableTrades++;
      }

      // Summing up confidence levels
      if (typeof trade.confidenceLevel === 'number' && !isNaN(trade.confidenceLevel)) {
        totalConfidenceLevel += trade.confidenceLevel;
        tradesWithConfidence++;
      }


      // Highest Profit Day (for a single trade's P&L)
      if (trade.pnlAmount > highestProfit) {
        highestProfit = trade.pnlAmount;
        highestProfitDate = new Date(trade.date).toLocaleDateString("en-US", { day: '2-digit', month: 'short', year: '2-digit' });
      }

      // Calculate Equity Curve for Drawdown
      const currentEquity = equityCurve[equityCurve.length - 1] + trade.pnlAmount;
      equityCurve.push(currentEquity);

      if (currentEquity > maxEquity) {
        maxEquity = currentEquity;
      }
      const currentDrawdown = ((maxEquity - currentEquity) / maxEquity) * 100;
      if (currentDrawdown > maxDrawdown) {
        maxDrawdown = currentDrawdown;
      }
    });

    const currentCapital = startingCapital + totalPNL;
    const progressToTarget = Math.min(1, Math.max(0, (currentCapital - startingCapital) / (targetCapital - startingCapital)));
    const winRate = totalTrades > 0 ? profitableTrades / totalTrades : 0; // 0-1 scale

    // Daily Target and Days Remaining
    const challengeEnd = new Date(challengeEndDate);
    const now = new Date(); // Current date for calculations
    const timeRemainingMs = challengeEnd.getTime() - now.getTime();
    const daysRemaining = Math.max(0, Math.ceil(timeRemainingMs / (1000 * 60 * 60 * 24)));
    const remainingToTarget = targetCapital - currentCapital;
    const dailyTarget = daysRemaining > 0 ? remainingToTarget / daysRemaining : 0;

    // Aggregate daily P&L for 'dailyActual'
    let dailyPnlSum = 0;
    const today = now.toISOString().split('T')[0]; // YYYY-MM-DD
    tradesWithPnL.forEach(trade => {
        if (trade.date === today) { // Assuming trade.date is also YYYY-MM-DD
            dailyPnlSum += trade.pnlAmount;
        }
    });

    // Calculate numerical Trading Confidence Level (0-100%)
    let tradingConfidenceLevel = 0;
    const winRatePercentage = winRate * 100; // Scale win rate to 0-100%

    // Calculate average individual trade confidence level (scaled to 0-100%)
    const averageTradeConfidencePercentage = tradesWithConfidence > 0 ? (totalConfidenceLevel / tradesWithConfidence) * 10 : 0;
    // The `* 10` is because your individual `confidenceLevel` is 1-10, so multiply by 10 to get 10-100.

    // Combine win rate and average trade confidence. You can adjust weighting.
    // Here, a simple average of the two scaled values is used.
    if (totalTrades > 0 || tradesWithConfidence > 0) {
      tradingConfidenceLevel = (winRatePercentage + averageTradeConfidencePercentage) / 2;
    }
    // Ensure it's clamped between 0 and 100
    tradingConfidenceLevel = Math.min(100, Math.max(0, tradingConfidenceLevel));


    // Avg Risk:Reward
    const calculatedAvgRR = tradesWithPnL.filter(t => t.riskReward !== null && !isNaN(t.riskReward) && t.riskReward > 0).reduce((acc, t) => acc + t.riskReward, 0);
    const avgRiskReward = tradesWithPnL.filter(t => t.riskReward !== null && !isNaN(t.riskReward) && t.riskReward > 0).length > 0 ?
                                  calculatedAvgRR / tradesWithPnL.filter(t => t.riskReward !== null && !isNaN(t.riskReward) && t.riskReward > 0).length : null;


    return {
      summary: {
        startingCapital: startingCapital,
        currentCapital: currentCapital,
        targetCapital: targetCapital,
        dailyTarget: dailyTarget,
        dailyActual: dailyPnlSum,
        daysRemaining: daysRemaining,
        projectedDate: challengeEnd.toLocaleDateString("en-US", { day: '2-digit', month: 'short', year: '2-digit' }),
        winRate: winRate, // Keep as 0-1 for summary, TradingConfidenceIndex uses 0-100
        progressToTarget: progressToTarget,
      },
      performance: {
        avgRiskReward: avgRiskReward,
        highestProfitDay: highestProfit,
        highestProfitDayDate: highestProfitDate,
        maxDrawdown: maxDrawdown,
        tradingConfidenceLevel: tradingConfidenceLevel, // Now a number 0-100
      },
    };
  }, []);

  // Effect to load data from localStorage
  const loadDataFromLocalStorage = useCallback(() => {
    setLoading(true);
    try {
      // Load challenge settings
      const storedSettings = localStorage.getItem("challengeSettings");
      let currentSettings = DEFAULT_CHALLENGE_SETTINGS;
      if (storedSettings) {
        currentSettings = JSON.parse(storedSettings);
      }
      setChallengeSettings(currentSettings); // Update state with loaded settings

      // Load trade journal data
      const storedTrades = localStorage.getItem("tradeJournalData");
      let parsedTrades = [];
      if (storedTrades) {
        parsedTrades = JSON.parse(storedTrades);
      }
      setTradeHistory(parsedTrades);

      // Calculate metrics with loaded settings and trades
      setChallengeData(calculateMetrics(parsedTrades, currentSettings));
    } catch (err) {
      console.error("Error loading data from localStorage:", err);
      setError("Failed to load data from local storage.");
      toast.error("Failed to load data from local storage.");
    } finally {
      setLoading(false);
    }
  }, [calculateMetrics]);

  useEffect(() => {
    loadDataFromLocalStorage();

    // Listen for storage events if data might change in other tabs/windows
    const handleStorageChange = (event) => {
        if (event.key === "tradeJournalData" || event.key === "challengeSettings") {
            loadDataFromLocalStorage();
        }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => {
        window.removeEventListener("storage", handleStorageChange);
    };
  }, [loadDataFromLocalStorage]);


  const handleSaveChallengeSettings = useCallback((newSettings) => {
    localStorage.setItem("challengeSettings", JSON.stringify(newSettings));
    setChallengeSettings(newSettings); // Update state
    // Recalculate all metrics immediately with new settings and existing trades
    setChallengeData(calculateMetrics(tradeHistory, newSettings));
  }, [calculateMetrics, tradeHistory]); // Depend on calculateMetrics and tradeHistory

  return {
    challengeData,
    tradeHistory,
    loading,
    error,
    challengeSettings,
    handleSaveChallengeSettings,
  };
};
