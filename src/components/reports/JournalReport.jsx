// components/JournalReport.jsx
"use client";

import React from 'react';
import { Sparkles, XCircle, CheckCircle, Brain, Layout } from 'lucide-react';

import MetricCard from '@/components/MatricCard';
import { useJournalMetrics } from '@/hooks/useJournalMetrics';
import { formatCurrency } from '@/utils/formatters';

const JournalReport = ({ tradeHistory }) => {
  const {
    mostFrequentMistakes,
    mostFrequentSuccesses,
    pnlByMistake,
    pnlBySuccess,
    mostUsedSetup,
    setupPerformance,
    overallSentiment,
  } = useJournalMetrics(tradeHistory);

  return (
    <div className="p-4 space-y-8">
      
      {/* Actionable Insights: Mistakes & Successes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <MetricCard
          title="Top 5 Mistakes"
          icon={XCircle}
          subValues={pnlByMistake.map(item => ({
            label: item.label,
            value: formatCurrency(item.value),
            valueColor: 'text-red-500',
          }))}
          footerText="Average P&L when this mistake was made. Focus on these."
        />
        <MetricCard
          title="Top 5 Successes"
          icon={CheckCircle}
          subValues={pnlBySuccess.map(item => ({
            label: item.label,
            value: formatCurrency(item.value),
            valueColor: 'text-green-500',
          }))}
          footerText="Average P&L when this success was noted. Repeat these actions."
        />
        <MetricCard
          title="Frequent Behaviors"
          icon={Sparkles}
          subValues={[...mostFrequentMistakes.map(m => ({ label: `Mistake: ${m.label}`, value: m.value })), ...mostFrequentSuccesses.map(s => ({ label: `Success: ${s.label}`, value: s.value }))]
            .sort((a,b) => parseInt(b.value) - parseInt(a.value))
            .slice(0, 5)}
          footerText="Most common self-reflections, good or bad."
        />
      </div>

      {/* Setup Performance */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <MetricCard
          title="Most Used Setup"
          icon={Layout}
          mainValue={mostUsedSetup.setup}
          footerText={`${mostUsedSetup.count} trades used this setup.`}
        />
        <MetricCard
          title="Setup Performance"
          icon={Layout}
          subValues={setupPerformance.map(setup => ({
            label: `${setup.label} (Win Rate: ${setup.winRate.toFixed(1)}%)`,
            value: formatCurrency(setup.avgPnl),
            valueColor: setup.avgPnl > 0 ? 'text-green-500' : (setup.avgPnl < 0 ? 'text-red-500' : 'text-gray-400')
          }))}
          footerText="Avg P&L per trade for each setup."
        />
      </div>

      {/* Trader's Emotional State Summary */}
      <div className="grid grid-cols-1 gap-6">
        <MetricCard
          title="Overall Emotional Sentiment"
          icon={Brain}
          subValues={overallSentiment.map(item => ({
            label: item.label,
            value: item.value,
          }))}
          footerText="Your most common emotions before and after trades."
        />
      </div>

    </div>
  );
};

export default JournalReport;