
import React from 'react';

const LoadingSpinner: React.FC = () => {
    const messages = [
        "Weaving neural threads...",
        "Consulting the cognitive archives...",
        "Simulating REM state...",
        "Decoding subconscious symbols...",
        "Synchronizing with the dream stream..."
    ];
    const [message, setMessage] = React.useState(messages[0]);

    React.useEffect(() => {
        const interval = setInterval(() => {
            setMessage(messages[Math.floor(Math.random() * messages.length)]);
        }, 2500);
        return () => clearInterval(interval);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

  return (
    <div className="text-center p-8 my-6 flex flex-col items-center justify-center">
      <svg
        className="animate-spin h-10 w-10 text-indigo-400 mb-4"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
      <p className="text-slate-400 text-lg animate-pulse">{message}</p>
    </div>
  );
};

export default LoadingSpinner;
