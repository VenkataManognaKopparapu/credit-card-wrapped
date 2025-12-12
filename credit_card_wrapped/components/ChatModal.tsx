
import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Bot, User, Sparkles, Loader2 } from 'lucide-react';
import { WrappedData, ChatMessage } from '../types';
import { createFinancialAdvisor } from '../services/chatService';

interface Props {
  data: WrappedData;
  onClose: () => void;
}

export const ChatModal: React.FC<Props> = ({ data, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [advisor, setAdvisor] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize Chat
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

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input on mount
  useEffect(() => {
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  }, []);

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || !advisor) return;

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

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-0 md:p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in-up">
      <div className="relative w-full md:max-w-xl h-full md:h-[80vh] bg-white md:rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 bg-white border-b border-slate-100 flex items-center justify-between shrink-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Bot className="text-white w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 leading-tight">AI Financial Advisor</h2>
              <p className="text-xs text-emerald-500 font-medium flex items-center gap-1">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                Online & Analyzing
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-50 space-y-6">
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

        {/* Input Area */}
        <div className="bg-white border-t border-slate-100 p-4 shrink-0">
          
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
              placeholder="Ask anything..."
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
        </div>

      </div>
    </div>
  );
};
