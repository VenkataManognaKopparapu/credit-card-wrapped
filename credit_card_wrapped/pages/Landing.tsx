
import React, { useState } from 'react';
import { Upload, Sparkles, Shield, BarChart3, Play, CreditCard, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '../components/Button';
import { processFiles, analyzeSpending } from '../services/geminiService';
import { WrappedData } from '../types';
import { EmailCapture } from '../components/EmailCapture';
import { UploadSection } from '../components/UploadSection';

interface LandingProps {
  onDataReady: (data: WrappedData) => void;
  setLoading: (loading: boolean) => void;
}

export const Landing: React.FC<LandingProps> = ({ onDataReady, setLoading }) => {
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [email, setEmail] = useState<string | undefined>(undefined);
  const [processedData, setProcessedData] = useState<WrappedData | null>(null);
  const [processingError, setProcessingError] = useState<string | null>(null);

  const handleStart = () => {
    setShowEmailModal(true);
  };

  const handleEmailComplete = (capturedEmail?: string) => {
    setEmail(capturedEmail);
    setShowEmailModal(false);
    setShowUploadModal(true);
  };

  const handleFileProcess = async (files: File[]) => {
    setLoading(true);
    setProcessingError(null);
    
    try {
      // Simulate a small delay for better UX
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const data = await processFiles(files);
      setProcessedData(data);
      setLoading(false);
      setShowUploadModal(false);
      setShowSuccessModal(true);
    } catch (error: any) {
      console.error("Processing failed:", error);
      setLoading(false);
      setProcessingError(error.message || "We couldn't read your files. Please check the format.");
    }
  };

  const handleDemo = async () => {
    setLoading(true);
    // Simulate API delay for dramatic effect
    await new Promise(resolve => setTimeout(resolve, 1500));
    const data = await analyzeSpending(''); // Empty string triggers mock data
    onDataReady(data);
    setLoading(false);
  };

  const handleSuccessContinue = () => {
    if (processedData) {
      onDataReady(processedData);
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 md:h-20 flex items-center justify-between">
            <div className="flex items-center gap-2 font-display font-bold text-lg md:text-xl tracking-tight text-slate-900">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center shadow-lg shadow-slate-900/20">
                    <CreditCard size={18} />
                </div>
                <span>Credit Card Wrapped</span>
            </div>
            <div className="hidden md:flex items-center gap-4">
               <button onClick={handleDemo} className="text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors">
                  View Demo
               </button>
               <Button variant="dark" size="sm" onClick={handleStart}>
                  Start Now
               </Button>
            </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10 text-center">
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-black tracking-tighter text-slate-900 mb-8 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                Your Year <br className="hidden md:block" />
                in <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600">Spending</span> 🎉
            </h1>

            <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-600 mb-10 leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                Transform your boring transaction history into an interactive, personalized story. 
                Discover your spending persona and visualize where your money went.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up px-4" style={{ animationDelay: '0.3s' }}>
                <Button 
                    size="lg" 
                    variant="dark"
                    onClick={handleStart}
                    className="w-full sm:w-auto shadow-xl shadow-slate-900/20 group h-14 px-8 text-lg"
                >
                    <Upload className="w-5 h-5 mr-2 group-hover:-translate-y-1 transition-transform" />
                    Upload Your Data
                </Button>
                <Button 
                    size="lg" 
                    variant="ghost" 
                    onClick={handleDemo}
                    className="w-full sm:w-auto h-14 px-8 text-lg group"
                >
                    <Play className="w-5 h-5 mr-2 fill-current" />
                    Try Demo Mode
                </Button>
            </div>
            
            <p className="mt-8 text-sm text-slate-400 animate-fade-in-up flex items-center justify-center gap-2" style={{ animationDelay: '0.4s' }}>
                <Shield size={14} />
                <span>Private & Secure. Data is processed locally.</span>
            </p>
        </div>
        
        {/* Animated Background Blobs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full overflow-hidden -z-10 pointer-events-none">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-50/50 via-white to-white"></div>
            <div className="absolute top-1/4 left-1/4 w-72 h-72 md:w-96 md:h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
            <div className="absolute top-1/3 right-1/4 w-72 h-72 md:w-96 md:h-96 bg-fuchsia-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-32 left-1/2 w-72 h-72 md:w-96 md:h-96 bg-violet-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="bg-slate-50 py-24 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
            <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold font-display text-slate-900 mb-4">Everything you need to know</h2>
                <p className="text-slate-500 max-w-2xl mx-auto">Get deep insights into your financial habits without the boring spreadsheets.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                <FeatureCard 
                    icon={<BarChart3 className="w-6 h-6 text-white" />}
                    color="bg-indigo-600"
                    title="Interactive Stories"
                    description="Experience your spending habits like never before with animated, story-driven insights inspired by your favorite music app."
                />
                <FeatureCard 
                    icon={<Sparkles className="w-6 h-6 text-white" />}
                    color="bg-violet-600"
                    title="AI-Powered Insights"
                    description="Our Gemini-powered analysis finds trends, categorizes spending, and generates your unique spending persona."
                />
                <FeatureCard 
                    icon={<Shield className="w-6 h-6 text-white" />}
                    color="bg-emerald-600"
                    title="Privacy First"
                    description="Your data is processed securely. We don't store your transactions, ensuring your financial privacy remains intact."
                />
            </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-white py-12 border-t border-slate-100">
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-slate-400 text-sm">© 2024 Credit Card Wrapped. Not affiliated with Spotify.</p>
              <div className="flex gap-6">
                  <a href="#" className="text-slate-400 hover:text-slate-900 text-sm transition-colors">Privacy</a>
                  <a href="#" className="text-slate-400 hover:text-slate-900 text-sm transition-colors">Terms</a>
                  <a href="#" className="text-slate-400 hover:text-slate-900 text-sm transition-colors">GitHub</a>
              </div>
          </div>
      </footer>

      {/* Modals */}
      {showEmailModal && (
        <EmailCapture 
          onComplete={handleEmailComplete} 
          onClose={() => setShowEmailModal(false)} 
        />
      )}

      {showUploadModal && (
        <UploadSection
          onFileProcess={handleFileProcess}
          onClose={() => setShowUploadModal(false)}
          isProcessing={false} // Loading handled by parent overlay
          error={processingError}
          resetError={() => setProcessingError(null)}
        />
      )}

      {showSuccessModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in-up">
          <div className="relative w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl ring-1 ring-black/5 text-center">
             <div className="flex justify-center mb-6">
               <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center animate-bounce">
                  <CheckCircle2 className="text-emerald-500 w-10 h-10" />
               </div>
             </div>
             
             <h2 className="text-3xl font-bold text-slate-900 mb-4">All Wrapped Up! 🎉</h2>
             
             <p className="text-slate-500 mb-8 text-lg">
               {email 
                 ? <span>Your wrapped report will be sent to <span className="text-slate-900 font-semibold">{email}</span> in a few minutes! 📧</span>
                 : 'Processing complete! Get ready to see your year in spending.'
               }
             </p>

             <Button 
               variant="secondary" 
               className="w-full py-4 text-lg font-bold"
               onClick={handleSuccessContinue}
             >
               View Preview Now <ArrowRight className="ml-2 w-5 h-5" />
             </Button>
          </div>
        </div>
      )}
    </div>
  );
};

const FeatureCard = ({ icon, color, title, description }: { icon: React.ReactNode, color: string, title: string, description: string }) => (
    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-indigo-900/5 transition-all duration-300 hover:-translate-y-1 group">
        <div className={`w-14 h-14 rounded-2xl ${color} flex items-center justify-center mb-6 shadow-lg shadow-indigo-900/10 group-hover:scale-110 transition-transform duration-300`}>
            {icon}
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-3 font-display">{title}</h3>
        <p className="text-slate-600 leading-relaxed text-sm md:text-base">
            {description}
        </p>
    </div>
);
