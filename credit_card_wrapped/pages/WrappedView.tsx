import React, { useState, useEffect } from 'react';
import { WrappedData, AiInsight, WrappedSection } from '../types';
import { X, Wrench } from 'lucide-react';
import { generateCards } from '../utils/generateCards';
import { generatePremiumInsights } from '../services/geminiService';
import { calculateAchievements } from '../utils/achievements';

// Views
import { RegularCardsView } from '../components/RegularCardsView';
import { UnlockScreen } from '../components/UnlockScreen';
import { LoadingScreen } from '../components/LoadingScreen';
import { AIStoryView } from '../components/AIStoryView';
import { AchievementView } from '../components/AchievementView';
import { CompletionScreen } from '../components/CompletionScreen';
import { ChatbotScreen } from '../components/ChatbotScreen';

interface WrappedViewProps {
  data: WrappedData;
  onReset: () => void;
}

export const WrappedView: React.FC<WrappedViewProps> = ({ data, onReset }) => {
  const [section, setSection] = useState<WrappedSection>('regular');
  const [cards] = useState(() => generateCards(data));
  const [aiInsights, setAiInsights] = useState<AiInsight[]>([]);
  // Initialize with data.achievements if present (from upload), otherwise calc with empty (for demo/fallback)
  const [achievements, setAchievements] = useState(() => {
    if (data.achievements && data.achievements.length > 0) {
      return data.achievements;
    }
    // Only happens if data didn't come from processFiles (e.g. legacy demo without pre-calc)
    return calculateAchievements([], data);
  });

  // Handler to fetch premium data during loading
  const handlePremiumFetch = async () => {
    try {
      const insights = await generatePremiumInsights(data);
      setAiInsights(insights);
      // Removed the buggy recalculation that passed [] as transactions
      
      setSection('ai-story');
    } catch (e) {
      console.error("Premium fetch failed", e);
      // Fallback to achievements if AI fails
      setSection('achievement');
    }
  };

  // Replay logic
  const handleReplay = () => {
    setSection('regular');
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 flex flex-col items-center justify-center relative">
      
      {/* Background Ambience (Only for regular flow) */}
      {section === 'regular' && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-200/40 rounded-full blur-3xl animate-pulse-slow"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-200/40 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
        </div>
      )}

      {/* Exit Button - Fixed to viewport */}
      <div className="fixed top-6 right-6 z-[60]">
        <button 
          onClick={onReset} 
          className="p-2 bg-white/50 hover:bg-white rounded-full text-slate-800 backdrop-blur-sm transition-colors shadow-sm"
        >
           <X size={20} />
        </button>
      </div>

      {/* VIEW ORCHESTRATION */}
      {/* Each view is now responsible for its own container height/scrolling */}
      
      {section === 'regular' && (
        <RegularCardsView 
          cards={cards} 
          onComplete={() => setSection('chatbot')} 
          data={data}
        />
      )}

      {section === 'chatbot' && (
        <ChatbotScreen 
          data={data}
          onContinue={() => setSection('unlock')}
        />
      )}

      {section === 'unlock' && (
        <UnlockScreen 
          onUnlock={() => setSection('loading')} 
        />
      )}

      {section === 'loading' && (
        <LoadingScreen 
          onComplete={handlePremiumFetch} 
        />
      )}

      {section === 'ai-story' && (
        <AIStoryView 
          insights={aiInsights} 
          onComplete={() => setSection('achievement')} 
        />
      )}

      {section === 'achievement' && (
        <AchievementView 
          achievements={achievements} 
          onComplete={() => setSection('complete')} 
        />
      )}

      {section === 'complete' && (
        <CompletionScreen 
          data={data} 
          onReset={onReset}
          onReplay={handleReplay}
        />
      )}

      {/* Debug Shortcut - Fixed to viewport */}
      {section === 'regular' && (
        <button 
            onClick={() => setSection('chatbot')}
            className="fixed bottom-4 right-4 z-50 p-2 bg-slate-200 text-slate-500 rounded-full hover:bg-slate-300 opacity-50 hover:opacity-100 text-xs flex items-center gap-1"
        >
            <Wrench size={12} /> Skip to Chat
        </button>
      )}
    </div>
  );
};