import React from 'react';
import useCountdown from '../../hooks/useCountdown';

const pad = (value) => String(value).padStart(2, '0');

export default function Countdown({ endsAt, className = '' }) {
  const remaining = useCountdown(endsAt);

  if (!endsAt) return null;

  if (remaining.expired) {
    return <span className={`font-mono text-[11px] text-muted ${className}`}>Sale ended</span>;
  }

  const units = [
    { value: remaining.days, label: 'days' },
    { value: remaining.hours, label: 'hrs' },
    { value: remaining.minutes, label: 'min' },
    { value: remaining.seconds, label: 'sec' },
  ];

  return (
    <div className={`flex items-start gap-3 ${className}`} aria-label="Time remaining">
      {units.map((unit) => (
        <div key={unit.label} className="min-w-6 text-left">
          <span className="block font-mono text-[20px] leading-none tabular-nums text-ink">
            {pad(unit.value)}
          </span>
          <span className="mt-1 block font-mono text-[9px] leading-none text-muted">
            {unit.label}
          </span>
        </div>
      ))}
    </div>
  );
}
