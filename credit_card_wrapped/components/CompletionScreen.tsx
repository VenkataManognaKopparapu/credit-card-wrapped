import React, { useState } from 'react';
import { WrappedData } from '../types';
import { Button } from './Button';
import { Share2, RotateCcw, Crown, ShoppingBag, CreditCard } from 'lucide-react';
import { ShareModal } from './ShareModal';

interface Props {
  data: WrappedData;
  onReset: () => void;
  onReplay: () => void;
}

export const CompletionScreen: React.FC<Props> = ({ data, onReset, onReplay }) => {
  const [showShare, setShowShare] = useState(false);

  return (
    <div className="w-full min-h-screen flex items-center justify-center p-6 bg-slate-50">
      <div className="w-full max-w-md text-center animate-fade-in-up py-12">
          <div className="inline-block mb-6 p-4 rounded-full bg-gradient-to-r from-emerald-400 to-teal-400 shadow-xl shadow-emerald-500/20 animate-bounce">
              <span className="text-4xl">🎉</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-2 tracking-tight">
              That's a Wrap!
          </h1>
          <p className="text-slate-500 text-lg mb-8">You've uncovered your 2024 financial story.</p>
          
          {/* Stats Summary Card */}
          <div className="bg-white rounded-3xl shadow-xl shadow-slate-200 border border-slate-100 mb-8 overflow-hidden">
             <div className="bg-slate-900 p-6 text-white text-left">
                <p className="text-xs uppercase font-bold text-slate-400 mb-1">Total Spent</p>
                <h2 className="text-4xl font-black tracking-tight">${Math.floor(data.totalSpent).toLocaleString()}</h2>
             </div>
             
             <div className="p-6 grid gap-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                   <div className="flex items-center gap-3 text-left">
                      <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                         <CreditCard size={20} />
                      </div>
                      <div>
                         <p className="text-sm font-bold text-slate-900">Transactions</p>
                         <p className="text-xs text-slate-500">Processed this year</p>
                      </div>
                   </div>
                   <span className="text-xl font-bold text-slate-800">{data.transactionCount}</span>
                </div>

                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                   <div className="flex items-center gap-3 text-left">
                      <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                         <Crown size={20} />
                      </div>
                      <div>
                         <p className="text-sm font-bold text-slate-900">Top Merchant</p>
                         <p className="text-xs text-slate-500 truncate max-w-[120px]">{data.topMerchant.name}</p>
                      </div>
                   </div>
                   <div className="text-right">
                      <span className="block text-xl font-bold text-slate-800">{data.topMerchant.count}</span>
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Visits</span>
                   </div>
                </div>

                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-3 text-left">
                      <div className="p-2 bg-pink-50 text-pink-600 rounded-lg">
                         <ShoppingBag size={20} />
                      </div>
                      <div>
                         <p className="text-sm font-bold text-slate-900">Persona</p>
                         <p className="text-xs text-slate-500">Your spending style</p>
                      </div>
                   </div>
                   <span className="text-sm font-bold text-white bg-slate-900 px-3 py-1 rounded-full">
                     {data.persona.title}
                   </span>
                </div>
             </div>
          </div>

          <div className="flex flex-col gap-3 w-full pb-8">
            <Button onClick={() => setShowShare(true)} variant="secondary" className="w-full py-4 text-lg shadow-emerald-500/20">
              <Share2 className="mr-2 h-5 w-5" /> Share Your Wrapped
            </Button>
            
            <div className="grid grid-cols-2 gap-3">
               <Button onClick={onReplay} variant="outline" className="w-full">
                  <RotateCcw className="mr-2 h-4 w-4" /> Replay
               </Button>
               <Button onClick={onReset} variant="ghost" className="w-full bg-white border border-slate-200">
                  New Upload
               </Button>
            </div>
          </div>
      </div>

      {showShare && (
        <ShareModal 
          data={data} 
          onClose={() => setShowShare(false)} 
        />
      )}
    </div>
  );
};