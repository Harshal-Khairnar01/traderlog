// StrategyClient.jsx
"use client";

import React, { useEffect, useState, useCallback } from "react";
import StrategyCard from "./StrategyCard";
import StrategyTradesModal from "./StrategyTradeModal";

const StrategyClient = () => {
  const [tradeHistory, setTradeHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [strategyMetrics, setStrategyMetrics] = useState({});

  const [showModal, setShowModal] = useState(false);
  const [modalStrategyName, setModalStrategyName] = useState('');
  const [modalTrades, setModalTrades] = useState([]);

  const loadTrades = useCallback(() => {
    try {
      setLoading(true);
      const savedTrades = localStorage.getItem("tradeJournalData");
      if (savedTrades) {
        const parsedTrades = JSON.parse(savedTrades);
        const enhancedTrades = parsedTrades.map((trade) => ({
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
        }));
        setTradeHistory(enhancedTrades);
      } else {
        setTradeHistory([]);
      }
    } catch (err) {
      console.error(
        "Failed to load or parse trade history from localStorage:",
        err
      );
      setError("Error loading trade data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTrades();
  }, [loadTrades]);

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
      const profitFactorValue = data.totalGrossLoss === 0
        ? (data.totalGrossProfit > 0 ? data.totalGrossProfit : 0)
        : data.totalGrossProfit / data.totalGrossLoss;

      const riskPerTradeValue = data.totalCapitalUsed === 0
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
    calculateStrategyMetrics();
  }, [tradeHistory, calculateStrategyMetrics]);

  const handleViewDetails = useCallback((strategyName) => {
    const filteredTrades = tradeHistory.filter(
      (trade) => (trade.strategy || "Uncategorized") === strategyName
    );
    setModalStrategyName(strategyName);
    setModalTrades(filteredTrades);
    setShowModal(true);
  }, [tradeHistory]);

  const handleCloseModal = useCallback(() => {
    setShowModal(false);
    setModalStrategyName('');
    setModalTrades([]);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <p className="text-gray-300 text-lg">Loading strategies data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );
  }

  const hasStrategies = Object.keys(strategyMetrics).length > 0;

  return (
    <div className="min-h-screen bg-slate-900 relative p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-200">Trading Strategies Overview</h2>
      </div>

      {hasStrategies ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Object.entries(strategyMetrics).map(([strategyName, metrics]) => (
            <StrategyCard
              key={strategyName}
              strategyName={strategyName}
              usage={metrics.usage}
              profitFactor={metrics.profitFactor}
              totalProfit={metrics.totalProfit}
              winRate={metrics.winRate}
              riskPerTrade={metrics.riskPerTrade}
              onViewDetailsClick={handleViewDetails}
            />
          ))}
        </div>
      ) : (
        <p className="text-gray-400 text-center py-8">
          No trade data available to analyze strategies. Please add some trades.
        </p>
      )}

      {showModal && (
        <StrategyTradesModal
          strategyName={modalStrategyName}
          trades={modalTrades}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default StrategyClient;