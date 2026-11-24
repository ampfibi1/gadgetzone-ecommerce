import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

export default function ErrorMessage({ message = 'Something went wrong', onRetry }) {
  return (
    <div className="mx-auto my-6 max-w-lg rounded-xl border border-line bg-surface p-6">
      <div className="flex items-start gap-3">
        <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-danger" />
        <div>
          <h3 className="text-[15px] font-medium text-ink">Could not load this page</h3>
          <p className="mt-1 text-[13px] leading-5 text-muted">{message}</p>
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="ui-btn ui-btn-secondary ui-btn-sm mt-4"
            >
              <RefreshCw className="h-3.5 w-3.5" /> Try again
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
