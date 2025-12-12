import React from 'react';
import { WrappedData } from '../../types';

export const PersonaSlide: React.FC<{ data: WrappedData }> = ({ data }) => {
  return (
    <div className="h-full flex flex-col justify-center items-center p-8 bg-gradient-to-br from-orange-500 to-red-600 text-white">
      <h2 className="text-2xl font-bold mb-8 text-white/80 uppercase tracking-widest">Your Spending Persona</h2>
      
      <div className="w-64 h-64 bg-black/20 rounded-full flex items-center justify-center mb-8 backdrop-blur-lg border-4 border-white/20 shadow-2xl">
        <span className="text-9xl animate-pulse-slow">{data.persona.emoji}</span>
      </div>

      <h1 className="text-4xl md:text-6xl font-black mb-6 text-center leading-tight">
        {data.persona.title}
      </h1>

      <div className="bg-black/30 p-6 rounded-2xl max-w-lg backdrop-blur-md">
        <p className="text-xl font-medium text-center mb-4 leading-relaxed">
          "{data.persona.description}"
        </p>
        <div className="border-t border-white/20 pt-4 mt-4">
          <p className="text-sm uppercase text-white/60 mb-1 font-bold">The Roast</p>
          <p className="italic text-lg text-yellow-200">
            {data.persona.roast}
          </p>
        </div>
      </div>
    </div>
  );
};
