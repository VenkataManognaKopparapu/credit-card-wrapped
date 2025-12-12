import React, { useState, useEffect, useRef } from 'react';
import { Bot, User, Sparkles, Loader2, Send, ArrowRight, MessageCircle } from 'lucide-react';
import { WrappedData, ChatMessage } from '../types';
import { createFinancialAdvisor } from '../services/chatService';
import { Button } from './Button';

interface Props {
  data: WrappedData;
  onContinue: () => void;
}

export const ChatbotScreen: React.FC<Props> = ({ data, onContinue }) => {
  const [viewState, setViewState] = useState<'intro' | 'chat'>('intro');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [advisor, setAdvisor] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize Chat Service
  useEffect(() => {
    const initChat = () => {
      const chatService = createFinancialAdvisor(data);
      setAdvisor(chatService);
      
      // Add initial greeting
      setMessages([
        {
          id: 'init',
          role: 'model',
          text: `Hi! 👋 I've analyzed your 2024 spending data. \n\nI can help you spot money leaks, suggest savings strategies, or just chat about your ${data.persona.title} habits.\n\nWhat's on your mind?`,
          timestamp: new Date()
        }
      ]);
    };

    initChat();
  }, [data]);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (viewState === 'chat') {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, viewState]);

  // Focus input when entering chat mode
  useEffect(() => {
    if (viewState === 'chat') {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [viewState]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || !advisor) return;

    // Switch to chat view if not already
    if (viewState === 'intro') {
      setViewState('chat');
    }

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: text,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const responseText = await advisor.sendMessage(text);
      
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const suggestions = [
    "How can I save $500/mo?",
    "What's my biggest leak?",
    "Should I cut subscriptions?",
    "Is my spending healthy?"
  ];

  if (viewState === 'intro') {
    return (
      <div className="min-h-screen w-full bg-slate-50 flex flex-col items-center justify-center p-6 animate-fade-in-up">
        <div className="w-full max-w-lg bg-white rounded-[2rem] shadow-xl border border-slate-100 overflow-hidden flex flex-col mb-8">
          {/* Header Graphic */}
          <div className="h-32 bg-gradient-to-r from-indigo-500 via-purple-500 to-fuchsia-500 relative flex items-center justify-center">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg animate-bounce">
              <MessageCircle className="text-indigo-600 w-8 h-8" />
            </div>
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-20">
               <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[radial-gradient(circle,_transparent_20%,_#ffffff_20%,_#ffffff_22%,_transparent_22%,_transparent)] bg-[length:20px_20px]"></div>
            </div>
          </div>

          <div className="p-8 text-center flex-1 flex flex-col">
            <h2 className="text-2xl font-black text-slate-900 mb-2">Questions About Your Data?</h2>
            <p className="text-slate-500 mb-6">
              You've seen your spending story. Want personalized advice from our AI Financial Advisor?
            </p>

            <div className="bg-slate-50 rounded-2xl p-4 text-left mb-8 border border-slate-100">
              <p className="text-xs font-bold text-slate-400 uppercase mb-3 tracking-wider">Ask me anything like:</p>
              <div className="space-y-2">
                {suggestions.slice(0, 3).map((q, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm text-slate-700 bg-white p-2 rounded-lg border border-slate-100 shadow-sm">
                    <span className="text-indigo-500 font-bold">•</span> {q}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3 mt-auto">
              <Button 
                onClick={() => setViewState('chat')} 
                variant="dark" 
                className="w-full py-4 text-lg shadow-indigo-500/20"
              >
                <Bot className="w-5 h-5 mr-2" /> Ask AI Advisor
              </Button>
              
              <button 
                onClick={onContinue}
                className="text-slate-400 hover:text-slate-600 font-semibold py-2 transition-colors flex items-center justify-center gap-1 group"
              >
                Continue Your Wrapped <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // CHAT VIEW
  return (
    <div className="min-h-screen w-full bg-slate-50 flex flex-col animate-fade-in-up relative">
      {/* Header - Sticky */}
      <div className="sticky top-0 bg-white/90 backdrop-blur-md border-b border-slate-100 px-4 py-4 flex items-center justify-between shadow-sm z-30">
        <div className="flex items-center gap-3">
           <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white shadow-md">
             <Bot size={20} />
           </div>
           <div>
             <h3 className="font-bold text-slate-900 leading-tight">AI Financial Advisor</h3>
             <p className="text-xs text-emerald-500 font-medium flex items-center gap-1">
               <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
               Online
             </p>
           </div>
        </div>
        <button 
          onClick={onContinue}
          className="text-xs font-bold text-slate-400 hover:text-indigo-600 bg-slate-100 hover:bg-indigo-50 px-3 py-1.5 rounded-full transition-colors flex items-center gap-1"
        >
          Continue Wrapped <ArrowRight size={12} />
        </button>
      </div>

      {/* Chat History */}
      <div className="flex-1 p-4 bg-slate-50 space-y-6">
          <div className="max-w-2xl mx-auto w-full space-y-6 pb-4">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex max-w-[85%] md:max-w-[75%] gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  
                  {/* Avatar */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1 shadow-sm
                    ${msg.role === 'user' ? 'bg-slate-200 text-slate-600' : 'bg-white text-indigo-600 border border-indigo-100'}`}
                  >
                    {msg.role === 'user' ? <User size={16} /> : <Sparkles size={16} />}
                  </div>

                  {/* Bubble */}
                  <div className={`p-4 rounded-2xl shadow-sm text-sm md:text-base leading-relaxed whitespace-pre-wrap
                    ${msg.role === 'user' 
                      ? 'bg-indigo-600 text-white rounded-tr-sm' 
                      : 'bg-white text-slate-800 border border-slate-100 rounded-tl-sm'}`}
                  >
                    {msg.text}
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex w-full justify-start">
                <div className="flex gap-3 max-w-[75%]">
                   <div className="w-8 h-8 rounded-full bg-white text-indigo-600 border border-indigo-100 flex items-center justify-center shrink-0 mt-1">
                      <Loader2 size={16} className="animate-spin" />
                   </div>
                   <div className="bg-white border border-slate-100 p-4 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-2">
                      <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span>
                      <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                      <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                   </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
      </div>

      {/* Input Area - Sticky Bottom */}
      <div className="sticky bottom-0 bg-white border-t border-slate-100 p-4 z-30">
        <div className="max-w-2xl mx-auto w-full">
            {/* Quick Chips */}
            {messages.length < 3 && !isLoading && (
                <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar mask-fade-right">
                {suggestions.map((q, idx) => (
                    <button
                    key={idx}
                    onClick={() => handleSendMessage(q)}
                    className="whitespace-nowrap px-4 py-2 bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 text-slate-600 hover:text-indigo-600 rounded-full text-xs font-medium transition-colors"
                    >
                    {q}
                    </button>
                ))}
                </div>
            )}

            <div className="relative flex items-center gap-2">
                <input
                ref={inputRef}
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(inputText)}
                placeholder="Ask financial advisor..."
                disabled={isLoading}
                className="flex-1 bg-slate-50 border border-slate-200 rounded-full px-6 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all disabled:opacity-50"
                />
                <button
                onClick={() => handleSendMessage(inputText)}
                disabled={!inputText.trim() || isLoading}
                className="p-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 rounded-full text-white shadow-lg shadow-indigo-500/30 transition-all disabled:shadow-none"
                >
                <Send size={20} className={isLoading ? 'opacity-0' : 'opacity-100'} />
                {isLoading && <Loader2 size={20} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-spin" />}
                </button>
            </div>
            
            <div className="mt-4 text-center md:hidden">
               <button 
                  onClick={onContinue}
                  className="text-xs font-bold text-slate-400 hover:text-slate-600 uppercase tracking-wide py-2"
                >
                  Continue to Wrapped →
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};