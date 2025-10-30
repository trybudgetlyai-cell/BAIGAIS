import React, { useState, useMemo, useCallback } from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Legend, Sector } from 'recharts';
import type { BudgetCategory, Theme } from '../../types';
import { THEME_COLORS, getContrastingTextColor } from '../../constants';

interface BudgetPieChartProps {
  data: BudgetCategory[];
  currencySymbol: string;
  theme: Theme;
  palette: string[];
}

const RADIAN = Math.PI / 180;

// This component renders the "active" or hovered slice of the pie chart
const renderActiveShape = (props: any) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;
  
  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 6} // Make the active slice pop out
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
    </g>
  );
};

const BudgetPieChart: React.FC<BudgetPieChartProps> = ({ data, currencySymbol, theme, palette }) => {
  const [activeIndex, setActiveIndex] = useState(-1);
  const colors = THEME_COLORS[theme];
  const pieColors = palette;
  
  const chartData = useMemo(() => {
    const totalAllocated = data.reduce((sum, item) => sum + item.allocated, 0);
    if (totalAllocated === 0) {
      return data.map(item => ({ ...item, percentage: 0, currencySymbol }));
    }

    return data.map(item => ({
        ...item,
        percentage: (item.allocated / totalAllocated) * 100,
        currencySymbol,
    }));

  }, [data, currencySymbol]);

  const onPieEnter = useCallback((_: any, index: number) => {
    setActiveIndex(index);
  }, []);
  
  const onPieLeave = useCallback(() => {
    setActiveIndex(-1);
  }, []);

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }: any) => {
    // Hide label for small slices to prevent clutter
    if (percent < 0.05) {
      return null;
    }
    
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    
    const sliceColor = pieColors[index % pieColors.length];
    const textColor = getContrastingTextColor(sliceColor);

    return (
      <text x={x} y={y} fill={textColor} textAnchor="middle" dominantBaseline="central" className="text-xs font-bold pointer-events-none transition-opacity" style={{ opacity: activeIndex === -1 ? 1 : 0.5 }}>
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };
  
  const totalAllocated = useMemo(() => data.reduce((sum, item) => sum + item.allocated, 0), [data]);
  const activeData = activeIndex !== -1 ? chartData[activeIndex] : null;

  return (
    // Position relative is needed for the absolutely positioned center text
    <div style={{ width: '100%', height: 350, position: 'relative' }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            activeIndex={activeIndex}
            activeShape={renderActiveShape}
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius="80%"
            innerRadius="60%" // A bit larger hole for the text
            dataKey="allocated"
            paddingAngle={5}
            onMouseEnter={onPieEnter}
            onMouseLeave={onPieLeave}
          >
            {chartData.map((entry, index) => (
                <Cell 
                    key={`cell-${index}`} 
                    fill={pieColors[index % pieColors.length]}
                    className="transition-opacity"
                    style={{ opacity: activeIndex === -1 || activeIndex === index ? 1 : 0.3 }}
                />
            ))}
          </Pie>
          <Legend 
            wrapperStyle={{ 
                color: colors.textPrimary, 
                fontSize: '12px', 
                paddingTop: '20px',
                transition: 'opacity 0.2s ease',
            }} 
            formatter={(value, entry, index) => (
                <span style={{ opacity: activeIndex === -1 || activeIndex === index ? 1 : 0.5 }}>
                    {value}
                </span>
            )}
           />
        </PieChart>
      </ResponsiveContainer>
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none"
        // Adjust margin to vertically center inside the donut hole, accounting for the legend
        style={{ marginTop: '-18px' }} 
      >
        {activeData ? (
          <>
            <span className="text-sm text-text-secondary block truncate max-w-[120px]">{activeData.name}</span>
            <span className="text-xl font-bold text-text-primary block">
              {currencySymbol}{activeData.allocated.toLocaleString()}
            </span>
          </>
        ) : (
          <>
            <span className="text-sm text-text-secondary block">Total Budget</span>
            <span className="text-xl font-bold text-text-primary block">
              {currencySymbol}{totalAllocated.toLocaleString()}
            </span>
          </>
        )}
      </div>
    </div>
  );
};

export default BudgetPieChart;