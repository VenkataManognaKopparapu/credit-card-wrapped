
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { InsightCard as InsightCardType } from '../types';
import { MousePointerClick, RefreshCcw } from 'lucide-react';
import { MonthlyChart } from './charts/MonthlyChart';
import { CategoryChart } from './charts/CategoryChart';
import { CardBreakdownChart } from './charts/CardBreakdownChart';
import { AchievementGrid } from './charts/AchievementGrid';

interface Props {
  card: InsightCardType;
  isActive: boolean;
  onAction?: (action: string) => void;
}

export const InsightCard: React.FC<Props> = ({ card, isActive, onAction }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const isChart = card.type === 'monthly-chart' || 
                  card.type === 'category-chart' || 
                  card.type === 'card-breakdown' || 
                  card.type === 'achievement-grid';
  
  // Reset flip state when card changes
  React.useEffect(() => {
    if (!isActive) {
      const timer = setTimeout(() => setIsFlipped(false), 500);
      return () => clearTimeout(timer);
    }
  }, [isActive, card.id]);

  const handleFlip = () => {
    if (!isChart) {
      setIsFlipped(!isFlipped);
    }
  };

  const containerClasses = card.isPremium 
    ? "bg-slate-900 border-indigo-500/50 shadow-indigo-500/20" 
    : "bg-white border-slate-100 shadow-xl";

  const textClasses = card.isPremium
    ? "text-white"
    : "text-slate-800";

  // SPECIAL CARD: Charts & Grids
  if (isChart) {
    return (
      <div className="w-full h-full relative">
        <div className={`absolute inset-0 rounded-3xl flex flex-col items-center border overflow-hidden ${containerClasses}`}>
          <div className="flex-1 w-full min-h-0 relative bg-white">
             {card.type === 'monthly-chart' && <MonthlyChart data={card.chartData} card={card} />}
             {card.type === 'category-chart' && <CategoryChart data={card.chartData} card={card} />}
             {card.type === 'card-breakdown' && <CardBreakdownChart data={card.chartData} card={card} />}
             {card.type === 'achievement-grid' && <AchievementGrid data={card.chartData} card={card} />}
          </div>
        </div>
      </div>
    );
  }

  // STANDARD FLIP CARD
  return (
    <div className="w-full h-full perspective-1000">
      <motion.div
        className="relative w-full h-full cursor-pointer preserve-3d"
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: 'spring', stiffness: 260, damping: 20 }}
        onClick={handleFlip}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* FRONT */}
        <div 
          className={`absolute inset-0 backface-hidden rounded-3xl p-6 md:p-8 flex flex-col justify-between items-center text-center border overflow-hidden ${containerClasses}`}
          style={{ backfaceVisibility: 'hidden' }}
        >
          {/* Decorative element to show color */}
          <div className={`absolute top-0 inset-x-0 h-2 bg-gradient-to-r ${card.gradient}`} />
          {card.isPremium && <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 pointer-events-none" />}

          <div className="absolute top-4 right-4">
             {card.isPremium && <span className="bg-indigo-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest shadow-lg shadow-indigo-500/40">Premium AI</span>}
          </div>

          <div className="flex-1 flex flex-col justify-center items-center w-full px-2 min-h-0 relative z-10">
            <span className="text-6xl md:text-8xl mb-6 animate-bounce drop-shadow-md shrink-0">{card.emoji}</span>
            <h3 className={`text-xl md:text-3xl font-black leading-tight break-words hyphens-auto w-full ${textClasses}`}>
              {card.question}
            </h3>
          </div>
          
          <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs md:text-sm font-semibold animate-pulse border shrink-0 mt-4 relative z-10 ${card.isPremium ? 'bg-white/10 text-white border-white/20' : 'bg-slate-50 text-slate-400 border-slate-100'}`}>
            <MousePointerClick size={16} />
            <span>Tap to reveal</span>
          </div>
        </div>

        {/* BACK */}
        <div 
          className={`absolute inset-0 backface-hidden rounded-3xl p-6 md:p-8 flex flex-col justify-between items-center text-center border overflow-hidden ${containerClasses}`}
          style={{ 
            backfaceVisibility: 'hidden', 
            transform: 'rotateY(180deg)' 
          }}
        >
          {/* Decorative element */}
          <div className={`absolute bottom-0 inset-x-0 h-2 bg-gradient-to-r ${card.gradient}`} />
          {card.isPremium && <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 pointer-events-none" />}

          <div className="w-full flex justify-end shrink-0 mb-2 relative z-10">
            <button className={`p-2 transition-colors ${card.isPremium ? 'text-white/50 hover:text-white' : 'text-slate-300 hover:text-slate-500'}`}>
              <RefreshCcw size={20} />
            </button>
          </div>

          <div className="flex-1 flex flex-col justify-center items-center w-full px-2 min-h-0 relative z-10">
            <div className={`font-black text-2xl md:text-4xl mb-6 leading-tight break-words hyphens-auto w-full text-transparent bg-clip-text bg-gradient-to-br ${card.gradient}`}>
              {card.answerValue}
            </div>
            <div className="w-full overflow-y-auto max-h-[50%]">
              <p className={`text-base md:text-lg font-medium leading-relaxed break-words px-1 ${card.isPremium ? 'text-slate-300' : 'text-slate-600'}`}>
                {card.answerDescription}
              </p>
            </div>
          </div>

          <div className="text-3xl opacity-50 grayscale hover:grayscale-0 transition-all shrink-0 mt-4">{card.emoji}</div>
        </div>
      </motion.div>
    </div>
  );
};
