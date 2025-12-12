import React from 'react';
import { InsightCard, WrappedData } from '../types';
import { CardSwiper } from './CardSwiper';

interface Props {
  cards: InsightCard[];
  onComplete: () => void;
  data: WrappedData;
}

export const RegularCardsView: React.FC<Props> = ({ cards, onComplete, data }) => {
  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center py-8">
      <CardSwiper 
        cards={cards} 
        onComplete={onComplete} 
      />
    </div>
  );
};