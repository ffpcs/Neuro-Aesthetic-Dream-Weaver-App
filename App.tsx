import React, { useState, useCallback } from 'react';
import { analyzeDream } from './services/geminiService';
import DreamInput from './components/DreamInput';
import AnalysisDisplay from './components/AnalysisDisplay';
import LoadingSpinner from './components/LoadingSpinner';

const App: React.FC = () => {
  const [dreamDescription, setDreamDescription] = useState<string>('');
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyzeDream = useCallback(async () => {
    if (!dreamDescription.trim()) {
      setError('Please describe your dream before analyzing.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);

    try {
      const result = await analyzeDream(dreamDescription);
      setAnalysisResult(result);
    } catch (e) {
      console.error(e);
      setError('Sorry, an error occurred while analyzing your dream. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [dreamDescription]);

  const handleReset = useCallback(() => {
    setDreamDescription('');
    setAnalysisResult(null);
    setError(null);
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 font-sans p-4 sm:p-6 md:p-8">
      <div 
        className="absolute inset-0 z-0 opacity-10" 
        style={{
          backgroundImage: 'radial-gradient(circle at top right, rgba(128, 90, 213, 0.2), transparent 40%), radial-gradient(circle at bottom left, rgba(79, 70, 229, 0.2), transparent 40%)',
        }}
      ></div>
      <div className="max-w-4xl mx-auto relative z-10">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-500 mb-2">
            The Neuro-Aesthetic Dream Weaver
          </h1>
          <p className="text-slate-400 text-lg">
            Unravel the threads of your subconscious, for entertainment only.
          </p>
        </header>

        <main>
          <div>
            <DreamInput
              value={dreamDescription}
              onChange={(e) => setDreamDescription(e.target.value)}
              onSubmit={handleAnalyzeDream}
              isLoading={isLoading}
              onReset={handleReset}
              hasContentToReset={!!dreamDescription || !!analysisResult}
            />
          </div>

          {error && (
            <div className="mt-6 p-4 bg-red-900/50 border border-red-700 text-red-300 rounded-lg text-center">
              {error}
            </div>
          )}

          {isLoading && <div><LoadingSpinner /></div>}

          {analysisResult && (
            <div className="mt-8">
              <AnalysisDisplay analysisText={analysisResult} />
            </div>
          )}
        </main>
        
        <footer className="text-center mt-12 text-slate-500 text-sm">
          <p>Powered by Google's Gemini API. This is an AI-generated interpretation and not professional advice.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;