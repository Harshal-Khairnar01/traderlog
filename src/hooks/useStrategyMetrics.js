// src/app/hooks/useStrategyMetrics.js
import { useState, useEffect, useCallback } from "react";

export const useStrategyMetrics = () => {
  const [tradeHistory, setTradeHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [strategyMetrics, setStrategyMetrics] = useState({});

  const parseTradeData = (trade) => {
    // Basic parsing of number fields
    const parsedTrade = {
      ...trade,
      id: trade.id || crypto.randomUUID(),
      entryPrice: parseFloat(trade.entryPrice),
      exitPrice: parseFloat(trade.exitPrice),
      quantity: parseFloat(trade.quantity),
      stopLoss: trade.stopLoss !== null && trade.stopLoss !== undefined ? parseFloat(trade.stopLoss) : null,
      target: trade.target !== null && trade.target !== undefined ? parseFloat(trade.target) : null,
      charges: parseFloat(trade.charges) || 0,
      pnlAmount: parseFloat(trade.pnlAmount) || 0,
      pnlPercentage: parseFloat(trade.pnlPercentage) || 0,
      totalAmount: parseFloat(trade.totalAmount) || 0,
      confidenceLevel: parseFloat(trade.confidenceLevel) || 5,
    };

    // Calculate Risk-Reward Ratio
    let riskReward = null;
    const { entryPrice, stopLoss, target, direction } = parsedTrade;

    if (entryPrice && stopLoss && target) {
      const risk =
        direction === "Long"
          ? entryPrice - stopLoss
          : stopLoss - entryPrice;

      const reward =
        direction === "Long"
          ? target - entryPrice
          : entryPrice - target;

      // Ensure risk is a positive number to avoid division by zero or negative results
      if (risk > 0) {
        const ratio = reward / risk;
        riskReward = ratio > 0 ? ratio.toFixed(2) : '0'; // Handle potential negative ratios if target is below entry
      }
    }
    
    return { ...parsedTrade, riskReward };
  };

  const loadTrades = useCallback(() => {
    try {
      setLoading(true);
      const savedTrades = localStorage.getItem("tradeJournalData");
      if (savedTrades) {
        const parsedTrades = JSON.parse(savedTrades);
        const enhancedTrades = parsedTrades.map(parseTradeData);
        setTradeHistory(enhancedTrades);
      } else {
        setTradeHistory([]);
      }
    } catch (err) {
      console.error("Failed to load or parse trade history from localStorage:", err);
      setError("Error loading trade data.");
    } finally {
      setLoading(false);
    }
  }, []);

  const calculateStrategyMetrics = useCallback(() => {
    if (tradeHistory.length === 0) {
      setStrategyMetrics({});
      return;
    }

    const metrics = {};
    const totalOverallTrades = tradeHistory.length;

    tradeHistory.forEach((trade) => {
      const strategy = trade.strategy || "Uncategorized";
      if (!metrics[strategy]) {
        metrics[strategy] = {
          totalTrades: 0,
          winningTrades: 0,
          totalGrossProfit: 0,
          totalGrossLoss: 0,
          totalNetProfit: 0,
          totalInitialRiskAmount: 0,
          totalCapitalUsed: 0,
        };
      }

      const strategyData = metrics[strategy];
      strategyData.totalTrades++;
      strategyData.totalNetProfit += trade.pnlAmount;

      const grossPnl =
        trade.direction === "Long"
          ? (trade.exitPrice - trade.entryPrice) * trade.quantity
          : (trade.entryPrice - trade.exitPrice) * trade.quantity;

      if (grossPnl > 0) {
        strategyData.winningTrades++;
        strategyData.totalGrossProfit += grossPnl;
      } else if (grossPnl < 0) {
        strategyData.totalGrossLoss += Math.abs(grossPnl);
      }

      if (!isNaN(trade.entryPrice) && trade.stopLoss !== null && !isNaN(trade.quantity)) {
        let potentialLoss = 0;
        if (trade.direction === "Long") {
          potentialLoss = Math.max(0, trade.entryPrice - trade.stopLoss) * trade.quantity;
        } else if (trade.direction === "Short") {
          potentialLoss = Math.max(0, trade.stopLoss - trade.entryPrice) * trade.quantity;
        }
        strategyData.totalInitialRiskAmount += potentialLoss;
      }

      if (!isNaN(trade.entryPrice) && !isNaN(trade.quantity)) {
        strategyData.totalCapitalUsed += trade.entryPrice * trade.quantity;
      }
    });

    const finalizedMetrics = {};
    Object.keys(metrics).forEach((strategy) => {
      const data = metrics[strategy];
      const profitFactorValue =
        data.totalGrossLoss === 0
          ? data.totalGrossProfit > 0 ? data.totalGrossProfit : 0
          : data.totalGrossProfit / data.totalGrossLoss;

      const riskPerTradeValue =
        data.totalCapitalUsed === 0
          ? 0
          : (data.totalInitialRiskAmount / data.totalCapitalUsed) * 100;

      finalizedMetrics[strategy] = {
        usage: (data.totalTrades / totalOverallTrades) * 100,
        profitFactor: profitFactorValue,
        totalProfit: data.totalNetProfit,
        winRate: (data.winningTrades / data.totalTrades) * 100,
        riskPerTrade: riskPerTradeValue,
      };
    });

    setStrategyMetrics(finalizedMetrics);
  }, [tradeHistory]);

  useEffect(() => {
    loadTrades();
  }, [loadTrades]);

  useEffect(() => {
    calculateStrategyMetrics();
  }, [tradeHistory, calculateStrategyMetrics]);

  return { tradeHistory, loading, error, strategyMetrics };
};