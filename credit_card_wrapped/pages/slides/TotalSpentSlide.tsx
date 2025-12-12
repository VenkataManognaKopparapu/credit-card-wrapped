import React from 'react';
import { WrappedData } from '../../types';

export const TotalSpentSlide: React.FC<{ data: WrappedData }> = ({ data }) => {
  return (
    <div className="h-full flex flex-col justify-center items-center p-8 bg-wrapped-pink">
      <h2 className="text-4xl font-bold mb-8 text-black opacity-80">You spent a total of</h2>
      
      <div className="relative">
        <div className="absolute -inset-4 bg-black rounded-full blur-xl opacity-20 animate-pulse-slow"></div>
        <h1 className="relative text-7xl md:text-9xl font-black text-black tracking-tighter">
          ${Math.floor(data.totalSpent).toLocaleString()}
        </h1>
      </div>
      
      <p className="mt-8 text-2xl font-bold text-black/70 max-w-md text-center">
        That's roughly {Math.floor(data.totalSpent / 5)} burritos. 🌯
      </p>

      <div className="absolute bottom-12 left-0 right-0 text-center">
        <p className="text-black/50 font-mono text-sm uppercase tracking-widest">Transaction Count</p>
        <p className="text-4xl font-bold text-black">{data.transactionCount}</p>
      </div>
    </div>
  );
};
