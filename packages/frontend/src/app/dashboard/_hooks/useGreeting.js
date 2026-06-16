/**
 * dashboard/_hooks/useGreeting.js
 *
 * FIX: This file was named "userGreeting.js" — renamed to "useGreeting.js"
 * (React hook naming convention: hooks must start with "use").
 *
 * Extracts the day/time greeting logic from SabbathGreeting.
 * Returns { heading, subline, badge, badgeStyle }
 */
export function useGreeting(name = 'Friend') {
  const now  = new Date();
  const day  = now.getDay();
  const hour = now.getHours();

  if (day === 6) {
    return {
      heading:    `Blessed Sabbath, ${name}!`,
      subline:    'Welcome home to your MU SDA PCM Companion. May this Sabbath draw you closer to Jesus.',
      badge:      'Happy Sabbath ✦',
      badgeStyle: { background: 'rgba(46,109,231,0.12)', color: '#2E6DE7', border: '1px solid rgba(46,109,231,0.25)' },
    };
  }
  if (day === 5 && hour >= 17) {
    return {
      heading:    `Sabbath is Almost Here, ${name}!`,
      subline:    'Prepare your heart for rest and worship. The sun is setting on a blessed week.',
      badge:      'Sabbath Eve ✦',
      badgeStyle: { background: 'rgba(124,58,237,0.10)', color: '#7C3AED', border: '1px solid rgba(124,58,237,0.25)' },
    };
  }
  if (day === 0) {
    return {
      heading:    `Blessed Sunday, ${name}!`,
      subline:    'Welcome back to your MU SDA PCM Companion. May this week be filled with purpose and faith.',
      badge:      'Blessed Sunday',
      badgeStyle: { background: 'rgba(46,109,231,0.08)', color: '#2E6DE7', border: '1px solid rgba(46,109,231,0.2)' },
    };
  }
  const timeOfDay = hour < 12 ? 'Morning' : hour < 17 ? 'Afternoon' : 'Evening';
  return {
    heading:    `Good ${timeOfDay}, ${name}!`,
    subline:    'Welcome to your MU SDA PCM Companion. May this day draw you closer to Jesus.',
    badge:      `Good ${timeOfDay}`,
    badgeStyle: { background: 'rgba(15,42,74,0.07)', color: '#0F2A4A', border: '1px solid rgba(15,42,74,0.15)' },
  };
}