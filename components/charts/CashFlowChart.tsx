import React, { useState } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import Card from '../ui/Card';
import type { Theme } from '../../types';
import { THEME_COLORS } from '../../constants';

type TimePeriod = '1M' | '3M' | '6M' | '1Y';

interface CashFlowChartProps {
  theme: Theme;
  incomeColor: string;
  expenseColor: string;
}

const allData = {
  '1M': [
    { name: 'Week 1', Income: 1000, Expenses: 600 },
    { name: 'Week 2', Income: 1200, Expenses: 750 },
    { name: 'Week 3', Income: 900, Expenses: 800 },
    { name: 'Week 4', Income: 1100, Expenses: 550 },
  ],
  '3M': [
    { name: 'Apr', Income: 2780, Expenses: 3908 },
    { name: 'May', Income: 1890, Expenses: 4800 },
    { name: 'Jun', Income: 2390, Expenses: 3800 },
  ],
  '6M': [
    { name: 'Jan', Income: 4000, Expenses: 2400 },
    { name: 'Feb', Income: 3000, Expenses: 1398 },
    { name: 'Mar', Income: 2000, Expenses: 9800 },
    { name: 'Apr', Income: 2780, Expenses: 3908 },
    { name: 'May', Income: 1890, Expenses: 4800 },
    { name: 'Jun', Income: 2390, Expenses: 3800 },
  ],
  '1Y': [
    { name: 'Jul', Income: 4200, Expenses: 2500 },
    { name: 'Aug', Income: 3100, Expenses: 1500 },
    { name: 'Sep', Income: 2100, Expenses: 3100 },
    { name: 'Oct', Income: 2900, Expenses: 4000 },
    { name: 'Nov', Income: 2000, Expenses: 4900 },
    { name: 'Dec', Income: 5000, Expenses: 3000 },
    { name: 'Jan', Income: 4000, Expenses: 2400 },
    { name: 'Feb', Income: 3000, Expenses: 1398 },
    { name: 'Mar', Income: 2000, Expenses: 9800 },
    { name: 'Apr', Income: 2780, Expenses: 3908 },
    { name: 'May', Income: 1890, Expenses: 4800 },
    { name: 'Jun', Income: 2390, Expenses: 3800 },
  ]
};

const CashFlowChart: React.FC<CashFlowChartProps> = ({ theme, incomeColor, expenseColor }) => {
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('6M');
  const colors = THEME_COLORS[theme];
  const desiredOrder = ['Income', 'Expenses'];

  const renderLegend = (props: any) => {
    const { payload } = props;
    const sortedPayload = [...payload].sort((a: any, b: any) => desiredOrder.indexOf(a.value) - desiredOrder.indexOf(b.value));

    return (
      <div className="flex justify-center items-center gap-4 mt-2">
        {sortedPayload.map((entry: any, index: number) => (
          <div key={`item-${index}`} className="flex items-center gap-2 text-sm" style={{ color: colors.textPrimary }}>
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: entry.color }}></div>
            <span>{entry.value}</span>
          </div>
        ))}
      </div>
    );
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const sortedPayload = [...payload].sort((a: any, b: any) => desiredOrder.indexOf(a.name) - desiredOrder.indexOf(b.name));

      return (
        <div className="bg-bg-primary p-3 rounded-md border border-accent-primary shadow-lg text-sm">
          <p className="font-bold text-text-primary mb-2">{label}</p>
          {sortedPayload.map((pld: any, index: number) => (
            <p key={index} style={{ color: pld.color }}>
              {`${pld.name}: ${pld.value.toLocaleString()}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="mt-6">
       <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-text-primary">Cash Flow</h3>
        <div className="flex gap-1 rounded-md bg-bg-primary p-1">
            {(['1M', '3M', '6M', '1Y'] as const).map((period) => (
                <button 
                    key={period} 
                    onClick={() => setTimePeriod(period)} 
                    className={`px-2 py-1 text-xs font-semibold rounded-md transition-colors ${
                        timePeriod === period 
                        ? 'bg-accent-primary text-accent-text' 
                        : 'text-text-secondary hover:bg-text-secondary/20'
                    }`}
                >
                    {period}
                </button>
            ))}
        </div>
      </div>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <BarChart data={allData[timePeriod]}>
            <XAxis dataKey="name" stroke={colors.textSecondary} />
            <YAxis stroke={colors.textSecondary} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
            <Legend content={renderLegend} />
            <Bar dataKey="Income" fill={incomeColor} name="Income"/>
            <Bar dataKey="Expenses" fill={expenseColor} name="Expenses"/>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default CashFlowChart;