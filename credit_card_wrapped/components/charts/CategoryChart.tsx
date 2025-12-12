
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { SpendingCategory, InsightCard } from '../../types';

interface Props {
  data: SpendingCategory[];
  card: InsightCard;
}

export const CategoryChart: React.FC<Props> = ({ data, card }) => {
  const top3 = data.slice(0, 3);
  
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const d = payload[0].payload;
      return (
        <div className="bg-slate-900 text-white p-3 border border-slate-700 shadow-xl rounded-xl text-xs z-50">
          <p className="font-bold mb-1">{d.name}</p>
          <p className="font-mono text-lg font-bold">
            ${Math.floor(d.amount).toLocaleString()}
          </p>
          <p className="opacity-70">{Math.round(d.percentage)}%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-full flex flex-col bg-white">
      {/* Header */}
      <div className={`w-full h-2 bg-gradient-to-r ${card.gradient}`} />
      
      <div className="px-8 pt-6 pb-2 text-center">
        <h3 className="text-xl font-bold text-slate-900">{card.question}</h3>
      </div>

      {/* Chart Area */}
      <div className="flex-1 w-full min-h-0 relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={90}
              paddingAngle={4}
              dataKey="amount"
              cornerRadius={6}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.color} 
                  stroke="none"
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        
        {/* Donut Center Text */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
          <p className="text-slate-400 text-[10px] uppercase tracking-wider font-bold">Top</p>
          <p className="text-3xl font-black text-slate-900">{data.length}</p>
          <p className="text-slate-400 text-[10px] uppercase tracking-wider font-bold">Cats</p>
        </div>
      </div>

      {/* Legend & Summary */}
      <div className="px-6 pb-8">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 text-center">Top Categories</p>
        <div className="space-y-3">
          {top3.map((cat, idx) => (
             <div key={idx} className="flex items-center justify-between group">
               <div className="flex items-center gap-3">
                 <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: cat.color }} />
                 <span className="text-sm font-semibold text-slate-700">{cat.name}</span>
               </div>
               <div className="text-right">
                  <span className="block text-sm font-bold text-slate-900">${Math.floor(cat.amount).toLocaleString()}</span>
                  <span className="text-[10px] font-medium text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-full">{Math.round(cat.percentage)}%</span>
               </div>
             </div>
          ))}
        </div>
      </div>
    </div>
  );
};
