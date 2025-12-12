import React, { useEffect } from 'react';
import { Achievement } from '../types';
import { AchievementGrid } from './charts/AchievementGrid';
import { Button } from './Button';
import { ArrowRight } from 'lucide-react';

interface Props {
  achievements: Achievement[];
  onComplete: () => void;
}

export const AchievementView: React.FC<Props> = ({ achievements, onComplete }) => {
  
  useEffect(() => {
    console.log("Achievement view rendered with new design");
  }, []);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50 flex flex-col p-6 overflow-y-auto">
      <div className="flex-1 flex flex-col max-w-lg mx-auto w-full pt-8">
        <div className="text-center mb-8 animate-fade-in-up">
           <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-2">
             Your 2024 <br/> Achievements 🏆
           </h2>
           <p className="text-slate-500">
             You unlocked <span className="font-bold text-purple-600">{achievements.filter(a => a.earned).length}</span> of {achievements.length} badges!
           </p>
        </div>

        {/* Content grows naturally with flex-1 but allows scroll */}
        <div className="mb-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
           <AchievementGrid data={achievements} />
        </div>

        <div className="mt-auto pb-8">
          <Button 
            variant="dark" 
            className="w-full py-4 text-lg font-bold shadow-xl animate-fade-in-up" 
            style={{ animationDelay: '0.4s' }}
            onClick={onComplete}
          >
            See Your Summary <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};