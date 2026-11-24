import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-16 text-center">
      <h1 className="text-8xl font-medium text-ember mb-2">404</h1>
      <h2 className="text-2xl font-medium text-ink-soft mb-2">Page Not Found</h2>
      <p className="text-sm text-muted max-w-sm mb-8">
        The gadget or page you are looking for does not exist or has been relocated.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-6 py-3 bg-ink hover:bg-ink-soft text-paper rounded-xl text-sm font-medium transition-colors"
      >
        <Home className="w-4 h-4" /> Back to LHQ BANGLADESH
      </Link>
    </div>
  );
}
