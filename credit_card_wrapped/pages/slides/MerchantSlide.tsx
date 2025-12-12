import React from 'react';
import { WrappedData } from '../../types';
import { Crown } from 'lucide-react';

export const MerchantSlide: React.FC<{ data: WrappedData }> = ({ data }) => {
  return (
    <div className="h-full flex flex-col justify-center items-center p-8 bg-wrapped-purple text-white relative overflow-hidden">
      
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
           <div 
             key={i} 
             className="absolute text-9xl font-black"
             style={{
               top: `${Math.random() * 100}%`,
               left: `${Math.random() * 100}%`,
               transform: `rotate(${Math.random() * 90 - 45}deg)`
             }}
           >
             {data.topMerchant.name}
           </div>
        ))}
      </div>

      <div className="z-10 text-center">
        <div className="inline-block p-4 bg-white text-wrapped-purple rounded-full mb-6 shadow-2xl animate-bounce">
          <Crown size={48} fill="currentColor" />
        </div>
        
        <h2 className="text-3xl font-bold mb-2">You kept them in business</h2>
        <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tighter uppercase break-words">
          {data.topMerchant.name}
        </h1>

        <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
          <div className="bg-black/20 p-4 rounded-2xl backdrop-blur-sm">
            <p className="text-sm opacity-75 uppercase tracking-wider">Times Visited</p>
            <p className="text-4xl font-black">{data.topMerchant.count}</p>
          </div>
          <div className="bg-black/20 p-4 rounded-2xl backdrop-blur-sm">
            <p className="text-sm opacity-75 uppercase tracking-wider">Total Spent</p>
            <p className="text-4xl font-black">${Math.floor(data.topMerchant.amount)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
