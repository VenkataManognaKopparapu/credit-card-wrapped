
import React from 'react';
import { CardBreakdown, InsightCard } from '../../types';
import { CreditCard, Wallet } from 'lucide-react';

interface Props {
  data: CardBreakdown[];
  card: InsightCard;
}

export const CardBreakdownChart: React.FC<Props> = ({ data, card }) => {
  const total = data.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="w-full h-full flex flex-col bg-slate-50">
       <div className={`w-full h-2 bg-gradient-to-r ${card.gradient}`} />
       
       <div className="px-8 pt-6 pb-4">
         <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            {card.question}
         </h3>
       </div>

       <div className="flex-1 overflow-y-auto px-6 space-y-4 pb-6">
         {data.map((item, index) => (
           <div key={index} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden group">
             {/* Progress Background */}
             <div 
                className="absolute left-0 bottom-0 top-0 bg-gradient-to-r from-emerald-50 to-teal-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ width: `${item.percentage}%`, zIndex: 0 }}
             />
             
             <div className="relative z-10 flex items-center gap-4">
               <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 shrink-0">
                  <CreditCard size={18} />
               </div>
               
               <div className="flex-1 min-w-0">
                 <p className="font-bold text-slate-900 truncate">{item.cardName}</p>
                 <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div 
                        className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full" 
                        style={{ width: `${item.percentage}%` }}
                    />
                 </div>
               </div>

               <div className="text-right shrink-0">
                 <p className="font-black text-slate-900 text-lg">${Math.floor(item.amount).toLocaleString()}</p>
                 <p className="text-xs font-bold text-slate-400">{Math.round(item.percentage)}%</p>
               </div>
             </div>
           </div>
         ))}
       </div>

       <div className="p-6 bg-white border-t border-slate-100">
          <div className="flex justify-between items-center">
             <div className="flex items-center gap-2 text-slate-500">
                <Wallet size={16} />
                <span className="text-sm font-bold uppercase tracking-wider">Total Output</span>
             </div>
             <span className="text-xl font-black text-slate-900">${Math.floor(total).toLocaleString()}</span>
          </div>
       </div>
    </div>
  );
};
