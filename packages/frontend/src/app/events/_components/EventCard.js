'use client';
// packages/frontend/src/app/events/_components/EventCard.js
// Event card with:
//  - "More Info" → full detail modal (flyer image, description, EMBEDDED map, call)
//  - "Call" button → tel: deep link (only shown if contactNumber set by admin)
//  - Embedded map (no external navigation) — uses mapsQuery or falls back to venue

import { useState } from 'react';

// ── Icons ──────────────────────────────────────────────────────────────────
const Ico = ({ d, c = 'w-4 h-4' }) => (
  <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

const CalIcon   = ({ c }) => <Ico c={c} d="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z" />;
const ClockIcon = ({ c }) => (
  <svg className={c || 'w-4 h-4'} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round">
    <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
  </svg>
);
const PinIcon   = ({ c }) => <Ico c={c} d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z M12 7a3 3 0 100 6 3 3 0 000-6z" />;
const PhoneIcon = ({ c }) => <Ico c={c} d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.01 1.18 2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z" />;
const CloseIcon = ({ c }) => <Ico c={c} d="M18 6L6 18M6 6l12 12" />;
const ExtIcon   = ({ c }) => <Ico c={c} d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />;

// ── Helpers ────────────────────────────────────────────────────────────────
function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });
}

function formatDateShort(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-GB', {
    weekday: 'short', day: 'numeric', month: 'short', year: 'numeric',
  });
}

function formatTime(timeStr) {
  if (!timeStr) return '';
  const [h, m] = timeStr.split(':').map(Number);
  const suffix = h >= 12 ? 'PM' : 'AM';
  const hour   = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, '0')} ${suffix}`;
}

function telHref(raw = '') {
  return 'tel:' + raw.replace(/[\s\-().]/g, '');
}

function mapQueryText(mapsQuery, venue) {
  const q = (mapsQuery || venue || '').trim();
  return q || null;
}

function mapEmbedSrc(query) {
  return `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;
}

function mapExternalHref(query) {
  return `https://www.google.com/maps/search/${encodeURIComponent(query)}`;
}

// ── Category colours ───────────────────────────────────────────────────────
const CAT_COLORS = {
  'Worship Services': { bg: 'rgba(46,109,231,0.1)',  text: '#2E6DE7' },
  'Prayer':           { bg: 'rgba(124,58,237,0.1)',  text: '#7C3AED' },
  'Bible Studies':    { bg: 'rgba(15,42,74,0.08)',   text: '#0F2A4A' },
  'Community':        { bg: 'rgba(46,109,231,0.08)', text: '#2E6DE7' },
  'Community Service':{ bg: 'rgba(5,150,105,0.1)',   text: '#059669' },
  'Retreats & Camps': { bg: 'rgba(124,58,237,0.08)', text: '#7C3AED' },
};

// ── Event Detail Modal ─────────────────────────────────────────────────────
function EventModal({ event, onClose }) {
  const {
    title, category = 'General', date, time, venue,
    description, image, contactNumber, mapsQuery, featured,
  } = event;

  const colors = CAT_COLORS[category] || { bg: 'rgba(46,109,231,0.1)', text: '#2E6DE7' };
  const query  = mapQueryText(mapsQuery, venue);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      style={{ background: 'rgba(15,42,74,0.65)', backdropFilter: 'blur(6px)' }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full sm:max-w-lg max-h-[96vh] overflow-y-auto"
        style={{
          background: 'white',
          borderRadius: '20px 20px 0 0',
          boxShadow: '0 -8px 40px rgba(15,42,74,0.25)',
        }}
      >
        {/* Flyer image – full preview, no cropping */}
        <div className="relative" style={{ minHeight: image ? 'auto' : 80 }}>
          {image ? (
            <img
              src={image}
              alt={title}
              className="w-full h-auto max-h-[50vh] object-contain"
              onError={e => { e.currentTarget.style.display = 'none'; }}
            />
          ) : (
            <div style={{ height: 80, background: 'linear-gradient(135deg, #0F2A4A, #2E6DE7)' }} />
          )}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.25)', color: 'white' }}
          >
            <CloseIcon c="w-4 h-4" />
          </button>
          <span
            className="absolute bottom-3 left-4 text-[10px] font-bold px-2.5 py-1 rounded-full"
            style={{ background: colors.bg, color: colors.text, backdropFilter: 'blur(8px)', border: `1px solid ${colors.text}30` }}
          >
            {category}
          </span>
        </div>

        {/* Content */}
        <div className="px-6 pt-5 pb-8 flex flex-col gap-5">
          <div>
            <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 22, fontWeight: 700, color: '#0F2A4A', lineHeight: 1.2 }}>
              {title}
            </h2>
            {featured && (
              <span className="inline-block mt-2 text-[10px] font-bold px-2.5 py-1 rounded-full"
                style={{ background: 'rgba(46,109,231,0.1)', color: '#2E6DE7' }}>
                ★ Featured Event
              </span>
            )}
          </div>

          <div className="flex flex-col gap-2.5 rounded-2xl p-4" style={{ background: '#F5F7FF', border: '1px solid #E2E8F7' }}>
            <div className="flex items-center gap-3" style={{ fontSize: 14, color: '#0F2A4A', fontWeight: 500 }}>
              <span style={{ color: '#2E6DE7' }}><CalIcon c="w-4 h-4" /></span>
              {formatDate(date)}
            </div>
            {time && (
              <div className="flex items-center gap-3" style={{ fontSize: 14, color: '#475569' }}>
                <span style={{ color: '#2E6DE7' }}><ClockIcon c="w-4 h-4" /></span>
                {formatTime(time)}
              </div>
            )}
            {venue && (
              <div className="flex items-center gap-3" style={{ fontSize: 14, color: '#475569' }}>
                <span style={{ color: '#2E6DE7', flexShrink: 0 }}><PinIcon c="w-4 h-4" /></span>
                <span>{venue}</span>
              </div>
            )}
          </div>

          {description && (
            <div>
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', color: '#94A3B8', marginBottom: 8 }}>ABOUT THIS EVENT</p>
              <p style={{ fontSize: 14, color: '#334155', lineHeight: 1.8 }}>{description}</p>
            </div>
          )}

          {query && (
            <div>
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', color: '#94A3B8', marginBottom: 8 }}>LOCATION</p>
              <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid #E2E8F7', height: 200 }}>
                <iframe
                  src={mapEmbedSrc(query)}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={`Map showing ${venue || title}`}
                />
              </div>
              <a
                href={mapExternalHref(query)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 mt-2 text-xs font-semibold"
                style={{ color: '#2E6DE7' }}
              >
                Get directions <ExtIcon c="w-3 h-3" />
              </a>
            </div>
          )}

          <div className="flex flex-col gap-3 pt-2" style={{ borderTop: '1px solid #E2E8F7' }}>
            {contactNumber && (
              <a
                href={telHref(contactNumber)}
                className="flex items-center justify-center gap-2.5 w-full py-3.5 rounded-2xl text-sm font-bold transition-all"
                style={{ background: '#2E6DE7', color: 'white', textDecoration: 'none' }}
                onMouseEnter={e => e.currentTarget.style.background = '#1d5cd4'}
                onMouseLeave={e => e.currentTarget.style.background = '#2E6DE7'}
              >
                <PhoneIcon c="w-4 h-4" />
                Call {contactNumber}
              </a>
            )}
            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-2xl text-sm font-medium"
              style={{ color: '#94A3B8', border: '1px solid #E2E8F7', background: 'white' }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── EventCard ──────────────────────────────────────────────────────────────
export default function EventCard({ event }) {
  const [showModal, setShowModal] = useState(false);

  const {
    title, category = 'General', date, time, venue,
    description, image, featured = false, contactNumber,
  } = event;

  const colors = CAT_COLORS[category] || { bg: 'rgba(46,109,231,0.1)', text: '#2E6DE7' };

  return (
    <>
      <div
        className="rounded-2xl overflow-hidden flex flex-col transition-all duration-200 hover:-translate-y-0.5"
        style={{
          background: 'white',
          border:     featured ? '1.5px solid rgba(46,109,231,0.35)' : '1px solid #E2E8F7',
          boxShadow:  featured ? '0 4px 20px rgba(46,109,231,0.12)' : '0 1px 4px rgba(46,109,231,0.06)',
        }}
        onMouseEnter={e => e.currentTarget.style.boxShadow = '0 8px 28px rgba(46,109,231,0.14)'}
        onMouseLeave={e => e.currentTarget.style.boxShadow = featured ? '0 4px 20px rgba(46,109,231,0.12)' : '0 1px 4px rgba(46,109,231,0.06)'}
      >
        {/* Responsive 16:9 image container – cropped */}
        <div
          className="relative overflow-hidden"
          style={{
            aspectRatio: '16 / 9',
            background: 'linear-gradient(135deg, #0F2A4A, #1a3d68)',
          }}
        >
          {image && (
            <img
              src={image}
              alt={title}
              className="absolute inset-0 w-full h-full object-cover"
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
          <p className="text-sm leading-relaxed flex-1" style={{ color: '#64748B', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {description}
          </p>

          <div className="flex flex-col gap-1.5 pt-3" style={{ borderTop: '1px solid #F1F5F9' }}>
            <span className="flex items-center gap-1.5 text-xs font-medium" style={{ color: '#475569' }}>
              <span style={{ color: '#2E6DE7' }}><CalIcon c="w-3.5 h-3.5" /></span>
              {formatDateShort(date)}
            </span>
            <div className="flex items-center gap-4">
              {time && (
                <span className="flex items-center gap-1.5 text-xs font-medium" style={{ color: '#475569' }}>
                  <span style={{ color: '#2E6DE7' }}><ClockIcon c="w-3.5 h-3.5" /></span>
                  {formatTime(time)}
                </span>
              )}
              {venue && (
                <span className="flex items-center gap-1.5 text-xs font-medium truncate" style={{ color: '#475569' }}>
                  <span style={{ color: '#2E6DE7', flexShrink: 0 }}><PinIcon c="w-3.5 h-3.5" /></span>
                  <span className="truncate">{venue}</span>
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="px-5 pb-5 flex gap-2">
          <button
            onClick={() => setShowModal(true)}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all"
            style={{ background: '#2E6DE7', color: 'white' }}
            onMouseEnter={e => e.currentTarget.style.background = '#1d5cd4'}
            onMouseLeave={e => e.currentTarget.style.background = '#2E6DE7'}
          >
            More Info
          </button>

          {contactNumber && (
            <a
              href={telHref(contactNumber)}
              className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all"
              style={{ background: '#F5F7FF', color: '#059669', border: '1px solid rgba(5,150,105,0.25)', textDecoration: 'none' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(5,150,105,0.08)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#F5F7FF'; }}
              title={`Call ${contactNumber}`}
            >
              <PhoneIcon c="w-4 h-4" />
              Call
            </a>
          )}
        </div>
      </div>

      {showModal && (
        <EventModal event={event} onClose={() => setShowModal(false)} />
      )}
    </>
  );
}