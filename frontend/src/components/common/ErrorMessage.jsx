import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

export default function ErrorMessage({ message = 'An error occurred', onRetry }) {
  return (
    <div className="p-6 my-4 bg-red-50 border border-red-200 rounded-xl text-center max-w-lg mx-auto">
      <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-2" />
      <h3 className="font-semibold text-red-900 mb-1">Something went wrong</h3>
      <p className="text-sm text-red-700 mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition"
        >
          <RefreshCw className="w-4 h-4" /> Try Again
        </button>
      )}
    </div>
  );
}
