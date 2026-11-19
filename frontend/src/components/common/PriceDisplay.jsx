import React from 'react';

export default function PriceDisplay({ amount, compareAmount, className = '' }) {
  const formatted = `৳${Number(amount || 0).toLocaleString('en-BD')}`;
  const formattedCompare = compareAmount ? `৳${Number(compareAmount).toLocaleString('en-BD')}` : null;

  return (
    <div className={`flex items-baseline gap-2 ${className}`}>
      <span className="font-bold text-blue-600 dark:text-blue-400">{formatted}</span>
      {formattedCompare && (
        <span className="text-sm text-slate-400 line-through">{formattedCompare}</span>
      )}
    </div>
  );
}
