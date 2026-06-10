'use client';
// packages/frontend/src/app/events/_components/EventCard.js

import { downloadICS } from '@/app/utils/calendar';

function CalIcon() {
  return (
    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round">
      <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
    </svg>
  );
}
function PinIcon() {
  return (
    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round">
      <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
    </svg>
  );
}
function ClockIcon() {
  return (
    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round">
      <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
    </svg>
  );
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-GB', {
    weekday: 'short', day: 'numeric', month: 'short', year: 'numeric',
  });
}

const categoryColors = {
  'Worship Services': { bg: 'rgba(46,109,231,0.1)',  text: '#2E6DE7' },
  'Prayer':           { bg: 'rgba(124,58,237,0.1)',  text: '#7C3AED' },
  'Bible Studies':    { bg: 'rgba(15,42,74,0.08)',   text: '#0F2A4A' },
  'Community':        { bg: 'rgba(46,109,231,0.08)', text: '#2E6DE7' },
  'Community Service':{ bg: 'rgba(5,150,105,0.1)',   text: '#059669' },
  'Retreats & Camps': { bg: 'rgba(124,58,237,0.08)', text: '#7C3AED' },
};

export default function EventCard({ event }) {
  const { title, category = 'General', date, time, venue, description, image, featured = false } = event;
  const colors = categoryColors[category] || { bg: 'rgba(46,109,231,0.1)', text: '#2E6DE7' };

  const handleAddToCalendar = (e) => {
    e.preventDefault();
    downloadICS({ title, date, time, venue, description });
  };

  return (
    <div
      className="rounded-2xl overflow-hidden flex flex-col transition-all duration-200 hover:-translate-y-0.5"
      style={{
        background:   'white',
        border:       featured ? '1.5px solid rgba(46,109,231,0.35)' : '1px solid #E2E8F7',
        boxShadow:    featured ? '0 4px 20px rgba(46,109,231,0.12)' : '0 1px 4px rgba(46,109,231,0.06)',
      }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = '0 8px 28px rgba(46,109,231,0.14)'}
      onMouseLeave={e => e.currentTarget.style.boxShadow = featured ? '0 4px 20px rgba(46,109,231,0.12)' : '0 1px 4px rgba(46,109,231,0.06)'}
    >
      {/* Image */}
      <div className="relative overflow-hidden" style={{ height: 180, background: '#F5F7FF' }}>
        {image && (
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover"
            onError={e => { e.currentTarget.style.display = 'none'; }}
          />
        )}
        {featured && (
          <span className="absolute top-3 left-3 text-[10px] font-bold px-2.5 py-1 rounded-full"
            style={{ background: '#2E6DE7', color: 'white', letterSpacing: '0.1em' }}>
            FEATURED
          </span>
        )}
        <span className="absolute top-3 right-3 text-[10px] font-bold px-2.5 py-1 rounded-full"
          style={{ background: colors.bg, color: colors.text, backdropFilter: 'blur(4px)' }}>
          {category}
        </span>
      </div>

      {/* Body */}
      <div className="p-5 flex flex-col gap-3 flex-1">
        <h3 className="font-bold leading-snug" style={{ color: '#0F2A4A', fontSize: 15 }}>{title}</h3>
        <p className="text-sm leading-relaxed flex-1" style={{ color: '#64748B' }}>{description}</p>

        {/* Meta */}
        <div className="flex flex-col gap-1.5 pt-3" style={{ borderTop: '1px solid #F1F5F9' }}>
          <span className="flex items-center gap-1.5 text-xs font-medium" style={{ color: '#475569' }}>
            <span style={{ color: '#2E6DE7' }}><CalIcon /></span> {formatDate(date)}
          </span>
          <div className="flex items-center gap-4">
            {time && (
              <span className="flex items-center gap-1.5 text-xs font-medium" style={{ color: '#475569' }}>
                <span style={{ color: '#2E6DE7' }}><ClockIcon /></span> {time}
              </span>
            )}
            {venue && (
              <span className="flex items-center gap-1.5 text-xs font-medium" style={{ color: '#475569' }}>
                <span style={{ color: '#2E6DE7' }}><PinIcon /></span> {venue}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-5 pb-5 flex gap-2">
        <button
          onClick={handleAddToCalendar}
          className="flex-1 py-2 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-1.5"
          style={{ background: '#2E6DE7', color: 'white' }}
          onMouseEnter={e => e.currentTarget.style.background = '#1d5cd4'}
          onMouseLeave={e => e.currentTarget.style.background = '#2E6DE7'}
          title="Download .ics file to add to your calendar"
        >
          <CalIcon /> Add to Calendar
        </button>
      </div>
    </div>
  );
}