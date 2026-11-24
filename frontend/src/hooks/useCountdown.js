import { useEffect, useState } from 'react';

const calculateRemaining = (endsAt, now) => {
  const end = new Date(endsAt).getTime();
  const remaining = Number.isNaN(end) ? 0 : Math.max(0, end - now);

  return {
    total: remaining,
    days: Math.floor(remaining / 86_400_000),
    hours: Math.floor((remaining / 3_600_000) % 24),
    minutes: Math.floor((remaining / 60_000) % 60),
    seconds: Math.floor((remaining / 1_000) % 60),
    expired: remaining <= 0,
  };
};

/**
 * Ticks once per second while a deadline is set so countdown UIs stay isolated
 * from the rest of the page.
 */
export default function useCountdown(endsAt) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!endsAt) return undefined;

    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, [endsAt]);

  return calculateRemaining(endsAt, now);
}
