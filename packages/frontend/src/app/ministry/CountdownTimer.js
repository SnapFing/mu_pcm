'use client';

/**
 * CountdownTimer.js
 * Place at: src/app/ministry/CountdownTimer.js
 *
 * Props:
 *   targetDate {string} — ISO 8601 date string, e.g. "2026-03-14T19:00:00+02:00"
 *   label      {string} — optional label shown above the timer
 */

import { useState, useEffect } from 'react';

function pad(n) {
  return String(n).padStart(2, '0');
}

function getTimeLeft(target) {
  const diff = new Date(target) - new Date();
  if (diff <= 0) return null;
  const totalSecs = Math.floor(diff / 1000);
  return {
    days:    Math.floor(totalSecs / 86400),
    hours:   Math.floor((totalSecs % 86400) / 3600),
    minutes: Math.floor((totalSecs % 3600) / 60),
    seconds: totalSecs % 60,
  };
}

export default function CountdownTimer({ targetDate, label = 'Starting in' }) {
  const [timeLeft, setTimeLeft] = useState(null);
  const [mounted, setMounted]   = useState(false);

  useEffect(() => {
    setMounted(true);
    setTimeLeft(getTimeLeft(targetDate));
    const id = setInterval(() => setTimeLeft(getTimeLeft(targetDate)), 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  // Avoid hydration mismatch
  if (!mounted) return null;

  if (!timeLeft) {
    return (
      <div className="flex items-center gap-2 rounded-xl px-4 py-3"
        style={{ background: 'rgba(46,109,231,0.08)', border: '1px solid rgba(46,109,231,0.2)' }}>
        <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#2E6DE7' }}/>
        <p className="font-semibold text-sm" style={{ color: '#2E6DE7' }}>Event is happening now!</p>
      </div>
    );
  }

  const units = [
    { label: 'Days',    value: pad(timeLeft.days)    },
    { label: 'Hours',   value: pad(timeLeft.hours)   },
    { label: 'Mins',    value: pad(timeLeft.minutes) },
    { label: 'Secs',    value: pad(timeLeft.seconds) },
  ];

  return (
    <div className="flex flex-col gap-2">
      <p style={{ fontSize: 11, fontWeight: 600, color: '#94A3B8', letterSpacing: '0.05em' }}>{label}</p>
      <div className="flex items-center gap-2">
        {units.map(({ label: u, value }, i) => (
          <div key={u} className="flex items-center gap-2">
            <div className="flex flex-col items-center rounded-xl px-3 py-2 min-w-[52px]"
              style={{ background: '#F5F7FF', border: '1px solid #E2E8F7' }}>
              <span className="font-extrabold leading-none" style={{ fontSize: 20, color: '#0F2A4A', fontVariantNumeric: 'tabular-nums' }}>
                {value}
              </span>
              <span style={{ fontSize: 9, color: '#94A3B8', fontWeight: 600, letterSpacing: '0.08em', marginTop: 2 }}>
                {u}
              </span>
            </div>
            {/* Separator dots — not after last */}
            {i < units.length - 1 && (
              <span style={{ color: '#CBD5E1', fontWeight: 700, fontSize: 16, lineHeight: 1 }}>:</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}