import React from 'react';

const sizes = {
  sm: 'text-[12px]',
  md: 'text-[14px]',
  lg: 'text-[18px]',
  xl: 'text-[26px]',
};

const compareSizes = {
  sm: 'text-[10px]',
  md: 'text-[10px]',
  lg: 'text-[11px]',
  xl: 'text-[13px]',
};

export default function PriceDisplay({ amount, compareAmount, size = 'md', className = '' }) {
  const formatted = `৳${Number(amount || 0).toLocaleString('en-BD')}`;
  const formattedCompare = compareAmount
    ? `৳${Number(compareAmount).toLocaleString('en-BD')}`
    : null;

  return (
    <div className={`flex items-baseline gap-2 font-mono tabular-nums ${sizes[size] || sizes.md} ${className}`}>
      <span className="font-medium tracking-[-0.02em] text-ink">{formatted}</span>
      {formattedCompare && (
        <span className={`${compareSizes[size] || compareSizes.md} text-muted line-through`}>
          {formattedCompare}
        </span>
      )}
    </div>
  );
}
