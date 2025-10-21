import React from 'react';

interface DreamInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit: () => void;
  isLoading: boolean;
  onReset: () => void;
  hasContentToReset: boolean;
}

const DreamInput: React.FC<DreamInputProps> = ({ value, onChange, onSubmit, isLoading, onReset, hasContentToReset }) => {
  return (
    <div className="bg-slate-800/50 p-6 rounded-xl shadow-lg border border-slate-700">
      <label htmlFor="dream-description" className="block text-lg font-medium text-slate-300 mb-3">
        Describe your dream...
      </label>
      <textarea
        id="dream-description"
        value={value}
        onChange={onChange}
        placeholder="e.g., I was flying over a city made of glass, but my wings were made of melting clocks..."
        rows={8}
        className="w-full p-4 bg-slate-900 border border-slate-600 rounded-lg text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 resize-y"
        disabled={isLoading}
      />
      <div className="mt-4 flex justify-end items-center gap-4">
        {hasContentToReset && !isLoading && (
          <button
            onClick={onReset}
            className="px-8 py-3 bg-slate-700/50 text-slate-300 font-bold rounded-lg hover:bg-slate-700 hover:text-slate-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-slate-500 transition-colors duration-200"
          >
            Reset
          </button>
        )}
        <button
          onClick={onSubmit}
          disabled={isLoading || !value}
          className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-indigo-500 disabled:bg-slate-600 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 disabled:scale-100"
        >
          {isLoading ? 'Analyzing...' : 'Weave My Dream'}
        </button>
      </div>
    </div>
  );
};

export default DreamInput;