import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { WrappedData } from '../../types';

export const CategorySlide: React.FC<{ data: WrappedData }> = ({ data }) => {
  return (
    <div className="h-full flex flex-col justify-center items-center p-8 bg-[#121212]">
      <h2 className="text-3xl font-bold mb-4 text-white">Your Top Categories</h2>
      
      <div className="w-full h-64 mb-8">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data.topCategories}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={5}
              dataKey="amount"
            >
              {data.topCategories.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="w-full max-w-sm space-y-3">
        {data.topCategories.map((cat, idx) => (
          <div key={idx} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
              <span className="font-bold text-lg">{cat.name}</span>
            </div>
            <span className="font-mono text-gray-400">${Math.floor(cat.amount).toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
