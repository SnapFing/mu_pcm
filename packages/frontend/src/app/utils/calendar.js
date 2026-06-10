// packages/frontend/src/app/utils/calendar.js
// Generates an .ics file and triggers a browser download.
// Works in all modern browsers with no dependencies.
//
// Usage:
//   import { downloadICS } from '@/app/utils/calendar';
//   downloadICS(event);
//
// event shape: { title, date, time, venue, description }
//   date   — 'YYYY-MM-DD'
//   time   — 'HH:MM'  (24-hour, optional)

/**
 * Pad a number to 2 digits.
 */
function pad(n) {
  return String(n).padStart(2, '0');
}

/**
 * Sanitize a string for ICS text fields.
 * Escapes commas, semicolons, backslashes, and folds newlines.
 */
function icsText(str = '') {
  return str
    .replace(/\\/g, '\\\\')
    .replace(/;/g,  '\\;')
    .replace(/,/g,  '\\,')
    .replace(/\n/g, '\\n');
}

/**
 * Build an ICS datetime stamp from date string + time string.
 * Returns a floating local time (no timezone suffix) so it opens
 * in the user's local calendar correctly regardless of timezone.
 */
function toICSDate(dateStr, timeStr) {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-');
  if (!timeStr) return `${year}${month}${day}`;
  const [hour, minute] = timeStr.split(':');
  return `${year}${month}${day}T${pad(parseInt(hour))}${pad(parseInt(minute))}00`;
}

/**
 * downloadICS(event)
 * Generates and triggers download of a .ics calendar file.
 */
export function downloadICS(event) {
  const {
    title       = 'MU SDA PCM Event',
    date        = '',
    time        = '',
    venue       = '',
    description = '',
  } = event;

  // Calculate end time: default 2 hours after start
  let endDate = date;
  let endTime = time;
  if (time) {
    const [h, m] = time.split(':').map(Number);
    const endHour = (h + 2) % 24;
    endTime = `${pad(endHour)}:${pad(m)}`;
    // Handle midnight rollover
    if (endHour < h) {
      const d = new Date(date);
      d.setDate(d.getDate() + 1);
      endDate = d.toISOString().split('T')[0];
    }
  }

  const dtStart = toICSDate(date, time);
  const dtEnd   = toICSDate(endDate, endTime);
  const uid     = `${Date.now()}-${Math.random().toString(36).slice(2)}@mupcm.org`;
  const now     = new Date();
  const stamp   = `${now.getUTCFullYear()}${pad(now.getUTCMonth()+1)}${pad(now.getUTCDate())}T${pad(now.getUTCHours())}${pad(now.getUTCMinutes())}${pad(now.getUTCSeconds())}Z`;

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//MU SDA PCM//Mulungushi University//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${stamp}`,
    dtStart ? `DTSTART:${dtStart}` : null,
    dtEnd   ? `DTEND:${dtEnd}`     : null,
    `SUMMARY:${icsText(title)}`,
    venue       ? `LOCATION:${icsText(venue)}`       : null,
    description ? `DESCRIPTION:${icsText(description)}` : null,
    'END:VEVENT',
    'END:VCALENDAR',
  ]
    .filter(Boolean)
    .join('\r\n');

  const blob     = new Blob([lines], { type: 'text/calendar;charset=utf-8' });
  const url      = URL.createObjectURL(blob);
  const anchor   = document.createElement('a');
  anchor.href    = url;
  anchor.download = `${title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.ics`;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}