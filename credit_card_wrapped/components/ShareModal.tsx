
import React, { useState, useRef } from 'react';
import { X, Download, Link, Twitter, Facebook, Linkedin, Check, CreditCard } from 'lucide-react';
import { WrappedData } from '../types';
import { Button } from './Button';
import html2canvas from 'html2canvas';

interface ShareModalProps {
  data: WrappedData;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ data, onClose }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const earnedBadges = data.achievements?.filter(a => a.earned).length || 0;
  const siteUrl = window.location.origin;

  const handleDownload = async () => {
    if (!cardRef.current) return;
    setIsGenerating(true);
    
    try {
      // Small delay to ensure styles are rendered
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const canvas = await html2canvas(cardRef.current, {
        scale: 2, // Retina quality
        backgroundColor: '#ffffff',
        useCORS: true,
        logging: false
      });

      const link = document.createElement('a');
      link.download = `my-2024-wrapped.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error("Image generation failed", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(siteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareText = `I just wrapped my 2024 spending! 💸 I made ${data.transactionCount} transactions and unlocked ${earnedBadges} badges. Check yours at`;
  
  const socialLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(siteUrl)}&hashtags=CreditCardWrapped`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(siteUrl)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(siteUrl)}`
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-md animate-fade-in-up">
      <div className="relative w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl ring-1 ring-white/10 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white z-20 shrink-0">
            <h2 className="text-lg font-bold text-slate-900">Share Your Story</h2>
            <button 
                onClick={onClose} 
                className="p-2 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-600 transition-colors"
            >
                <X size={18} />
            </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-6 flex flex-col items-center bg-slate-50">
          
          <p className="text-slate-500 text-sm mb-6 text-center max-w-xs">
            Show off your spending persona and achievements (without revealing exactly how much you spent on coffee).
          </p>

          {/* PREVIEW CARD CONTAINER */}
          <div className="relative shadow-2xl shadow-indigo-500/20 rounded-[2rem] overflow-hidden transition-transform hover:scale-[1.01] duration-500 mb-8 shrink-0">
            {/* THIS IS THE CARD THAT GETS DOWNLOADED */}
            <div 
              ref={cardRef}
              className="w-[300px] h-[533px] bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-6 flex flex-col text-white relative"
            >
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-20">
                 <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] bg-yellow-300 rounded-full blur-3xl"></div>
                 <div className="absolute bottom-[-20%] right-[-20%] w-[80%] h-[80%] bg-blue-400 rounded-full blur-3xl"></div>
              </div>

              {/* Header */}
              <div className="relative z-10 flex justify-between items-center mb-6">
                 <div className="flex items-center gap-2 font-display font-bold text-xs bg-white/20 backdrop-blur-md px-2 py-1 rounded-full border border-white/20">
                    <CreditCard size={12} />
                    <span>CardWrapped</span>
                 </div>
                 <span className="text-[10px] font-semibold opacity-80">2024</span>
              </div>

              {/* Title */}
              <div className="relative z-10 mb-6 text-center">
                 <h2 className="text-3xl font-black mb-1 tracking-tight">My 2024 <br/> Wrapped ✨</h2>
              </div>

              {/* Main Stat: Persona */}
              <div className="relative z-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 text-center mb-4">
                 <div className="text-5xl mb-3 animate-bounce">{data.persona.emoji}</div>
                 <p className="text-[10px] uppercase tracking-widest font-bold opacity-70 mb-1">I am a</p>
                 <h3 className="text-xl font-black">{data.persona.title}</h3>
              </div>

              {/* Quick Stats Grid */}
              <div className="relative z-10 grid grid-cols-2 gap-2 mb-auto">
                 <div className="bg-black/20 rounded-2xl p-3 backdrop-blur-sm">
                    <p className="text-[8px] uppercase font-bold opacity-70">Transactions</p>
                    <p className="text-xl font-black">{data.transactionCount}</p>
                 </div>
                 <div className="bg-black/20 rounded-2xl p-3 backdrop-blur-sm">
                    <p className="text-[8px] uppercase font-bold opacity-70">Top Merchant</p>
                    <p className="text-sm font-bold leading-tight truncate">{data.topMerchant.name}</p>
                 </div>
                 <div className="col-span-2 bg-gradient-to-r from-emerald-500/80 to-teal-500/80 rounded-2xl p-3 flex items-center justify-between border border-white/20">
                    <div>
                        <p className="text-[8px] uppercase font-bold opacity-80">Badges Unlocked</p>
                        <p className="text-lg font-black">{earnedBadges} / {data.achievements?.length || 8}</p>
                    </div>
                    <div className="text-2xl">🏆</div>
                 </div>
              </div>

              {/* Footer */}
              <div className="relative z-10 text-center mt-4">
                 <div className="bg-white text-indigo-600 px-3 py-1 rounded-full text-[10px] font-bold inline-block shadow-lg">
                    creditcardwrapped.app
                 </div>
              </div>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="w-full max-w-[300px] space-y-4">
            <Button 
              variant="secondary" 
              className="w-full py-3 text-base shadow-emerald-500/20" 
              onClick={handleDownload}
              disabled={isGenerating}
            >
              {isGenerating ? 'Generating...' : (
                <>
                  <Download className="mr-2 h-4 w-4" /> Download Image
                </>
              )}
            </Button>
            
            <div className="flex items-center justify-center gap-4">
              <a 
                href={socialLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-white hover:bg-sky-50 text-slate-400 hover:text-sky-500 rounded-full transition-colors border border-slate-200 shadow-sm"
                title="Share on Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a 
                href={socialLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-white hover:bg-blue-50 text-slate-400 hover:text-blue-600 rounded-full transition-colors border border-slate-200 shadow-sm"
                title="Share on Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a 
                href={socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-white hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 rounded-full transition-colors border border-slate-200 shadow-sm"
                title="Share on LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              
              <div className="w-px h-8 bg-slate-200 mx-2"></div>

              <button 
                onClick={handleCopyLink}
                className="p-3 bg-white hover:bg-slate-50 text-slate-400 hover:text-slate-900 rounded-full transition-colors border border-slate-200 shadow-sm relative group"
                title="Copy Link"
              >
                {copied ? <Check className="h-5 w-5 text-emerald-500" /> : <Link className="h-5 w-5" />}
                
                {copied && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-slate-800 text-white text-[10px] py-1 px-2 rounded-md whitespace-nowrap">
                    Copied!
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
