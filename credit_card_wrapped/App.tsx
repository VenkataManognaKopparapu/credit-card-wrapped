import React, { useState } from 'react';
import { HashRouter } from 'react-router-dom';
import { Landing } from './pages/Landing';
import { WrappedView } from './pages/WrappedView';
import { WrappedData, AppState } from './types';
import { Loader2 } from 'lucide-react';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(AppState.LANDING);
  const [data, setData] = useState<WrappedData | null>(null);
  const [loading, setLoading] = useState(false);

  const handleDataReady = (processedData: WrappedData) => {
    setData(processedData);
    setState(AppState.WRAPPED);
  };

  const handleReset = () => {
    setData(null);
    setState(AppState.LANDING);
  };

  return (
    <HashRouter>
      {/* Container is always light themed now, changed to min-h-screen and removed overflow lock */}
      <div className="font-sans min-h-screen w-full bg-slate-50 text-slate-900">
        {loading && (
          <div className="fixed inset-0 z-[100] bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center text-slate-900 overflow-y-auto">
            <Loader2 className="w-12 h-12 text-emerald-500 animate-spin mb-4" />
            <p className="text-xl font-bold animate-pulse">Crunching the numbers...</p>
            <p className="text-sm text-slate-500 mt-2">Asking the AI not to judge you too hard.</p>
          </div>
        )}

        {state === AppState.LANDING && (
          <Landing onDataReady={handleDataReady} setLoading={setLoading} />
        )}

        {state === AppState.WRAPPED && data && (
          <WrappedView data={data} onReset={handleReset} />
        )}
      </div>
    </HashRouter>
  );
};

export default App;