// src/hooks/useChallengeData.js
import { useState, useEffect, useCallback } from 'react';

export function useChallengeData(userId) {
  const [challenge, setChallenge] = useState(null);
  const [challengeTrades, setChallengeTrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const initialMetricsState = {
    progressToTarget: 0,
    currentCapital: 0,
    dailyTargetAmount: 0,
    dailyProfitToday: 0,
    winRate: 0,
    avgRiskReward: 'N/A',
    highestProfitDay: 0,
    maxDrawdown: 0,
  };
  const [calculatedMetrics, setCalculatedMetrics] = useState(initialMetricsState);


  const calculateMetrics = useCallback((currentChallenge, trades) => {
    // Always return a valid metrics object, even if inputs are invalid
    if (!currentChallenge || !trades || trades.length === 0) {
      // If there are no trades, currentCapital should be startingCapital
      const defaultCurrentCapital = currentChallenge && typeof currentChallenge.startingCapital === 'number' ? currentChallenge.startingCapital : 0;
      return {
        progressToTarget: 0,
        currentCapital: defaultCurrentCapital, // Use startingCapital if no trades
        dailyTargetAmount: 0,
        dailyProfitToday: 0,
        winRate: 0,
        avgRiskReward: 'N/A',
        highestProfitDay: 0,
        maxDrawdown: 0,
      };
    }

    const { startingCapital, targetCapital, targetDate, startDate } = currentChallenge;
    const safeStartingCapital = typeof startingCapital === 'number' ? startingCapital : 0;

    // Calculate currentCapital from startingCapital + sum of all P&L
    const currentCapital = safeStartingCapital + trades.reduce((sum, trade) => sum + (typeof trade.pnl === 'number' ? trade.pnl : 0), 0);

    // Progress to Target (handle division by zero if target equals starting capital)
    let progressToTarget = 0;
    if (typeof targetCapital === 'number' && targetCapital !== safeStartingCapital) {
      progressToTarget = ((currentCapital - safeStartingCapital) / (targetCapital - safeStartingCapital)) * 100;
    }
    progressToTarget = Math.max(0, Math.min(100, progressToTarget)); // Cap between 0 and 100

    // Daily Target Amount
    const today = new Date();
    const targetDt = new Date(targetDate);
    const startDt = new Date(startDate);

    // Validate dates before calculating time difference
    if (isNaN(targetDt.getTime()) || isNaN(startDt.getTime())) {
        console.warn("Invalid targetDate or startDate for daily target calculation. Returning 0.");
        return { ...initialMetricsState, currentCapital: currentCapital }; // Return currentCapital, but other metrics default
    }

    const timeDiff = Math.abs(targetDt.getTime() - startDt.getTime());
    const totalChallengeDays = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

    const amountToGain = targetCapital - safeStartingCapital;
    const dailyTargetAmount = totalChallengeDays > 0 ? amountToGain / totalChallengeDays : 0;

    // Daily Profit Today
    const todayStr = today.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: '2-digit' });
    const dailyProfitToday = trades
      .filter(trade => {
        // Ensure trade.date exists and is a valid date string
        if (!trade.date) return false;
        const tradeDate = new Date(trade.date);
        return !isNaN(tradeDate.getTime()) && tradeDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: '2-digit' }) === todayStr;
      })
      .reduce((sum, trade) => sum + (typeof trade.pnl === 'number' ? trade.pnl : 0), 0);

    // Win Rate
    const totalTrades = trades.length;
    const winningTrades = trades.filter(trade => (typeof trade.pnl === 'number' && trade.pnl > 0)).length;
    const winRate = totalTrades > 0 ? (winningTrades / totalTrades) * 100 : 0;

    // Highest Profit Day
    const pnlByDay = trades.reduce((acc, trade) => {
      // Ensure trade.date exists and is a valid date string
      if (!trade.date || typeof trade.pnl !== 'number') return acc;
      const dateKey = new Date(trade.date).toDateString();
      if (!isNaN(new Date(dateKey).getTime())) { // Ensure dateKey is valid
        acc[dateKey] = (acc[dateKey] || 0) + trade.pnl;
      }
      return acc;
    }, {});
    const highestProfitDay = Object.values(pnlByDay).length > 0
      ? Math.max(...Object.values(pnlByDay), 0) // Ensure 0 is the floor if all days are negative
      : 0;

    // Max Drawdown (simplified and robust calculation)
    let maxDD = 0;
    let currentBalanceForDD = safeStartingCapital;
    let peak = safeStartingCapital;

    // Sort trades by date to accurately simulate balance progression
    const sortedTrades = [...trades].filter(trade => trade.date).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    for (const trade of sortedTrades) {
      currentBalanceForDD += (typeof trade.pnl === 'number' ? trade.pnl : 0);

      if (currentBalanceForDD > peak) {
        peak = currentBalanceForDD; // Found a new peak
      } else {
        // Calculate drawdown from the highest peak seen so far
        // Ensure peak is not zero to avoid division by zero
        const drawdown = (peak > 0) ? (peak - currentBalanceForDD) / peak * 100 : 0;
        maxDD = Math.max(maxDD, isNaN(drawdown) ? 0 : drawdown); // Handle NaN for drawdown percentage
      }
    }
    maxDD = Math.max(0, maxDD); // Ensure maxDD is not negative

    return {
      progressToTarget,
      currentCapital,
      dailyTargetAmount,
      dailyProfitToday,
      winRate,
      avgRiskReward: 'N/A', // Remains N/A until R:R data is available
      highestProfitDay,
      maxDrawdown,
    };
  }, [initialMetricsState]); // Depend on initialMetricsState for default return if dates are invalid


  useEffect(() => {
    setLoading(true); // Ensure loading is true at the start of fetch
    setError(null); // Clear previous errors
    try {
      console.log('--- useChallengeData: Attempting to load data from localStorage ---');
      const storedChallenge = localStorage.getItem(`challengeData_${userId}`);
      const storedTrades = localStorage.getItem('tradeJournalData');

      let initialChallenge = null;
      let initialTrades = [];

      // --- Load Challenge Data ---
      if (storedChallenge) {
        try {
          initialChallenge = JSON.parse(storedChallenge);
          console.log('useChallengeData: Parsed storedChallenge:', initialChallenge);

          // Validate and parse dates for challenge
          if (initialChallenge.targetDate) {
              const parsedTargetDate = new Date(initialChallenge.targetDate);
              if (isNaN(parsedTargetDate.getTime())) {
                  console.warn("useChallengeData: Invalid targetDate parsed. Using default.");
                  initialChallenge.targetDate = new Date(2025, 7, 23); // Default date
              } else {
                  initialChallenge.targetDate = parsedTargetDate;
              }
          }
          if (initialChallenge.startDate) {
              const parsedStartDate = new Date(initialChallenge.startDate);
              if (isNaN(parsedStartDate.getTime())) {
                  console.warn("useChallengeData: Invalid startDate parsed. Using default.");
                  initialChallenge.startDate = new Date(); // Default to today
              } else {
                  initialChallenge.startDate = parsedStartDate;
              }
          }
           // Ensure startingCapital and targetCapital are numbers
          initialChallenge.startingCapital = typeof initialChallenge.startingCapital === 'number' ? initialChallenge.startingCapital : 30000;
          initialChallenge.targetCapital = typeof initialChallenge.targetCapital === 'number' ? initialChallenge.targetCapital : 40000;

        } catch (parseError) {
          console.error("useChallengeData: Error parsing storedChallenge from localStorage. Resetting to default.", parseError);
          initialChallenge = null; // Treat as no stored challenge
        }
      }

      if (!initialChallenge) {
        console.log('useChallengeData: No valid challenge found or parse error, setting default challenge.');
        initialChallenge = {
          startingCapital: 30000,
          targetCapital: 40000,
          targetDate: new Date(2025, 7, 23), // Month is 0-indexed (August 23, 2025)
          startDate: new Date(), // Set start date to today
          isActive: true
        };
        // Save this default challenge immediately so it persists
        localStorage.setItem(`challengeData_${userId}`, JSON.stringify({
            ...initialChallenge,
            targetDate: initialChallenge.targetDate.toISOString(),
            startDate: initialChallenge.startDate.toISOString()
        }));
      }

      // --- Load Trade Data ---
      if (storedTrades) {
        try {
          initialTrades = JSON.parse(storedTrades);
          console.log('useChallengeData: Parsed storedTrades:', initialTrades);
          // Basic validation for trades array elements if needed
          if (!Array.isArray(initialTrades)) {
              console.warn("useChallengeData: Stored trades is not an array. Initializing as empty.");
              initialTrades = [];
          }
        } catch (parseError) {
          console.error("useChallengeData: Error parsing storedTrades from localStorage. Initializing as empty.", parseError);
          initialTrades = []; // Treat as no stored trades
        }
      } else {
        initialTrades = [];
        localStorage.setItem('tradeJournalData', JSON.stringify([])); // Persist empty array
        console.log('useChallengeData: No tradeJournalData found, initializing as empty.');
      }

      setChallenge(initialChallenge);
      setChallengeTrades(initialTrades);
      // Ensure calculateMetrics is called with valid initialChallenge and initialTrades
      setCalculatedMetrics(calculateMetrics(initialChallenge, initialTrades));
      console.log('useChallengeData: Data loaded successfully. Current metrics:', calculateMetrics(initialChallenge, initialTrades));

    } catch (e) {
      // This catch block handles any other unexpected errors during the useEffect execution
      console.error("useChallengeData: Unhandled error during localStorage data loading:", e);
      setError("Failed to load your challenge data. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [userId, calculateMetrics]); // `calculateMetrics` is a dependency because it's a useCallback

  // Function to save/update a challenge
  const saveChallenge = useCallback(async (formData) => {
    setLoading(true);
    setError(null);
    try {
      const newChallenge = {
        ...formData,
        // Preserve original startDate if editing, otherwise set to now
        startDate: challenge?.startDate || new Date(),
        isActive: true, // Always active when saved/edited
      };
      // Store dates as ISO strings for proper JSON serialization
      const challengeToStore = {
        ...newChallenge,
        targetDate: newChallenge.targetDate.toISOString(),
        startDate: newChallenge.startDate.toISOString()
      };
      localStorage.setItem(`challengeData_${userId}`, JSON.stringify(challengeToStore));
      setChallenge(newChallenge);
      setCalculatedMetrics(calculateMetrics(newChallenge, challengeTrades)); // Recalculate with new challenge data
      setLoading(false);
      return true;
    } catch (e) {
      console.error("useChallengeData: Failed to save challenge:", e);
      setError("Failed to save challenge. Please try again.");
      setLoading(false);
      return false;
    }
  }, [userId, challenge, challengeTrades, calculateMetrics]);

  // Function to deactivate a challenge
  const deactivateChallenge = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      localStorage.removeItem(`challengeData_${userId}`);
      // Remove tradeJournalData only if you want to clear ALL trades with challenge deactivation
      localStorage.removeItem('tradeJournalData');

      setChallenge(null);
      setChallengeTrades([]); // Clear trades from state
      setCalculatedMetrics(initialMetricsState); // Reset metrics to default
      setLoading(false);
      return true;
    } catch (e) {
      console.error("useChallengeData: Failed to deactivate challenge:", e);
      setError("Failed to deactivate challenge. Please try again.");
      setLoading(false);
      return false;
    }
  }, [userId, initialMetricsState]); // initialMetricsState is a stable reference

  // Function to manually refresh data (e.g., after an error or external change)
  const refreshChallengeData = useCallback(() => {
    setLoading(true);
    setError(null);
    try {
        console.log('useChallengeData: Attempting to refresh data from localStorage...');
        const storedChallenge = localStorage.getItem(`challengeData_${userId}`);
        const storedTrades = localStorage.getItem('tradeJournalData');

        let currentChallenge = null;
        let currentTrades = [];

        if (storedChallenge) {
            try {
                currentChallenge = JSON.parse(storedChallenge);
                if (currentChallenge.targetDate) {
                    const parsedTargetDate = new Date(currentChallenge.targetDate);
                    currentChallenge.targetDate = isNaN(parsedTargetDate.getTime()) ? new Date(2025, 7, 23) : parsedTargetDate;
                }
                if (currentChallenge.startDate) {
                    const parsedStartDate = new Date(currentChallenge.startDate);
                    currentChallenge.startDate = isNaN(parsedStartDate.getTime()) ? new Date() : parsedStartDate;
                }
                currentChallenge.startingCapital = typeof currentChallenge.startingCapital === 'number' ? currentChallenge.startingCapital : 30000;
                currentChallenge.targetCapital = typeof currentChallenge.targetCapital === 'number' ? currentChallenge.targetCapital : 40000;
            } catch (parseError) {
                console.error("useChallengeData: Error parsing storedChallenge during refresh. Resetting to default.", parseError);
                currentChallenge = null;
            }
        }
        // If no challenge after parse or if initially null, set default
        if (!currentChallenge) {
             currentChallenge = {
                startingCapital: 30000,
                targetCapital: 40000,
                targetDate: new Date(2025, 7, 23),
                startDate: new Date(),
                isActive: true
            };
        }


        if (storedTrades) {
            try {
                currentTrades = JSON.parse(storedTrades);
                if (!Array.isArray(currentTrades)) {
                    console.warn("useChallengeData: Stored trades is not an array during refresh. Initializing as empty.");
                    currentTrades = [];
                }
            } catch (parseError) {
                console.error("useChallengeData: Error parsing storedTrades during refresh. Initializing as empty.", parseError);
                currentTrades = [];
            }
        } else {
            currentTrades = [];
        }

        setChallenge(currentChallenge);
        setChallengeTrades(currentTrades);
        setCalculatedMetrics(calculateMetrics(currentChallenge, currentTrades));
        console.log('useChallengeData: Data refreshed successfully.');
    } catch (e) {
        console.error("useChallengeData: Unhandled error during refreshChallengeData:", e);
        setError("Failed to refresh data. Please try again.");
    } finally {
        setLoading(false);
    }
  }, [userId, calculateMetrics]);

  return {
    challenge,
    calculatedMetrics,
    challengeTrades,
    loading,
    error,
    saveChallenge,
    deactivateChallenge,
    refreshChallengeData,
  };
}