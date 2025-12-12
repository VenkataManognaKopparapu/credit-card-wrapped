
import React from 'react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { InsightCard } from '../../types';

interface Props {
  data: number[];
  card: InsightCard;
}

export const MonthlyChart: React.FC<Props> = ({ data, card }) => {
  const chartData = data.map((amount, index) => ({
    name: new Date(0, index).toLocaleString('default', { month: 'short' }),
    amount: amount
  }));

  const totalSpent = data.reduce((a, b) => a + b, 0);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 text-white p-3 border border-slate-700 shadow-xl rounded-xl text-xs">
          <p className="font-bold opacity-70 mb-1">{label}</p>
          <p className="font-mono text-emerald-400 font-bold text-lg">
            ${Math.floor(payload[0].value).toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-full flex flex-col bg-slate-50">
      {/* Header Section */}
      <div className={`w-full h-2 bg-gradient-to-r ${card.gradient}`} />
      
      <div className="px-8 pt-6 pb-2">
        <h3 className="text-xl font-bold text-slate-900">{card.question}</h3>
        <div className="mt-2">
           <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Total Spending</p>
           <p className="text-4xl font-black text-slate-900 tracking-tight">
             ${Math.floor(totalSpent).toLocaleString()}
           </p>
        </div>
      </div>

      <div className="flex-1 w-full min-h-0 px-4 pb-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 20, right: 10, left: 10, bottom: 20 }}>
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#64748b', fontSize: 10, fontWeight: 600 }} 
              interval={0}
              dy={10}
            />
            <Tooltip cursor={{ fill: '#e2e8f0' }} content={<CustomTooltip />} />
            <Bar dataKey="amount" radius={[6, 6, 6, 6]}>
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={`url(#colorGradient-${index})`} 
                />
              ))}
            </Bar>
            <defs>
              {chartData.map((_, index) => (
                 <linearGradient key={`grad-${index}`} id={`colorGradient-${index}`} x1="0" y1="0" x2="0" y2="1">
                   <stop offset="0%" stopColor="#8b5cf6" />
                   <stop offset="100%" stopColor="#3b82f6" />
                 </linearGradient>
              ))}
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
