import React from 'react';
import useCountdown from '../../hooks/useCountdown';

const pad = (value) => String(value).padStart(2, '0');

export default function Countdown({ endsAt, className = '' }) {
  const remaining = useCountdown(endsAt);

  if (!endsAt) return null;

  if (remaining.expired) {
    return (
      <span className={`text-xs font-medium text-slate-400 ${className}`}>
        Sale ended
      </span>
    );
  }

  const units = [
    { value: remaining.days, label: 'Days' },
    { value: remaining.hours, label: 'Hours' },
    { value: remaining.minutes, label: 'Mins' },
    { value: remaining.seconds, label: 'Secs' },
  ];

  return (
    <div className={`flex items-center gap-1.5 ${className}`} aria-label="Time remaining">
      {units.map((unit) => (
        <div
          key={unit.label}
          className="min-w-10 rounded-lg bg-slate-900 px-2 py-1 text-center text-white"
        >
          <span className="block text-sm font-semibold leading-none tabular-nums">
            {pad(unit.value)}
          </span>
          <span className="mt-1 block text-[9px] font-medium uppercase tracking-wider text-slate-400">
            {unit.label}
          </span>
        </div>
      ))}
    </div>
  );
}
