import React from 'react';

export default function PriceDisplay({ amount, compareAmount, className = '' }) {
  const formatted = `৳${Number(amount || 0).toLocaleString('en-BD')}`;
  const formattedCompare = compareAmount ? `৳${Number(compareAmount).toLocaleString('en-BD')}` : null;

  return (
    <div className={`flex items-baseline gap-1.5 ${className}`}>
      <span className="font-semibold text-slate-900 tabular-nums">{formatted}</span>
      {formattedCompare && (
        <span className="text-xs text-slate-400 line-through tabular-nums">{formattedCompare}</span>
      )}
    </div>
  );
}
