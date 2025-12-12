import React from 'react';

interface ProgressBarProps {
  total: number;
  current: number;
  onNext: () => void;
  isPlaying: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ total, current, onNext, isPlaying }) => {
  return (
    <div className="absolute top-4 left-0 right-0 z-50 flex gap-2 px-4">
      {Array.from({ length: total }).map((_, index) => (
        <ProgressItem 
          key={index} 
          index={index} 
          currentIndex={current} 
          onFinish={onNext}
          isPlaying={isPlaying}
        />
      ))}
    </div>
  );
};

const ProgressItem: React.FC<{ index: number; currentIndex: number; onFinish: () => void; isPlaying: boolean }> = ({ 
  index, 
  currentIndex, 
  onFinish,
  isPlaying 
}) => {
  const isActive = index === currentIndex;
  const isPast = index < currentIndex;

  return (
    <div className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden">
      <div 
        className={`h-full bg-white transition-all duration-100 ease-linear ${isPast ? 'w-full' : 'w-0'}`}
        style={isActive && isPlaying ? { 
          width: '100%', 
          transition: 'width 5s linear' 
        } : {}}
        onTransitionEnd={() => {
          if (isActive) onFinish();
        }}
      />
    </div>
  );
};
