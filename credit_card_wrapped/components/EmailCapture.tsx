import React, { useState } from 'react';
import { Mail, X } from 'lucide-react';
import { Button } from './Button';

interface EmailCaptureProps {
  onComplete: (email?: string) => void;
  onClose: () => void;
}

export const EmailCapture: React.FC<EmailCaptureProps> = ({ onComplete, onClose }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateEmail(email)) {
      onComplete(email);
    } else {
      setError('Please enter a valid email address');
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in-up">
      <div className="relative w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl ring-1 ring-black/5">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors">
          <X size={24} />
        </button>
        
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
             <Mail className="text-emerald-500 w-8 h-8" />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-slate-900 text-center mb-2">Ready to unwrap your year? 🎁</h2>
        <p className="text-slate-500 text-center mb-8">Enter your email to get started. We'll send your personalized wrapped report when it's ready.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError('');
              }}
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all shadow-sm"
            />
            {error && <p className="text-red-500 text-sm mt-2 ml-1">{error}</p>}
          </div>

          <Button 
            variant="secondary" 
            className="w-full py-4 text-lg font-bold"
            disabled={!email}
            type="submit"
          >
            Continue
          </Button>
        </form>

        <div className="mt-6 text-center">
          <button 
            onClick={() => onComplete()} 
            className="text-slate-400 hover:text-slate-600 text-sm font-medium transition-colors"
          >
            Skip for now
          </button>
        </div>
      </div>
    </div>
  );
};