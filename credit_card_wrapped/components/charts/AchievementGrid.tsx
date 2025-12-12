
import React, { useEffect } from 'react';
import { Achievement, InsightCard } from '../../types';
import { Lock } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  data: Achievement[];
  card?: InsightCard;
}

export const AchievementGrid: React.FC<Props> = ({ data, card }) => {
  
  useEffect(() => {
    // Fire confetti when this card mounts
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#8b5cf6', '#d946ef', '#6366f1'] // Updated to purple/pink/indigo
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#8b5cf6', '#d946ef', '#6366f1']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();
  }, []);

  return (
    <div className="w-full h-full flex flex-col bg-white">
      {/* Optional Header if card provided */}
      {card && <div className={`w-full h-2 bg-gradient-to-r ${card.gradient}`} />}
      {card && (
        <div className="px-8 pt-6 pb-2 text-center">
             <h3 className="text-xl font-bold text-slate-900">{card.question}</h3>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-6 pb-8 no-scrollbar">
        <div className="grid grid-cols-2 gap-4">
          {data.map((achievement) => (
            <div 
              key={achievement.id}
              className={`
                relative p-4 rounded-2xl flex flex-col items-center text-center transition-all duration-300 border
                ${achievement.earned 
                  ? 'bg-white border-indigo-100 shadow-md shadow-indigo-100 hover:-translate-y-1' 
                  : 'bg-slate-50 border-transparent opacity-60 grayscale'}
              `}
            >
              {!achievement.earned && (
                <div className="absolute top-3 right-3 text-slate-400">
                  <Lock size={14} />
                </div>
              )}
              
              <div className="text-4xl mb-3 filter drop-shadow-sm">{achievement.emoji}</div>
              <h4 className="font-bold text-slate-800 text-sm leading-tight mb-1">{achievement.name}</h4>
              <p className="text-[11px] text-slate-500 leading-tight mb-2">{achievement.description}</p>
              
              {!achievement.earned && achievement.progress ? (
                 <div className="mt-auto text-[10px] bg-slate-200/50 px-2 py-1 rounded-md text-slate-500 font-medium">
                  {achievement.progress}
                </div>
              ) : achievement.earned ? (
                <div className="mt-auto text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                   Unlocked ✓
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
