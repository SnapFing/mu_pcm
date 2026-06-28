'use client';
// packages/frontend/src/app/events/_components/EventCard.js
// Event card with:
//  - "More Info" → full detail modal (flyer image, description, EMBEDDED map, call)
//  - "Call" button → tel: deep link (only shown if contactNumber set by admin)
//  - Embedded map (no external navigation) — uses mapsQuery or falls back to venue

import { useState } from 'react';
import Button from '@/app/ui/Button';
import { CalendarIcon, ClockIcon, PinIcon, PhoneIcon, XIcon } from '@/app/ui/Icon';

// Using shared icons from Icon.js

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
            aria-label="Close dialog"
          >
            <XIcon className="w-4 h-4 text-white" />
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
              <span style={{ color: '#2E6DE7' }}><CalendarIcon className="w-4 h-4" /></span>
              {formatDate(date)}
            </div>
            {time && (
                <div className="flex items-center gap-3" style={{ fontSize: 14, color: '#475569' }}>
                <span style={{ color: '#2E6DE7' }}><ClockIcon className="w-4 h-4" /></span>
                {formatTime(time)}
              </div>
            )}
            {venue && (
                <div className="flex items-center gap-3" style={{ fontSize: 14, color: '#475569' }}>
                <span style={{ color: '#2E6DE7', flexShrink: 0 }}><PinIcon className="w-4 h-4" /></span>
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
                  Get directions
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
                title={`Call ${contactNumber}`}
              >
                <PhoneIcon className="w-4 h-4" />
                Call {contactNumber}
              </a>
            )}
            <Button onClick={onClose} variant="subtle" className="w-full">Close</Button>
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
              <span style={{ color: '#2E6DE7' }}><PhoneIcon c="w-3.5 h-3.5" /></span>
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
          <Button onClick={() => setShowModal(true)} variant="primary" className="flex-1">More Info</Button>

          {contactNumber && (
            <a
              href={telHref(contactNumber)}
              className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all"
              style={{ background: '#F5F7FF', color: '#059669', border: '1px solid rgba(5,150,105,0.25)', textDecoration: 'none' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(5,150,105,0.08)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#F5F7FF'; }}
              title={`Call ${contactNumber}`}
            >
              <PhoneIcon className="w-4 h-4" />
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