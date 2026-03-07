'use client';

/**
 * SabbathGreeting.js
 * Place at: src/app/ministry/SabbathGreeting.js
 *
 * Shows a contextual greeting based on the current day:
 *  - Friday sunset → "Happy Sabbath Eve"
 *  - Saturday       → "Happy Sabbath" (in Bemba + English)
 *  - Sunday         → "Blessed Sunday"
 *  - Other days     → "Good [Morning/Afternoon/Evening]"
 */

export default function SabbathGreeting({ name = 'Friend' }) {
  const now  = new Date();
  const day  = now.getDay();   // 0=Sun … 6=Sat
  const hour = now.getHours();

  // ── Choose greeting ───────────────────────────────────────────────────
  let heading   = '';
  let subline   = '';
  let badge     = '';
  let badgeStyle = {};

  if (day === 6) {
    // Saturday — Sabbath
    heading    = 'Sabata Yanu Yili Bwino, ' + name + '!';
    subline    = 'Welcome home to your MU SDA PCM Companion. May this Sabbath draw you closer to Jesus.';
    badge      = 'Happy Sabbath ✦';
    badgeStyle = { background: 'rgba(46,109,231,0.12)', color: '#2E6DE7', border: '1px solid rgba(46,109,231,0.25)' };
  } else if (day === 5 && hour >= 17) {
    // Friday after 5 PM — Sabbath eve
    heading    = 'Sabbath is Almost Here, ' + name + '!';
    subline    = 'Prepare your heart for rest and worship. The sun is setting on a blessed week.';
    badge      = 'Sabbath Eve ✦';
    badgeStyle = { background: 'rgba(124,58,237,0.10)', color: '#7C3AED', border: '1px solid rgba(124,58,237,0.25)' };
  } else if (day === 0) {
    // Sunday
    heading    = 'Blessed Sunday, ' + name + '!';
    subline    = 'Welcome back to your MU SDA PCM Companion. May this week be filled with purpose and faith.';
    badge      = 'Blessed Sunday';
    badgeStyle = { background: 'rgba(46,109,231,0.08)', color: '#2E6DE7', border: '1px solid rgba(46,109,231,0.2)' };
  } else {
    // Weekday greeting by time of day
    const timeOfDay = hour < 12 ? 'Morning' : hour < 17 ? 'Afternoon' : 'Evening';
    heading    = `Good ${timeOfDay}, ${name}!`;
    subline    = 'Welcome to your MU SDA PCM Companion. May this day draw you closer to Jesus.';
    badge      = `Good ${timeOfDay}`;
    badgeStyle = { background: 'rgba(15,42,74,0.07)', color: '#0F2A4A', border: '1px solid rgba(15,42,74,0.15)' };
  }

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex flex-col gap-2">
        {/* Badge */}
        <span className="self-start text-[10px] font-bold px-3 py-1 rounded-full tracking-widest uppercase"
          style={badgeStyle}>
          {badge}
        </span>
        {/* Heading */}
        <h2 className="font-bold leading-tight" style={{ fontSize: 'clamp(1.1rem, 2vw, 1.4rem)', color: '#0F2A4A' }}>
          {heading}
        </h2>
        {/* Sub */}
        <p style={{ fontSize: 14, color: '#64748B', lineHeight: 1.6 }}>{subline}</p>
      </div>

      {/* Date pill */}
      <div className="shrink-0 text-right">
        <p className="font-semibold" style={{ fontSize: 13, color: '#2E6DE7' }}>
          {now.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
        <p style={{ fontSize: 12, color: '#94A3B8', marginTop: 2 }}>
          {now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })} CAT
        </p>
      </div>
    </div>
  );
}