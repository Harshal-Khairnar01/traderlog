// hooks/usePsychologyMetrics.js
import { useState, useEffect, useCallback } from 'react';

const getEmotionalStateFromConfidence = (level) => {
  if (level === null || level === undefined) return 'Unknown';
  if (level >= 9) return 'Overconfident';
  if (level >= 7) return 'Calm';
  if (level >= 5) return 'Impatient';
  if (level >= 3) return 'Anxious';
  return 'Frustrated';
};

export const usePsychologyMetrics = (tradeHistory) => {
  const [psychologyMetrics, setPsychologyMetrics] = useState({
    emotionalStates: [],
    avgRRByEmotionalState: [],
    pnlByConfidenceLevel: [], // New
    winRateByEmotionBefore: [], // New
    avgRRByEmotionBefore: [], // New
    mistakeFrequency: [], // New
    avgPnlByMistake: [], // New
    avgRRByMistake: [], // New
    // You could also add emotionAfter analysis if desired, e.g.,
    // outcomeByEmotionAfter: [],
  });

  const calculatePsychologyMetrics = useCallback(() => {
    if (!tradeHistory || tradeHistory.length === 0) {
      setPsychologyMetrics({
        emotionalStates: [],
        avgRRByEmotionalState: [],
        pnlByConfidenceLevel: [],
        winRateByEmotionBefore: [],
        avgRRByEmotionBefore: [],
        mistakeFrequency: [],
        avgPnlByMistake: [],
        avgRRByMistake: [],
      });
      return;
    }

    const totalEntries = tradeHistory.length;
    const emotionalStateCounts = {};
    const emotionalStateRRSum = {};
    const emotionalStateRRCount = {};

    const confidenceLevelPnl = {
      'High (8-10)': { sum: 0, count: 0 },
      'Medium (5-7)': { sum: 0, count: 0 },
      'Low (1-4)': { sum: 0, count: 0 },
      'Unknown': { sum: 0, count: 0 }
    };

    const emotionsBeforeStats = {}; // { emotion: { wins: 0, losses: 0, totalRR: 0, rrCount: 0, totalPnl: 0, pnlCount: 0 } }
    const mistakeCounts = {};
    const mistakePnlRR = {}; // { mistake: { sumPnl: 0, count: 0, sumRR: 0, rrCount: 0 } }

    tradeHistory.forEach(trade => {
      const pnl = trade.pnlAmount || 0;
      const confidenceLevel = trade.confidenceLevel;
      const emotionsBefore = trade.emotionsBefore || 'Unknown';
      const riskReward = trade.riskReward;
      const mistakes = trade.mistakeChecklist || [];

      // Emotional State based on Confidence
      const emotionalState = getEmotionalStateFromConfidence(confidenceLevel);
      emotionalStateCounts[emotionalState] = (emotionalStateCounts[emotionalState] || 0) + 1;

      // Risk/Reward by Emotional State
      let rValue = 0;
      if (riskReward && typeof riskReward === 'string' && riskReward.includes(':')) {
        const [riskStr, rewardStr] = riskReward.split(':');
        const risk = parseFloat(riskStr);
        const reward = parseFloat(rewardStr);

        if (!isNaN(risk) && !isNaN(reward) && risk !== 0) {
          rValue = reward / risk;
          emotionalStateRRSum[emotionalState] = (emotionalStateRRSum[emotionalState] || 0) + rValue;
          emotionalStateRRCount[emotionalState] = (emotionalStateRRCount[emotionalState] || 0) + 1;
        }
      }

      // Confidence Level Impact on P&L
      if (confidenceLevel !== null && confidenceLevel !== undefined) {
        let confidenceCategory;
        if (confidenceLevel >= 8) confidenceCategory = 'High (8-10)';
        else if (confidenceLevel >= 5) confidenceCategory = 'Medium (5-7)';
        else if (confidenceLevel >= 1) confidenceCategory = 'Low (1-4)';
        else confidenceCategory = 'Unknown';

        confidenceLevelPnl[confidenceCategory].sum += pnl;
        confidenceLevelPnl[confidenceCategory].count++;
      } else {
        confidenceLevelPnl['Unknown'].sum += pnl;
        confidenceLevelPnl['Unknown'].count++;
      }

      // Emotional Impact on Outcome (emotionsBefore)
      if (!emotionsBeforeStats[emotionsBefore]) {
        emotionsBeforeStats[emotionsBefore] = { wins: 0, losses: 0, totalRR: 0, rrCount: 0, totalPnl: 0, pnlCount: 0 };
      }
      if (pnl > 0) emotionsBeforeStats[emotionsBefore].wins++;
      else if (pnl < 0) emotionsBeforeStats[emotionsBefore].losses++;
      emotionsBeforeStats[emotionsBefore].totalPnl += pnl;
      emotionsBeforeStats[emotionsBefore].pnlCount++;
      if (rValue !== 0) {
        emotionsBeforeStats[emotionsBefore].totalRR += rValue;
        emotionsBeforeStats[emotionsBefore].rrCount++;
      }

      // Most Frequent Mistakes & Impact of Mistakes
      mistakes.forEach(mistake => {
        mistakeCounts[mistake] = (mistakeCounts[mistake] || 0) + 1;

        if (!mistakePnlRR[mistake]) {
          mistakePnlRR[mistake] = { sumPnl: 0, count: 0, sumRR: 0, rrCount: 0 };
        }
        mistakePnlRR[mistake].sumPnl += pnl;
        mistakePnlRR[mistake].count++;
        if (rValue !== 0) {
          mistakePnlRR[mistake].sumRR += rValue;
          mistakePnlRR[mistake].rrCount++;
        }
      });
    });

    // Calculate existing emotional states
    const calculatedEmotionalStates = Object.entries(emotionalStateCounts)
      .map(([state, count]) => ({
        label: state,
        value: `${((count / totalEntries) * 100).toFixed(0)}%`,
      }))
      .sort((a, b) => parseFloat(b.value) - parseFloat(a.value));

    const calculatedAvgRRByEmotionalState = Object.entries(emotionalStateRRSum)
      .map(([state, totalRR]) => {
        const count = emotionalStateRRCount[state] || 0;
        const avgRR = count > 0 ? totalRR / count : 0;
        return {
          label: `When ${state}`,
          value: avgRR,
        };
      })
      .sort((a, b) => b.value - a.value);

    // Calculate P&L by Confidence Level
    const calculatedPnlByConfidenceLevel = Object.entries(confidenceLevelPnl)
      .map(([level, data]) => ({
        label: `Avg P&L ${level}`,
        value: data.count > 0 ? (data.sum / data.count) : null, // Use null for N/A for better filtering later
      }))
      .filter(item => item.value !== null)
      .sort((a, b) => b.value - a.value);

    // Calculate Win Rate and Avg R:R by Emotion Before
    const calculatedWinRateByEmotionBefore = Object.entries(emotionsBeforeStats)
      .map(([emotion, data]) => ({
        label: `${emotion} Win Rate`,
        value: data.wins + data.losses > 0 ? (data.wins / (data.wins + data.losses)) * 100 : null,
      }))
      .filter(item => item.value !== null)
      .sort((a, b) => b.value - a.value);

    const calculatedAvgRRByEmotionBefore = Object.entries(emotionsBeforeStats)
      .map(([emotion, data]) => ({
        label: `${emotion} Avg R:R`,
        value: data.rrCount > 0 ? data.totalRR / data.rrCount : null,
      }))
      .filter(item => item.value !== null)
      .sort((a, b) => b.value - a.value);

    // Calculate Mistake Frequency
    const calculatedMistakeFrequency = Object.entries(mistakeCounts)
      .map(([mistake, count]) => ({
        label: mistake,
        value: `${((count / totalEntries) * 100).toFixed(0)}%`,
        count: count,
      }))
      .sort((a, b) => b.count - a.count);

    // Calculate Avg P&L by Mistake
    const calculatedAvgPnlByMistake = Object.entries(mistakePnlRR)
      .map(([mistake, data]) => ({
        label: `Avg P&L for '${mistake}'`,
        value: data.count > 0 ? (data.sumPnl / data.count) : null,
      }))
      .filter(item => item.value !== null)
      .sort((a, b) => a.value - b.value); // Sort by P&L ascending (worst first)

    // Calculate Avg R:R by Mistake
    const calculatedAvgRRByMistake = Object.entries(mistakePnlRR)
      .map(([mistake, data]) => ({
        label: `Avg R:R for '${mistake}'`,
        value: data.rrCount > 0 ? (data.sumRR / data.rrCount) : null,
      }))
      .filter(item => item.value !== null)
      .sort((a, b) => a.value - b.value); // Sort by RR ascending (worst first)


    setPsychologyMetrics({
      emotionalStates: calculatedEmotionalStates,
      avgRRByEmotionalState: calculatedAvgRRByEmotionalState,
      pnlByConfidenceLevel: calculatedPnlByConfidenceLevel,
      winRateByEmotionBefore: calculatedWinRateByEmotionBefore,
      avgRRByEmotionBefore: calculatedAvgRRByEmotionBefore,
      mistakeFrequency: calculatedMistakeFrequency,
      avgPnlByMistake: calculatedAvgPnlByMistake,
      avgRRByMistake: calculatedAvgRRByMistake,
    });
  }, [tradeHistory]);

  useEffect(() => {
    calculatePsychologyMetrics();
  }, [tradeHistory, calculatePsychologyMetrics]);

  return psychologyMetrics;
};