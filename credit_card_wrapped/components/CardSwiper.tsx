
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { InsightCard as InsightCardType } from '../types';
import { InsightCard } from './InsightCard';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface Props {
  cards: InsightCardType[];
  onComplete: () => void;
  onCardAction?: (action: string) => void;
}

export const CardSwiper: React.FC<Props> = ({ cards, onComplete, onCardAction }) => {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right

  // Reset index if cards array changes length drastically (re-mount logic mostly handled by parent)
  useEffect(() => {
    if (index >= cards.length && cards.length > 0) {
      setIndex(0);
    }
  }, [cards.length]);

  const nextCard = () => {
    if (index < cards.length - 1) {
      setDirection(1);
      setIndex(index + 1);
    } else {
      onComplete();
    }
  };

  const prevCard = () => {
    if (index > 0) {
      setDirection(-1);
      setIndex(index - 1);
    }
  };

  const handleDragEnd = (e: any, { offset, velocity }: any) => {
    const swipeThreshold = 50;
    if (offset.x < -swipeThreshold) {
      nextCard();
    } else if (offset.x > swipeThreshold) {
      prevCard();
    }
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 500 : -500,
      opacity: 0,
      scale: 0.8,
      rotate: direction > 0 ? 20 : -20
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
      rotate: 0
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 500 : -500,
      opacity: 0,
      scale: 0.8,
      rotate: direction < 0 ? 20 : -20
    })
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full max-w-md mx-auto relative px-4 py-8">
      {/* Cards Container */}
      <div className="relative w-full aspect-[3/4] md:aspect-[9/14] mb-8">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={index}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={handleDragEnd}
            className="absolute w-full h-full cursor-grab active:cursor-grabbing"
          >
            {cards[index] ? (
               <InsightCard 
                  card={cards[index]} 
                  isActive={true} 
                  onAction={onCardAction}
               />
            ) : (
                <div className="flex items-center justify-center h-full text-slate-400">Loading card...</div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between w-full max-w-xs px-4">
        <button 
          onClick={prevCard}
          disabled={index === 0}
          className={`p-3 rounded-full bg-white shadow-md text-slate-800 hover:bg-slate-50 transition-all ${index === 0 ? 'opacity-30 cursor-not-allowed shadow-none' : ''}`}
        >
          <ArrowLeft size={24} />
        </button>

        <div className="text-slate-400 text-sm font-medium">
          Card {index + 1} of {cards.length}
        </div>

        <button 
          onClick={nextCard}
          className="p-3 rounded-full bg-slate-900 text-white hover:bg-slate-800 transition-all shadow-lg"
        >
          <ArrowRight size={24} />
        </button>
      </div>
      
      <p className="text-slate-400 text-xs mt-4">Swipe to navigate</p>
    </div>
  );
};
