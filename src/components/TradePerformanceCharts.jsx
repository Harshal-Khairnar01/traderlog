'use client';

import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, Cell
} from 'recharts';

export default function TradePerformanceCharts({ tradeHistory }) {
  if (!Array.isArray(tradeHistory) || tradeHistory.length === 0) {
    return <p className="text-center text-red-600 font-medium">No trade data available to display charts.</p>;
  }

  const aggregateEmotionPnl = () => {
    const emotionMap = {};
    tradeHistory.forEach(trade => {
      const emotion = trade.emotionsAfter || 'Unknown';
      if (!emotionMap[emotion]) emotionMap[emotion] = 0;
      emotionMap[emotion] += trade.pnl;
    });
    return Object.entries(emotionMap).map(([emotion, pnl]) => ({ emotion, pnl }));
  };

  const aggregateSetupPnl = () => {
    const map = {};
    tradeHistory.forEach(trade => {
      const setup = trade.strategyUsed || 'Unknown';
      if (!map[setup]) map[setup] = { total: 0, count: 0 };
      map[setup].total += trade.netPnl;
      map[setup].count++;
    });
    return Object.entries(map).map(([setup, { total, count }]) => ({
      setup,
      avgPnl: count ? total / count : 0
    }));
  };

  const dayOfWeekData = () => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const map = days.reduce((acc, day) => ({ ...acc, [day]: { total: 0, wins: 0, count: 0 } }), {});
    tradeHistory.forEach(trade => {
      const date = new Date(trade.date);
      const day = days[date.getDay()];
      map[day].total += trade.netPnl;
      map[day].count++;
      if (trade.netPnl > 0) map[day].wins++;
    });
    return days.map(day => ({
      day,
      avgPnl: map[day].count ? map[day].total / map[day].count : 0,
      winRate: map[day].count ? (map[day].wins / map[day].count) * 100 : 0
    }));
  };

  const confidenceLevelData = () => {
    const map = {};
    tradeHistory.forEach(trade => {
      const level = parseInt(trade.confidenceLevel) || 0;
      if (!map[level]) map[level] = { total: 0, count: 0 };
      map[level].total += trade.netPnl;
      map[level].count++;
    });
    return Object.entries(map)
      .map(([level, { total, count }]) => ({
        level: parseInt(level),
        avgPnl: count ? total / count : 0
      }))
      .sort((a, b) => a.level - b.level);
  };

  const emotionPnlData = aggregateEmotionPnl();
  const setupPnlData = aggregateSetupPnl();
  const dayData = dayOfWeekData();
  const confidenceData = confidenceLevelData();

  return (
    <div className="space-y-12">
      <div className="p-6 bg-zinc-50 rounded-lg shadow border border-zinc-200">
        <h3 className="text-xl font-semibold mb-4 text-slate-800">1. Emotion after trade vs Total P&L</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={emotionPnlData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="emotion" angle={-15} textAnchor="end" height={60} />
            <YAxis />
            <Tooltip formatter={val => `₹${val.toFixed(2)}`} />
            <Legend />
            <Bar dataKey="pnl" name="Total P&L">
              {emotionPnlData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.pnl >= 0 ? '#22c55e' : '#ef4444'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="p-6 bg-zinc-50 rounded-lg shadow border border-zinc-200">
        <h3 className="text-xl font-semibold mb-4 text-slate-800">2. Strategy Setup vs Avg Net P&L</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={setupPnlData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="setup" angle={-15} textAnchor="end" height={60} />
            <YAxis />
            <Tooltip formatter={val => `₹${val.toFixed(2)}`} />
            <Legend />
            <Bar dataKey="avgPnl" name="Avg Net P&L">
              {setupPnlData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.avgPnl >= 0 ? '#16a34a' : '#dc2626'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="p-6 bg-zinc-50 rounded-lg shadow border border-zinc-200">
        <h3 className="text-xl font-semibold mb-4 text-slate-800">3. Day of Week vs Avg P&L & Win Rate</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={dayData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis yAxisId="left" stroke="#3b82f6" />
            <YAxis yAxisId="right" orientation="right" stroke="#f97316" />
            <Tooltip formatter={(val, name) => name === 'Win Rate (%)' ? `${val.toFixed(1)}%` : `₹${val.toFixed(2)}`} />
            <Legend />
            <Line yAxisId="left" type="monotone" dataKey="avgPnl" stroke="#3b82f6" name="Avg P&L" />
            <Line yAxisId="right" type="monotone" dataKey="winRate" stroke="#f97316" name="Win Rate (%)" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="p-6 bg-zinc-50 rounded-lg shadow border border-zinc-200">
        <h3 className="text-xl font-semibold mb-4 text-slate-800">4. Confidence Level vs Avg P&L</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={confidenceData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="level" />
            <YAxis />
            <Tooltip formatter={val => `₹${val.toFixed(2)}`} />
            <Legend />
            <Line type="monotone" dataKey="avgPnl" stroke="#facc15" name="Avg P&L" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
