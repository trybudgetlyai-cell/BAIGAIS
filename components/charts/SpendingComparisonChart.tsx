import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import Card from '../ui/Card';
import type { Theme } from '../../types';
import { THEME_COLORS } from '../../constants';

interface SpendingComparisonChartProps {
  theme: Theme;
  plannedColor: string;
  emotionalColor: string;
}

const data = [
  { name: 'Groceries', Planned: 400, Emotional: 50 },
  { name: 'Dining Out', Planned: 150, Emotional: 200 },
  { name: 'Shopping', Planned: 100, Emotional: 300 },
  { name: 'Entertainment', Planned: 80, Emotional: 120 },
];

const SpendingComparisonChart: React.FC<SpendingComparisonChartProps> = ({ theme, plannedColor, emotionalColor }) => {
  const colors = THEME_COLORS[theme];
  const desiredOrder = ['Planned', 'Emotional'];

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
      const total = sortedPayload.reduce((sum, item) => sum + item.value, 0);

      return (
        <div className="bg-bg-primary p-3 rounded-md border border-accent-primary shadow-lg text-sm">
          <p className="font-bold text-text-primary mb-2">{label}</p>
          {sortedPayload.map((pld: any, index: number) => (
            <p key={index} style={{ color: pld.color }}>
              {`${pld.name}: ${pld.value.toLocaleString()}`}
            </p>
          ))}
           <div className="border-t border-border my-1"></div>
           <p className="font-semibold text-text-primary">Total: {total.toLocaleString()}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <h3 className="text-lg font-bold text-text-primary mb-4">Planned vs. Emotional Spending</h3>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <BarChart data={data} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
            <XAxis type="number" stroke={colors.textSecondary} />
            <YAxis type="category" dataKey="name" stroke={colors.textSecondary} width={80}/>
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
            <Legend content={renderLegend} />
            <Bar dataKey="Planned" stackId="a" fill={plannedColor} name="Planned" />
            <Bar dataKey="Emotional" stackId="a" fill={emotionalColor} name="Emotional" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default SpendingComparisonChart;