
import React from 'react';
import CashFlowChart from './charts/CashFlowChart';
import SpendingComparisonChart from './charts/SpendingComparisonChart';
import type { Theme } from '../types';

interface AnalysisProps {
    theme: Theme;
    incomeColor: string;
    expenseColor: string;
}

const Analysis: React.FC<AnalysisProps> = ({ theme, incomeColor, expenseColor }) => {
  return (
    <div className="space-y-6">
      <CashFlowChart theme={theme} incomeColor={incomeColor} expenseColor={expenseColor} />
      <SpendingComparisonChart theme={theme} plannedColor={incomeColor} emotionalColor={expenseColor} />
    </div>
  );
};

export default Analysis;
