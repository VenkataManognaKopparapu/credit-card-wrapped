import React from 'react';
import { Brain, Sparkles } from 'lucide-react';
import { Button } from './Button';

interface Props {
  onUnlock: () => void;
}

export const UnlockScreen: React.FC<Props> = ({ onUnlock }) => {
  return (
    <div className="fixed inset-0 z-40 bg-slate-900/80 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center animate-fade-in-up overflow-y-auto">
      <div className="w-full max-w-lg mx-auto flex flex-col items-center justify-center min-h-full">
        <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-indigo-500/30 animate-bounce">
          <Brain className="text-white w-10 h-10" />
        </div>
        
        <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
          Ready for Something <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-amber-500">Special? ✨</span>
        </h2>
        <p className="text-slate-300 text-lg mb-10 max-w-sm leading-relaxed">
          Unlock your AI-powered insights and discover your unique financial personality.
        </p>

        <Button 
          variant="secondary" 
          className="w-full max-w-xs py-4 text-lg font-bold shadow-lg shadow-emerald-500/20 scale-100 hover:scale-105 transition-transform"
          onClick={onUnlock}
        >
          <Sparkles className="w-5 h-5 mr-2" /> Unlock Premium Insights
        </Button>
        
        <p className="mt-6 text-xs text-slate-500 font-medium tracking-wide uppercase">Powered by Gemini AI</p>
      </div>
    </div>
  );
};