import React, { useEffect, useState } from 'react';
import { Brain } from 'lucide-react';

interface Props {
  onComplete: () => void;
}

export const LoadingScreen: React.FC<Props> = ({ onComplete }) => {
  const [loadingText, setLoadingText] = useState("Analyzing your patterns... 🔍");

  useEffect(() => {
    const messages = [
      "Analyzing your patterns... 🔍",
      "Discovering insights... 💡",
      "Unlocking achievements... 🏆",
      "Almost ready... ⏳"
    ];
    let msgIndex = 0;
    
    // Rotate messages
    const msgInterval = setInterval(() => {
      msgIndex = (msgIndex + 1) % messages.length;
      setLoadingText(messages[msgIndex]);
    }, 1500);

    // Auto complete after duration
    const completeTimeout = setTimeout(() => {
      onComplete();
    }, 4500);

    return () => {
      clearInterval(msgInterval);
      clearTimeout(completeTimeout);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900 flex flex-col items-center justify-center p-6 text-center overflow-y-auto">
       <div className="relative mb-8">
         <div className="w-24 h-24 bg-indigo-600 rounded-full flex items-center justify-center animate-pulse">
           <Brain className="text-white w-12 h-12" />
         </div>
         <div className="absolute -inset-4 border-2 border-indigo-500/30 rounded-full animate-spin"></div>
       </div>

       <h3 className="text-2xl font-bold text-white mb-2 animate-pulse min-h-[3rem]">
         {loadingText}
       </h3>
       
       <div className="w-64 h-2 bg-slate-800 rounded-full mt-4 overflow-hidden">
         <div className="h-full bg-indigo-500 animate-[width_4s_ease-in-out_infinite]" style={{ width: '0%' }}></div>
       </div>
    </div>
  );
};