import React from 'react';
import { Loader2 } from 'lucide-react';

export default function LoadingSpinner({ text = 'Loading', fullScreen = false }) {
  const content = (
    <div className="flex flex-col items-center justify-center gap-3 p-8 text-center">
      <Loader2 className="h-5 w-5 animate-spin text-muted" />
      <p className="font-mono text-[11px] text-muted">{text}</p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-paper/80">
        {content}
      </div>
    );
  }

  return content;
}
