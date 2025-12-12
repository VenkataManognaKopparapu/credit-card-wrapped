import React, { useState, useEffect } from 'react';
import { AiInsight } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';

interface Props {
  insights: AiInsight[];
  onComplete: () => void;
}

export const AIStoryView: React.FC<Props> = ({ insights, onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    console.log("AIStoryView rendering with subtle background");
  }, []);

  const handleNext = () => {
    if (currentIndex < insights.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onComplete();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleTap = (e: React.MouseEvent) => {
    const width = window.innerWidth;
    const x = e.clientX;
    // Don't trigger navigation if clicking buttons or content
    if ((e.target as HTMLElement).closest('button')) return;
    
    if (x < width / 3) {
      handlePrev();
    } else {
      handleNext();
    }
  };

  const currentInsight = insights[currentIndex];

  if (!currentInsight) return null;

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50 flex flex-col relative" onClick={handleTap}>
      {/* Progress Bars - Sticky Top */}
      <div className="sticky top-0 z-30 bg-gradient-to-b from-violet-50 to-transparent pb-4 px-4 pt-4 md:pt-6 w-full max-w-lg mx-auto">
        <div className="flex gap-1.5 w-full">
          {insights.map((_, idx) => (
            <div key={idx} className="h-1 flex-1 bg-slate-200 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-purple-600"
                initial={{ width: idx < currentIndex ? '100%' : '0%' }}
                animate={{ width: idx === currentIndex ? '100%' : idx < currentIndex ? '100%' : '0%' }}
                transition={{ duration: idx === currentIndex ? 5 : 0, ease: 'linear' }}
                onAnimationComplete={() => {
                  if (idx === currentIndex) handleNext();
                }}
              />
            </div>
          ))}
        </div>

        {/* Header */}
        <div className="mt-4 flex justify-between items-center">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 border border-purple-200 shadow-sm">
            <Sparkles size={14} className="text-purple-600" />
            <span className="text-purple-700 text-xs font-bold uppercase tracking-wider">AI Insight</span>
          </div>
          <button 
             onClick={(e) => { e.stopPropagation(); onComplete(); }}
             className="text-slate-400 hover:text-slate-900 text-xs font-medium px-2 py-1 transition-colors"
          >
            Skip
          </button>
        </div>
      </div>

      {/* Content - Flexible Height */}
      <div className="flex-1 flex flex-col justify-center items-center px-8 text-center relative z-10 max-w-lg mx-auto w-full py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.4 }}
            className="w-full flex flex-col items-center"
          >
             <div className="text-8xl md:text-9xl mb-12 filter drop-shadow-xl animate-bounce">
                {currentInsight.emoji}
             </div>

             <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-6 leading-tight tracking-tight">
               {currentInsight.question}
             </h2>

             <div className="bg-white/60 backdrop-blur-xl border border-white/50 p-6 md:p-8 rounded-3xl w-full shadow-xl shadow-purple-500/5 ring-1 ring-white/60">
                <p className="text-xl md:text-2xl font-bold text-slate-800 leading-relaxed">
                  {currentInsight.answer}
                </p>
                {currentInsight.tip && (
                  <p className="mt-4 text-sm text-indigo-600 border-t border-slate-200 pt-4 font-medium flex items-center justify-center gap-2">
                    <span className="bg-indigo-100 p-1 rounded-full">💡</span> {currentInsight.tip}
                  </p>
                )}
             </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="pb-8 text-center text-slate-400 text-xs z-20 font-medium">
         Tap to continue
      </div>
    </div>
  );
};