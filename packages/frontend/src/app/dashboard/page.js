'use client';
import React from 'react';

import { useState, useEffect, useRef } from 'react';
import Navbar          from '@/app/ui/Navbar';
import Footer          from '@/app/ui/Footer';
import SabbathGreeting from '@/app/ministry/SabbathGreeting';
import VerseDisplay    from '@/app/ministry/VerseDisplay';
import CountdownTimer  from '@/app/ministry/CountdownTimer';
import { downloadICS } from '@/app/utils/calendar';
import { useEvents }   from '@/app/context/DataContext';   // <-- add this import

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const userName = " ";

// ── Icons (unchanged) ──────────────────────────────────────────────────────
const Ico = ({ children, className = 'w-5 h-5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    {children}
  </svg>
);
const ChevronRight = ({ c = 'w-4 h-4' }) => <Ico className={c}><path d="M9 18l6-6-6-6"/></Ico>;
const ChevronLeft  = ({ c = 'w-4 h-4' }) => <Ico className={c}><path d="M15 18l-6-6 6-6"/></Ico>;
const CalIcon      = ({ c = 'w-5 h-5' }) => <Ico className={c}><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></Ico>;
const PrayIcon     = ({ c = 'w-5 h-5' }) => <Ico className={c}><path d="M12 22s-8-5.25-8-11a8 8 0 0116 0c0 5.75-8 11-8 11z"/></Ico>;
const BookIcon     = ({ c = 'w-5 h-5' }) => <Ico className={c}><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></Ico>;
const JournalIcon  = ({ c = 'w-5 h-5' }) => <Ico className={c}><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/></Ico>;
const MediaIcon    = ({ c = 'w-5 h-5' }) => <Ico className={c}><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></Ico>;
const StarIcon     = ({ c = 'w-5 h-5' }) => <Ico className={c}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></Ico>;
const UsersIcon    = ({ c = 'w-5 h-5' }) => <Ico className={c}><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></Ico>;
const ClockIcon    = ({ c = 'w-5 h-5' }) => <Ico className={c}><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></Ico>;
const CrossIcon    = ({ c = 'w-5 h-5' }) => <Ico className={c}><path d="M12 3v18M4 9h16"/></Ico>;
const PinIcon      = ({ c = 'w-4 h-4' }) => <Ico className={c}><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></Ico>;
const CreditIcon   = ({ c = 'w-5 h-5' }) => <Ico className={c}><rect x="1" y="4" width="22" height="16" rx="2"/><path d="M1 10h22"/></Ico>;
const AlertIcon    = ({ c = 'w-4 h-4' }) => <Ico className={c}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></Ico>;
const BellIcon     = ({ c = 'w-4 h-4' }) => <Ico className={c}><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"/></Ico>;

const stats = [
  { value: '340+', label: 'Members',       Icon: UsersIcon },
  { value: '12',   label: 'Weekly Events', Icon: CalIcon   },
  { value: '24h',  label: 'Prayer Chain',  Icon: ClockIcon },
  { value: '6',    label: 'Ministries',    Icon: CrossIcon },
];

const quickLinks = [
  { href: '/events',    Icon: CalIcon,     label: 'Events'    },
  { href: '/about',     Icon: UsersIcon,   label: 'About Us'  },
  { href: '/prayer',    Icon: PrayIcon,    label: 'Prayer'    },
  { href: '/resources', Icon: BookIcon,    label: 'Resources' },
  { href: '/journals',  Icon: JournalIcon, label: 'Journals'  },
  { href: '/media',     Icon: MediaIcon,   label: 'Media'     },
  { href: '/heroes',    Icon: StarIcon,    label: 'Heroes'    },
  { href: '/groups',    Icon: UsersIcon,   label: 'Groups'    },  
];

// ── Accent colors cycle ────────────────────────────────────────────────────
const ACCENTS = ['#2E6DE7', '#7C3AED', '#0F2A4A', '#059669', '#F59E0B'];

// ── Format date ────────────────────────────────────────────────────────────
function fmtDate(dateStr) {
  if (!dateStr) return '';
  try {
    return new Date(dateStr).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
  } catch { return dateStr; }
}

function formatTime(timeStr) {
  if (!timeStr) return '';
  const [h, m] = timeStr.split(':').map(Number);
  const suffix = h >= 12 ? 'PM' : 'AM';
  const hour   = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, '0')} ${suffix}`;
}

// ── Cards ──────────────────────────────────────────────────────────────────
function VerseCard() {
  return (
    <div className="rounded-2xl overflow-hidden flex flex-col h-full"
      style={{ background: 'white', border: '1px solid #E2E8F7', boxShadow: '0 1px 4px rgba(46,109,231,0.06)', borderTop: '3px solid #2E6DE7' }}>
      <div className="px-6 pt-5 pb-3 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'rgba(46,109,231,0.1)', color: '#2E6DE7' }}>
          <BookIcon c="w-4 h-4" />
        </div>
        <div>
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', color: '#2E6DE7' }} className="uppercase">Morning Watch</p>
          <p style={{ fontSize: 11, color: '#94A3B8' }}>Today's devotion</p>
        </div>
      </div>
      <div className="flex-1 px-6 py-4" style={{ background: 'linear-gradient(160deg, rgba(46,109,231,0.04) 0%, rgba(46,109,231,0.01) 100%)', borderTop: '1px solid #E2E8F7', borderBottom: '1px solid #E2E8F7' }}>
        <VerseDisplay theme="light" />
      </div>
      <div className="px-6 py-4">
        <a href="/resources" className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: '#2E6DE7' }}>
          More devotional resources <ChevronRight c="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
}

function EventCard({ nextEvent }) {
  const [rsvpDone, setRsvpDone] = React.useState(false);
 
  const handleAddToCalendar = (e) => {
    e.preventDefault();
    if (nextEvent) downloadICS(nextEvent);
  };

  if (!nextEvent) {
    return (
      <div className="rounded-2xl overflow-hidden flex flex-col h-full"
        style={{ background: 'white', border: '1px solid #E2E8F7', boxShadow: '0 1px 4px rgba(46,109,231,0.06)', borderTop: '3px solid #0F2A4A' }}>
        <div className="px-6 pt-5 pb-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'rgba(15,42,74,0.08)', color: '#0F2A4A' }}>
            <CalIcon c="w-4 h-4" />
          </div>
          <div>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', color: '#0F2A4A' }} className="uppercase">Next Gathering</p>
            <p style={{ fontSize: 11, color: '#94A3B8' }}>Coming up soon</p>
          </div>
        </div>
        <div className="flex-1 px-6 py-4 flex items-center justify-center" style={{ borderTop: '1px solid #E2E8F7' }}>
          <p style={{ fontSize: 14, color: '#94A3B8' }}>No upcoming events</p>
        </div>
        <div className="px-6 py-4 flex justify-end" style={{ borderTop: '1px solid #E2E8F7', background: '#FAFBFF' }}>
          <a href="/events" className="text-xs font-semibold" style={{ color: '#2E6DE7' }}>View all events <ChevronRight c="w-3.5 h-3.5" /></a>
        </div>
      </div>
    );
  }
 
  return (
    <div className="rounded-2xl overflow-hidden flex flex-col h-full"
      style={{ background: 'white', border: '1px solid #E2E8F7', boxShadow: '0 1px 4px rgba(46,109,231,0.06)', borderTop: '3px solid #0F2A4A' }}>
      <div className="px-6 pt-5 pb-3 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'rgba(15,42,74,0.08)', color: '#0F2A4A' }}>
          <CalIcon c="w-4 h-4" />
        </div>
        <div>
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', color: '#0F2A4A' }} className="uppercase">Next Gathering</p>
          <p style={{ fontSize: 11, color: '#94A3B8' }}>Coming up soon</p>
        </div>
      </div>
      <div className="flex-1 px-6 py-4 flex flex-col gap-4" style={{ borderTop: '1px solid #E2E8F7' }}>
        <div>
          <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 700, fontSize: 20, color: '#0F2A4A', lineHeight: 1.2 }}>{nextEvent.title}</h3>
          {nextEvent.description && <p style={{ fontSize: 13, color: '#64748B', marginTop: 4 }}>{nextEvent.description}</p>}
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="flex items-center gap-1.5 rounded-full px-3 py-1"
            style={{ background: '#F5F7FF', border: '1px solid #E2E8F7', fontSize: 11, color: '#475569', fontWeight: 500 }}>
            <ClockIcon c="w-3 h-3" /> {fmtDate(nextEvent.date)}{nextEvent.time ? ` · ${formatTime(nextEvent.time)}` : ''}
          </span>
          {nextEvent.venue && (
            <span className="flex items-center gap-1.5 rounded-full px-3 py-1"
              style={{ background: '#F5F7FF', border: '1px solid #E2E8F7', fontSize: 11, color: '#475569', fontWeight: 500 }}>
              <PinIcon c="w-3 h-3" /> {nextEvent.venue}
            </span>
          )}
        </div>
        <CountdownTimer targetDate={`${nextEvent.date}T${nextEvent.time || '00:00'}:00+02:00`} />
      </div>
      <div className="px-6 py-4 flex justify-between items-center" style={{ borderTop: '1px solid #E2E8F7', background: '#FAFBFF' }}>
        <button
          onClick={handleAddToCalendar}
          className="flex items-center gap-1.5 text-xs font-medium transition-colors"
          style={{ color: '#64748B', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          onMouseEnter={e => e.currentTarget.style.color = '#0F2A4A'}
          onMouseLeave={e => e.currentTarget.style.color = '#64748B'}
        >
          <CalIcon c="w-3.5 h-3.5" /> Add to Calendar
        </button>
        {rsvpDone ? (
          <span className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold"
            style={{ background: 'rgba(5,150,105,0.1)', color: '#059669' }}>
            ✓ See you there!
          </span>
        ) : (
          <button
            onClick={() => setRsvpDone(true)}
            className="px-4 py-1.5 rounded-full text-xs font-bold transition-all"
            style={{ background: '#2E6DE7', color: 'white' }}
            onMouseEnter={e => e.currentTarget.style.background = '#1d5cd4'}
            onMouseLeave={e => e.currentTarget.style.background = '#2E6DE7'}
          >
            I&apos;m Coming
          </button>
        )}
      </div>
    </div>
  );
}

function MembershipCard() {
  return (
    <div className="rounded-2xl overflow-hidden flex flex-col h-full"
      style={{ background: 'white', border: '1px solid #E2E8F7', boxShadow: '0 1px 4px rgba(46,109,231,0.06)', borderTop: '3px solid #7C3AED' }}>
      <div className="px-6 pt-5 pb-3 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'rgba(124,58,237,0.1)', color: '#7C3AED' }}>
          <CreditIcon c="w-4 h-4" />
        </div>
        <div>
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', color: '#7C3AED' }} className="uppercase">Membership</p>
          <p style={{ fontSize: 11, color: '#94A3B8' }}>Semester contribution</p>
        </div>
      </div>
      <div className="flex-1 px-6 py-4 flex flex-col gap-3" style={{ borderTop: '1px solid #E2E8F7' }}>
        <div className="flex items-start gap-2 rounded-xl p-3" style={{ background: 'rgba(124,58,237,0.06)', border: '1px solid rgba(124,58,237,0.15)' }}>
          <AlertIcon />
          <p style={{ fontSize: 12, color: '#5b21b6', lineHeight: 1.55 }}>
            <strong>Due 31 March 2026.</strong> Keep your membership active to access all PCM events.
          </p>
        </div>
        {[
          { label: 'Amount', value: 'ZMW 50.00 / semester' },
          { label: 'Pay to', value: 'Prince Bwalya (Treasurer)' },
          { label: 'Mobile Money', value: 'MTN: 0976 123 456' },
          { label: 'Reference', value: 'Name + Student ID' },
          { label: 'Please ensure you get your receipt upon any payments'}
        ].map(({ label, value }) => (
          <div key={label} className="flex items-start justify-between gap-3 pb-2.5" style={{ borderBottom: '1px solid #F1F5F9' }}>
            <span style={{ fontSize: 11, color: '#94A3B8', fontWeight: 600, flexShrink: 0 }}>{label}</span>
            <span style={{ fontSize: 12, color: '#0F2A4A', fontWeight: 600, textAlign: 'right' }}>{value}</span>
          </div>
        ))}
      </div>
      <div className="px-6 py-4 flex justify-between items-center" style={{ borderTop: '1px solid #E2E8F7', background: '#FAFBFF' }}>
        <span style={{ fontSize: 11, color: '#94A3B8' }}>Questions? Contact treasurer</span>
        <a href="/contact" className="px-4 py-1.5 rounded-full text-xs font-bold" style={{ background: '#7C3AED', color: 'white' }}>Contact Us</a>
      </div>
    </div>
  );
}

// ── Carousel ───────────────────────────────────────────────────────────────
function InfoCarousel({ nextEvent }) {
  const cards = [
    <VerseCard key="verse" />,
    <EventCard key="event" nextEvent={nextEvent} />,
    <MembershipCard key="membership" />,
  ];
  const [index, setIndex] = useState(0);
  const timerRef = useRef(null);
  const TOTAL = cards.length;

  const startTimer = () => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => setIndex(i => (i + 1) % TOTAL), 6000);
  };

  useEffect(() => {
    startTimer();
    return () => clearInterval(timerRef.current);
  }, []);

  const prev = () => { setIndex(i => (i - 1 + TOTAL) % TOTAL); startTimer(); };
  const next = () => { setIndex(i => (i + 1) % TOTAL); startTimer(); };

  return (
    <div className="relative">
      {/* Card container */}
      <div className="relative overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {cards.map((card, i) => (
            <div key={i} className="w-full flex-shrink-0 px-1">
              {card}
            </div>
          ))}
        </div>
      </div>

      {/* Dots and arrows */}
      <div className="flex items-center justify-between mt-5">
        <div className="flex items-center gap-2">
          {Array.from({ length: TOTAL }).map((_, i) => (
            <button
              key={i}
              onClick={() => { setIndex(i); startTimer(); }}
              className="rounded-full transition-all duration-300"
              style={{
                width: index === i ? 22 : 7,
                height: 7,
                background: index === i ? '#2E6DE7' : '#CBD5E1',
              }}
            />
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button onClick={prev} className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: '#F5F7FF', color: '#64748B', border: '1px solid #E2E8F7' }}>
            <ChevronLeft c="w-4 h-4" />
          </button>
          <button onClick={next} className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: '#2E6DE7', color: 'white' }}>
            <ChevronRight c="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Live Announcements + Events Section (unchanged) ────────────────────────
function WhatsHappeningSection() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [annRes, evtRes] = await Promise.all([
          fetch(`${API}/api/announcements`),
          fetch(`${API}/api/events`),
        ]);
        const announcements = await annRes.json();
        const events = await evtRes.json();

        const taggedAnn = (Array.isArray(announcements) ? announcements : [])
          .filter(a => a.status === 'Active')
          .slice(0, 3)
          .map((a, i) => ({
            ...a,
            _kind: 'announcement',
            accentColor: ACCENTS[i % ACCENTS.length],
            tag: a.type || 'Announcement',
            displayDate: fmtDate(a.date),
          }));

        const today = new Date().toISOString().split('T')[0];
        const taggedEvt = (Array.isArray(events) ? events : [])
          .filter(e => e.status === 'Upcoming' || (e.date && e.date >= today))
          .sort((a, b) => (a.date || '').localeCompare(b.date || ''))
          .slice(0, 3)
          .map((e, i) => ({
            ...e,
            _kind: 'event',
            accentColor: ACCENTS[(i + 2) % ACCENTS.length],
            tag: 'Upcoming Event',
            displayDate: fmtDate(e.date),
          }));

        setItems([...taggedAnn, ...taggedEvt].slice(0, 6));
      } catch (err) {
        console.error('WhatsHappening fetch error:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1,2,3].map(i => (
        <div key={i} className="rounded-2xl h-48 animate-pulse" style={{ background: '#F1F5F9' }} />
      ))}
    </div>
  );

  if (items.length === 0) return (
    <p style={{ color: '#94A3B8', fontSize: 14 }}>No announcements or upcoming events yet.</p>
  );

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item, idx) => (
        <div key={item.id || idx}
          className="rounded-2xl p-6 flex flex-col gap-4 transition-all duration-200 hover:-translate-y-0.5"
          style={{ background: 'white', border: '1px solid #E2E8F7', boxShadow: '0 1px 4px rgba(46,109,231,0.06)', borderTop: `3px solid ${item.accentColor}` }}
          onMouseEnter={e => e.currentTarget.style.boxShadow = '0 8px 24px rgba(46,109,231,0.12)'}
          onMouseLeave={e => e.currentTarget.style.boxShadow = '0 1px 4px rgba(46,109,231,0.06)'}>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full tracking-wide flex items-center gap-1"
              style={{ background: item.accentColor + '15', color: item.accentColor, border: `1px solid ${item.accentColor}30` }}>
              {item._kind === 'event' ? <CalIcon c="w-3 h-3" /> : <BellIcon c="w-3 h-3" />}
              {item.tag}
            </span>
            <span style={{ fontSize: 10, color: '#94A3B8', fontWeight: 500 }}>{item.displayDate}</span>
          </div>
          <h3 className="font-bold leading-snug" style={{ color: '#0F2A4A' }}>{item.title}</h3>
          <p className="text-sm leading-relaxed flex-1" style={{ color: '#64748B' }}>
            {item._kind === 'event' ? item.description : item.body}
          </p>
          {item._kind === 'event' && (item.venue || item.time) && (
            <div className="flex flex-wrap gap-3 pt-3" style={{ borderTop: '1px solid #F1F5F9', fontSize: 10, color: '#94A3B8' }}>
              {item.venue && <span className="flex items-center gap-1"><PinIcon c="w-3 h-3" />{item.venue}</span>}
              {item.time  && <span className="flex items-center gap-1"><ClockIcon c="w-3 h-3" />{item.time}</span>}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────
export default function Dashboard() {
  // Fetch the next upcoming event for the carousel
  const { items: events } = useEvents();
  const upcoming = events
    .filter(e => e.status === 'Upcoming')
    .sort((a, b) => (a.date || '').localeCompare(b.date || ''));
  const nextEvent = upcoming[0] || null;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;500;600;700;800&family=Playfair+Display:ital,wght@0,700;0,800;1,700&display=swap');
        *, body { font-family: 'Noto Sans', sans-serif; }
        .serif { font-family: 'Playfair Display', Georgia, serif; }
        html { scroll-behavior: smooth; }
      `}</style>
      <div style={{ minHeight: '100vh', background: '#FFFFFF', color: '#1E293B' }}>
        <Navbar activePath="/dashboard" />
        <section className="relative flex items-center justify-center overflow-hidden" style={{ height: 'clamp(480px, 78vh, 700px)' }}>
          <img src="/img0.jpg" alt="MU Campus Worship" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(15,42,74,0.4) 0%, rgba(15,42,74,0.75) 50%, rgba(15,42,74,0.95) 100%)' }} />
          <div className="relative z-10 text-center px-5 sm:px-8 w-full max-w-4xl mx-auto">
            <p style={{ fontSize: 10, letterSpacing: '0.28em', color: 'rgba(255,255,255,0.65)', fontWeight: 700 }} className="uppercase mb-5">SDA Public Campus Ministries</p>
            <h1 className="serif font-bold text-white leading-[1.08] mb-5" style={{ fontSize: 'clamp(2.4rem, 6vw, 4.5rem)' }}>Mulungushi University</h1>
            <div className="flex items-center justify-center gap-3 mb-6">
              <div style={{ height: 1, width: 48, background: 'rgba(46,109,231,0.7)', borderRadius: 9999 }} />
              <div style={{ width: 6, height: 6, borderRadius: 9999, background: '#2E6DE7' }} />
              <div style={{ height: 1, width: 48, background: 'rgba(46,109,231,0.7)', borderRadius: 9999 }} />
            </div>
            <p className="font-semibold text-white mb-3" style={{ fontSize: 'clamp(1.1rem, 2.5vw, 1.6rem)' }}>Follow Jesus. Embrace His Mission.</p>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', maxWidth: 420, margin: '0 auto 2.5rem' }}>A community of faith, purpose, and excellence — right here on campus.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a href="/events" className="w-full sm:w-auto px-8 py-3 rounded-full text-sm font-bold shadow-lg" style={{ background: '#2E6DE7', color: 'white' }}>View Events</a>
              <a href="/prayer" className="w-full sm:w-auto px-8 py-3 rounded-full text-sm font-medium" style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.25)', color: 'white' }}>Submit Prayer Request</a>
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="py-10" style={{ borderBottom: '1px solid #E2E8F7' }}>
            <div className="rounded-2xl px-6 sm:px-8 py-6" style={{ background: '#F5F7FF', border: '1px solid #E2E8F7' }}>
              <SabbathGreeting name={userName} />
            </div>
          </div>

          <section className="py-16" style={{ borderBottom: '1px solid #E2E8F7' }}>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
              {stats.map(({ value, label, Icon }, i) => (
                <div key={label} className="text-center">
                  <div className="rounded-2xl flex items-center justify-center mx-auto mb-4"
                    style={{ width: 52, height: 52, background: i % 2 === 0 ? 'rgba(46,109,231,0.08)' : 'rgba(124,58,237,0.08)', color: i % 2 === 0 ? '#2E6DE7' : '#7C3AED' }}>
                    <Icon c="w-5 h-5" />
                  </div>
                  <p className="font-extrabold leading-none mb-1" style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', color: '#0F2A4A' }}>{value}</p>
                  <p style={{ fontSize: 11, color: '#94A3B8', fontWeight: 600, letterSpacing: '0.1em' }} className="uppercase">{label}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="py-16" style={{ borderBottom: '1px solid #E2E8F7' }}>
            <div className="flex items-end justify-between mb-8">
              <div>
                <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.25em', color: '#2E6DE7' }} className="uppercase mb-2">Daily Updates</p>
                <h2 className="serif font-bold" style={{ fontSize: 'clamp(1.7rem, 3vw, 2.4rem)', color: '#0F2A4A' }}>What's On Today</h2>
              </div>
            </div>
            <InfoCarousel nextEvent={nextEvent} />
          </section>

          <section className="py-16" style={{ borderBottom: '1px solid #E2E8F7' }}>
            <div className="flex items-end justify-between mb-10">
              <div>
                <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.25em', color: '#7C3AED' }} className="uppercase mb-2">What's Happening</p>
                <h2 className="serif font-bold" style={{ fontSize: 'clamp(1.7rem, 3vw, 2.4rem)', color: '#0F2A4A' }}>Announcements & Events</h2>
              </div>
              <a href="/events" className="flex items-center gap-1 text-sm font-semibold whitespace-nowrap" style={{ color: '#2E6DE7' }}>
                All events <ChevronRight c="w-4 h-4" />
              </a>
            </div>
            <WhatsHappeningSection />
          </section>

          <section className="py-16" style={{ borderBottom: '1px solid #E2E8F7' }}>
            <div className="mb-10">
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.25em', color: '#7C3AED' }} className="uppercase mb-2">Navigate</p>
              <h2 className="serif font-bold" style={{ fontSize: 'clamp(1.7rem, 3vw, 2.4rem)', color: '#0F2A4A' }}>Explore PCM</h2>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
              {quickLinks.map(({ href, Icon, label }, i) => (
                <a key={href} href={href} className="rounded-2xl p-5 flex flex-col items-center gap-3 transition-all duration-200 hover:-translate-y-0.5"
                  style={{ background: 'white', border: '1px solid #E2E8F7', boxShadow: '0 1px 3px rgba(46,109,231,0.05)' }}>
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center"
                    style={{ background: i % 2 === 0 ? 'rgba(46,109,231,0.08)' : 'rgba(124,58,237,0.08)', color: i % 2 === 0 ? '#2E6DE7' : '#7C3AED' }}>
                    <Icon c="w-5 h-5" />
                  </div>
                  <span className="text-xs font-semibold text-center" style={{ color: '#64748B' }}>{label}</span>
                </a>
              ))}
            </div>
          </section>

          <section className="py-16">
            <div className="relative rounded-2xl overflow-hidden" style={{ background: 'linear-gradient(135deg, #0F2A4A 0%, #1a3d68 50%, #2E6DE7 100%)' }}>
              <div className="absolute right-8 sm:right-16 top-1/2 -translate-y-1/2 pointer-events-none" style={{ opacity: 0.05 }}>
                <CrossIcon c="w-48 h-48 sm:w-56 sm:h-56" />
              </div>
              <div className="relative z-10 px-8 sm:px-16 py-16 sm:py-20 text-center">
                <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.3em', color: 'rgba(255,255,255,0.5)' }} className="uppercase mb-8">Scripture of the Week</p>
                <blockquote className="serif font-bold italic text-white leading-relaxed max-w-3xl mx-auto" style={{ fontSize: 'clamp(1.1rem, 2.5vw, 1.8rem)' }}>
                  "For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, plans to give you hope and a future."
                </blockquote>
                <div className="flex items-center justify-center gap-4 mt-8">
                  <div style={{ height: 1, width: 40, background: 'rgba(46,109,231,0.5)', borderRadius: 9999 }} />
                  <cite style={{ color: '#2E6DE7', fontSize: 13, fontWeight: 700, letterSpacing: '0.2em', fontStyle: 'normal' }}>Jeremiah 29:11</cite>
                  <div style={{ height: 1, width: 40, background: 'rgba(46,109,231,0.5)', borderRadius: 9999 }} />
                </div>
              </div>
            </div>
          </section>
        </div>
        <Footer />
      </div>
    </>
  );
}