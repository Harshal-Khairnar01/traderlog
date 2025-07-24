"use client";

import React from 'react';
import { Shield, TrendingDown, DollarSign, Target } from 'lucide-react';

import MetricCard from '@/components/MatricCard';
import { usePerformanceMetrics } from '@/hooks/usePerformanceMetrics';
import { formatCurrency, formatRR } from '@/utils/formatters';

const RiskReport = ({ tradeHistory }) => {
  const metrics = usePerformanceMetrics(tradeHistory);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      <MetricCard
        title="Risk Management"
        icon={Shield}
        subValues={[
          { label: 'Planned Risk Reward Ratio', value: formatRR(metrics.plannedRiskRewardRatio), valueColor: metrics.plannedRiskRewardRatio >= 1 ? 'text-green-500' : 'text-red-500' },
          { label: 'Realized Risk Reward Ratio', value: formatRR(metrics.realizedRiskRewardRatio), valueColor: metrics.realizedRiskRewardRatio >= 1 ? 'text-green-500' : 'text-red-500' },
          { label: 'Avg Loss', value: formatCurrency(metrics.avgLoss), valueColor: 'text-red-500' },
          { label: 'Max Drawdown', value: formatCurrency(metrics.maxDrawdown), valueColor: 'text-red-500' },
          { label: 'Expectancy ($ per R)', value: formatCurrency(metrics.expectancyPerR), valueColor: metrics.expectancyPerR > 0 ? 'text-green-500' : 'text-red-500' },
        ]}
      />
    </div>
  );
};

export default RiskReport;